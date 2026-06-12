import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// Obtener todos los juegos y contar cuántas claves "DISPONIBLES" tienen
export async function GET() {
  try {
    const products = await prisma.product.findMany({
      select: {
        id: true,
        title: true,
        _count: {
          select: { keys: { where: { status: "AVAILABLE" } } }
        }
      },
      orderBy: { title: "asc" }
    });
    return NextResponse.json(products);
  } catch (error) {
    return NextResponse.json({ error: "Error al cargar inventario" }, { status: 500 });
  }
}

// Recibir una lista de claves de texto y guardarlas en la Bóveda Real
export async function POST(req: Request) {
  try {
    const { productId, keys } = await req.json();
    
    // Convertimos el texto largo (claves separadas por salto de línea) en un arreglo real
    const keyArray = keys.split(/[\n,]+/).map((k: string) => k.trim()).filter(Boolean);

    const created = await prisma.gameKey.createMany({
      data: keyArray.map((keyString: string) => ({
        keyString,
        productId,
        status: "AVAILABLE"
      })),
      skipDuplicates: true // Ignora automáticamente si pegas una clave que ya existía
    });

    return NextResponse.json({ success: true, count: created.count });
  } catch (error) {
    return NextResponse.json({ error: "Error al guardar las claves" }, { status: 500 });
  }
}