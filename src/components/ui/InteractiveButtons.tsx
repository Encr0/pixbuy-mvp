"use client";

import { ShoppingCart, Heart } from "lucide-react";
import { useStore } from "@/context/StoreProvider";
import { useState } from "react";

interface Props {
  product: { id: string; title: string; priceCLP: number; coverImage: string };
}

export default function InteractiveButtons({ product }: Props) {
  const { addToCart, cart, wishlist, toggleWishlist } = useStore();
  const [added, setAdded] = useState(false);

  const isWishlisted = wishlist.includes(product.id);
  const inCart = cart.some((item) => item.id === product.id);

  const handleCart = () => {
    addToCart({
      id: product.id,
      productId: product.id,
      title: product.title,
      price: product.priceCLP,
      image: product.coverImage,
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 2000); // Vuelve a la normalidad en 2 segundos
  };

  return (
    <div className="flex gap-3">
      {/* Botón de Carrito */}
      <button 
        onClick={handleCart}
        disabled={inCart}
        className={`flex-1 flex items-center justify-center gap-2 font-black text-lg py-4 rounded transition-colors ${
          inCart 
            ? "bg-green-500 text-white cursor-default" 
            : added 
              ? "bg-green-500 text-white" 
              : "bg-[#FF6600] hover:bg-[#e55c00] text-white"
        }`}
      >
        <ShoppingCart className="w-6 h-6" />
        {inCart ? "En el carrito" : added ? "¡Añadido!" : "Añadir al Carrito"}
      </button>

      {/* Botón de Wishlist */}
      <button 
        onClick={() => toggleWishlist(product.id)}
        className={`p-4 rounded border-2 transition-colors flex items-center justify-center ${
          isWishlisted 
            ? "border-red-500 bg-red-500/10 text-red-500" 
            : "border-[#2a2a2a] hover:border-gray-500 text-gray-400"
        }`}
      >
        <Heart className={`w-6 h-6 ${isWishlisted ? "fill-current" : ""}`} />
      </button>
    </div>
  );
}