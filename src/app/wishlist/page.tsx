"use client";

import { useEffect, useState } from "react";
import { useStore } from "@/context/StoreProvider";
import Link from "next/link";
import { Heart, HeartCrack, ShoppingCart, Loader2 } from "lucide-react";

export default function WishlistPage() {
  const { wishlist, toggleWishlist } = useStore();
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Cada vez que cambia la memoria de la wishlist, buscamos los juegos en la base de datos
  useEffect(() => {
    const fetchWishlist = async () => {
      if (wishlist.length === 0) {
        setProducts([]);
        setLoading(false);
        return;
      }

      const res = await fetch("/api/wishlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ids: wishlist }),
      });

      if (res.ok) {
        const data = await res.json();
        setProducts(data);
      }
      setLoading(false);
    };

    fetchWishlist();
  }, [wishlist]);

  if (loading) {
    return (
      <main className="flex-1 flex justify-center items-center min-h-[60vh]">
        <Loader2 className="w-10 h-10 animate-spin text-[#FF6600]" />
      </main>
    );
  }

  if (products.length === 0) {
    return (
      <main className="flex-1 flex flex-col items-center justify-center p-4 min-h-[60vh]">
        <HeartCrack className="w-24 h-24 text-[#2a2a2a] mb-6" />
        <h1 className="text-3xl md:text-4xl font-black text-white mb-4 text-center">Sin favoritos</h1>
        <p className="text-gray-400 mb-8 text-center max-w-md text-lg">
          Tu lista de deseos está vacía. Navega por el catálogo y marca los juegos que te interesan.
        </p>
        <Link href="/catalogo" className="bg-[#FF6600] text-white font-bold py-3 px-8 rounded-full">
          Explorar Catálogo
        </Link>
      </main>
    );
  }

  return (
    <main className="flex-1 w-full max-w-7xl mx-auto px-4 py-12">
      <div className="flex items-center gap-3 mb-10 border-b border-[#2a2a2a] pb-6">
        <Heart className="w-8 h-8 text-[#FF6600] fill-current" />
        <h1 className="text-3xl md:text-4xl font-black text-white">Mi Lista de Deseos</h1>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.map((product) => (
          <div key={product.id} className="bg-[#1e1e1e] border border-[#2a2a2a] rounded-xl overflow-hidden hover:border-[#FF6600] transition-all flex flex-col relative group">
            
            {/* Botón de eliminar de wishlist directo en la tarjeta */}
            <button 
              onClick={() => toggleWishlist(product.id)}
              className="absolute top-2 right-2 bg-black/70 p-2 rounded-full text-red-500 hover:bg-red-500 hover:text-white transition-colors z-10"
              title="Eliminar de la lista"
            >
              <HeartCrack className="w-4 h-4" />
            </button>

            <Link href={`/product/${product.id}`} className="aspect-[3/4] relative overflow-hidden block">
              <img src={product.coverImage} alt={product.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
            </Link>
            
            <div className="p-5 flex flex-col flex-1 justify-between">
              <div>
                <Link href={`/product/${product.id}`}>
                  <h3 className="font-bold text-white text-lg line-clamp-1 hover:text-[#FF6600] mb-1">{product.title}</h3>
                </Link>
              </div>
              <div className="flex items-end justify-between mt-4">
                <span className="font-black text-white text-xl">${product.priceCLP.toLocaleString('es-CL')}</span>
                <Link href={`/product/${product.id}`} className="bg-[#2a2a2a] hover:bg-[#FF6600] p-3 rounded-lg transition-colors text-white">
                  <ShoppingCart className="w-5 h-5" />
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}