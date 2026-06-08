"use client";
import { useCartStore } from "@/lib/store";
import { Trash2, CreditCard } from "lucide-react";
import Link from "next/link";

export default function CartPage() {
  const { items, removeItem } = useCartStore();
  
  const totalCLP = items.reduce((acc, item) => acc + (item.priceCLP * item.quantity), 0);
  const totalUSD = items.reduce((acc, item) => acc + (item.priceUSD * item.quantity), 0);

  const handleCheckout = async (method: 'webpay' | 'paypal') => {
    // Aquí se llamaría a /api/checkout
    alert(`Redirigiendo a pasarela: ${method.toUpperCase()}...`);
  };

  return (
    <main className="flex-1 w-full max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-black mb-8 border-l-4 border-pixorange pl-3">Tu Carrito</h1>
      
      {items.length === 0 ? (
        <div className="text-center py-20 bg-pixdark-light rounded-xl border border-pixdark-lighter">
          <p className="text-gray-400 mb-4">Tu carrito está vacío.</p>
          <Link href="/" className="text-pixorange hover:text-pixorange-hover font-bold">
            Volver al catálogo
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => (
              <div key={item.id} className="flex items-center gap-4 bg-pixdark-light p-4 rounded-xl border border-pixdark-lighter">
                <img src={item.coverImage} alt={item.title} className="w-24 h-24 object-cover rounded-lg" />
                <div className="flex-1">
                  <h3 className="font-bold text-lg">{item.title}</h3>
                  <p className="text-gray-400 text-sm">Cantidad: {item.quantity}</p>
                </div>
                <div className="text-right">
                  <p className="font-black text-xl">${(item.priceCLP * item.quantity).toLocaleString('es-CL')}</p>
                  <button 
                    onClick={() => removeItem(item.id)}
                    className="text-red-500 hover:text-red-400 text-sm flex items-center gap-1 mt-2 ml-auto"
                  >
                    <Trash2 className="w-4 h-4" /> Eliminar
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-pixdark-light p-6 rounded-xl border border-pixdark-lighter h-fit sticky top-24">
            <h3 className="text-xl font-bold mb-4 border-b border-pixdark-lighter pb-4">Resumen</h3>
            <div className="flex justify-between mb-2">
              <span className="text-gray-400">Total (CLP)</span>
              <span className="font-bold">${totalCLP.toLocaleString('es-CL')}</span>
            </div>
            <div className="flex justify-between mb-8">
              <span className="text-gray-400">Total (USD)</span>
              <span className="font-bold">${totalUSD.toFixed(2)}</span>
            </div>

            <div className="space-y-3">
              <button onClick={() => handleCheckout('webpay')} className="w-full bg-teal-600 hover:bg-teal-500 text-white font-bold py-3 rounded-lg flex justify-center items-center gap-2 transition-colors">
                <CreditCard className="w-5 h-5" /> Pagar con Webpay
              </button>
              <button onClick={() => handleCheckout('paypal')} className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 rounded-lg flex justify-center items-center gap-2 transition-colors">
                Pagar con PayPal
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}