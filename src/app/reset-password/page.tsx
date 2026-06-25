"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Lock, Loader2, CheckCircle } from "lucide-react";
import Link from "next/link";

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  // Si alguien entra aquí sin venir del enlace del correo, le avisamos.
  if (!token) {
    return (
      <div className="text-center text-red-400">
        Token inválido. <Link href="/recuperar-password" className="text-white underline">Solicita uno nuevo</Link>.
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, newPassword: password }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error);
      }

      setSuccess(true);
      setTimeout(() => router.push("/login"), 3000); // Lo mandamos al login tras 3 segundos
    } catch (err: any) {
      setError(err.message || "Error al restablecer la contraseña");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="text-center">
        <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
        <h2 className="text-xl font-bold text-white mb-2">¡Contraseña Actualizada!</h2>
        <p className="text-gray-400">Redirigiendo al login en unos segundos...</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && <div className="text-red-400 text-sm bg-red-500/10 p-3 rounded-lg">{error}</div>}
      
      <div>
        <label className="block text-sm font-bold text-gray-300 mb-2">Nueva Contraseña</label>
        <div className="relative">
          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
          <input
            type="password"
            required
            minLength={6}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Mínimo 6 caracteres"
            className="w-full bg-[#121212] border border-[#333] rounded-xl pl-10 pr-4 py-3 text-white focus:outline-none focus:border-[#FF6600]"
          />
        </div>
      </div>
      <button
        type="submit"
        disabled={loading}
        className="w-full bg-[#FF6600] hover:bg-[#e55c00] disabled:opacity-50 text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2"
      >
        {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Guardar y Entrar"}
      </button>
    </form>
  );
}

// Envolvemos todo en Suspense porque usamos useSearchParams()
export default function ResetPasswordPage() {
  return (
    <main className="flex-1 flex items-center justify-center p-4 min-h-[80vh]">
      <div className="w-full max-w-md bg-[#1e1e1e] border border-[#2a2a2a] rounded-2xl p-8 shadow-2xl relative">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-black text-white">Crear Nueva Contraseña</h1>
        </div>
        <Suspense fallback={<div className="text-center text-gray-500">Cargando...</div>}>
          <ResetPasswordForm />
        </Suspense>
      </div>
    </main>
  );
}