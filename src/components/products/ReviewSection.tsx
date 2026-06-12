"use client";

import { useState } from "react";
import { Star, MessageSquare, CheckCircle2 } from "lucide-react";
import { useRouter } from "next/navigation";

export default function ReviewSection({ productId, reviews, canReview }: { productId: string, reviews: any[], canReview: boolean }) {
  const router = useRouter();
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");

    const res = await fetch("/api/reviews", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ productId, rating, comment }),
    });

    if (res.ok) {
      setComment("");
      setRating(5);
      router.refresh(); // Refrescamos la página para que la reseña aparezca mágicamente
    } else {
      const data = await res.json();
      setError(data.error || "Hubo un error al enviar tu reseña");
    }
    setSubmitting(false);
  };

  return (
    <div className="bg-[#1e1e1e] border border-[#2a2a2a] rounded-xl p-6 md:p-8 mt-8">
      <div className="flex items-center gap-2 mb-6 border-b border-[#2a2a2a] pb-2">
        <MessageSquare className="text-[#FF6600]" />
        <h2 className="text-2xl font-bold text-white">Reseñas de la Comunidad</h2>
      </div>

      {/* Formulario (Oculto si el usuario no ha comprado el juego) */}
      {canReview && (
        <form onSubmit={handleSubmit} className="mb-10 bg-[#121212] p-5 rounded-lg border border-[#2a2a2a]">
          <h3 className="font-bold text-white mb-3">¿Qué te pareció el juego?</h3>
          {error && <p className="text-red-500 text-sm mb-3 font-bold">{error}</p>}
          
          <div className="flex gap-2 mb-4">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star 
                key={star} 
                className={`w-8 h-8 cursor-pointer transition-colors ${star <= rating ? "text-yellow-500 fill-current" : "text-gray-600 hover:text-yellow-500/50"}`}
                onClick={() => setRating(star)}
              />
            ))}
          </div>

          <textarea 
            rows={3} 
            value={comment} 
            onChange={(e) => setComment(e.target.value)}
            placeholder="Escribe tu opinión aquí (Opcional)..."
            className="w-full bg-[#1e1e1e] border border-[#2a2a2a] rounded p-3 text-white focus:border-[#FF6600] focus:outline-none mb-3"
          />
          <button 
            type="submit" disabled={submitting}
            className="bg-[#FF6600] hover:bg-[#e55c00] text-white font-bold py-2 px-6 rounded transition-colors disabled:opacity-50"
          >
            {submitting ? "Publicando..." : "Publicar Reseña"}
          </button>
        </form>
      )}

      {/* Lista de Comentarios */}
      <div className="space-y-4">
        {reviews.length === 0 ? (
          <p className="text-gray-500 italic">Aún no hay reseñas para este título. ¡Sé el primero en opinar!</p>
        ) : (
          reviews.map((rev) => (
            <div key={rev.id} className="bg-[#121212] p-4 rounded-lg border border-[#2a2a2a]">
              <div className="flex justify-between items-start mb-2">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-[#2a2a2a] rounded-full flex items-center justify-center text-gray-400 font-bold uppercase">
                    {rev.user?.name?.charAt(0) || rev.user?.email.charAt(0)}
                  </div>
                  <div>
                    <span className="text-white font-bold block leading-tight">{rev.user?.name || rev.user?.email.split("@")[0]}</span>
                    <span className="text-xs text-green-500 flex items-center gap-1"><CheckCircle2 className="w-3 h-3"/> Comprador verificado</span>
                  </div>
                </div>
                <div className="flex text-yellow-500">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className={`w-4 h-4 ${i < rev.rating ? "fill-current" : "text-gray-600"}`} />
                  ))}
                </div>
              </div>
              {rev.comment && <p className="text-gray-300 text-sm mt-2">{rev.comment}</p>}
            </div>
          ))
        )}
      </div>
    </div>
  );
}