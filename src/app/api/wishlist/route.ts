import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth"; 

// LECTURA: Extrae los favoritos de la base de datos cuando el usuario inicia sesión
export async function GET() {
  const session = await getServerSession(authOptions);
  
  // TRUCO TYPESCRIPT: Usamos 'as any' para que el editor sepa que el id sí existe
  const userId = (session?.user as any)?.id;

  // Si es un visitante sin cuenta, no devolvemos nada
  if (!userId) {
    return NextResponse.json([]);
  }

  // Buscamos solo los IDs de los juegos guardados por este usuario
  const items = await prisma.wishlistItem.findMany({
    where: { userId: userId },
    select: { productId: true }
  });

  // Devolvemos un arreglo limpio de strings: ["id-juego-1", "id-juego-2"]
  return NextResponse.json(items.map(item => item.productId));
}

// ESCRITURA: Agrega o elimina un favorito en la base de datos
export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    const userId = (session?.user as any)?.id;

    if (!userId) {
      return NextResponse.json({ error: "Debes iniciar sesión para guardar en la nube" }, { status: 401 });
    }

    const { productId } = await req.json();

    // Buscamos si el juego ya estaba en la base de datos
    const existingItem = await prisma.wishlistItem.findUnique({
      where: {
        userId_productId: { userId, productId }
      }
    });

    if (existingItem) {
      // Si ya existía, significa que el usuario presionó el corazón para QUITARLO
      await prisma.wishlistItem.delete({ where: { id: existingItem.id } });
      return NextResponse.json({ message: "Eliminado de la nube" });
    } else {
      // Si no existía, lo AGREGAMOS
      await prisma.wishlistItem.create({ data: { userId, productId } });
      return NextResponse.json({ message: "Guardado en la nube" });
    }
  } catch (error) {
    console.error("Error en wishlist:", error);
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}