import type { Metadata } from "next";
import { ProductsPage } from "@/components/products/products-page";
export const metadata: Metadata = { title: "Products | Dabang" };
export default function Page() {
  return <ProductsPage />;
}
