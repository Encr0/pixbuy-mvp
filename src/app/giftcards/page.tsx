import prisma from "@/lib/prisma";
import Link from "next/link";
import { CreditCard, ShoppingCart } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function GiftCardsPage() {
  const giftcards = await prisma.product.findMany({
    where: {
      categories: {
        some: {
          name: "Gift Cards" // IMPORTANTE: Debe coincidir exactamente con el nombre en tu BD
        }
      }
    },
    include: {
      keys: {
        where: { status: "AVAILABLE" }
      }
    }
  });

  return (
    <main className="flex-1 w-full max-w-7xl mx-auto px-4 py-12">
      {/* Cabecera */}
      <div className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 border border-blue-500/30 rounded-2xl p-8 mb-12 flex items-center justify-between">
        <div>
          <h1 className="text-4xl md:text-5xl font-black text-white mb-2 flex items-center gap-3">
            <CreditCard className="w-10 h-10 text-blue-400" />
            Tarjetas de Regalo
          </h1>
          <p className="text-gray-400 text-lg">
            Recarga tu saldo al instante. Códigos digitales para Steam, PlayStation, Xbox y Nintendo.
          </p>
        </div>
      </div>

      {/* Grid de Productos */}
      {giftcards.length === 0 ? (
        <div className="text-center py-20 bg-[#1e1e1e] rounded-xl border border-[#2a2a2a]">
          <CreditCard className="w-16 h-16 text-gray-600 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-gray-300">Inventario Vacío</h3>
          <p className="text-gray-500 mt-2">Pronto añadiremos nuevas tarjetas de regalo.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {giftcards.map((card) => {
            const stock = card.keys.length;
            
            return (
              <div key={card.id} className="bg-[#1e1e1e] border border-[#2a2a2a] rounded-xl overflow-hidden hover:border-blue-500 transition-colors group flex flex-col">
                {/* Contenedor de Imagen Horizontal */}
                <div className="aspect-[16/9] overflow-hidden relative bg-black">
                  <img 
                    src={card.coverImage} 
                    alt={card.title} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-2 right-2 bg-black/80 backdrop-blur text-xs font-bold px-2 py-1 rounded text-white">
                    {stock > 0 ? `${stock} disponibles` : <span className="text-red-500">Agotado</span>}
                  </div>
                </div>
                
                <div className="p-4 flex flex-col flex-1 justify-between">
                  <div>
                    <h3 className="text-lg font-bold text-white mb-1 line-clamp-2">{card.title}</h3>
                  </div>
                  <div className="flex justify-between items-end mt-4 pt-4 border-t border-[#2a2a2a]">
                    <span className="text-2xl font-black text-blue-400">
                      ${card.priceCLP.toLocaleString('es-CL')}
                    </span>
                    <Link 
                      href={`/product/${card.id}`}
                      className="bg-[#2a2a2a] hover:bg-blue-500 text-white p-2 rounded-lg transition-colors"
                      title="Ver detalles"
                    >
                      <ShoppingCart className="w-5 h-5" />
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </main>
  );
}