import { ShieldCheck, Lock, Database, Mail } from "lucide-react";

export const metadata = {
  title: "Política de Privacidad - PixBuy",
};

export default function PrivacidadPage() {
  return (
    <main className="flex-1 w-full max-w-4xl mx-auto px-4 py-12">
      <div className="flex items-center gap-4 mb-8 border-b border-[#2a2a2a] pb-6">
        <ShieldCheck className="w-10 h-10 text-green-500" />
        <div>
          <h1 className="text-3xl font-black text-white tracking-tight uppercase">Política de Privacidad</h1>
          <p className="text-gray-400 text-sm mt-1">Tu información está segura con nosotros.</p>
        </div>
      </div>

      <div className="space-y-8 text-gray-300 leading-relaxed">
        <section>
          <p className="text-lg">
            En PixBuy nos tomamos la privacidad de nuestros gamers muy en serio. Esta política explica qué datos recopilamos, cómo los protegemos y para qué los utilizamos.
          </p>
        </section>

        <div className="grid md:grid-cols-2 gap-6 my-8">
          <div className="bg-[#1e1e1e] border border-[#2a2a2a] p-6 rounded-xl">
            <Database className="w-8 h-8 text-blue-400 mb-4" />
            <h3 className="text-white font-bold mb-2">Datos que Recopilamos</h3>
            <p className="text-sm text-gray-400">
              Solo solicitamos la información estrictamente necesaria: tu nombre, correo electrónico y el historial de tus pedidos. No guardamos información financiera sensible (números de tarjeta) en nuestros servidores; dichos datos son procesados por pasarelas seguras externas.
            </p>
          </div>
          
          <div className="bg-[#1e1e1e] border border-[#2a2a2a] p-6 rounded-xl">
            <Lock className="w-8 h-8 text-purple-400 mb-4" />
            <h3 className="text-white font-bold mb-2">Protección y Criptografía</h3>
            <p className="text-sm text-gray-400">
              Tus contraseñas nunca se almacenan en texto plano. Utilizamos algoritmos de hashing unidireccional (bcrypt) estándar de la industria. Las sesiones son manejadas a través de JSON Web Tokens (JWT) seguros.
            </p>
          </div>
        </div>

        <section>
          <h2 className="text-xl font-bold text-white mb-3 flex items-center gap-2">
            <Mail className="w-5 h-5 text-[#FF6600]" />
            Uso de tu Correo Electrónico
          </h2>
          <p>
            El correo proporcionado se utilizará exclusivamente para:
          </p>
          <ul className="list-disc pl-6 mt-3 space-y-2 text-gray-400">
            <li>Enviarte recibos automáticos de compra e información sobre tus CD Keys.</li>
            <li>Enviarte enlaces de recuperación si olvidas tu contraseña.</li>
            <li>Notificarte sobre respuestas a tus tickets de soporte técnico.</li>
          </ul>
          <p className="mt-3">
            <strong>Nunca</strong> venderemos tu base de datos a terceros ni te enviaremos spam promocional sin tu consentimiento expreso (opt-in).
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-white mb-3">Cookies y Tecnologías de Rastreo</h2>
          <p>
            Utilizamos cookies de sesión estrictamente necesarias para mantener tu cuenta logueada mientras navegas por el catálogo y mantienes productos en tu carrito. Además, utilizamos métricas anónimas de rendimiento (Speed Insights) para garantizar que nuestra tienda cargue lo más rápido posible.
          </p>
        </section>

      </div>
    </main>
  );
}