import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import nodemailer from "nodemailer";

// Configuramos Nodemailer con tus credenciales de Gmail
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

    const { subject, message } = await req.json();

    if (!subject || !message) {
      return NextResponse.json({ error: "Todos los campos son obligatorios" }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json({ error: "Usuario no encontrado" }, { status: 404 });
    }

    // 1. Guardamos el ticket en la base de datos (PostgreSQL/Neon)
    const newTicket = await prisma.ticket.create({
      data: {
        userId: user.id,
        subject,
        message,
        status: "OPEN",
      },
    });

    // ==========================================
    // 2. ENVIAMOS EL CORREO DE ALERTA AL ADMINISTRADOR
    // ==========================================
    try {
      await transporter.sendMail({
        from: `"PixBuy Support System" <${process.env.GMAIL_USER}>`, 
        to: process.env.GMAIL_USER, // Te lo envías a ti mismo (al correo admin)
        subject: `🚨 NUEVO TICKET: ${subject} (Ticket #${newTicket.id.slice(-6).toUpperCase()})`,
        html: `
          <div style="font-family: Arial, sans-serif; padding: 20px; color: #333; background-color: #f9f9f9; border-left: 5px solid #FF6600;">
            <h2 style="color: #FF6600; margin-top: 0;">¡Tienes un nuevo ticket de soporte!</h2>
            
            <p><strong>Cliente:</strong> ${session.user.name} (${session.user.email})</p>
            <p><strong>Estado:</strong> ABIERTO</p>
            <p><strong>Asunto:</strong> ${subject}</p>
            
            <div style="background-color: #ffffff; padding: 15px; border-radius: 8px; margin: 20px 0; border: 1px solid #ddd;">
              <p style="margin: 0; font-style: italic;">"${message}"</p>
            </div>
            
            <p style="font-size: 12px; color: #777;">
              Para responder a este cliente, búscalo en tu base de datos o escríbele directamente a su correo.<br>
              Ticket ID completo: ${newTicket.id}
            </p>
          </div>
        `,
      });
      console.log("Alerta de ticket enviada al administrador.");
    } catch (emailError) {
      // Si el correo falla, no rompemos el proceso. El ticket ya se guardó en BD.
      console.error("Error enviando alerta de ticket:", emailError);
    }
    // ==========================================

    return NextResponse.json({ success: true, ticketId: newTicket.id });

  } catch (error: any) {
    console.error("Error al crear el ticket:", error);
    return NextResponse.json(
      { error: error.message || "Error interno del servidor" },
      { status: 500 }
    );
  }
}