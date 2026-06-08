import Image from "next/image";
import Link from "next/link";
import { ShoppingCart, ShieldCheck, Zap, Monitor } from "lucide-react";

export default function ProductPage({ params }: { params: { id: string } }) {
  // Simulamos la obtención de datos (En producción se reemplaza por Prisma: prisma.product.findUnique)
  const product = {
    id: params.id,
    title: "Cyberpunk 2077",
    description: "Una historia de acción y aventura en un mundo abierto ambientado en Night City, una megalópolis obsesionada con el poder, el glamour y la modificación corporal. Asumes el papel de V, un mercenario que busca un implante único que es la clave para la inmortalidad.",
    coverImage: "https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&q=80&w=1200",
    priceCLP: 25000,
    priceUSD: 29.99,
    platforms: ["Steam", "GOG"],
    publisher: "CD PROJEKT RED"
  };

  return (
    <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 bg-pixdark-light p-6 md:p-8 rounded-2xl border border-pixdark-lighter">
        
        {/* Imagen del Producto */}
        <div className="relative rounded-xl overflow-hidden aspect-video md:aspect-square bg-pixdark">
          <img 
            src={product.coverImage} 
            alt={product.title}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Detalles e Información de Compra */}
        <div className="flex flex-col justify-center">
          <div className="flex gap-2 mb-4">
            {product.platforms.map(platform => (
              <span key={platform} className="bg-pixdark border border-pixdark-lighter px-3 py-1 rounded text-sm font-bold flex items-center gap-2">
                <Monitor className="w-4 h-4 text-pixorange" /> {platform}
              </span>
            ))}
          </div>

          <h1 className="text-4xl font-black mb-2">{product.title}</h1>
          <p className="text-gray-400 text-sm mb-6">Editor: <span className="text-white">{product.publisher}</span></p>
          
          <p className="text-gray-300 leading-relaxed mb-8">
            {product.description}
          </p>

          <div className="bg-pixdark border border-pixdark-lighter rounded-xl p-6 mb-8">
            <div className="flex justify-between items-end mb-6">
              <div>
                <span className="text-sm text-gray-500 block mb-1">Precio Final</span>
                <span className="text-4xl font-black text-white">${product.priceCLP.toLocaleString('es-CL')}</span>
                <span className="text-sm text-gray-400 ml-3">USD {product.priceUSD}</span>
              </div>
            </div>

            <button className="w-full bg-pixorange hover:bg-pixorange-hover text-white font-bold py-4 rounded-xl flex justify-center items-center gap-3 transition-colors text-lg">
              <ShoppingCart className="w-6 h-6" />
              Añadir al Carrito
            </button>
          </div>

          <div className="grid grid-cols-2 gap-4 text-sm text-gray-400">
            <div className="flex items-center gap-2">
              <Zap className="w-5 h-5 text-pixorange" />
              <span>Entrega digital instantánea</span>
            </div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-pixorange" />
              <span>Clave 100% original</span>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}