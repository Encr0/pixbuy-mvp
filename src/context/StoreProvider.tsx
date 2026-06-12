"use client";

import { createContext, useContext, useState, ReactNode } from "react";

export type CartItem = {
  id: string;
  productId: string;
  title: string;
  price: number;
  image: string;
};

interface StoreContextType {
  cart: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (id: string) => void;
  clearCart: () => void;
  wishlist: string[];
  toggleWishlist: (id: string) => void;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export function StoreProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [wishlist, setWishlist] = useState<string[]>([]);

  const addToCart = (item: CartItem) => {
    setCart((prev) => {
      const exists = prev.find((i) => i.id === item.id);
      if (exists) return prev;
      return [...prev, item];
    });
  };

  // NUEVA: Función que filtra el carrito y saca el que no queremos
  const removeFromCart = (id: string) => {
    setCart((prev) => prev.filter((item) => item.id !== id));
  };

  const clearCart = () => setCart([]);


  const toggleWishlist = (id: string) => {
    setWishlist((prev) => 
      prev.includes(id) ? prev.filter((itemId) => itemId !== id) : [...prev, id]
    );
  };

  return (

    <StoreContext.Provider value={{ cart, addToCart, clearCart, removeFromCart, wishlist, toggleWishlist }}>
      {children}
    </StoreContext.Provider>
  );
}

export function useStore() {
  const context = useContext(StoreContext);
  if (!context) throw new Error("useStore debe usarse dentro de un StoreProvider");
  return context;
}