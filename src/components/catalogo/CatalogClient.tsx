"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Search, ShoppingCart, Filter, Gamepad2 } from "lucide-react";
import { useSearchParams } from "next/navigation";

export default function CatalogClient({ products, categories }: { products: any[], categories: any[] }) {

  const searchParams = useSearchParams();
  const searchQuery = searchParams.get("search") || "";
  
  // 1. Inicializamos el buscador interno con lo que venga de la URL
  const [searchTerm, setSearchTerm] = useState(searchQuery);
  const [selectedPlatform, setSelectedPlatform] = useState("Todas");
  const [selectedCategory, setSelectedCategory] = useState("Todas");

  // 2. MAGIA: Si el usuario busca desde el Navbar mientras YA está en el catálogo, 
  // esto actualiza la caja de búsqueda interna automáticamente.
  useEffect(() => {
    setSearchTerm(searchQuery);
  }, [searchQuery]);

  const platforms = ["Todas", "Steam", "Epic Games", "PSN", "Xbox", "Nintendo"];

  // Motor de filtrado en tiempo real
  const filteredProducts = products.filter((product) => {
    // Busca coincidencias en el título o en la descripción
    const matchesSearch = product.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          (product.description && product.description.toLowerCase().includes(searchTerm.toLowerCase()));
                          
    const matchesPlatform = selectedPlatform === "Todas" || product.platforms.includes(selectedPlatform);
    const matchesCategory = selectedCategory === "Todas" || product.categories.some((c: any) => c.name === selectedCategory);
    
    return matchesSearch && matchesPlatform && matchesCategory;
  });

  return (
    <div className="flex flex-col md:flex-row gap-8">
      
      {/* BARRA LATERAL DE FILTROS */}
      <aside className="w-full md:w-64 space-y-8 flex-shrink-0">
        
        {/* Buscador de texto */}
        <div className="relative">
          <input 
            type="text" 
            placeholder="Buscar juego..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-[#1e1e1e] border border-[#2a2a2a] rounded-lg py-3 px-4 pl-10 text-white focus:outline-none focus:border-[#FF6600] transition-colors"
          />
          <Search className="absolute left-3 top-3.5 text-gray-500 w-5 h-5" />
        </div>

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
                  type="radio" 
                  name="platform" 
                  checked={selectedPlatform === platform}
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
                type="radio" name="category" 
                checked={selectedCategory === "Todas"}
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
                  type="radio" name="category" 
                  checked={selectedCategory === category.name}
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

      {/* CUADRÍCULA DE RESULTADOS */}
      <div className="flex-1">
        
        {/* Aviso de Búsqueda Activa */}
        {searchQuery && (
          <div className="mb-6 bg-pixorange/10 border border-[#FF6600] rounded-lg p-4 flex justify-between items-center">
            <span className="text-gray-300">
              Resultados para: <strong className="text-white text-lg ml-1">&quot;{searchQuery}&quot;</strong>
            </span>
          </div>
        )}

        <div className="mb-6 flex justify-between items-end">
          <h2 className="text-2xl font-black text-white">
            Explorar Catálogo
          </h2>
          <span className="text-gray-400 text-sm">
            {filteredProducts.length} {filteredProducts.length === 1 ? 'resultado' : 'resultados'}
          </span>
        </div>

        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
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
                    <div className="flex gap-1 mb-4">
                      {product.categories.slice(0, 2).map((cat: any) => (
                        <span key={cat.id} className="text-[10px] uppercase font-bold text-gray-500 border border-[#2a2a2a] px-2 py-0.5 rounded">
                          {cat.name}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="flex items-end justify-between mt-auto">
                    <div>
                      <span className="font-black text-white text-xl">${product.priceCLP.toLocaleString('es-CL')}</span>
                    </div>
                    <Link href={`/product/${product.id}`} className="bg-[#2a2a2a] hover:bg-[#FF6600] p-3 rounded-lg transition-colors text-white">
                      <ShoppingCart className="w-5 h-5" />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-[#1e1e1e] rounded-xl border border-[#2a2a2a]">
            <Search className="w-16 h-16 text-[#2a2a2a] mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-400">No se encontraron juegos</h3>
            <p className="text-gray-500 mt-2">Intenta cambiar los filtros o tu término de búsqueda.</p>
            <button 
              onClick={() => { setSearchTerm(""); setSelectedPlatform("Todas"); setSelectedCategory("Todas"); }}
              className="mt-6 text-[#FF6600] hover:underline font-bold"
            >
              Limpiar filtros
            </button>
          </div>
        )}
      </div>

    </div>
  );
}