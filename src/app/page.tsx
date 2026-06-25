import prisma from "@/lib/prisma";
import Link from "next/link";
import { 
  Gamepad2, Terminal, ShieldCheck, Sparkles, Zap, Wrench, User, Github, Flame, Tent, ShoppingCart, 
  FileText
} from "lucide-react";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  // Ejecutamos las 3 consultas en paralelo para máxima velocidad
  const [latestReleases, actionGames, survivalGames] = await Promise.all([
    prisma.product.findMany({
      take: 4,
      orderBy: { id: 'desc' }, 
      include: { keys: { where: { status: "AVAILABLE" } } }
    }),
    prisma.product.findMany({
      take: 4,
      where: { categories: { some: { name: "Acción" } } },
      include: { keys: { where: { status: "AVAILABLE" } } }
    }),
    prisma.product.findMany({
      take: 4,
      where: { categories: { some: { name: "Supervivencia" } } },
      include: { keys: { where: { status: "AVAILABLE" } } }
    })
  ]);

  // Función auxiliar para renderizar la cuadrícula de juegos (¡AHORA CLICKEABLE!)
  const renderGameGrid = (games: any[]) => {
    if (games.length === 0) return <p className="text-gray-500 py-4">No hay juegos en esta categoría aún.</p>;

    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
        {games.map((game) => {
          const stock = game.keys?.length || 0;
          return (
            <div key={game.id} className="bg-[#1e1e1e] border border-[#2a2a2a] rounded-xl overflow-hidden hover:border-[#FF6600] transition-colors group flex flex-col relative">
              
              {/* Envolvemos la Imagen y el Título en un Link para que TODO sea clickeable */}
              <Link href={`/product/${game.id}`} className="flex flex-col flex-1">
                <div className="aspect-[3/4] overflow-hidden relative bg-black">
                  <img 
                    src={game.coverImage} 
                    alt={game.title} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-2 right-2 bg-black/80 backdrop-blur text-xs font-bold px-2 py-1 rounded text-white z-10">
                    {stock > 0 ? `${stock} disp.` : <span className="text-red-500">Agotado</span>}
                  </div>
                </div>
                <div className="p-4 flex flex-col flex-1">
                  <h3 className="text-lg font-bold text-white mb-1 line-clamp-2 group-hover:text-[#FF6600] transition-colors">{game.title}</h3>
                </div>
              </Link>

              {/* Contenedor de Precio y Carrito (Se mantiene en la parte inferior) */}
              <div className="px-4 pb-4 mt-auto">
                <div className="flex justify-between items-end pt-4 border-t border-[#2a2a2a]">
                  <span className="text-xl font-black text-[#FF6600]">
                    ${game.priceCLP.toLocaleString('es-CL')}
                  </span>
                  <Link 
                    href={`/product/${game.id}`}
                    className="bg-[#2a2a2a] hover:bg-[#FF6600] text-white p-2 rounded-lg transition-colors z-10"
                    title="Ver producto"
                  >
                    <ShoppingCart className="w-5 h-5" />
                  </Link>
                </div>
              </div>

            </div>
          );
        })}
      </div>
    );
  };

  return (
    <main className="flex-1 w-full max-w-7xl mx-auto px-4 py-12 space-y-16">
      
      {/* =========================================
          CARTEL DE LOGS (HERO SECTION) INTACTO
      ========================================= */}
<div className="bg-gradient-to-r from-[#FF6600]/20 to-[#121212] border border-[#FF6600]/30 rounded-2xl p-8 md:p-12 mb-12 flex flex-col md:flex-row items-center justify-between">
  <div className="max-w-2xl">
    <div className="flex items-center gap-4 mb-6">
      <Terminal className="w-10 h-10 md:w-14 md:h-14 text-[#FF6600]" />
      <h1 className="text-4xl md:text-6xl font-black text-white leading-tight">
        LOGS: 25-06-2026
      </h1>
    </div>

    <ul className="space-y-4 mb-8 text-gray-300 text-lg md:text-xl">
      <li className="flex items-start gap-3">
        <ShieldCheck className="w-6 h-6 text-green-500 shrink-0 mt-1" />
        <span>
          <strong className="text-white">Seguridad y Auth:</strong> Flujo completo de recuperación de contraseñas con tokens criptográficos (`crypto`), expiración temporal y envío de enlaces mágicos vía Nodemailer.
        </span>
      </li>
      <li className="flex items-start gap-3">
        <Sparkles className="w-6 h-6 text-purple-400 shrink-0 mt-1" />
        <span>
          <strong className="text-white">CRM & Soporte:</strong> Implementación de un sistema de Tickets relacional en PostgreSQL con notificaciones Push automáticas al correo del administrador.
        </span>
      </li>
      <li className="flex items-start gap-3">
        <FileText className="w-6 h-6 text-blue-400 shrink-0 mt-1" />
        <span>
          <strong className="text-white">Legal & Compliance:</strong> Integración de apartados legales de e-commerce (Términos y Condiciones, Política de Privacidad) adaptados para la venta de bienes digitales.
        </span>
      </li>
      <li className="flex items-start gap-3">
        <Zap className="w-6 h-6 text-yellow-400 shrink-0 mt-1" />
        <span>
          <strong className="text-white">UX & Rendimiento:</strong> Telemetría en vivo con Vercel Speed Insights, optimización de carga con `Promise.all` y sistema de Gamificación dinámica (PixPoints).
        </span>
      </li>
      <li className="flex items-start gap-3">
        <Wrench className="w-6 h-6 text-gray-400 shrink-0 mt-1" />
        <span>
          <strong className="text-white">Build Release:</strong> Despliegue exitoso en producción (Vercel + Neon DB) solucionando conflictos de dependencias (`legacy-peer-deps`) y caché.
        </span>
      </li>
    </ul>

    <div className="mt-8 flex flex-col gap-2">
      <div className="flex items-center gap-2 text-[#FF6600] font-mono text-lg">
        <User className="w-5 h-5" />
        <span>Encr0 - lead developer</span>
      </div>
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

  <div className="hidden md:flex opacity-80 shrink-0 ml-8">
    <Gamepad2 className="w-64 h-64 text-[#FF6600]/20" />
  </div>
</div>


      {/* =========================================
          SECCIÓN 1: ÚLTIMOS LANZAMIENTOS
      ========================================= */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl md:text-3xl font-black text-white flex items-center gap-3">
            <Gamepad2 className="w-8 h-8 text-[#FF6600]" />
            Últimos Lanzamientos
          </h2>
          <Link href="/catalogo" className="text-[#FF6600] hover:text-white font-bold text-sm transition-colors">
            Ver todo el catálogo &rarr;
          </Link>
        </div>
        {renderGameGrid(latestReleases)}
      </section>

      {/* =========================================
          SECCIÓN 2: CATEGORÍA ACCIÓN
      ========================================= */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl md:text-3xl font-black text-white flex items-center gap-3">
            <Flame className="w-8 h-8 text-red-500" />
            Acción Pura
          </h2>
          <Link href="/catalogo?categoria=accion" className="text-gray-400 hover:text-white font-bold text-sm transition-colors">
            Ver más Acción &rarr;
          </Link>
        </div>
        {renderGameGrid(actionGames)}
      </section>

      {/* =========================================
          SECCIÓN 3: CATEGORÍA SUPERVIVENCIA
      ========================================= */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl md:text-3xl font-black text-white flex items-center gap-3">
            <Tent className="w-8 h-8 text-green-500" />
            Supervivencia Extrema
          </h2>
          <Link href="/catalogo?categoria=supervivencia" className="text-gray-400 hover:text-white font-bold text-sm transition-colors">
            Ver más Supervivencia &rarr;
          </Link>
        </div>
        {renderGameGrid(survivalGames)}
      </section>
      
    </main>
  );
}