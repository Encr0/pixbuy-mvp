export const dynamic = "force-dynamic";

import prisma from "@/lib/prisma";
import WishlistClient from "@/components/wishlist/WishlistClient";

export default async function WishlistPage() {
  // Traemos todos los juegos activos de la base de datos para cruzarlos con el estado global
  const products = await prisma.product.findMany({
    where: { isActive: true },
    orderBy: { createdAt: "desc" }
  });

  return <WishlistClient products={products} />;
}