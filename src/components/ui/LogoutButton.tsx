"use client";

import { signOut } from "next-auth/react";

export default function LogoutButton() {
  return (
    <button 
      onClick={() => signOut({ callbackUrl: "/" })}
      className="border border-[#FF6600] text-[#FF6600] hover:bg-[#FF6600] hover:text-white transition-colors px-6 py-2 rounded font-bold"
    >
      Cerrar Sesión
    </button>
  );
}