export const dynamic = "force-dynamic";

import prisma from "@/lib/prisma";
import CatalogClient from "@/components/catalogo/CatalogClient";

export default async function CatalogoPage({
  searchParams,
}: {
  searchParams: { search?: string; page?: string };
}) {
  // 1. Matemáticas de Paginación
  const currentPage = Number(searchParams.page) || 1;
  const itemsPerPage = 6; // Mostrará 6 juegos por página (cámbialo a 12 o 24 en el futuro)
  const skip = (currentPage - 1) * itemsPerPage;
  const searchQuery = searchParams.search || "";

  // 2. Le decimos a Prisma qué estamos buscando exactamente (Filtro de Servidor)
  const whereClause: any = {
    isActive: true,
  };

  if (searchQuery) {
    whereClause.OR = [
      { title: { contains: searchQuery, mode: "insensitive" } },
      { description: { contains: searchQuery, mode: "insensitive" } },
    ];
  }

  // 3. Prisma trae SOLO el bloque de juegos que necesitamos
  const products = await prisma.product.findMany({
    where: whereClause,
    include: { categories: true },
    orderBy: { createdAt: "desc" },
    skip: skip,
    take: itemsPerPage,
  });

  // 4. Prisma cuenta el TOTAL de juegos para saber cuántas páginas dibujar
  const totalProducts = await prisma.product.count({ where: whereClause });
  const totalPages = Math.ceil(totalProducts / itemsPerPage);

  // Categorías para el menú lateral
  const categories = await prisma.category.findMany({ orderBy: { name: "asc" } });

  return (
    <main className="flex-1 w-full max-w-7xl mx-auto px-4 py-12">
      <div className="mb-10 border-b border-[#2a2a2a] pb-6">
        <h1 className="text-4xl md:text-5xl font-black text-white mb-4">Catálogo Completo</h1>
        <p className="text-gray-400 text-lg">
          Encuentra tu próximo juego favorito. Mostrando página {currentPage} de {totalPages || 1}.
        </p>
      </div>

      {/* Le pasamos los nuevos datos matemáticos al cliente */}
      <CatalogClient 
        products={products} 
        categories={categories} 
        currentPage={currentPage}
        totalPages={totalPages}
      />
    </main>
  );
}