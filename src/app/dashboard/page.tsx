export const dynamic = "force-dynamic";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import LogoutButton from "@/components/ui/LogoutButton";
import RevealKey from "@/components/dashboard/RevealKey";
import { Coins, Gamepad2, Key, Star, Receipt } from "lucide-react";
import Link from "next/link";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session || !session.user?.email) {
    redirect("/login");
  }

  // 1. Buscamos al usuario incluyendo sus puntos
  const dbUser = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: {
      id: true,
      name: true,
      email: true,
      pixPoints: true,
    }
  });

  if (!dbUser) redirect("/login");

  // 2. Definimos explícitamente el tipo de objeto para TypeScript
  const user: { id: string; name: string | null; email: string | null; pixPoints: number } = {
    id: dbUser.id,
    name: dbUser.name,
    email: dbUser.email,
    pixPoints: dbUser.pixPoints ?? 0,
  };

  // 2. Buscamos todas las compras de este usuario
  const userOrders = await prisma.order.findMany({
    where: { userId: user.id },
    include: {
      items: {
        include: {
          product: true 
        }
      }
    },
    orderBy: { createdAt: 'desc' }
  });

  

  return (
    <main className="flex-1 w-full max-w-7xl mx-auto px-4 py-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-black text-white mb-1">Mi Bóveda</h1>
          <p className="text-gray-400">Bienvenido de vuelta, {session.user.name || session.user.email}</p>
        </div>
        <LogoutButton />
      </div>

      {/* --- TARJETAS DE ESTADO (PIXPOINTS + CUENTA) --- */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <div className="bg-[#1e1e1e] border-2 border-[#FF6600]/30 p-6 rounded-xl flex items-center gap-4">
           <Coins className="w-10 h-10 text-[#FF6600]" />
           <div>
             <p className="text-gray-400 text-sm font-bold uppercase">Mis PixPoints</p>
             <h3 className="text-3xl font-black text-white">{user.pixPoints.toLocaleString('es-CL')}</h3>
           </div>
        </div>
        <div className="bg-[#1e1e1e] border border-[#2a2a2a] p-6 rounded-xl flex items-center gap-4">
           <Key className="w-10 h-10 text-blue-500" />
           <div>
             <p className="text-gray-400 text-sm font-bold uppercase">Juegos Activos</p>
             <h3 className="text-3xl font-black text-white">{userOrders.flatMap(o => o.items).length}</h3>
           </div>
        </div>
        <div className="bg-[#1e1e1e] border border-[#2a2a2a] p-6 rounded-xl flex items-center gap-4">
           <Star className="w-10 h-10 text-purple-500" />
           <div>
             <p className="text-gray-400 text-sm font-bold uppercase">Rango</p>
             <h3 className="text-3xl font-black text-white">Bronce</h3>
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* COLUMNA IZQUIERDA: La Biblioteca de Juegos */}
        <div className="lg:col-span-2 space-y-6">
          <h2 className="text-xl font-bold text-white border-b border-[#2a2a2a] pb-3 flex items-center gap-2">
            <Gamepad2 className="text-[#FF6600]" /> Mi Arsenal
          </h2>

          {userOrders.length === 0 ? (
             <div className="bg-[#1e1e1e] p-12 rounded-xl border border-[#2a2a2a] text-center">
               <Gamepad2 className="w-16 h-16 text-gray-600 mx-auto mb-4" />
               <h3 className="text-xl font-bold text-gray-300">Aún no tienes juegos</h3>
               <p className="text-gray-500 mt-2 mb-6">Tu biblioteca está vacía. ¡Ve a la tienda y equípate!</p>
               <Link href="/" className="bg-[#FF6600] text-white px-6 py-2 rounded font-bold hover:bg-[#e55c00]">
                 Explorar Catálogo
               </Link>
             </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {userOrders.flatMap(order => order.items).map((item) => {
                  const actualKey = item.assignedKey || "CLAVE-PENDIENTE";
                  return (
                    <div key={item.id} className="bg-[#1e1e1e] border border-[#2a2a2a] rounded-xl p-4 flex flex-col transition-colors hover:border-gray-600">
                      <div className="flex items-center gap-4 mb-2">
                        <img 
                          src={item.product.coverImage} 
                          alt={item.product.title} 
                          className="w-16 h-16 object-cover rounded shadow"
                        />
                        <div>
                          <h3 className="font-bold text-white line-clamp-1">{item.product.title}</h3>
                          <p className="text-xs text-gray-400">Entregado digitalmente</p>
                        </div>
                      </div>
                      <RevealKey gameName={item.product.title} fakeKey={actualKey} />
                    </div>
                  );
              })}
            </div>
          )}
        </div>

        {/* COLUMNA DERECHA: Cuenta y Recibos */}
        <div className="space-y-6">
          <div className="bg-[#1e1e1e] p-6 rounded-xl border border-[#2a2a2a]">
            <h2 className="text-xl font-bold text-white mb-4 border-b border-[#2a2a2a] pb-2">Mi Cuenta</h2>
            <ul className="space-y-3 text-sm">
              <li className="flex justify-between">
                <span className="text-gray-400">Email:</span>
                <span className="text-white font-medium truncate ml-2">{session.user.email}</span>
              </li>
              <li className="flex justify-between">
                <span className="text-gray-400">Estado:</span>
                <span className="text-green-500 font-bold">Activo</span>
              </li>
            </ul>
          </div>

          <div className="bg-[#1e1e1e] p-6 rounded-xl border border-[#2a2a2a]">
            <h2 className="text-xl font-bold text-white mb-4 border-b border-[#2a2a2a] pb-2 flex items-center gap-2">
              <Receipt className="text-gray-400 w-5 h-5" /> Últimas Compras
            </h2>
            {userOrders.length === 0 ? (
              <p className="text-sm text-gray-500">No hay transacciones.</p>
            ) : (
              <div className="space-y-4 text-sm">
                {userOrders.slice(0, 3).map(order => (
                  <div key={order.id} className="flex justify-between items-center bg-[#121212] p-3 rounded border border-[#2a2a2a]">
                    <div>
                      <p className="text-white font-bold">${order.totalCLP.toLocaleString('es-CL')}</p>
                      <p className="text-xs text-gray-500">{new Date(order.createdAt).toLocaleDateString()}</p>
                    </div>
                    <span className="bg-green-500/20 text-green-500 text-xs font-bold px-2 py-1 rounded">
                      Completado
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}