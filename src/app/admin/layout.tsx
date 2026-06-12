import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth"; // Asegúrate de que esta ruta apunte a tu config de NextAuth
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import { ShieldAlert } from "lucide-react";
import Link from "next/link";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  // 1. Verificamos quién está intentando entrar
  const session = await getServerSession(authOptions);

  if (!session || !session.user?.email) {
    redirect("/login");
  }

  // 2. Buscamos al usuario en tu base de datos para ver su Rango
  const user = await prisma.user.findUnique({
    where: { email: session.user.email }
  });

  // 3. Si no es administrador, le mostramos el letrero de Alto
  if (user?.role !== "ADMIN") {
    return (
      <main className="flex-1 flex flex-col items-center justify-center p-4 min-h-[60vh]">
        <ShieldAlert className="w-24 h-24 text-red-500 mb-6" />
        <h1 className="text-3xl md:text-5xl font-black text-white mb-4 text-center">Acceso Denegado</h1>
        <p className="text-gray-400 mb-8 text-center max-w-md text-lg">
          Tu cuenta <span className="text-white font-bold">{session.user.email}</span> no tiene privilegios de administrador.
        </p>
        <Link 
          href="/" 
          className="bg-[#FF6600] hover:bg-[#e55c00] text-white font-bold py-3 px-8 rounded-full transition-colors"
        >
          Volver a la tienda
        </Link>
      </main>
    );
  }

  // 4. Si es ADMIN, le mostramos la página normal
  return <>{children}</>;
}