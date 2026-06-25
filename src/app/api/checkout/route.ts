import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import nodemailer from "nodemailer";


const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD,
  },
});

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.email) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const { cart } = await req.json();

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

    try {
      // 3.1 Generamos las filas de la tabla leyendo el carrito (cart)
      const cartItemsHtml = cart.map((item: any) => `
        <tr>
          <td style="padding: 12px; border-bottom: 1px solid #333;">
            <strong style="color: #ffffff; font-size: 16px;">${item.title}</strong>
          </td>
          <td style="padding: 12px; border-bottom: 1px solid #333; text-align: center; color: #cccccc;">
            x${item.quantity}
          </td>
          <td style="padding: 12px; border-bottom: 1px solid #333; text-align: right; color: #FF6600; font-weight: bold;">
            $${(item.price * item.quantity).toLocaleString('es-CL')}
          </td>
        </tr>
      `).join('');

      // 3.2 Enviamos el correo con el diseño premium
      await transporter.sendMail({
        from: `"PixBuy Store" <${process.env.GMAIL_USER}>`, 
        to: session.user.email,
        subject: "🎮 ¡Compra Exitosa! Tu recibo de PixBuy",
        html: `
          <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; background-color: #121212; color: #ffffff; border-radius: 12px; overflow: hidden; border: 1px solid #FF6600;">
            
            <!-- Cabecera Naranja -->
            <div style="background-color: #FF6600; padding: 25px; text-align: center;">
              <h1 style="color: #ffffff; margin: 0; font-size: 32px; letter-spacing: 2px; font-weight: 900;">PIXBUY</h1>
            </div>
            
            <!-- Cuerpo del Correo -->
            <div style="padding: 30px;">
              <h2 style="margin-top: 0; color: #ffffff; font-size: 24px;">¡Compra Exitosa, ${session.user.name?.split(' ')[0] || 'Gamer'}!</h2>
              <p style="color: #aaaaaa; font-size: 16px; line-height: 1.6;">
                Tu orden <strong>#${newOrder.id}</strong> ha sido procesada exitosamente. Las llaves de activación ya están aseguradas en tu bóveda personal.
              </p>
              
              <!-- Tabla de Productos -->
              <table style="width: 100%; border-collapse: collapse; margin-top: 25px; background-color: #1e1e1e; border-radius: 8px; overflow: hidden;">
                <thead style="background-color: #2a2a2a;">
                  <tr>
                    <th style="padding: 12px; text-align: left; color: #888888; font-size: 14px; text-transform: uppercase;">Juego / Producto</th>
                    <th style="padding: 12px; text-align: center; color: #888888; font-size: 14px; text-transform: uppercase;">Cant.</th>
                    <th style="padding: 12px; text-align: right; color: #888888; font-size: 14px; text-transform: uppercase;">Subtotal</th>
                  </tr>
                </thead>
                <tbody>
                  ${cartItemsHtml}
                </tbody>
              </table>

              <!-- Caja de Resumen Financiero -->
              <div style="margin-top: 25px; background-color: #1e1e1e; padding: 20px; border-radius: 8px; border-left: 4px solid #FF6600;">
                <p style="margin: 0 0 10px 0; color: #cccccc; font-size: 16px;">
                  Total Pagado: <span style="color: #ffffff; font-size: 20px; font-weight: bold; float: right;">$${newOrder.totalCLP.toLocaleString('es-CL')} CLP</span>
                </p>
                <p style="margin: 0; color: #cccccc; font-size: 16px;">
                  Recompensa: <span style="color: #FF6600; font-weight: bold; float: right;">+${Math.floor(newOrder.totalCLP * 0.01)} PixPoints</span>
                </p>
              </div>

              <!-- Botón de Acción -->
              <div style="text-align: center; margin-top: 40px; margin-bottom: 20px;">
                <a href="https://pixbuy-mvp.vercel.app/dashboard" style="background-color: #FF6600; color: #ffffff; padding: 16px 32px; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 16px; display: inline-block; text-transform: uppercase; letter-spacing: 1px;">
                  Revelar mis llaves
                </a>
              </div>
            </div>
            
            <!-- Pie de página (Footer) -->
            <div style="background-color: #0a0a0a; padding: 20px; text-align: center; border-top: 1px solid #222222;">
              <p style="color: #666666; font-size: 12px; margin: 0;">Este es un recibo automático generado por los servidores de PixBuy.</p>
              <p style="color: #666666; font-size: 12px; margin: 5px 0 0 0;">Si tienes problemas para activar tus códigos, contacta a nuestro soporte técnico.</p>
            </div>

          </div>
        `,
      });
      console.log("Correo enviado exitosamente a:", session.user.email);
    } catch (emailError) {
      console.error("Error enviando el correo:", emailError);
    }


    return NextResponse.json({ success: true, orderId: newOrder.id });


  } catch (error: any) {
    console.error("Error en checkout:", error);
    // Le enviamos al usuario el mensaje exacto de si faltó stock
    return NextResponse.json({ error: error.message || "Error procesando el pago" }, { status: 500 });
  }
}