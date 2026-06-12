import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth"; // Tu configuración de NextAuth

export async function POST(req: Request) {
  try {
    // 1. Verificamos que el usuario esté logueado
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.email) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    // 2. Buscamos al usuario en la base de datos
    const user = await prisma.user.findUnique({ 
      where: { email: session.user.email } 
    });
    if (!user) {
      return NextResponse.json({ error: "Usuario no encontrado" }, { status: 404 });
    }

    // 3. Recibimos los datos del carrito
    const { cart, totalCLP } = await req.json();

    // 4. Creamos la Orden Maestra y conectamos los juegos vendidos
    const newOrder = await prisma.order.create({
      data: {
        userId: user.id,
        totalCLP: totalCLP,
        totalUSD: parseFloat((totalCLP / 900).toFixed(2)),
        status: "PAID", // Simulamos que el pago fue exitoso
        payment: "Pixbuy Wallet (Simulador)",
        items: {
          create: cart.map((item: any) => ({
            productId: item.productId,
            quantity: 1,
            price: item.price
          }))
        }
      }
    });

    return NextResponse.json({ success: true, orderId: newOrder.id });

  } catch (error) {
    console.error("Error en checkout:", error);
    return NextResponse.json({ error: "Error interno procesando el pago" }, { status: 500 });
  }
}