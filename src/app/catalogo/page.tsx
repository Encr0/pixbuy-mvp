import prisma from "@/lib/prisma";
import CatalogClient from "@/components/catalogo/CatalogClient";

export default async function CatalogoPage() {
  // 1. Buscamos TODOS los juegos activos en la base de datos
  const products = await prisma.product.findMany({
    where: { isActive: true },
    include: {
      categories: true, 
    },
    orderBy: { createdAt: 'desc' }
  });

  // 2. Buscamos TODAS las categorías
  const categories = await prisma.category.findMany({
    orderBy: { name: 'asc' }
  });

  return (
    <main className="flex-1 w-full max-w-7xl mx-auto px-4 py-12">
      <div className="mb-10 border-b border-[#2a2a2a] pb-6">
        <h1 className="text-4xl md:text-5xl font-black text-white mb-4">Catálogo Completo</h1>
        <p className="text-gray-400 text-lg">
          Encuentra tu próximo juego favorito utilizando nuestros filtros avanzados.
        </p>
      </div>

      {/* Aquí inyectamos el componente pasándole los datos reales completos */}
      <CatalogClient products={products} categories={categories} />
    </main>
  );
}