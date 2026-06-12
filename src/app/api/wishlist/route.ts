import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const { ids } = await req.json();
    
    if (!ids || ids.length === 0) return NextResponse.json([]);

    // Busca todos los juegos cuyo ID esté en la lista que le enviamos
    const products = await prisma.product.findMany({
      where: { id: { in: ids } },
      include: { categories: true }
    });

    return NextResponse.json(products);
  } catch (error) {
    return NextResponse.json({ error: "Error buscando favoritos" }, { status: 500 });
  }
}