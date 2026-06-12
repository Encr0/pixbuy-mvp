"use client";

import Link from "next/link";
import { Trash2, ShoppingCart, Gamepad2, ArrowRight } from "lucide-react";
import { useStore } from "@/context/StoreProvider";

export default function CartPage() {
  // Conectamos la página a nuestra memoria global
  const { cart, removeFromCart } = useStore();

  // Magia pura: Calculamos la suma de los precios de todo lo que hay en el carrito
  const totalCLP = cart.reduce((acumulador, item) => acumulador + item.price, 0);

  // Si el carrito está vacío, mostramos una pantalla especial para que vayan a comprar
  if (cart.length === 0) {
    return (
      <main className="flex-1 flex flex-col items-center justify-center p-4 min-h-[60vh]">
        <ShoppingCart className="w-24 h-24 text-[#2a2a2a] mb-6" />
        <h1 className="text-3xl md:text-5xl font-black text-white mb-4 text-center">Tu arsenal está vacío</h1>
        <p className="text-gray-400 mb-8 text-center max-w-md text-lg">
          Aún no has añadido ninguna clave a tu carrito. ¡Explora nuestro catálogo y prepárate para jugar!
        </p>
        <Link 
          href="/" 
          className="bg-[#FF6600] hover:bg-[#e55c00] text-white font-bold py-3 px-8 rounded-full transition-colors text-lg"
        >
          Explorar Juegos
        </Link>
      </main>
    );
  }

  // Si hay cosas en el carrito, mostramos la tabla de cobro
  return (
    <main className="flex-1 w-full max-w-7xl mx-auto px-4 py-12">
      <h1 className="text-3xl md:text-4xl font-black text-white mb-8 flex items-center gap-3">
        <ShoppingCart className="text-[#FF6600]" />
        Tu Carrito
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        
        {/* COLUMNA IZQUIERDA: Lista de Juegos */}
        <div className="lg:col-span-2 space-y-4">
          {cart.map((item) => (
            <div key={item.id} className="bg-[#1e1e1e] border border-[#2a2a2a] rounded-xl p-4 flex flex-col sm:flex-row items-center gap-4 relative sm:pr-6 transition-all hover:border-gray-600">
              
              <img src={item.image} alt={item.title} className="w-full sm:w-32 h-32 object-cover rounded-lg border border-[#2a2a2a]" />
              
              <div className="flex-1 w-full text-center sm:text-left mt-2 sm:mt-0">
                <Link href={`/product/${item.productId}`} className="hover:text-[#FF6600] transition-colors">
                  <h3 className="text-xl font-bold text-white mb-1 line-clamp-1">{item.title}</h3>
                </Link>
                <p className="text-gray-400 text-sm mb-3">Entrega Digital Instantánea</p>
                <span className="text-2xl font-black text-white">
                  ${item.price.toLocaleString('es-CL')} <span className="text-sm text-gray-500 font-normal">CLP</span>
                </span>
              </div>
              
              {/* Botón de Borrar */}
              <button 
                onClick={() => removeFromCart(item.id)}
                className="absolute sm:static top-2 right-2 p-3 text-gray-500 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-colors"
                title="Eliminar del carrito"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
          ))}
        </div>

        {/* COLUMNA DERECHA: Resumen de Compra (Ticket) */}
        <div className="bg-[#1e1e1e] border border-[#2a2a2a] rounded-xl p-6 h-fit sticky top-24">
          <h2 className="text-xl font-bold text-white border-b border-[#2a2a2a] pb-4 mb-4">Resumen de la Orden</h2>
          
          <div className="space-y-3 mb-6 text-sm">
            <div className="flex justify-between text-gray-400">
              <span>Artículos ({cart.length})</span>
              <span className="text-white">${totalCLP.toLocaleString('es-CL')}</span>
            </div>
            <div className="flex justify-between text-gray-400">
              <span>Impuestos y comisiones</span>
              <span className="text-green-500">Incluidos</span>
            </div>
          </div>

          <div className="border-t border-[#2a2a2a] pt-4 mb-6">
            <div className="flex justify-between items-end">
              <span className="text-gray-300 font-bold">Total a pagar</span>
              <span className="text-3xl font-black text-[#FF6600]">
                ${totalCLP.toLocaleString('es-CL')}
              </span>
            </div>
          </div>

          {/* El botón que lleva al Checkout que ya programaste antes */}
          <Link 
            href="/checkout" 
            className="w-full flex items-center justify-center gap-2 bg-[#FF6600] hover:bg-[#e55c00] text-white font-black py-4 rounded transition-colors text-lg"
          >
            Proceder al Pago <ArrowRight className="w-6 h-6" />
          </Link>

          <div className="mt-4 flex items-center justify-center gap-2 text-xs text-gray-500">
            <Gamepad2 className="w-4 h-4" />
            <span>Transacción segura de extremo a extremo</span>
          </div>
        </div>

      </div>
    </main>
  );
}