import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    // 1. Verificamos quién es el usuario
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.email) {
      return NextResponse.json({ error: "Debes iniciar sesión para opinar." }, { status: 401 });
    }

    const user = await prisma.user.findUnique({ where: { email: session.user.email } });
    if (!user) return NextResponse.json({ error: "Usuario no encontrado." }, { status: 404 });

    const { productId, rating, comment } = await req.json();

    // 2. Verificación estricta: ¿Compró este juego?
    const hasBought = await prisma.orderItem.findFirst({
      where: {
        productId: productId,
        order: { userId: user.id, status: "PAID" }
      }
    });

    if (!hasBought) {
      return NextResponse.json({ error: "Solo los compradores verificados pueden calificar este juego." }, { status: 403 });
    }

    // 3. Verificamos si ya había dejado una reseña (para evitar spam)
    const existingReview = await prisma.review.findFirst({
      where: { userId: user.id, productId: productId }
    });

    if (existingReview) {
      return NextResponse.json({ error: "Ya has calificado este juego anteriormente." }, { status: 400 });
    }

    // 4. Guardamos la reseña (dejamos el comentario como null si viene vacío)
    const newReview = await prisma.review.create({
      data: { 
        rating, 
        comment: comment && comment.trim() !== "" ? comment : null, 
        userId: user.id, 
        productId 
      }
    });

    return NextResponse.json({ success: true, review: newReview });
  } catch (error) {
    console.error("Error guardando reseña:", error);
    return NextResponse.json({ error: "Error interno al procesar la reseña." }, { status: 500 });
  }
}