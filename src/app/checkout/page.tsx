"use client";

import { useState } from "react";
import { useStore } from "@/context/StoreProvider";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { CreditCard, ShieldCheck, Loader2, Gamepad2, AlertCircle, CheckCircle } from "lucide-react";

export default function CheckoutPage() {
  const { cart, clearCart } = useStore();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");


  const [isSuccess, setIsSuccess] = useState(false);
  const totalCLP = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);


  const handlePayment = async () => {
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cart, totalCLP }),
      });

      if (res.status === 401) {
        router.push("/login?callbackUrl=/checkout");
        return;
      }

      if (!res.ok) throw new Error("Fallo al procesar el pago");

      setIsSuccess(true); 
      clearCart(); // Ahora, aunque el carrito se vacíe, se mostrará la pantalla de éxito
      
      router.refresh(); 

      // 3. Esperamos 2 segundos para que el usuario lea el mensaje antes de redirigirlo
      setTimeout(() => {
        router.push("/dashboard");
      }, 2000);


    } catch (err) {
      setError("Hubo un problema con el pago o stock del producto. Intenta nuevamente mas tarde.");
      setLoading(false);
    }
  };

  if (isSuccess) {
    return (
      <main className="flex-1 flex flex-col items-center justify-center p-4 min-h-[60vh]">
        <CheckCircle className="w-24 h-24 text-green-500 mb-6 animate-bounce" />
        <h1 className="text-4xl font-black text-white mb-2">¡Pago Aprobado!</h1>
        <p className="text-gray-400 text-lg flex items-center gap-2">
          <Loader2 className="w-5 h-5 animate-spin text-[#FF6600]" /> 
          Preparando tus juegos y redirigiendo a tu bóveda...
        </p>
      </main>
    );
  }

  // Si alguien entra a /checkout con el carrito vacío (y no acaba de pagar)
  if (cart.length === 0) {
    return (
      <main className="flex-1 flex flex-col items-center justify-center p-4 min-h-[60vh]">
        <AlertCircle className="w-20 h-20 text-yellow-500 mb-6" />
        <h1 className="text-3xl font-black text-white mb-2">Checkout Inválido</h1>
        <p className="text-gray-400 mb-6">No tienes productos para procesar.</p>
        <Link href="/" className="bg-[#FF6600] px-8 py-3 rounded-full font-bold text-white hover:bg-[#e55c00] transition-colors">
          Volver a la Tienda
        </Link>
      </main>
    );
  }

  return (
    <main className="flex-1 w-full max-w-4xl mx-auto px-4 py-12">
      <div className="text-center mb-10">
        <h1 className="text-4xl font-black text-white mb-2">Finalizar Compra</h1>
        <p className="text-gray-400">Estás a un solo clic de desbloquear tu arsenal</p>
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500 text-red-400 p-4 rounded-xl mb-6 font-bold text-center">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* Resumen del Carrito */}
        <div className="bg-[#1e1e1e] border border-[#2a2a2a] rounded-xl p-6 h-fit">
          <h2 className="text-xl font-bold text-white mb-4 border-b border-[#2a2a2a] pb-2">Resumen de tu Orden</h2>
          <div className="space-y-4 mb-6">
            {cart.map((item) => (
              <div key={item.id} className="flex justify-between items-center text-sm">
    <span className="text-gray-300 line-clamp-1 pr-4">
      {/* AQUI AGREGAMOS LA CANTIDAD */}
      {item.quantity}x {item.title}
    </span>
    {/* AQUI CALCULAMOS EL PRECIO TOTAL DE ESTE ITEM */}
    <span className="text-white font-bold whitespace-nowrap">
      ${(item.price * item.quantity).toLocaleString('es-CL')}
    </span>
  </div>
))}
          </div>
          <div className="border-t border-[#2a2a2a] pt-4 flex justify-between items-end">
            <span className="text-gray-400 font-bold">Total a Pagar</span>
            <span className="text-3xl font-black text-[#FF6600]">${totalCLP.toLocaleString('es-CL')}</span>
          </div>
        </div>

        {/* Simulador de Pago */}
        <div className="bg-[#1e1e1e] border border-[#2a2a2a] rounded-xl p-6">
          <h2 className="text-xl font-bold text-white mb-4 border-b border-[#2a2a2a] pb-2 flex items-center gap-2">
            <CreditCard className="text-[#FF6600]" /> Método de Pago
          </h2>
          
          <div className="bg-[#121212] border-2 border-[#FF6600] rounded-lg p-4 mb-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 bg-[#FF6600] text-white text-[10px] font-black px-2 py-1 rounded-bl-lg">
              MODO PRUEBA
            </div>
            <div className="flex items-center gap-3 mb-2">
              <Gamepad2 className="text-[#FF6600] w-6 h-6" />
              <h3 className="font-bold text-white">Pixbuy Wallet (Simulador)</h3>
            </div>
            <p className="text-xs text-gray-400">
              Al hacer clic en pagar, simularemos una transacción bancaria exitosa y enviaremos los juegos a tu cuenta inmediatamente.
            </p>
          </div>

          <div className="space-y-3 mb-6">
            <div className="flex items-center gap-2 text-sm text-green-500">
              <ShieldCheck className="w-5 h-5" /> Transacción encriptada y segura
            </div>
          </div>

          <button 
            onClick={handlePayment} 
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 bg-[#FF6600] hover:bg-[#e55c00] text-white font-black py-4 rounded-xl transition-colors text-lg disabled:opacity-50"
          >
            {loading ? (
              <><Loader2 className="w-6 h-6 animate-spin" /> Procesando pago...</>
            ) : (
              `Pagar $${totalCLP.toLocaleString('es-CL')}`
            )}
          </button>
        </div>

      </div>
    </main>
  );
}