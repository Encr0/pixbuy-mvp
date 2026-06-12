import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { title, description, coverImage, priceCLP, platforms, publisher, categoryName } = body;

    // 1. Verificamos o creamos la categoría si no existe
    let categoryConnect = {};
    if (categoryName) {
      const category = await prisma.category.upsert({
        where: { name: categoryName },
        update: {},
        create: { name: categoryName }
      });
      categoryConnect = { connect: [{ id: category.id }] };
    }

    // 2. Calculamos un precio en USD aproximado (ejemplo: 1 USD = 900 CLP)
    const priceUSD = parseFloat((parseInt(priceCLP) / 900).toFixed(2));

    // 3. Creamos el producto en la base de datos
    const newProduct = await prisma.product.create({
      data: {
        title,
        description,
        coverImage,
        priceCLP: parseInt(priceCLP),
        priceUSD,
        platforms: platforms.split(",").map((p: string) => p.trim()), // Convierte "Steam, Epic" en un arreglo real
        publisher,
        categories: categoryConnect
      }
    });

    return NextResponse.json({ success: true, product: newProduct });
  } catch (error) {
    console.error("Error al guardar el juego:", error);
    return NextResponse.json({ error: "Error al crear el producto" }, { status: 500 });
  }
}