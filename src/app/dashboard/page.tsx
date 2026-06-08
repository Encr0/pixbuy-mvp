"use client";
import { useState } from "react";
import { Key, Eye, CheckCircle } from "lucide-react";

export default function DashboardPage() {
  const [revealedKeys, setRevealedKeys] = useState<{ [key: string]: string }>({});

  // Mock de historial de pedidos
  const orders = [
    { id: "ORD-001", date: "2024-03-01", status: "PAID", game: "Cyberpunk 2077", keyId: "key_123" }
  ];

  const handleRevealKey = async (keyId: string) => {
    // Simulación de llamada a /api/keys/reveal
    setRevealedKeys(prev => ({ ...prev, [keyId]: "AAAA-BBBB-CCCC-DDDD" }));
  };

  return (
    <main className="flex-1 w-full max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-black mb-8 border-l-4 border-pixorange pl-3">Mi Panel</h1>

      <div className="bg-pixdark-light rounded-xl border border-pixdark-lighter overflow-hidden">
        <div className="p-6 border-b border-pixdark-lighter">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <Key className="w-5 h-5 text-pixorange" /> Mis Claves y Pedidos
          </h2>
        </div>
        
        <div className="divide-y divide-pixdark-lighter">
          {orders.map(order => (
            <div key={order.id} className="p-6 flex flex-col md:flex-row items-center justify-between gap-4">
              <div>
                <h3 className="font-bold text-lg">{order.game}</h3>
                <p className="text-sm text-gray-400">Pedido: {order.id} • Fecha: {order.date}</p>
                <span className="inline-flex items-center gap-1 mt-2 text-xs font-bold text-green-500 bg-green-500/10 px-2 py-1 rounded">
                  <CheckCircle className="w-3 h-3" /> Pago Completado
                </span>
              </div>

              <div className="w-full md:w-auto">
                {revealedKeys[order.keyId] ? (
                  <div className="bg-pixdark border border-pixorange p-3 rounded-lg text-center font-mono text-lg text-white select-all">
                    {revealedKeys[order.keyId]}
                  </div>
                ) : (
                  <button 
                    onClick={() => handleRevealKey(order.keyId)}
                    className="w-full md:w-auto bg-pixdark border border-pixdark-lighter hover:border-pixorange text-white font-bold py-3 px-6 rounded-lg flex items-center justify-center gap-2 transition-colors"
                  >
                    <Eye className="w-5 h-5" /> Revelar Clave
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}