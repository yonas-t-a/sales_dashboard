import type { Metadata } from "next";
import { OrdersPage } from "@/components/orders/orders-page";

export const metadata: Metadata = { title: "Orders | Dabang" };
export default function Page() {
  return <OrdersPage />;
}
