import { FileText, AlertCircle } from "lucide-react";
import Link from "next/link";

export const metadata = {
  title: "Términos y Condiciones - PixBuy",
};

export default function TerminosPage() {
  return (
    <main className="flex-1 w-full max-w-4xl mx-auto px-4 py-12">
      <div className="flex items-center gap-4 mb-8 border-b border-[#2a2a2a] pb-6">
        <FileText className="w-10 h-10 text-[#FF6600]" />
        <div>
          <h1 className="text-3xl font-black text-white tracking-tight uppercase">Términos y Condiciones</h1>
          <p className="text-gray-400 text-sm mt-1">Última actualización: Junio de 2026</p>
        </div>
      </div>

      <div className="space-y-8 text-gray-300 leading-relaxed">
        <section>
          <h2 className="text-xl font-bold text-white mb-3 flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-[#FF6600]" />
            1. Naturaleza de los Productos
          </h2>
          <p>
            PixBuy es una plataforma de distribución digital. Todos los productos comercializados en esta tienda (videojuegos, tarjetas de regalo, suscripciones) se entregan en formato de código alfanumérico (CD Key). No enviamos productos físicos a domicilio.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-white mb-3">2. Política de Reembolsos y Devoluciones</h2>
          <p>
            Debido a la naturaleza de los bienes digitales, <strong>todas las ventas son finales</strong>. Una vez que el usuario hace clic en "Revelar Llave" dentro de su Bóveda, el código se considera consumido y no será elegible para reembolso. 
          </p>
          <ul className="list-disc pl-6 mt-3 space-y-2 text-gray-400">
            <li>Solo se emitirán reembolsos si se demuestra mediante nuestro Soporte Técnico que la llave entregada era inválida o duplicada antes de la compra.</li>
            <li>El usuario es responsable de verificar los requisitos mínimos del sistema y la plataforma (Steam, Xbox, PlayStation) antes de adquirir un producto.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-bold text-white mb-3">3. Cuentas de Usuario y Seguridad</h2>
          <p>
            Para realizar compras, debes crear una cuenta. Eres el único responsable de mantener la confidencialidad de tu contraseña. PixBuy se reserva el derecho de suspender o banear cuentas que participen en actividades fraudulentas, intentos de explotación del sistema de PixPoints, o uso de tarjetas de crédito robadas.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-white mb-3">4. Precios y Moneda</h2>
          <p>
            Todos los precios mostrados en el catálogo están en Pesos Chilenos (CLP) e incluyen los impuestos digitales correspondientes (IVA) a menos que se especifique lo contrario en la pasarela de pago. Nos reservamos el derecho a modificar los precios en cualquier momento sin previo aviso debido a la fluctuación del mercado de CD Keys.
          </p>
        </section>

        <div className="bg-[#1e1e1e] p-6 rounded-xl border border-[#2a2a2a] mt-12 text-center">
          <p className="mb-4">¿Tienes dudas sobre estos términos?</p>
          <Link href="/soporte" className="bg-[#FF6600] hover:bg-[#e55c00] text-white px-6 py-2 rounded-lg font-bold transition-colors inline-block">
            Contactar a Soporte
          </Link>
        </div>
      </div>
    </main>
  );
}