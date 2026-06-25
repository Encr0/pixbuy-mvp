import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import nodemailer from "nodemailer";
import crypto from "crypto"; // Viene por defecto en Node.js

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD,
  },
});

export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      // Por seguridad, siempre devolvemos "éxito" incluso si no existe,
      // para evitar que los hackers averigüen qué correos están registrados.
      return NextResponse.json({ success: true });
    }

    // 1. Generamos un token seguro y una fecha de expiración (1 hora)
    const resetToken = crypto.randomBytes(32).toString("hex");
    const resetTokenExpiry = new Date(Date.now() + 3600000); // +1 hora

    // 2. Lo guardamos en la base de datos del usuario
    await prisma.user.update({
      where: { email },
      data: { resetToken, resetTokenExpiry },
    });

    // 3. Creamos el link mágico
    const resetUrl = `${process.env.NEXTAUTH_URL || "https://pixbuy-mvp.vercel.app"}/reset-password?token=${resetToken}`;

    // 4. Enviamos el correo
    await transporter.sendMail({
      from: `"PixBuy Security" <${process.env.GMAIL_USER}>`,
      to: email,
      subject: "🔒 Recuperación de Contraseña - PixBuy",
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; background-color: #121212; color: white; border-radius: 10px; border: 1px solid #FF6600;">
          <h2 style="color: #FF6600;">Recuperación de Contraseña</h2>
          <p>Hemos recibido una solicitud para cambiar tu contraseña en PixBuy.</p>
          <p>Haz clic en el siguiente botón para establecer una nueva contraseña. Este enlace <strong>expirará en 1 hora</strong>.</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${resetUrl}" style="background-color: #FF6600; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; font-weight: bold;">
              Restablecer Contraseña
            </a>
          </div>
          <p style="font-size: 12px; color: #888;">Si no solicitaste este cambio, ignora este correo.</p>
        </div>
      `,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error en forgot-password:", error);
    return NextResponse.json({ error: "Error procesando la solicitud" }, { status: 500 });
  }
}