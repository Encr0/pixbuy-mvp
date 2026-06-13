"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Search, ShoppingCart, Filter, Gamepad2, ChevronLeft, ChevronRight } from "lucide-react";
import { useSearchParams, useRouter } from "next/navigation";

export default function CatalogClient({ 
  products, 
  categories,
  currentPage,
  totalPages
}: { 
  products: any[], 
  categories: any[],
  currentPage: number,
  totalPages: number
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const searchQuery = searchParams.get("search") || "";
  
  const [searchTerm, setSearchTerm] = useState(searchQuery);
  const [selectedPlatform, setSelectedPlatform] = useState("Todas");
  const [selectedCategory, setSelectedCategory] = useState("Todas");

  useEffect(() => {
    setSearchTerm(searchQuery);
  }, [searchQuery]);

  // Navegación de Paginación: Cambia la URL y el servidor hace el resto
  const changePage = (newPage: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", newPage.toString());
    router.push(`/catalogo?${params.toString()}`);
  };

  // Buscador interno: Al buscar algo nuevo, volvemos a la página 1
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (searchTerm.trim()) params.set("search", searchTerm.trim());
    params.set("page", "1");
    router.push(`/catalogo?${params.toString()}`);
  };

  const platforms = ["Todas", "Steam", "Epic Games", "PSN", "Xbox", "Nintendo"];

  // Filtros locales
  const filteredProducts = products.filter((product) => {
    const matchesPlatform = selectedPlatform === "Todas" || product.platforms.includes(selectedPlatform);
    const matchesCategory = selectedCategory === "Todas" || product.categories.some((c: any) => c.name === selectedCategory);
    return matchesPlatform && matchesCategory;
  });

  return (
    <div className="flex flex-col md:flex-row gap-8">
      
      {/* BARRA LATERAL */}
      <aside className="w-full md:w-64 space-y-8 flex-shrink-0">
        <form onSubmit={handleSearchSubmit} className="relative">
          <input 
            type="text" 
            placeholder="Buscar juego..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-[#1e1e1e] border border-[#2a2a2a] rounded-lg py-3 px-4 pl-10 text-white focus:outline-none focus:border-[#FF6600] transition-colors"
          />
          <button type="submit" className="absolute left-3 top-3.5 text-gray-500 hover:text-[#FF6600]">
            <Search className="w-5 h-5" />
          </button>
        </form>

        {/* Filtro de Plataformas */}
        <div className="bg-[#1e1e1e] border border-[#2a2a2a] rounded-xl p-5">
          <div className="flex items-center gap-2 mb-4 border-b border-[#2a2a2a] pb-2">
            <Gamepad2 className="text-[#FF6600] w-5 h-5" />
            <h3 className="font-bold text-white">Plataforma</h3>
          </div>
          <div className="space-y-2">
            {platforms.map((platform) => (
              <label key={platform} className="flex items-center gap-3 cursor-pointer group">
                <input 
                  type="radio" name="platform" checked={selectedPlatform === platform}
                  onChange={() => setSelectedPlatform(platform)}
                  className="accent-[#FF6600] w-4 h-4 cursor-pointer" 
                />
                <span className={`text-sm transition-colors ${selectedPlatform === platform ? "text-white font-bold" : "text-gray-400 group-hover:text-white"}`}>
                  {platform}
                </span>
              </label>
            ))}
          </div>
        </div>

        {/* Filtro de Categorías */}
        <div className="bg-[#1e1e1e] border border-[#2a2a2a] rounded-xl p-5">
          <div className="flex items-center gap-2 mb-4 border-b border-[#2a2a2a] pb-2">
            <Filter className="text-[#FF6600] w-5 h-5" />
            <h3 className="font-bold text-white">Género</h3>
          </div>
          <div className="space-y-2">
            <label className="flex items-center gap-3 cursor-pointer group">
              <input 
                type="radio" name="category" checked={selectedCategory === "Todas"}
                onChange={() => setSelectedCategory("Todas")}
                className="accent-[#FF6600] w-4 h-4 cursor-pointer" 
              />
              <span className={`text-sm transition-colors ${selectedCategory === "Todas" ? "text-white font-bold" : "text-gray-400 group-hover:text-white"}`}>
                Todos los géneros
              </span>
            </label>
            {categories.map((category) => (
              <label key={category.id} className="flex items-center gap-3 cursor-pointer group">
                <input 
                  type="radio" name="category" checked={selectedCategory === category.name}
                  onChange={() => setSelectedCategory(category.name)}
                  className="accent-[#FF6600] w-4 h-4 cursor-pointer" 
                />
                <span className={`text-sm transition-colors ${selectedCategory === category.name ? "text-white font-bold" : "text-gray-400 group-hover:text-white"}`}>
                  {category.name}
                </span>
              </label>
            ))}
          </div>
        </div>
      </aside>

      {/* RESULTADOS */}
      <div className="flex-1">
        {searchQuery && (
          <div className="mb-6 bg-pixorange/10 border border-[#FF6600] rounded-lg p-4 flex justify-between items-center">
            <span className="text-gray-300">
              Resultados para: <strong className="text-white text-lg ml-1">&quot;{searchQuery}&quot;</strong>
            </span>
          </div>
        )}

        {filteredProducts.length > 0 ? (
          <>
            {/* GRID DE JUEGOS */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
              {filteredProducts.map((product) => (
                <div key={product.id} className="bg-[#1e1e1e] border border-[#2a2a2a] rounded-xl overflow-hidden hover:border-[#FF6600] transition-all group flex flex-col">
                  <Link href={`/product/${product.id}`} className="aspect-[3/4] relative overflow-hidden block">
                    <img src={product.coverImage} alt={product.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    <div className="absolute top-2 left-2 bg-black/70 backdrop-blur text-white text-xs font-bold px-2 py-1 rounded border border-[#2a2a2a]">
                      {product.platforms[0]}
                    </div>
                  </Link>
                  <div className="p-5 flex flex-col flex-1 justify-between">
                    <div>
                      <Link href={`/product/${product.id}`}>
                        <h3 className="font-bold text-white text-lg line-clamp-1 hover:text-[#FF6600] transition-colors mb-1">{product.title}</h3>
                      </Link>
                    </div>
                    <div className="flex items-end justify-between mt-4">
                      <span className="font-black text-white text-xl">${product.priceCLP.toLocaleString('es-CL')}</span>
                      <Link href={`/product/${product.id}`} className="bg-[#2a2a2a] hover:bg-[#FF6600] p-3 rounded-lg transition-colors text-white">
                        <ShoppingCart className="w-5 h-5" />
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* CONTROLES DE PAGINACIÓN */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-4 mt-12 border-t border-[#2a2a2a] pt-8">
                <button 
                  onClick={() => changePage(currentPage - 1)}
                  disabled={currentPage <= 1}
                  className="flex items-center gap-2 px-4 py-2 bg-[#1e1e1e] border border-[#2a2a2a] rounded-lg text-white hover:bg-[#2a2a2a] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronLeft className="w-4 h-4" /> Anterior
                </button>
                
                <span className="text-gray-400 font-bold">
                  Página <span className="text-white">{currentPage}</span> de {totalPages}
                </span>

                <button 
                  onClick={() => changePage(currentPage + 1)}
                  disabled={currentPage >= totalPages}
                  className="flex items-center gap-2 px-4 py-2 bg-[#1e1e1e] border border-[#2a2a2a] rounded-lg text-white hover:bg-[#2a2a2a] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Siguiente <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-20 bg-[#1e1e1e] rounded-xl border border-[#2a2a2a]">
            <Search className="w-16 h-16 text-[#2a2a2a] mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-400">No se encontraron juegos</h3>
          </div>
        )}
      </div>
    </div>
  );
}