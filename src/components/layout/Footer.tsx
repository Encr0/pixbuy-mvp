import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-pixdark-light border-t border-pixdark-lighter mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <span className="text-2xl font-black text-white tracking-tighter">
              PIX<span className="text-pixorange">BUY</span>
            </span>
            <p className="mt-4 text-sm text-gray-400">
              Tu plataforma de confianza para comprar claves de videojuegos al instante. Precios locales, alcance global.
            </p>
          </div>
          <div>
            <h3 className="text-white font-bold mb-4">Plataformas</h3>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><Link href="#" className="hover:text-pixorange">Steam</Link></li>
              <li><Link href="#" className="hover:text-pixorange">Epic Games</Link></li>
              <li><Link href="#" className="hover:text-pixorange">PlayStation Network</Link></li>
              <li><Link href="#" className="hover:text-pixorange">Xbox Live</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-white font-bold mb-4">Soporte</h3>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><Link href="#" className="hover:text-pixorange">Centro de Asistencia</Link></li>
              <li><Link href="#" className="hover:text-pixorange">Términos y Condiciones</Link></li>
              <li><Link href="#" className="hover:text-pixorange">Política de Privacidad</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-white font-bold mb-4">Monedas Aceptadas</h3>
            <div className="flex gap-2">
              <span className="bg-pixdark px-3 py-1 rounded border border-pixdark-lighter text-sm">CLP</span>
              <span className="bg-pixdark px-3 py-1 rounded border border-pixdark-lighter text-sm">USD</span>
            </div>
          </div>
        </div>
        <div className="border-t border-pixdark-lighter mt-8 pt-8 text-center text-sm text-gray-500">
          © {new Date().getFullYear()} Pixbuy Chile. Todos los derechos reservados.
        </div>
      </div>
    </footer>
  );
}