"use client";

import { useState } from "react";
import { Star, ShieldCheck, ShoppingCart, Heart } from "lucide-react";
import { useStore } from "@/context/StoreProvider";

// Este componente recibe toda la info del juego desde la base de datos
export default function BuyBox({ product }: { product: any }) {
  const { addToCart, cart, wishlist, toggleWishlist } = useStore();
  
  // 1. Estado para recordar qué edición eligió el usuario (por defecto la 0, que es Standard)
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [added, setAdded] = useState(false);

  // 2. Variables dinámicas: Si hay ediciones, usamos la seleccionada, sino la base
  const activeEdition = product.editions?.length > 0 ? product.editions[selectedIndex] : null;
  const currentPrice = activeEdition ? activeEdition.priceCLP : product.priceCLP;
  
  // 3. Creamos un ID único para el carrito y un título personalizado (Ej: Cyberpunk 2077 - Ultimate Edition)
  const cartItemId = activeEdition ? activeEdition.id : product.id;
  const finalTitle = activeEdition && activeEdition.name !== "Standard Edition"
    ? `${product.title} - ${activeEdition.name}`
    : product.title;

  const inCart = cart.some((item) => item.id === cartItemId);
  const isWishlisted = wishlist.includes(product.id);

  const handleCart = () => {
    addToCart({
      id: cartItemId, 
      productId: product.id,
      title: finalTitle,
      price: currentPrice,
      image: product.coverImage,
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <div className="bg-[#1e1e1e] border border-[#2a2a2a] rounded-xl p-6 sticky top-6">
      <h1 className="text-3xl font-black text-white leading-tight mb-2">{product.title}</h1>
      
      {/* Reseñas y Publisher */}
      {/* Reseñas Calculadas Matemáticamente */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-1">
          <div className="flex text-yellow-500">
            {[1, 2, 3, 4, 5].map((star) => {
              // Calculamos el promedio sumando todas las calificaciones y dividiéndolas por la cantidad de reseñas
              const reviewCount = product.reviews?.length || 0;
              const avgRating = reviewCount > 0 
                ? product.reviews.reduce((acc: number, rev: any) => acc + rev.rating, 0) / reviewCount 
                : 0;
                
              return (
                <Star 
                  key={star} 
                  className={`w-5 h-5 ${star <= Math.round(avgRating) ? "fill-current" : "text-gray-600"}`} 
                />
              );
            })}
          </div>
          <span className="text-gray-400 text-sm ml-2">
            ({product.reviews?.length || 0} reseñas)
          </span>
        </div>
        <span className="text-xs font-bold bg-[#2a2a2a] text-gray-300 px-3 py-1 rounded-full">
          {product.publisher || "Digital"}
        </span>
      </div>

      {/* Categorías */}
      <div className="flex gap-2 mb-6">
        {product.categories?.map((cat: any) => (
          <span key={cat.id} className="text-xs font-bold bg-[#FF6600]/20 text-[#FF6600] px-3 py-1 rounded-full">
            {cat.name}
          </span>
        ))}
      </div>

      {/* Selector Dinámico de Ediciones */}
      {product.editions?.length > 0 && (
        <div className="mb-8 space-y-3">
          <p className="text-sm text-gray-400 mb-1">Selecciona la edición:</p>
          {product.editions.map((edition: any, index: number) => {
            const priceDiff = edition.priceCLP - product.priceCLP;
            const isSelected = selectedIndex === index;
            
            return (
              <label 
                key={edition.id} 
                onClick={() => setSelectedIndex(index)}
                className={`flex flex-col p-3 border-2 rounded cursor-pointer transition-colors ${
                  isSelected ? 'border-[#FF6600] bg-[#FF6600]/10' : 'border-[#2a2a2a] hover:border-gray-500'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <input 
                      type="radio" 
                      name="edition" 
                      className="accent-[#FF6600]" 
                      checked={isSelected}
                      readOnly // ReadOnly porque el div entero maneja el clic
                    />
                    <span className="text-white font-bold">{edition.name}</span>
                  </div>
                  {priceDiff > 0 && (
                    <span className="text-sm text-[#FF6600] font-bold">+ ${priceDiff.toLocaleString('es-CL')}</span>
                  )}
                </div>
                {edition.bonus && (
                  <span className="text-xs text-gray-400 mt-1 ml-6">{edition.bonus}</span>
                )}
              </label>
            );
          })}
        </div>
      )}

      {/* Precio Dinámico que reacciona a los clics */}
      <div className="mb-6">
        <div className="flex items-end gap-3 mb-4">
          <span className="text-4xl font-black text-white transition-all duration-300">
            ${currentPrice.toLocaleString('es-CL')} <span className="text-lg text-gray-400 font-normal">CLP</span>
          </span>
        </div>
        
        {/* Botones Interactivos Integrados */}
        <div className="flex gap-3">
          {product._count?.keys > 0 ? (
            <button 
              onClick={handleCart}
              className={`flex-1 flex items-center justify-center gap-2 font-black text-lg py-4 rounded transition-colors ${
                added ? "bg-green-500 text-white" : "bg-[#FF6600] hover:bg-[#e55c00] text-white"
              }`}
            >
              <ShoppingCart className="w-6 h-6" />
              {added ? "¡Añadido!" : inCart ? "Añadir otra copia" : "Añadir al Carrito"}
            </button>

            ) : (
              <button disabled className="flex-1 flex items-center justify-center gap-2 bg-[#2a2a2a] text-gray-500 font-black text-lg py-4 rounded cursor-not-allowed">
                Agotado Temporalmente
              </button>
            )}

          <button 
            onClick={() => toggleWishlist(product.id)}
            className={`p-4 rounded border-2 transition-colors flex items-center justify-center ${
              isWishlisted ? "border-red-500 bg-red-500/10 text-red-500" : "border-[#2a2a2a] hover:border-gray-500 text-gray-400"
            }`}
          >
            <Heart className={`w-6 h-6 ${isWishlisted ? "fill-current" : ""}`} />
          </button>
        </div>
      </div>

      <div className="space-y-3 mt-6 border-t border-[#2a2a2a] pt-6">
        <div className="flex items-center gap-3 text-sm text-gray-400">
          <ShieldCheck className="w-5 h-5 text-green-500" />
          <span>Clave digital original garantizada</span>
        </div>
      </div>
    </div>
  );
}