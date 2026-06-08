import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    
    // Aquí en el futuro irá la conexión real con el SDK de Transbank Webpay o PayPal
    console.log("Procesando pago para:", body);

    return NextResponse.json(
      { 
        success: true, 
        message: "Pago simulado con éxito", 
        redirectUrl: "/dashboard" 
      }, 
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: "Error interno procesando el pago" }, 
      { status: 500 }
    );
  }
}