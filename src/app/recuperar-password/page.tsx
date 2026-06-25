"use client";

import { useState } from "react";
import { KeyRound, Mail, Loader2, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      // Siempre mostramos éxito por privacidad
      setSuccess(true);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex-1 flex items-center justify-center p-4 min-h-[80vh]">
      <div className="w-full max-w-md bg-[#1e1e1e] border border-[#2a2a2a] rounded-2xl p-8 shadow-2xl relative overflow-hidden">
        {/* Decoración Superior */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#FF6600] to-transparent"></div>

        <div className="text-center mb-8">
          <div className="bg-[#FF6600]/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 border border-[#FF6600]/30">
            <KeyRound className="w-8 h-8 text-[#FF6600]" />
          </div>
          <h1 className="text-2xl font-black text-white">Recuperar Acceso</h1>
          <p className="text-gray-400 text-sm mt-2">Ingresa tu correo electrónico y te enviaremos un enlace para crear una nueva contraseña.</p>
        </div>

        {success ? (
          <div className="bg-green-500/10 border border-green-500/30 p-4 rounded-xl text-center">
            <p className="text-green-400 font-medium mb-4">Si el correo existe en nuestra base de datos, hemos enviado un enlace de recuperación.</p>
            <Link href="/login" className="text-[#FF6600] hover:text-white transition-colors text-sm font-bold">
              Volver al Login
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="tu@correo.com"
                  className="w-full bg-[#121212] border border-[#333] rounded-xl pl-10 pr-4 py-3 text-white focus:outline-none focus:border-[#FF6600] transition-colors"
                />
              </div>
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#FF6600] hover:bg-[#e55c00] disabled:opacity-50 text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2 transition-colors"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Enviar Enlace"}
            </button>
          </form>
        )}

        <div className="mt-6 text-center">
          <Link href="/login" className="text-gray-500 hover:text-white transition-colors text-sm flex items-center justify-center gap-1">
            <ArrowLeft className="w-4 h-4" /> Volver
          </Link>
        </div>
      </div>
    </main>
  );
}