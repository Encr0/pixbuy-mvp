"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { LifeBuoy, Send, Loader2, CheckCircle, AlertCircle } from "lucide-react";
import Link from "next/link";

export default function SupportPage() {
  const router = useRouter();
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/tickets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ subject, message }),
      });

      if (res.status === 401) {
        router.push("/login?callbackUrl=/soporte");
        return;
      }

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Error al enviar el ticket");
      }

      setSuccess(true);
      setSubject("");
      setMessage("");
    } catch (err: any) {
      setError(err.message || "Ocurrió un problema. Intenta más tarde.");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <main className="flex-1 flex flex-col items-center justify-center p-4 min-h-[70vh] max-w-xl mx-auto text-center">
        <CheckCircle className="w-20 h-20 text-green-500 mb-6 animate-pulse" />
        <h1 className="text-3xl font-black text-white mb-3">¡Ticket Recibido!</h1>
        <p className="text-gray-400 mb-8 text-lg">
          Tu solicitud de asistencia técnica ha sido registrada bajo el estado &quot;ABIERTO&quot;. Nuestro equipo de soporte revisará el caso a la brevedad.
        </p>
        <div className="flex gap-4">
          <Link href="/dashboard" className="bg-[#2a2a2a] hover:bg-[#3a3a3a] px-6 py-3 rounded-xl font-bold text-white transition-colors">
            Ir al Dashboard
          </Link>
          <button onClick={() => setSuccess(false)} className="bg-[#FF6600] hover:bg-[#e55c00] px-6 py-3 rounded-xl font-bold text-white transition-colors">
            Crear otro ticket
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="flex-1 w-full max-w-3xl mx-auto px-4 py-12">
      {/* Encabezado */}
      <div className="flex items-center gap-4 mb-8 border-b border-[#2a2a2a] pb-6">
        <LifeBuoy className="w-10 h-10 text-[#FF6600]" />
        <div>
          <h1 className="text-3xl font-black text-white tracking-tight uppercase">Soporte Técnico</h1>
          <p className="text-gray-400 text-sm mt-1">¿Tienes problemas con tus claves o tu cuenta? Abre un ticket de asistencia.</p>
        </div>
      </div>

      {/* Formulario */}
      <div className="bg-[#1e1e1e] border border-[#2a2a2a] rounded-2xl p-6 md:p-8 shadow-xl">
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 flex items-center gap-3 text-red-400">
              <AlertCircle className="w-5 h-5 shrink-0" />
              <p className="text-sm font-medium">{error}</p>
            </div>
          )}

          <div>
            <label htmlFor="subject" className="block text-sm font-bold text-gray-300 uppercase tracking-wider mb-2">
              Asunto / Motivo
            </label>
            <input
              id="subject"
              type="text"
              required
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="Ej: Problema al revelar clave de GTA V, Error en recarga..."
              className="w-full bg-[#121212] border border-[#333] rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-[#FF6600] transition-colors"
            />
          </div>

          <div>
            <label htmlFor="message" className="block text-sm font-bold text-gray-300 uppercase tracking-wider mb-2">
              Descripción del Problema
            </label>
            <textarea
              id="message"
              required
              rows={6}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Detalla lo más posible tu situación para ayudarte rápidamente..."
              className="w-full bg-[#121212] border border-[#333] rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-[#FF6600] transition-colors resize-none"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#FF6600] hover:bg-[#e55c00] disabled:bg-[#FF6600]/50 text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 transition-colors uppercase tracking-wider"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Registrando Ticket...</span>
              </>
            ) : (
              <>
                <Send className="w-5 h-5" />
                <span>Enviar Solicitud</span>
              </>
            )}
          </button>
        </form>
      </div>
    </main>
  );
}