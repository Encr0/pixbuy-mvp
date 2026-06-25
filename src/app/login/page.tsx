"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link"; // Importación corregida de Next.js

export default function LoginPage() {
  const router = useRouter();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (isLogin) {
      // Iniciar sesión con NextAuth
      const res = await signIn("credentials", {
        redirect: false,
        email,
        password,
      });

      if (res?.error) {
        setError("Credenciales incorrectas. Intenta de nuevo.");
      } else {
        router.push("/dashboard");
        router.refresh(); // Actualiza el Navbar
      }
    } else {
      // Registrar nuevo usuario
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, name }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error);
      } else {
        // Si se registra bien, lo logueamos automáticamente
        await signIn("credentials", { redirect: false, email, password });
        router.push("/dashboard");
        router.refresh();
      }
    }
    setLoading(false);
  };

  return (
    <main className="flex-1 flex items-center justify-center p-4">
      <div className="bg-[#1e1e1e] p-8 rounded-xl border border-[#2a2a2a] w-full max-w-md shadow-2xl">
        <h1 className="text-3xl font-black mb-6 text-center text-white">
          {isLogin ? "Bienvenido a Pixbuy" : "Crea tu Arsenal"}
        </h1>
        
        {error && (
          <div className="bg-red-500/20 border border-red-500 text-red-400 p-3 rounded mb-4 text-sm text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {!isLogin && (
            <div>
              <label className="block text-sm text-gray-400 mb-1">Nombre (Opcional)</label>
              <input 
                type="text" value={name} onChange={(e) => setName(e.target.value)}
                className="w-full bg-[#121212] border border-[#2a2a2a] rounded px-4 py-2 text-white focus:outline-none focus:border-[#FF6600]"
                placeholder="Ej. MasterChief99"
              />
            </div>
          )}
          <div>
            <label className="block text-sm text-gray-400 mb-1">Correo Electrónico</label>
            <input 
              type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-[#121212] border border-[#2a2a2a] rounded px-4 py-2 text-white focus:outline-none focus:border-[#FF6600]"
              placeholder="tu@correo.com"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-1">Contraseña</label>
            <input 
              type="password" required value={password} onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-[#121212] border border-[#2a2a2a] rounded px-4 py-2 text-white focus:outline-none focus:border-[#FF6600]"
              placeholder="••••••••"
            />
          </div>
          
          {/* Mostramos el enlace SOLO si estamos en la vista de Iniciar Sesión */}
          {isLogin && (
            <div className="text-right mt-1">
              <Link href="/recuperar-password" className="text-sm text-gray-400 hover:text-[#FF6600] transition-colors">
                ¿Olvidaste tu contraseña?
              </Link>
            </div>
          )}
          
          <button 
            type="submit" disabled={loading}
            className="w-full bg-[#FF6600] hover:bg-[#e55c00] text-white font-bold py-3 rounded transition-colors mt-2 disabled:opacity-50"
          >
            {loading ? "Cargando..." : isLogin ? "Entrar a la Bóveda" : "Crear Cuenta"}
          </button>
        </form>

        <p className="text-center text-gray-400 mt-6 text-sm">
          {isLogin ? "¿No tienes cuenta? " : "¿Ya eres miembro? "}
          <button 
            onClick={() => setIsLogin(!isLogin)} 
            className="text-[#FF6600] font-bold hover:underline"
            type="button"
          >
            {isLogin ? "Regístrate aquí" : "Inicia sesión"}
          </button>
        </p>
      </div>
    </main>
  );
}