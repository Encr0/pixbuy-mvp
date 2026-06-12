import prisma from "@/lib/prisma";
import Link from "next/link";
import { Monitor, Gamepad2 } from "lucide-react";
import BuyBox from "@/components/products/BuyBox";

export default async function ProductPage({ params }: { params: { id: string } }) {
  const product = await prisma.product.findUnique({
    where: { id: params.id },
    include: {
      requirements: true,
      editions: true,
      categories: true,
    }
  });

  if (!product) {
    return (
      <main className="flex-1 flex flex-col items-center justify-center text-white p-4">
        <Gamepad2 className="w-24 h-24 text-gray-600 mb-4" />
        <h1 className="text-3xl font-black mb-2">Juego no encontrado</h1>
        <Link href="/" className="bg-[#FF6600] px-6 py-2 rounded font-bold text-white mt-4">Volver a la tienda</Link>
      </main>
    );
  }

  return (
    <main className="flex-1 w-full max-w-7xl mx-auto px-4 py-12">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        
        {/* COLUMNA IZQUIERDA: Arte y Requisitos (Estática) */}
        <div className="lg:col-span-2 space-y-8">
          <div className="rounded-xl overflow-hidden border border-[#2a2a2a] bg-[#1e1e1e] aspect-video relative">
            <img src={product.coverImage} alt={product.title} className="w-full h-full object-cover" />
          </div>

          <div className="bg-[#1e1e1e] border border-[#2a2a2a] rounded-xl p-6 md:p-8">
            <h2 className="text-2xl font-bold text-white mb-4 border-b border-[#2a2a2a] pb-2">Acerca del juego</h2>
            <p className="text-gray-300 leading-relaxed whitespace-pre-line">{product.description}</p>
          </div>

          {product.requirements && (
            <div className="bg-[#1e1e1e] border border-[#2a2a2a] rounded-xl p-6 md:p-8">
              <div className="flex items-center gap-2 mb-6 border-b border-[#2a2a2a] pb-2">
                <Monitor className="text-[#FF6600]" />
                <h2 className="text-2xl font-bold text-white">Requisitos del Sistema (PC)</h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="bg-[#121212] p-4 rounded border border-[#2a2a2a]">
                  <h3 className="text-[#FF6600] font-bold mb-3">Mínimos</h3>
                  <ul className="text-sm text-gray-400 space-y-2">
                    <li><strong className="text-gray-300">SO:</strong> {product.requirements.minOS}</li>
                    <li><strong className="text-gray-300">Procesador:</strong> {product.requirements.minCpu}</li>
                    <li><strong className="text-gray-300">Memoria:</strong> {product.requirements.minRam}</li>
                    <li><strong className="text-gray-300">Gráficos:</strong> {product.requirements.minGpu}</li>
                  </ul>
                </div>
                <div className="bg-[#121212] p-4 rounded border border-[#2a2a2a]">
                  <h3 className="text-green-500 font-bold mb-3">Recomendados</h3>
                  <ul className="text-sm text-gray-400 space-y-2">
                    <li><strong className="text-gray-300">SO:</strong> {product.requirements.recOS}</li>
                    <li><strong className="text-gray-300">Procesador:</strong> {product.requirements.recCpu}</li>
                    <li><strong className="text-gray-300">Memoria:</strong> {product.requirements.recRam}</li>
                    <li><strong className="text-gray-300">Gráficos:</strong> {product.requirements.recGpu}</li>
                  </ul>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* COLUMNA DERECHA: La Caja de Compra Dinámica */}
        <div className="space-y-6">
          <BuyBox product={product} />
        </div>

      </div>
    </main>
  );
}