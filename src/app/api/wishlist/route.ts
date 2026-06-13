import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

// LECTURA: Extrae los favoritos usando el Email (Siempre disponible)
export async function GET() {
  const session = await getServerSession(authOptions);
  const userEmail = session?.user?.email;
  
  if (!userEmail) return NextResponse.json([]);

  // 1. Buscamos el ID real del usuario usando su Email
  const user = await prisma.user.findUnique({ 
    where: { email: userEmail } 
  });

  if (!user) return NextResponse.json([]);

  // 2. Buscamos sus juegos guardados
  const items = await prisma.wishlistItem.findMany({
    where: { userId: user.id },
    select: { productId: true }
  });

  return NextResponse.json(items.map(item => item.productId));
}

// ESCRITURA: Agrega o elimina un favorito
export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    const userEmail = session?.user?.email;

    if (!userEmail) {
      return NextResponse.json({ error: "Debes iniciar sesión para guardar en la nube" }, { status: 401 });
    }

    // 1. Buscamos el ID real del usuario usando su Email
    const user = await prisma.user.findUnique({ 
      where: { email: userEmail } 
    });

    if (!user) {
      return NextResponse.json({ error: "Usuario no encontrado" }, { status: 404 });
    }

    const userId = user.id;
    const { productId } = await req.json();

    // 2. Comprobamos si ya estaba guardado
    const existingItem = await prisma.wishlistItem.findUnique({
      where: {
        userId_productId: { userId, productId }
      }
    });

    if (existingItem) {
      // Lo quitamos
      await prisma.wishlistItem.delete({ where: { id: existingItem.id } });
      return NextResponse.json({ message: "Eliminado de la nube" });
    } else {
      // Lo agregamos
      await prisma.wishlistItem.create({ data: { userId, productId } });
      return NextResponse.json({ message: "Guardado en la nube" });
    }
  } catch (error) {
    console.error("Error en wishlist:", error);
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}