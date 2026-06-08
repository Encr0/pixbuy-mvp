import Image from "next/image";
import Link from "next/link";
import { ShoppingCart } from "lucide-react";

// Mock de datos para el MVP (En la Fase 3 lo conectaremos a Prisma)
const mockProducts = [
  {
    id: "1",
    title: "Cyberpunk 2077",
    coverImage: "https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&q=80&w=600",
    priceCLP: 25000,
    priceUSD: 29.99,
    platforms: ["Steam", "Epic"],
  },
  {
    id: "2",
    title: "Elden Ring",
    coverImage: "https://images.unsplash.com/photo-1605901309584-818e25960b8f?auto=format&fit=crop&q=80&w=600",
    priceCLP: 35000,
    priceUSD: 39.99,
    platforms: ["Steam"],
  },
  {
    id: "3",
    title: "EA Sports FC 24",
    coverImage: "https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&q=80&w=600",
    priceCLP: 45000,
    priceUSD: 49.99,
    platforms: ["PSN", "Xbox", "Steam"],
  }
];

export default function Home() {
  return (
    <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      
      {/* Hero Section */}
      <div className="relative rounded-2xl overflow-hidden bg-pixdark-light border border-pixdark-lighter p-8 md:p-12 mb-12 flex flex-col md:flex-row items-center justify-between">
        <div className="z-10 relative max-w-lg">
          <h1 className="text-4xl md:text-5xl font-black mb-4 leading-tight">
            Desbloquea tu próximo juego en <span className="text-pixorange">segundos</span>.
          </h1>
          <p className="text-gray-400 mb-8 text-lg">
            Claves originales, entrega instantánea y los mejores precios para la comunidad gamer en Chile y el mundo.
          </p>
          <button className="bg-pixorange hover:bg-pixorange-hover text-white font-bold py-3 px-8 rounded-full transition-colors w-full sm:w-auto">
            Ver Ofertas
          </button>
        </div>
        <div className="mt-8 md:mt-0 relative w-full md:w-1/2 h-64 md:h-80">
           {/* Decorative abstract gamer element / image placeholder */}
           <div className="absolute inset-0 bg-gradient-to-tr from-pixorange/20 to-transparent rounded-xl border border-pixorange/30 shadow-[0_0_50px_rgba(255,102,0,0.2)]"></div>
        </div>
      </div>

      {/* Catalog Section */}
      <div className="flex justify-between items-end mb-6">
        <h2 className="text-2xl font-bold border-l-4 border-pixorange pl-3">Juegos Destacados</h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {mockProducts.map((game) => (
          <div key={game.id} className="bg-pixdark-light rounded-xl border border-pixdark-lighter overflow-hidden group hover:border-pixorange transition-colors flex flex-col">
            <div className="relative h-48 w-full overflow-hidden bg-pixdark">
              <img 
                src={game.coverImage} 
                alt={game.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 opacity-80 group-hover:opacity-100"
              />
              <div className="absolute top-2 right-2 flex gap-1">
                {game.platforms.map(p => (
                  <span key={p} className="bg-black/70 backdrop-blur-sm text-xs font-bold px-2 py-1 rounded text-white">
                    {p}
                  </span>
                ))}
              </div>
            </div>
            
            <div className="p-4 flex flex-col flex-1">
              <Link href={`/product/${game.id}`} className="hover:text-pixorange transition-colors">
                <h3 className="font-bold text-lg mb-1 truncate">{game.title}</h3>
              </Link>
              
              <div className="mt-auto pt-4 flex items-center justify-between">
                <div>
                  <span className="text-xl font-black text-white">${game.priceCLP.toLocaleString('es-CL')}</span>
                  <span className="text-xs text-gray-500 block">USD {game.priceUSD}</span>
                </div>
                <button className="bg-pixdark border border-pixdark-lighter hover:bg-pixorange hover:border-pixorange text-white p-2 rounded-lg transition-colors">
                  <ShoppingCart className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}