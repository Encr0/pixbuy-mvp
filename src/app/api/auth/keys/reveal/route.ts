import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import prisma from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.email) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const { keyId } = await req.json();

    // Verificamos que el usuario logueado sea el dueño de la orden vinculada a esta clave
    const gameKey = await prisma.gameKey.findUnique({
      where: { id: keyId },
      include: {
        order: {
          include: { user: true }
        }
      }
    });

    if (!gameKey || !gameKey.order || gameKey.order.user.email !== session.user.email) {
      return NextResponse.json({ error: "Clave no encontrada o no pertenece al usuario" }, { status: 403 });
    }

    if (gameKey.order.status !== "PAID") {
      return NextResponse.json({ error: "El pedido no está pagado" }, { status: 400 });
    }

    return NextResponse.json({ keyString: gameKey.keyString }, { status: 200 });
    
  } catch (error) {
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}