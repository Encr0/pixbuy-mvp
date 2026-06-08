import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    // Busca todos los productos en la base de datos
    const products = await prisma.product.findMany({
      where: { isActive: true }
    });
    
    return NextResponse.json(products, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Error al cargar el catálogo de juegos" }, 
      { status: 500 }
    );
  }
}