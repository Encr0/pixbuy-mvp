import prisma from "@/lib/prisma";
import Link from "next/link";
import { Search, ShoppingCart, Gamepad2 } from "lucide-react";

export default async function HomePage() {

  const products = await prisma.product.findMany({
    where: { isActive: true },
    orderBy: { createdAt: 'desc' },
    take: 12 
  });

  return (
    <main className="flex-1 w-full max-w-7xl mx-auto px-4 py-8">
      
      {/* SECCIÓN HERO (El cartel principal) */}
      <div className="bg-gradient-to-r from-[#FF6600]/20 to-[#121212] border border-[#FF6600]/30 rounded-2xl p-8 md:p-12 mb-12 flex flex-col md:flex-row items-center justify-between">
        <div className="max-w-2xl">
          <h1 className="text-4xl md:text-6xl font-black text-white mb-4 leading-tight">
            Desbloquea tu próximo <span className="text-[#FF6600]">juego</span> en segundos.
          </h1>
          <p className="text-gray-400 text-lg md:text-xl mb-8">
            Claves originales, entrega instantánea y los mejores precios para la comunidad gamer en Chile y el mundo.
          </p>
          <div className="relative max-w-md">
            <input 
              type="text" 
              placeholder="Buscar juegos, tarjetas de regalo..." 
              className="w-full bg-[#1e1e1e] border border-[#2a2a2a] rounded-full py-3 px-6 pl-12 text-white focus:outline-none focus:border-[#FF6600] transition-colors"
            />
            <Search className="absolute left-4 top-3.5 text-gray-400 w-5 h-5" />
          </div>
        </div>
        <div className="hidden md:flex opacity-80">
          <Gamepad2 className="w-64 h-64 text-[#FF6600]/20" />
        </div>
      </div>

      {/* TÍTULO DE LA VITRINA */}
      <div className="flex items-center justify-between mb-8 border-b border-[#2a2a2a] pb-4">
        <h2 className="text-2xl md:text-3xl font-black text-white">Últimos Lanzamientos</h2>
        <Link href="/catalogo" className="text-[#FF6600] font-bold hover:underline">
          Ver todos
        </Link>
      </div>

      {/* CUADRÍCULA DINÁMICA DE JUEGOS */}
      {products.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <div key={product.id} className="bg-[#1e1e1e] border border-[#2a2a2a] rounded-xl overflow-hidden hover:border-[#FF6600] transition-all group hover:-translate-y-1 hover:shadow-2xl hover:shadow-[#FF6600]/10 flex flex-col">
              
              {/* Imagen (Clicable) */}
              <Link href={`/product/${product.id}`} className="aspect-[3/4] relative overflow-hidden block">
                <img 
                  src={product.coverImage} 
                  alt={product.title} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-2 left-2 bg-black/70 backdrop-blur text-white text-xs font-bold px-2 py-1 rounded border border-[#2a2a2a]">
                  {product.platforms[0]} {/* Muestra la primera plataforma, ej: Steam */}
                </div>
              </Link>
              
              {/* Info del Juego */}
              <div className="p-5 flex flex-col flex-1 justify-between">
                <div>
                  <Link href={`/product/${product.id}`}>
                    <h3 className="font-bold text-white text-lg line-clamp-1 hover:text-[#FF6600] transition-colors mb-1">
                      {product.title}
                    </h3>
                  </Link>
                  <p className="text-gray-400 text-xs mb-4 line-clamp-1">
                    {product.publisher || "Digital"}
                  </p>
                </div>
                
                {/* Precio y Botón */}
                <div className="flex items-end justify-between mt-auto">
                  <div>
                    <p className="text-xs text-gray-500 line-through mb-0.5">
                      ${(product.priceCLP * 1.3).toLocaleString('es-CL')}
                    </p>
                    <span className="font-black text-white text-xl">
                      ${product.priceCLP.toLocaleString('es-CL')}
                    </span>
                  </div>
                  <button className="bg-[#2a2a2a] hover:bg-[#FF6600] p-3 rounded-lg transition-colors text-white">
                    <ShoppingCart className="w-5 h-5" />
                  </button>
                </div>
              </div>

            </div>
          ))}
        </div>
      ) : (
        /* MENSAJE SI LA BASE DE DATOS ESTÁ VACÍA */
        <div className="text-center py-20 bg-[#1e1e1e] rounded-xl border border-[#2a2a2a]">
          <Gamepad2 className="w-16 h-16 text-gray-600 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-400">El catálogo está vacío</h2>
          <p className="text-gray-500 mt-2">Visita /api/seed para inyectar juegos de prueba.</p>
        </div>
      )}

    </main>
  );
}