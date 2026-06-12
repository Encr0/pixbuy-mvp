import prisma from "@/lib/prisma";
import { DollarSign, Gamepad2, Users, AlertTriangle, TrendingUp, Package } from "lucide-react";
import Link from "next/link";
import CreateGameForm from "./CreateGameForm"; // 

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  const paidOrders = await prisma.order.findMany({
    where: { status: "PAID" },
    include: { items: true }
  });

  const totalRevenue = paidOrders.reduce((acc, order) => acc + order.totalCLP, 0);
  
  const totalGamesSold = paidOrders.reduce((acc, order) => {
    return acc + order.items.reduce((sum, item) => sum + item.quantity, 0);
  }, 0);

  const totalUsers = await prisma.user.count();

  const topProducts = await prisma.product.findMany({
    include: {
      _count: { select: { orderItems: true } }
    },
    orderBy: { orderItems: { _count: 'desc' } },
    take: 5
  });

  // funcion para ver si hay stock bajo :)
  const productsWithStock = await prisma.product.findMany({
    where: { isActive: true },
    include: {
      _count: { select: { keys: { where: { status: "AVAILABLE" } } } }
    }
  });

  const lowStockProducts = productsWithStock
    .filter(p => p._count.keys < 3)
    .sort((a, b) => a._count.keys - b._count.keys);

  return (
    <main className="flex-1 w-full max-w-7xl mx-auto px-4 py-12">
      
      {/* Encabezado Principal */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10 border-b border-[#2a2a2a] pb-6">
        <div>
          <h1 className="text-3xl font-black text-white flex items-center gap-3">
            <TrendingUp className="w-8 h-8 text-[#FF6600]" />
            Centro de Mando Pixbuy
          </h1>
          <p className="text-gray-400 mt-1">Resumen financiero y gestión global del negocio.</p>
        </div>
        <Link href="/admin/stock" className="bg-[#FF6600] hover:bg-[#e55c00] text-white font-bold py-2 px-6 rounded-lg transition-colors text-center shadow-[0_0_15px_rgba(255,102,0,0.4)]">
          Inyectar Stock
        </Link>
      </div>

      {/* Tarjetas de Métricas (KPIs) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        
        <div className="bg-[#1e1e1e] border border-[#2a2a2a] p-6 rounded-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 bg-[#FF6600]/10 p-4 rounded-bl-3xl">
            <DollarSign className="w-8 h-8 text-[#FF6600]" />
          </div>
          <p className="text-gray-400 font-bold mb-1">Ingresos Brutos</p>
          <h3 className="text-3xl font-black text-white">${totalRevenue.toLocaleString('es-CL')}</h3>
        </div>

        <div className="bg-[#1e1e1e] border border-[#2a2a2a] p-6 rounded-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 bg-blue-500/10 p-4 rounded-bl-3xl">
            <Gamepad2 className="w-8 h-8 text-blue-500" />
          </div>
          <p className="text-gray-400 font-bold mb-1">Juegos Vendidos</p>
          <h3 className="text-3xl font-black text-white">{totalGamesSold}</h3>
        </div>

        <div className="bg-[#1e1e1e] border border-[#2a2a2a] p-6 rounded-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 bg-purple-500/10 p-4 rounded-bl-3xl">
            <Users className="w-8 h-8 text-purple-500" />
          </div>
          <p className="text-gray-400 font-bold mb-1">Usuarios Totales</p>
          <h3 className="text-3xl font-black text-white">{totalUsers}</h3>
        </div>

        <div className={`bg-[#1e1e1e] border ${lowStockProducts.length > 0 ? 'border-red-500' : 'border-[#2a2a2a]'} p-6 rounded-xl relative overflow-hidden`}>
          <div className={`absolute top-0 right-0 ${lowStockProducts.length > 0 ? 'bg-red-500/10' : 'bg-green-500/10'} p-4 rounded-bl-3xl`}>
            <AlertTriangle className={`w-8 h-8 ${lowStockProducts.length > 0 ? 'text-red-500' : 'text-green-500'}`} />
          </div>
          <p className="text-gray-400 font-bold mb-1">Alertas de Stock</p>
          <h3 className={`text-3xl font-black ${lowStockProducts.length > 0 ? 'text-red-500' : 'text-white'}`}>
            {lowStockProducts.length}
          </h3>
        </div>

      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        
        {/* TOP 5 MÁS VENDIDOS */}
        <div className="bg-[#1e1e1e] border border-[#2a2a2a] rounded-xl p-6 md:p-8">
          <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2 border-b border-[#2a2a2a] pb-4">
            <TrendingUp className="text-[#FF6600]" /> Top 5 Más Vendidos
          </h2>
          <div className="space-y-4">
            {topProducts.map((product, index) => (
              <div key={product.id} className="flex items-center gap-4 bg-[#121212] p-3 rounded-lg border border-[#2a2a2a]">
                <div className="w-8 h-8 flex items-center justify-center font-black text-gray-500">
                  #{index + 1}
                </div>
                <img src={product.coverImage} alt={product.title} className="w-12 h-12 object-cover rounded" />
                <div className="flex-1">
                  <h4 className="text-white font-bold line-clamp-1">{product.title}</h4>
                  <p className="text-gray-400 text-sm">{product._count.orderItems} copias vendidas</p>
                </div>
                <div className="font-bold text-[#FF6600]">
                  ${product.priceCLP.toLocaleString('es-CL')}
                </div>
              </div>
            ))}
            {topProducts.length === 0 && (
              <p className="text-gray-500 italic text-center py-4">Aún no hay ventas registradas.</p>
            )}
          </div>
        </div>

        {/* ALERTAS DE INVENTARIO */}
        <div className="bg-[#1e1e1e] border border-[#2a2a2a] rounded-xl p-6 md:p-8">
          <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2 border-b border-[#2a2a2a] pb-4">
            <Package className="text-red-500" /> Requieren Atención (Bajo Stock)
          </h2>
          <div className="space-y-4">
            {lowStockProducts.map((product) => (
              <div key={product.id} className="flex items-center justify-between bg-[#121212] p-4 rounded-lg border border-red-500/30">
                <div className="flex-1">
                  <h4 className="text-white font-bold line-clamp-1">{product.title}</h4>
                  <p className="text-gray-400 text-sm">
                    Stock actual: 
                    <span className={`font-black ml-2 ${product._count.keys === 0 ? 'text-red-500' : 'text-yellow-500'}`}>
                      {product._count.keys} claves
                    </span>
                  </p>
                </div>
                <Link href="/admin/stock" className="text-sm bg-[#2a2a2a] hover:bg-[#FF6600] text-white px-4 py-2 rounded transition-colors">
                  Reponer
                </Link>
              </div>
            ))}
            
            {lowStockProducts.length === 0 && (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Package className="w-8 h-8 text-green-500" />
                </div>
                <p className="text-green-500 font-bold">¡Inventario Saludable!</p>
                <p className="text-gray-500 text-sm mt-1">Todos tus juegos tienen al menos 3 claves disponibles.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* AQUÍ INYECTAMOS TU FORMULARIO ORIGINAL */}
      <CreateGameForm />

    </main>
  );
}