import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs"; // La librería que usas para encriptar

export async function POST(req: Request) {
  try {
    const { token, newPassword } = await req.json();

    if (!token || !newPassword) {
      return NextResponse.json({ error: "Datos incompletos" }, { status: 400 });
    }

    // 1. Buscamos al usuario que tenga ese token y que NO haya expirado
    const user = await prisma.user.findFirst({
      where: {
        resetToken: token,
        resetTokenExpiry: { gt: new Date() }, // Expiración mayor a la hora actual
      },
    });

    if (!user) {
      return NextResponse.json({ error: "El token es inválido o ha expirado" }, { status: 400 });
    }

    // 2. Encriptamos la nueva contraseña
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // 3. Actualizamos al usuario y borramos el token para que no se pueda reusar
    await prisma.user.update({
      where: { id: user.id },
      data: {
        password: hashedPassword,
        resetToken: null,
        resetTokenExpiry: null,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error en reset-password:", error);
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }
}