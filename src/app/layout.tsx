import type { Metadata } from "next";
import "./globals.css"; // Ruta relativa corregida
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

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
      <body className="antialiased min-h-screen flex flex-col">
        <Navbar />
        {children}
        <Footer />
      </body>
    </html>
  );
}