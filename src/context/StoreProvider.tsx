"use client";

import { createContext, useContext, useState, useEffect } from "react";

// (Tus tipos CartItem y StoreContextType siguen exactamente igual)
type CartItem = {
  id: string;
  productId: string;
  title: string;
  price: number;
  image: string;
  quantity: number; 
};

type StoreContextType = {
  cart: CartItem[];
  addToCart: (item: Omit<CartItem, "quantity">) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  wishlist: string[];
  toggleWishlist: (productId: string) => void;
};

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [isClient, setIsClient] = useState(false);

  // 1. Efecto inicial: Cargar LocalStorage y sincronizar con Base de Datos
  useEffect(() => {
    setIsClient(true);
    const savedCart = localStorage.getItem("cart");
    const savedWishlist = localStorage.getItem("wishlist");
    
    if (savedCart) setCart(JSON.parse(savedCart));
    
    let localWishlist: string[] = [];
    if (savedWishlist) {
      localWishlist = JSON.parse(savedWishlist);
      setWishlist(localWishlist);
    }

    // MAGIA DE NUBE: Le preguntamos a la API si hay juegos en la base de datos
    fetch("/api/wishlist")
      .then(res => res.ok ? res.json() : [])
      .then(dbWishlist => {
        if (dbWishlist.length > 0) {
          // Fusionamos los locales con los de la base de datos sin duplicados
          const mergedWishlist = Array.from(new Set([...localWishlist, ...dbWishlist]));
          setWishlist(mergedWishlist);
          localStorage.setItem("wishlist", JSON.stringify(mergedWishlist));
        }
      })
      .catch(() => {}); // Ignoramos errores si no hay internet o sesión
  }, []);

  useEffect(() => {
    if (isClient) {
      localStorage.setItem("cart", JSON.stringify(cart));
      localStorage.setItem("wishlist", JSON.stringify(wishlist));
    }
  }, [cart, wishlist, isClient]);

  // (Tus funciones de carrito siguen igual)
  const addToCart = (item: Omit<CartItem, "quantity">) => {
    setCart((prev) => {
      const existing = prev.find((i) => i.productId === item.productId);
      if (existing) {
        return prev.map((i) => i.productId === item.productId ? { ...i, quantity: i.quantity + 1 } : i);
      }
      return [...prev, { ...item, quantity: 1 }];
    });
  };

  const removeFromCart = (productId: string) => setCart((prev) => prev.filter((item) => item.productId !== productId));
  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) return removeFromCart(productId);
    setCart((prev) => prev.map((i) => i.productId === productId ? { ...i, quantity } : i));
  };
  const clearCart = () => setCart([]);

  // 2. toggleWishlist ahora dispara la sincronización en segundo plano
  const toggleWishlist = (productId: string) => {
    setWishlist((prev) => {
      const newWishlist = prev.includes(productId)
        ? prev.filter((id) => id !== productId) // Si existe, lo quita
        : [...prev, productId]; // Si no existe, lo agrega

      // SINCRONIZACIÓN EN SEGUNDO PLANO
      // Disparamos la petición a la API, pero NO esperamos a que termine.
      // Así el usuario ve el cambio instantáneo, y el servidor guarda una copia en silencio.
      fetch("/api/wishlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId }),
      }).catch(() => {});

      return newWishlist;
    });
  };

  return (
    <StoreContext.Provider value={{ cart, addToCart, removeFromCart, updateQuantity, clearCart, wishlist, toggleWishlist }}>
      {children}
    </StoreContext.Provider>
  );
}

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) throw new Error("useStore debe usarse dentro de un StoreProvider");
  return context;
};