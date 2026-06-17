"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ShoppingCart, Heart, User, Search, Gamepad2, CreditCard } from "lucide-react";
import { useStore } from "@/context/StoreProvider";

export default function Navbar() {
  const { cart, wishlist } = useStore();
  
  // Estados y Router para el buscador
  const [searchTerm, setSearchTerm] = useState("");
  const router = useRouter();

  // Función que se ejecuta al presionar Enter o el botón de la lupa
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      router.push(`/catalogo?search=${encodeURIComponent(searchTerm.trim())}`);
    } else {
      router.push("/catalogo");
    }
  };

  return (
    <nav className="border-b border-[#2a2a2a] bg-[#121212] sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <div className="bg-[#FF6600] p-1.5 rounded-lg group-hover:rotate-12 transition-transform">
            <Gamepad2 className="w-6 h-6 text-white" />
          </div>
          <span className="text-2xl font-black tracking-tight text-white">PIXBUY</span>
        </Link>
        <Link 
    href="/catalogo" 
    className="flex items-center gap-2 text-gray-300 hover:text-[#FF6600] transition-colors font-bold text-sm uppercase tracking-wider"
  >
    <Gamepad2 className="w-5 h-5" />
    <span>Catálogo</span>
  </Link>

  {/* Botón Gift Cards */}
  <Link 
    href="/giftcards" 
    className="flex items-center gap-2 text-gray-300 hover:text-blue-400 transition-colors font-bold text-sm uppercase tracking-wider"
  >
    <CreditCard className="w-5 h-5" />
    <span>Gift Cards</span>
  </Link>

        {/* Buscador (Desktop) - Ahora es un formulario funcional */}
        <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-md mx-8 relative">
          <input 
            type="text" 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar juegos..." 
            className="w-full bg-[#1e1e1e] border border-[#2a2a2a] rounded-full py-2 px-4 pl-10 text-sm text-white focus:outline-none focus:border-[#FF6600] transition-colors"
          />
          <button type="submit" className="absolute left-3 top-2.5 text-gray-500 hover:text-[#FF6600] transition-colors">
            <Search className="w-4 h-4" />
          </button>
        </form>

        {/* Íconos interactivos */}
        <div className="flex items-center gap-6">
          {/* Wishlist */}
          <Link href="/wishlist" className="relative text-gray-400 hover:text-white transition-colors">
            <Heart className="w-6 h-6" />
            {wishlist.length > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center animate-pulse">
                {wishlist.length}
              </span>
            )}
          </Link>

          {/* Carrito */}
          <Link href="/cart" className="relative text-gray-400 hover:text-[#FF6600] transition-colors">
            <ShoppingCart className="w-6 h-6" />
            {cart.length > 0 && (
              <span className="absolute -top-2 -right-2 bg-[#FF6600] text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center">
                {cart.length}
              </span>
            )}
          </Link>

          {/* Botón Mi Cuenta */}
          <Link href="/dashboard" className="text-gray-400 hover:text-white transition-colors flex flex-col items-center">
            <User className="w-6 h-6" />
            <span className="text-[10px] hidden md:block mt-1">Mi Cuenta</span>
          </Link>
        </div>
        
      </div>
    </nav>
  );
}