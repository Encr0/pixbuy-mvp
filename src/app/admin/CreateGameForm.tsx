"use client";

import { useState } from "react";
import { Gamepad2, Save, Image as ImageIcon, AlertCircle } from "lucide-react";
import { useRouter } from "next/navigation";

export default function AdminDashboard() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  // Estado del formulario
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    coverImage: "",
    priceCLP: "",
    platforms: "",
    publisher: "",
    categoryName: ""
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess(false);

    try {
      const res = await fetch("/api/admin/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!res.ok) throw new Error("Fallo al guardar el juego");

      setSuccess(true);
      // Limpiamos el formulario para el siguiente juego
      setFormData({
        title: "", description: "", coverImage: "", priceCLP: "", platforms: "", publisher: "", categoryName: ""
      });
      
      // Refrescamos la ruta para que la base de datos se actualice
      router.refresh(); 

    } catch (err) {
      setError("Hubo un problema al guardar el juego en la base de datos.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex-1 w-full max-w-4xl mx-auto px-4 py-12">
      <div className="flex items-center gap-3 mb-8 border-b border-[#2a2a2a] pb-6">
        <Gamepad2 className="w-10 h-10 text-[#FF6600]" />
        <div>
          <h1 className="text-3xl font-black text-white">Panel de Control</h1>
          <p className="text-gray-400">Añade nuevos títulos al arsenal de Pixbuy</p>
        </div>
      </div>

      {success && (
        <div className="bg-green-500/10 border border-green-500 text-green-400 p-4 rounded-xl mb-6 font-bold flex items-center justify-center">
          ¡Juego publicado con éxito en tu tienda!
        </div>
      )}

      {error && (
        <div className="bg-red-500/10 border border-red-500 text-red-400 p-4 rounded-xl mb-6 font-bold flex items-center gap-2">
          <AlertCircle /> {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-[#1e1e1e] border border-[#2a2a2a] rounded-xl p-6 md:p-8 space-y-6 shadow-xl">
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Título */}
          <div>
            <label className="block text-sm font-bold text-gray-400 mb-2">Título del Juego *</label>
            <input 
              required type="text" name="title" value={formData.title} onChange={handleChange}
              className="w-full bg-[#121212] border border-[#2a2a2a] rounded-lg p-3 text-white focus:border-[#FF6600] focus:outline-none transition-colors"
              placeholder="Ej. Elden Ring"
            />
          </div>

          {/* Precio */}
          <div>
            <label className="block text-sm font-bold text-gray-400 mb-2">Precio (CLP) *</label>
            <input 
              required type="number" name="priceCLP" value={formData.priceCLP} onChange={handleChange}
              className="w-full bg-[#121212] border border-[#2a2a2a] rounded-lg p-3 text-white focus:border-[#FF6600] focus:outline-none transition-colors"
              placeholder="Ej. 35000"
            />
          </div>

          {/* Categoría */}
          <div>
            <label className="block text-sm font-bold text-gray-400 mb-2">Categoría Principal *</label>
            <input 
              required type="text" name="categoryName" value={formData.categoryName} onChange={handleChange}
              className="w-full bg-[#121212] border border-[#2a2a2a] rounded-lg p-3 text-white focus:border-[#FF6600] focus:outline-none transition-colors"
              placeholder="Ej. RPG, Acción, Deportes..."
            />
          </div>

          {/* Publisher */}
          <div>
            <label className="block text-sm font-bold text-gray-400 mb-2">Desarrollador / Publisher</label>
            <input 
              type="text" name="publisher" value={formData.publisher} onChange={handleChange}
              className="w-full bg-[#121212] border border-[#2a2a2a] rounded-lg p-3 text-white focus:border-[#FF6600] focus:outline-none transition-colors"
              placeholder="Ej. FromSoftware"
            />
          </div>

          {/* Plataformas */}
          <div className="md:col-span-2">
            <label className="block text-sm font-bold text-gray-400 mb-2">Plataformas * <span className="font-normal text-gray-500">(Separadas por coma)</span></label>
            <input 
              required type="text" name="platforms" value={formData.platforms} onChange={handleChange}
              className="w-full bg-[#121212] border border-[#2a2a2a] rounded-lg p-3 text-white focus:border-[#FF6600] focus:outline-none transition-colors"
              placeholder="Ej. Steam, Epic Games, PS5"
            />
          </div>

          {/* Portada */}
          <div className="md:col-span-2">
            <label className="block text-sm font-bold text-gray-400 mb-2 flex items-center gap-2">
              <ImageIcon className="w-4 h-4" /> URL de la Portada (Imagen) *
            </label>
            <input 
              required type="url" name="coverImage" value={formData.coverImage} onChange={handleChange}
              className="w-full bg-[#121212] border border-[#2a2a2a] rounded-lg p-3 text-white focus:border-[#FF6600] focus:outline-none transition-colors"
              placeholder="https://ejemplo.com/imagen.jpg"
            />
            {formData.coverImage && (
               <div className="mt-3 text-xs text-green-500">Vista previa de imagen cargada.</div>
            )}
          </div>

          {/* Descripción */}
          <div className="md:col-span-2">
            <label className="block text-sm font-bold text-gray-400 mb-2">Descripción del Juego *</label>
            <textarea 
              required name="description" value={formData.description} onChange={handleChange} rows={5}
              className="w-full bg-[#121212] border border-[#2a2a2a] rounded-lg p-3 text-white focus:border-[#FF6600] focus:outline-none transition-colors"
              placeholder="Escribe la sinopsis del juego aquí..."
            ></textarea>
          </div>
        </div>

        {/* Botón de Guardar */}
        <div className="pt-4 border-t border-[#2a2a2a]">
          <button 
            type="submit" disabled={loading}
            className="w-full md:w-auto flex items-center justify-center gap-2 bg-[#FF6600] hover:bg-[#e55c00] text-white font-bold py-3 px-8 rounded-lg transition-colors disabled:opacity-50"
          >
            {loading ? "Publicando..." : <><Save className="w-5 h-5" /> Publicar Juego en la Tienda</>}
          </button>
        </div>

      </form>
    </main>
  );
}