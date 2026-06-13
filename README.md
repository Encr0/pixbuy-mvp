
# Documentación Técnica: PixBuy MVP

PixBuy es una plataforma de e-commerce especializada en la distribución automatizada de llaves de activación (CD Keys) para videojuegos. El sistema permite a los usuarios navegar por un catálogo, gestionar una lista de deseos, procesar compras mediante una billetera virtual y obtener recompensas mediante un sistema de gamificación basado en puntos y rangos.
## Usando

[![Next.js](https://img.shields.io/badge/Next.js-14.1-black?logo=nextdotjs)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?logo=typescript)](https://www.typescriptlang.org/)
[![Prisma](https://img.shields.io/badge/Prisma-5.22-2D3748?logo=prisma)](https://www.prisma.io/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-CSS-38B2AC?logo=tailwind-css)](https://tailwindcss.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)


## Características Principales

*   **Checkout Atómico:** Gestión de stock mediante transacciones de base de datos para evitar sobreventa.
*   **Sistema de Gamificación:** Rangos dinámicos (de Hierro a Gran Maestro) basados en puntos de fidelidad (`PixPoints`).
*   **UI Dinámica:** Interfaz reactiva con Tailwind CSS y efectos visuales de "brillo" (glow) progresivos según el rango del usuario.
*   **Seguridad:** Validación de precios y stock en el lado del servidor, protegiendo contra manipulación de datos en el cliente.
*   **Biblioteca Digital:** Acceso privado y seguro a claves de producto mediante un sistema de revelado dinámico.

## Stack Tecnológico

| Capa | Tecnología |
| :--- | :--- |
| **Frontend** | Next.js 14, Tailwind CSS, Lucide React |
| **Backend** | Serverless API (Next.js), NextAuth.js |
| **Base de Datos** | PostgreSQL (Neon.tech) |
| **ORM** | Prisma |


## Estructura del Proyecto

```text
src/
├── app/              # Rutas, API endpoints y layouts
├── components/       # Componentes de interfaz (reutilizables)
├── context/          # Gestión de estado global (StoreProvider)
├── lib/              # Configuración (Prisma, Auth, AuthOptions)
└── prisma/           # Esquema de base de datos

```
## Configuración del Entorno

Clonar el repositorio:

```text
git clone https://github.com/Encr0/pixbuy-mvp.git
```

Instalar dependencias:
```text
npm install
```

Configurar variables de entorno (.env):
```text
DATABASE_URL="postgres://tu_url_neon"
NEXTAUTH_SECRET="tu_secreto_aleatorio"
```

Sincronizar base de datos:
```text
npx prisma db push
```

Ejecutar en modo desarrollo:
```text
npm run dev
```
## Lógica de Gamificación

El sistema calcula el rango del usuario en tiempo real basándose en su actividad de compra:

Hierro: 0+ puntos

Bronce: 500+ puntos

Plata: 2,000+ puntos

Oro: 5,000+ puntos

Platino: 10,000+ puntos

Diamante: 15,000+ puntos

Gran Maestro: 20,000+ puntos

## Consideraciones de Seguridad

La aplicación implementa una arquitectura de validación de servidor. A diferencia de implementaciones estándar, los precios son validados en el servidor contra la base de datos antes de confirmar cualquier transacción, eliminando el riesgo de manipulación de precios desde el cliente.



## Licencia

Este proyecto está bajo la licencia MIT.

Desarrollado como Proyecto de Título - 2026

