"use client";
import Link from 'next/link';
import { Search, ShoppingCart, Heart, User, Globe } from 'lucide-react';
import { useState } from 'react';

export default function Navbar() {
  const [currency, setCurrency] = useState<'CLP' | 'USD'>('CLP');

  return (
    <nav className="sticky top-0 z-50 w-full bg-pixdark-light border-b border-pixdark-lighter">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <span className="text-2xl font-black text-white tracking-tighter">
              PIX<span className="text-pixorange">BUY</span>
            </span>
          </Link>

          {/* Buscador central (Oculto en móvil, visible en md+) */}
          <div className="hidden md:flex flex-1 max-w-xl mx-8">
            <div className="relative w-full">
              <input 
                type="text" 
                placeholder="Buscar juegos, tarjetas de regalo..." 
                className="w-full bg-pixdark border border-pixdark-lighter rounded-full py-2 pl-4 pr-10 text-sm focus:outline-none focus:border-pixorange transition-colors"
              />
              <Search className="absolute right-3 top-2.5 text-gray-400 w-4 h-4" />
            </div>
          </div>

          {/* Acciones de usuario */}
          <div className="flex items-center space-x-4 md:space-x-6">
            
            {/* Selector de Moneda */}
            <div className="hidden sm:flex items-center gap-1 cursor-pointer hover:text-pixorange transition-colors" onClick={() => setCurrency(currency === 'CLP' ? 'USD' : 'CLP')}>
              <Globe className="w-4 h-4" />
              <span className="text-sm font-medium">{currency}</span>
            </div>

            <button className="text-gray-300 hover:text-pixorange transition-colors">
              <Heart className="w-5 h-5" />
            </button>
            
            <Link href="/cart" className="relative text-gray-300 hover:text-pixorange transition-colors">
              <ShoppingCart className="w-5 h-5" />
              <span className="absolute -top-2 -right-2 bg-pixorange text-white text-xs font-bold px-1.5 py-0.5 rounded-full">
                2
              </span>
            </Link>

            <Link href="/dashboard" className="flex items-center gap-2 bg-pixdark border border-pixdark-lighter hover:border-pixorange rounded-full py-1.5 px-3 transition-colors">
              <User className="w-4 h-4 text-pixorange" />
              <span className="text-sm hidden sm:block">Mi Cuenta</span>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}