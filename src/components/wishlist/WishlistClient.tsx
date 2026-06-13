"use client";

import { useStore } from "@/context/StoreProvider";
import Link from "next/link";
import { Heart, ShoppingCart, Trash2 } from "lucide-react";

export default function WishlistClient({ products }: { products: any[] }) {
  const { wishlist, toggleWishlist, addToCart } = useStore();

  // Filtramos la lista completa de juegos usando los IDs guardados en el StoreProvider
  const favoriteProducts = products.filter((product) =>
    wishlist.includes(product.id)
  );

  if (favoriteProducts.length === 0) {
    return (
      <main className="flex-1 flex flex-col items-center justify-center p-4 min-h-[60vh]">
        <Heart className="w-24 h-24 text-[#2a2a2a] mb-6" />
        <h1 className="text-3xl font-black text-white mb-4">Tu lista de deseos está vacía</h1>
        <p className="text-gray-400 mb-8 text-center max-w-sm">
          Navega por el catálogo y marca con un corazón los juegos que te interesan para guardarlos aquí.
        </p>
        <Link href="/catalogo" className="bg-[#FF6600] text-white font-bold py-3 px-8 rounded-full hover:bg-[#e55c00] transition-colors">
          Explorar Catálogo
        </Link>
      </main>
    );
  }

  return (
    <main className="flex-1 w-full max-w-7xl mx-auto px-4 py-12">
      <div className="mb-10 border-b border-[#2a2a2a] pb-6">
        <h1 className="text-3xl font-black text-white mb-2 flex items-center gap-3">
          <Heart className="w-8 h-8 text-red-500 fill-red-500" />
          Mi Lista de Deseos
        </h1>
        <p className="text-gray-400">
          Tienes {favoriteProducts.length} {favoriteProducts.length === 1 ? 'juego guardado' : 'juegos guardados'} en tu cuenta.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {favoriteProducts.map((product) => (
          <div key={product.id} className="bg-[#1e1e1e] border border-[#2a2a2a] rounded-xl overflow-hidden hover:border-[#FF6600] transition-all group flex flex-col">
            <Link href={`/product/${product.id}`} className="aspect-[3/4] relative overflow-hidden block">
              <img src={product.coverImage} alt={product.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              <div className="absolute top-2 left-2 bg-black/70 backdrop-blur text-white text-xs font-bold px-2 py-1 rounded border border-[#2a2a2a]">
                {product.platforms?.[0] || "Digital"}
              </div>
            </Link>
            <div className="p-5 flex flex-col flex-1 justify-between">
              <div>
                <Link href={`/product/${product.id}`}>
                  <h3 className="font-bold text-white text-lg line-clamp-1 hover:text-[#FF6600] transition-colors mb-1">{product.title}</h3>
                </Link>
              </div>
              <div className="flex items-center justify-between mt-6 pt-4 border-t border-[#2a2a2a]">
                <div>
                  <span className="font-black text-white text-xl">${product.priceCLP.toLocaleString('es-CL')}</span>
                </div>
                <div className="flex gap-2">
                  <button 
                    onClick={() => toggleWishlist(product.id)}
                    className="bg-[#2a2a2a] hover:bg-red-500/10 p-2.5 rounded-lg transition-colors text-gray-400 hover:text-red-500"
                    title="Quitar de favoritos"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                  <button 
                    onClick={() => addToCart({ id: product.id, productId: product.id, title: product.title, price: product.priceCLP, image: product.coverImage })}
                    className="bg-[#FF6600] hover:bg-[#e55c00] p-2.5 rounded-lg transition-colors text-white"
                    title="Añadir al carrito"
                  >
                    <ShoppingCart className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}