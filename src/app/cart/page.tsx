"use client";

import { useStore } from "@/context/StoreProvider";
import Link from "next/link";
import { ShoppingCart, Trash2, Minus, Plus } from "lucide-react";
import { useMemo } from "react"; // 1. IMPORTANTE: Importa useMemo

export default function CartPage() {
  const { cart, removeFromCart, updateQuantity } = useStore();

  // Multiplicamos el precio por la cantidad de copias de cada juego
  const totalCLP = useMemo(() => {
    return cart.reduce((acumulador, item) => {
      return acumulador + (item.price * item.quantity);
    }, 0);
  }, [cart]);

  if (cart.length === 0) {
    return (
      <main className="flex-1 flex flex-col items-center justify-center p-4 min-h-[60vh]">
        <ShoppingCart className="w-24 h-24 text-[#2a2a2a] mb-6" />
        <h1 className="text-3xl font-black text-white mb-4">Tu carrito está vacío</h1>
        <Link href="/catalogo" className="bg-[#FF6600] text-white font-bold py-3 px-8 rounded-full">
          Explorar Juegos
        </Link>
      </main>
    );
  }

  return (
    <main className="flex-1 w-full max-w-5xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-black text-white mb-8">Carrito de Compras</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 space-y-4">
          {cart.map((item) => (
            <div key={item.productId} className="flex flex-col sm:flex-row items-center gap-6 bg-[#1e1e1e] border border-[#2a2a2a] p-4 rounded-xl">
              <img src={item.image} alt={item.title} className="w-24 h-24 object-cover rounded-lg" />
              
              <div className="flex-1 text-center sm:text-left">
                <h3 className="font-bold text-white text-lg">{item.title}</h3>
                <p className="text-gray-400 text-sm">${item.price.toLocaleString('es-CL')} c/u</p>
              </div>

              {/* Nuevos controles de cantidad */}
              <div className="flex items-center gap-3 bg-[#121212] rounded-lg p-1 border border-[#2a2a2a]">
                <button 
                  onClick={() => updateQuantity(item.productId, item.quantity - 1)} 
                  className="p-2 text-gray-400 hover:text-[#FF6600] transition-colors"
                >
                  <Minus className="w-4 h-4"/>
                </button>
                <span className="w-6 text-center font-bold text-white">{item.quantity}</span>
                <button 
                  onClick={() => updateQuantity(item.productId, item.quantity + 1)} 
                  className="p-2 text-gray-400 hover:text-[#FF6600] transition-colors"
                >
                  <Plus className="w-4 h-4"/>
                </button>
              </div>

              <div className="text-center sm:text-right min-w-[100px]">
                <p className="text-sm text-gray-400 mb-1 hidden sm:block">Subtotal</p>
                <p className="font-black text-white text-xl">${(item.price * item.quantity).toLocaleString('es-CL')}</p>
              </div>

              <button 
                onClick={() => removeFromCart(item.productId)} 
                className="p-3 text-gray-500 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-colors"
                title="Eliminar producto"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
          ))}
        </div>

        <div className="bg-[#1e1e1e] border border-[#2a2a2a] p-6 rounded-xl h-fit sticky top-24">
          <h2 className="text-xl font-bold text-white mb-6">Resumen de tu pedido</h2>
          <div className="flex justify-between items-center mb-6 border-b border-[#2a2a2a] pb-6">
            <span className="text-gray-400">Total a pagar:</span>
            <span className="text-3xl font-black text-[#FF6600]">
              ${totalCLP.toLocaleString('es-CL')}
            </span>
          </div>
          <Link href="/checkout" className="w-full block text-center bg-[#FF6600] hover:bg-[#e55c00] text-white font-bold py-4 px-6 rounded-lg transition-colors">
            Proceder al Pago
          </Link>
        </div>
      </div>
    </main>
  );
}