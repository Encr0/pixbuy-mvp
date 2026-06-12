"use client";

import Link from "next/link";
import { ShoppingCart, Heart, User, Search, Gamepad2 } from "lucide-react";
import { useStore } from "@/context/StoreProvider";

export default function Navbar() {
  const { cart, wishlist } = useStore();

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

        {/* Buscador (Desktop) */}
        <div className="hidden md:flex flex-1 max-w-md mx-8 relative">
          <input 
            type="text" 
            placeholder="Buscar juegos..." 
            className="w-full bg-[#1e1e1e] border border-[#2a2a2a] rounded-full py-2 px-4 pl-10 text-sm text-white focus:outline-none focus:border-[#FF6600] transition-colors"
          />
          <Search className="absolute left-3 top-2.5 text-gray-500 w-4 h-4" />
        </div>

        {/* Íconos interactivos */}
        <div className="flex items-center gap-6">
          {/* Wishlist */}
          <button className="relative text-gray-400 hover:text-white transition-colors">
            <Heart className="w-6 h-6" />
            {wishlist.length > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center animate-pulse">
                {wishlist.length}
              </span>
            )}
          </button>

          {/* Carrito */}
          <Link href="/cart" className="relative text-gray-400 hover:text-[#FF6600] transition-colors">
            <ShoppingCart className="w-6 h-6" />
            {cart.length > 0 && (
              <span className="absolute -top-2 -right-2 bg-[#FF6600] text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center">
                {cart.length}
              </span>
            )}
          </Link>

          {/* Usuario */}
          <Link href="/login" className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors border-l border-[#2a2a2a] pl-6">
            <User className="w-6 h-6" />
            <span className="hidden md:block text-sm font-bold">Mi Cuenta</span>
          </Link>
        </div>
        
      </div>
    </nav>
  );
}