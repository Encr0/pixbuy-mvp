"use client";

import { useState, useEffect } from "react";
import { KeyRound, Save, AlertCircle, Loader2 } from "lucide-react";

export default function StockAdminPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState("");
  
  const [formData, setFormData] = useState({ productId: "", keys: "" });

  // Cargar el inventario al entrar a la página
  const fetchProducts = async () => {
    const res = await fetch("/api/admin/stock");
    const data = await res.json();
    setProducts(data);
    setLoading(false);
  };

  useEffect(() => { fetchProducts(); }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSuccess("");

    const res = await fetch("/api/admin/stock", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });

    if (res.ok) {
      const data = await res.json();
      setSuccess(`¡Has inyectado ${data.count} nuevas claves exitosamente!`);
      setFormData({ ...formData, keys: "" }); // Limpiamos la caja de texto
      fetchProducts(); // Actualizamos los contadores
    }
    setSaving(false);
  };

  return (
    <main className="flex-1 w-full max-w-4xl mx-auto px-4 py-12">
      <div className="flex items-center gap-3 mb-8 border-b border-[#2a2a2a] pb-6">
        <KeyRound className="w-10 h-10 text-[#FF6600]" />
        <div>
          <h1 className="text-3xl font-black text-white">Gestor de Stock</h1>
          <p className="text-gray-400">Inyecta códigos de activación reales para tus juegos</p>
        </div>
      </div>

      {success && (
        <div className="bg-green-500/10 border border-green-500 text-green-400 p-4 rounded-xl mb-6 font-bold">
          {success}
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-[#1e1e1e] border border-[#2a2a2a] rounded-xl p-6 md:p-8 space-y-6">
        
        {/* Selector de Juego con Contador de Stock */}
        <div>
          <label className="block text-sm font-bold text-gray-400 mb-2">Seleccionar Juego *</label>
          {loading ? (
            <div className="text-gray-500 flex items-center gap-2"><Loader2 className="animate-spin w-4 h-4"/> Cargando catálogo...</div>
          ) : (
            <select 
              required
              value={formData.productId} 
              onChange={(e) => setFormData({ ...formData, productId: e.target.value })}
              className="w-full bg-[#121212] border border-[#2a2a2a] rounded-lg p-3 text-white focus:border-[#FF6600] focus:outline-none"
            >
              <option value="">-- Elige un título --</option>
              {products.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.title} (Stock actual: {p._count.keys} claves)
                </option>
              ))}
            </select>
          )}
        </div>

        {/* Caja para pegar claves */}
        <div>
          <label className="block text-sm font-bold text-gray-400 mb-2 flex items-center justify-between">
            <span>Lista de Claves (CD Keys) *</span>
            <span className="text-xs text-gray-500 font-normal">Una clave por línea</span>
          </label>
          <textarea 
            required rows={10} value={formData.keys} 
            onChange={(e) => setFormData({ ...formData, keys: e.target.value })}
            className="w-full bg-[#121212] border border-[#2a2a2a] rounded-lg p-3 text-white focus:border-[#FF6600] font-mono focus:outline-none"
            placeholder="XXXX-YYYY-ZZZZ&#10;AAAA-BBBB-CCCC&#10;1234-5678-9012"
          ></textarea>
        </div>

        <button 
          type="submit" disabled={saving || !formData.productId}
          className="w-full flex items-center justify-center gap-2 bg-[#FF6600] hover:bg-[#e55c00] text-white font-bold py-3 px-8 rounded-lg transition-colors disabled:opacity-50"
        >
          {saving ? "Guardando..." : <><Save className="w-5 h-5" /> Inyectar Claves a la Bóveda</>}
        </button>
      </form>
    </main>
  );
}