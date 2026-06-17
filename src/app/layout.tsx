/* eslint-disable @next/next/no-sync-scripts */
import type { Metadata } from "next";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { StoreProvider } from "@/context/StoreProvider";
import { SpeedInsights } from "@vercel/speed-insights/next"

export const metadata: Metadata = {
  title: "Pixbuy | Tu Tienda de Game Keys",
  description: "Compra los mejores juegos de Steam, Epic Games, PlayStation y Xbox al mejor precio con entrega instantánea.",
  openGraph: {
    title: "Pixbuy | Tu Tienda de Game Keys",
    description: "Juegos digitales al mejor precio. Entrega inmediata y pago seguro.",
    url: "https://pixbuy.vercel.app", // Puedes cambiar esto por tu dominio real de Vercel
    siteName: "Pixbuy",
    images: [
      {
        // Imagen por defecto genial para cuando compartan la página de inicio
        url: "https://lh3.googleusercontent.com/gg/AEir0wJajoXOl7PLPiahQ8ix3LfRRBjaF9d5UpemedJW-2XkSidN8e-qdj14OQJ1n7FV7-tKVTNRCLJFdg78cBnml3HCrjni30eIh_sgURwHorGU-71XAzlKZb4td_bQmGQ3YRZQ5JVxoPebRSE77fr4aFVQmZj4Opo12aymOnTTBfsyQmAFVMZGGJtl2lFftj-GdJmUEO17MneTsdf647te1Iu18cZwokHlzhkF_1pBWmCQtojra71MPLonWTB6pDE8bj4RDfUYiJPZtowa21_9fk8RqnefkhawtLS5_uo2ciHuk3xPyRHx-BojYzcVHADrDA01F4sChUZfyHIJdXwioW0=s1024-rj", 
        width: 1200,
        height: 630,
        alt: "Pixbuy Portada",
      },
    ],
    locale: "es_CL",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <head>
        {/* Volvemos a los scripts originales que sí cargan el diseño */}
        <script src="https://cdn.tailwindcss.com"></script>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              tailwind.config = {
                theme: { extend: { colors: {
                  pixdark: { DEFAULT: '#121212', light: '#1e1e1e', lighter: '#2a2a2a' },
                  pixorange: { DEFAULT: '#FF6600', hover: '#e55c00', light: '#ff8533' }
                }}}
              }
            `,
          }}
        />
        <style>{`
          body { background-color: #121212; color: #ffffff; }
          ::-webkit-scrollbar { width: 8px; }
          ::-webkit-scrollbar-track { background: #121212; }
          ::-webkit-scrollbar-thumb { background: #2a2a2a; border-radius: 4px; }
          ::-webkit-scrollbar-thumb:hover { background: #FF6600; }
        `}</style>
      </head>
      <body className="antialiased min-h-screen flex flex-col">
        <StoreProvider>
          <Navbar />
          {children}
          <Footer />
          <SpeedInsights />
        </StoreProvider>
      </body>
    </html>
  );
}