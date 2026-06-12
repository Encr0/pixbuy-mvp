import prisma from "@/lib/prisma";
import Link from "next/link";
import BuyBox from "@/components/products/BuyBox";
import ReviewSection from "@/components/products/ReviewSection";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

export default async function ProductPage({ params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);

  // 1. Buscamos el juego INCLUYENDO las reseñas y quién las escribió
  const product = await prisma.product.findUnique({
    where: { id: params.id },
    include: {
      requirements: true,
      editions: true,
      categories: true,
      _count: { select: { keys: { where: { status: "AVAILABLE" } } } },
      reviews: { 
        include: { user: true },
        orderBy: { createdAt: 'desc' }
      }
    }
  });

  if (!product) return <main>Juego no encontrado</main>;

  // 2. Lógica para saber si el usuario logueado compró el juego
  let canReview = false;
  if (session?.user?.email) {
    const user = await prisma.user.findUnique({ where: { email: session.user.email } });
    if (user) {
      const hasBought = await prisma.orderItem.findFirst({
        where: { productId: product.id, order: { userId: user.id, status: "PAID" } }
      });
      
      // Si lo compró y no ha dejado una reseña todavía, le damos permiso
      const hasReviewed = product.reviews.some((r: any) => r.userId === user.id);
      if (hasBought && !hasReviewed) canReview = true;
    }
  }

  return (
    <main className="flex-1 w-full max-w-7xl mx-auto px-4 py-12">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        
        {/* COLUMNA IZQUIERDA */}
        <div className="lg:col-span-2 space-y-8">
          <div className="rounded-xl overflow-hidden border border-[#2a2a2a] bg-[#1e1e1e] aspect-video relative">
            <img src={product.coverImage} alt={product.title} className="w-full h-full object-cover" />
          </div>

          <div className="bg-[#1e1e1e] border border-[#2a2a2a] rounded-xl p-6 md:p-8">
            <h2 className="text-2xl font-bold text-white mb-4 border-b border-[#2a2a2a] pb-2">Acerca del juego</h2>
            <p className="text-gray-300 leading-relaxed whitespace-pre-line">{product.description}</p>
          </div>

          {/* Renderizamos el nuevo sistema de Reseñas aquí abajo */}
          <ReviewSection productId={product.id} reviews={product.reviews} canReview={canReview} />
        </div>

        {/* COLUMNA DERECHA: Ahora le pasamos el producto con sus reseñas al BuyBox */}
        <div className="space-y-6">
          <BuyBox product={product} />
        </div>

      </div>
    </main>
  );
}