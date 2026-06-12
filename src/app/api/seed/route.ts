import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    // 1. Nos aseguramos de tener la categoría Acción
    const categoryAction = await prisma.category.upsert({
      where: { name: "Acción" },
      update: {},
      create: { name: "Acción" }
    });

    // 2. Creamos el juego con toda su nueva estructura anidada
    const newGame = await prisma.product.create({
      data: {
        title: "Cyberpunk 2077",
        description: "Cyberpunk 2077 es un RPG de acción y aventura de mundo abierto ambientado en Night City, una megalópolis obsesionada con el poder, el glamour y las modificaciones corporales.",
        coverImage: "https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=2070&auto=format&fit=crop", // Imagen de Unsplash de referencia
        priceCLP: 25000,
        priceUSD: 29.99,
        platforms: ["Steam", "Epic Games"],
        publisher: "CD PROJEKT RED",
        
        // Conectamos la categoría
        categories: {
          connect: [{ id: categoryAction.id }]
        },

        // Agregamos los Requisitos
        requirements: {
          create: {
            minOS: "Windows 10 64-bit",
            minCpu: "Core i7-6700 o Ryzen 5 1600",
            minRam: "12 GB RAM",
            minGpu: "GeForce GTX 1060 o Radeon RX 580",
            minStorage: "70 GB SSD",
            recOS: "Windows 10/11 64-bit",
            recCpu: "Core i7-12700 o Ryzen 7 7800X3D",
            recRam: "16 GB RAM",
            recGpu: "GeForce RTX 2060 o Radeon RX 5700 XT",
            recStorage: "70 GB SSD"
          }
        },

        // Agregamos las Ediciones
        editions: {
          create: [
            {
              name: "Standard Edition",
              priceCLP: 25000,
              priceUSD: 29.99
            },
            {
              name: "Ultimate Edition",
              bonus: "Incluye la expansión Phantom Liberty",
              priceCLP: 45000,
              priceUSD: 49.99
            }
          ]
        }
      }
    });

    return NextResponse.json({ 
      success: true, 
      message: "¡Juego supremo inyectado con éxito!", 
      game: newGame 
    });

  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Error inyectando los datos" }, { status: 500 });
  }
}