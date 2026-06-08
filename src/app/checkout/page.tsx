import Link from "next/link";
import { CheckCircle } from "lucide-react";

export default function CheckoutSuccessPage() {
  return (
    <main className="flex-1 w-full max-w-7xl mx-auto px-4 py-20 flex flex-col items-center justify-center text-center">
      <CheckCircle className="w-24 h-24 text-green-500 mb-6" />
      <h1 className="text-4xl md:text-5xl font-black mb-4">¡Pago Exitoso!</h1>
      <p className="text-gray-400 mb-8 max-w-lg text-lg">
        Tu orden simulada ha sido procesada correctamente. Ya puedes acceder a tu biblioteca y revelar las claves originales de tus juegos.
      </p>
      <Link 
        href="/dashboard" 
        className="bg-pixorange hover:bg-pixorange-hover text-white font-bold py-3 px-8 rounded-full transition-colors text-lg"
      >
        Ir a Mi Panel
      </Link>
    </main>
  );
}