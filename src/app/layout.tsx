/* eslint-disable @next/next/no-sync-scripts */
import type { Metadata } from "next";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { StoreProvider } from "@/context/StoreProvider";

export const metadata: Metadata = {
  title: "Pixbuy | Venta de Claves de Videojuegos",
  description: "Compra claves de juegos para PC, PlayStation y Xbox al instante.",
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
        </StoreProvider>
      </body>
    </html>
  );
}