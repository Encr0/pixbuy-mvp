import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.email) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const { cart } = await req.json(); // Solo necesitamos el carrito, el total lo calculamos nosotros

    // 1. RE-CALCULO DE SEGURIDAD: Buscamos el precio real de cada producto en tu BD
    // Esto evita que un usuario modifique el precio desde el navegador
    let realTotal = 0;
    const productIds = cart.map((i: any) => i.productId);
    const dbProducts = await prisma.product.findMany({
      where: { id: { in: productIds } }
    });

    for (const item of cart) {
      const product = dbProducts.find(p => p.id === item.productId);
      if (!product) throw new Error(`Producto ${item.title} no encontrado`);
      realTotal += product.priceCLP * item.quantity;
    }

    const user = await prisma.user.findUnique({ where: { email: session.user.email } });
    if (!user) return NextResponse.json({ error: "Usuario no encontrado" }, { status: 404 });

    // 2. Ahora usamos 'realTotal' en lugar del total que venía del frontend
    const newOrder = await prisma.$transaction(async (tx) => {
      const order = await tx.order.create({
        data: {
          userId: user.id,
          totalCLP: realTotal, // <--- PRECIO REAL DE BASE DE DATOS
          totalUSD: parseFloat((realTotal / 900).toFixed(2)),
          status: "PAID",
          payment: "Pixbuy Wallet (Simulador)",
        }
      });

      // 2. Procesamos cada juego del carrito uno por uno
      for (const item of cart) {
        // Buscamos la CANTIDAD EXACTA de claves que el usuario pidió
        const availableKeys = await tx.gameKey.findMany({
          where: { productId: item.productId, status: "AVAILABLE" },
          take: item.quantity // <--- Extraemos 1, 2, 3 o las que pida
        });

        // Verificamos si hay suficiente stock
        if (availableKeys.length < item.quantity) {
          throw new Error(`Stock insuficiente para ${item.title}. Solo quedan ${availableKeys.length} copias.`);
        }

        // 3. Marcamos TODAS esas claves como VENDIDAS
        await tx.gameKey.updateMany({
          where: { id: { in: availableKeys.map(k => k.id) } },
          data: { status: "SOLD" }
        });

        // 4. Conectamos los juegos al recibo.
        // Si compró 3 copias, creamos 3 filas individuales en el recibo.
        // ¡Así el Dashboard le mostrará 3 códigos separados automáticamente!
        const orderItemsData = availableKeys.map(key => ({
          orderId: order.id,
          productId: item.productId,
          quantity: 1, // Cada fila representa 1 copia individual con su propia clave
          price: item.price,
          assignedKey: key.keyString
        }));

        await tx.orderItem.createMany({
          data: orderItemsData
        });
      }

      const pointsEarned = Math.floor(realTotal * 0.03); // 3% de puntos por compra

      // Le sumamos los puntos a la billetera del usuario dentro de la misma transacción
      await tx.user.update({
        where: { id: user.id },
        data: {
          pixPoints: {
            increment: pointsEarned
          }
        } as any
      });

      return order;
    });

    revalidatePath("/dashboard");

    return NextResponse.json({ success: true, orderId: newOrder.id });


  } catch (error: any) {
    console.error("Error en checkout:", error);
    // Le enviamos al usuario el mensaje exacto de si faltó stock
    return NextResponse.json({ error: error.message || "Error procesando el pago" }, { status: 500 });
  }
}