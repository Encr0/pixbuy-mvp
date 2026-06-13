export const dynamic = "force-dynamic";
import prisma from "@/lib/prisma";
import Link from "next/link";
import { Search, ShoppingCart, Gamepad2 } from "lucide-react";
import { Terminal, ShieldCheck, Sparkles, Zap, Wrench, User, Github } from "lucide-react";

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
    {/* Título */}
    <div className="flex items-center gap-4 mb-6">
      <Terminal className="w-10 h-10 md:w-14 md:h-14 text-[#FF6600]" />
      <h1 className="text-4xl md:text-6xl font-black text-white leading-tight">
        LOGS: mes de junio 2026
      </h1>
    </div>

    {/* Lista estructurada en lugar del <p> con <br/> */}
    <ul className="space-y-4 mb-8 text-gray-300 text-lg md:text-xl">
      <li className="flex items-start gap-3">
        <ShieldCheck className="w-6 h-6 text-green-500 shrink-0 mt-1" />
        <span>
          <strong className="text-white">Seguridad & Auth:</strong> Base de datos protegida, contraseñas hasheadas, autenticación JWT y roles diferenciados (Admin/Cliente).
        </span>
      </li>

      <li className="flex items-start gap-3">
        <Sparkles className="w-6 h-6 text-purple-400 shrink-0 mt-1" />
        <span>
          <strong className="text-white">Nuevos Sistemas:</strong> Panel de administración completo, carrito con persistencia en DB y pasarela de pago simulada.
        </span>
      </li>

      <li className="flex items-start gap-3">
        <Sparkles className="w-6 h-6 text-purple-400 shrink-0 mt-1" />
        <span>
          <strong className="text-white">Interacción:</strong> Sistema de reseñas con moderación y búsqueda avanzada con filtros (plataforma, género, precio).
        </span>
      </li>

      <li className="flex items-start gap-3">
        <Zap className="w-6 h-6 text-yellow-400 shrink-0 mt-1" />
        <span>
          <strong className="text-white">Rendimiento:</strong> Optimización de consultas a la base de datos y uso de técnicas de caching.
        </span>
      </li>

      <li className="flex items-start gap-3">
        <Wrench className="w-6 h-6 text-blue-400 shrink-0 mt-1" />
        <span>
          <strong className="text-white">Bug Fixes:</strong> Arreglo en el error de cálculo de precios; ahora los impuestos se muestran correctamente.
        </span>
      </li>
    </ul>

    {/* Firma */}
    {/* Firma y Enlaces */}
    <div className="mt-8 flex flex-col gap-2">
      <div className="flex items-center gap-2 text-[#FF6600] font-mono text-lg">
        <User className="w-5 h-5" />
        <span>Encr0 - lead developer</span>
      </div>
      
      {/* Reemplaza TU_USUARIO por tu nombre de usuario real en GitHub */}
      <a 
        href="https://github.com/Encr0" 
        target="_blank" 
        rel="noopener noreferrer"
        className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors font-mono text-sm ml-7"
      >
        <Github className="w-4 h-4" />
        <span>github.com/Encr0</span>
      </a>
    </div>
  </div>

  {/* Icono gigante de la derecha (Mantenido intacto) */}
  <div className="hidden md:flex opacity-80 shrink-0 ml-8">
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