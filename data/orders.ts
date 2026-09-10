export type OrderStatus = "Processing" | "Shipped" | "Delivered" | "Cancelled";
export type PaymentStatus = "Paid" | "Pending" | "Refunded";
export type OrderPeriod = "month" | "week" | "all";
export type OrderItem = { name: string; sku: string; quantity: number; priceCents: number };
export type Order = {
  id: string; customer: string; email: string; date: string;
  status: OrderStatus; payment: PaymentStatus; channel: "Online store" | "Marketplace";
  items: OrderItem[]; shippingCents: number; taxCents: number;
  address: string; shippingMethod: string;
};

export const orderStatuses: OrderStatus[] = ["Processing", "Shipped", "Delivered", "Cancelled"];
export const paymentStatuses: PaymentStatus[] = ["Paid", "Pending", "Refunded"];
export const orderPeriods: Record<OrderPeriod, { label: string; start: string; end: string }> = {
  month: { label: "This month", start: "2026-09-01", end: "2026-09-10" },
  week: { label: "Last 7 days", start: "2026-09-04", end: "2026-09-10" },
  all: { label: "All time", start: "2026-01-01", end: "2026-09-10" },
};

const catalog = [
  { name: "Home Decor Range", sku: "HD-001", priceCents: 8900 },
  { name: "Disney Princess Pink Bag 18′", sku: "BG-018", priceCents: 4500 },
  { name: "Bathroom Essentials", sku: "BE-003", priceCents: 3250 },
  { name: "Apple Smartwatch", sku: "AW-004", priceCents: 29900 },
];

const customers = ["Olivia Rhye", "Phoenix Baker", "Lana Steiner", "Demi Wilkinson", "Drew Cano", "Natali Craig", "Orlando Diggs", "Andi Lane", "Kate Morrison", "Alex Morgan", "Sam Wilson", "Jamie Chen", "Avery Brooks", "Jordan Lee", "Taylor Reed", "Morgan Ellis"];
const dates = ["2026-09-10", "2026-09-10", "2026-09-09", "2026-09-09", "2026-09-08", "2026-09-08", "2026-09-07", "2026-09-06", "2026-09-05", "2026-09-04", "2026-09-03", "2026-09-02", "2026-09-01", "2026-08-30", "2026-08-28", "2026-08-25"];
const statuses: OrderStatus[] = ["Processing", "Shipped", "Processing", "Delivered", "Processing", "Delivered", "Shipped", "Cancelled", "Delivered", "Shipped", "Delivered", "Cancelled", "Delivered", "Delivered", "Shipped", "Delivered"];

// Fixed demo orders. Amounts use integer cents to keep line items and totals exact.
export const orders: Order[] = customers.map((customer, i) => {
  const items = [{ ...catalog[i % catalog.length], quantity: i % 3 + 1 }];
  if (i % 4 === 0) items.push({ ...catalog[(i + 2) % catalog.length], quantity: 1 });
  const subtotal = items.reduce((sum, item) => sum + item.priceCents * item.quantity, 0);
  return {
    id: `DB-${1048 - i}`, customer, email: `${customer.toLowerCase().replaceAll(" ", ".")}@example.com`, date: dates[i],
    status: statuses[i], payment: statuses[i] === "Cancelled" ? "Refunded" : i === 2 || i === 4 ? "Pending" : "Paid",
    channel: i % 3 === 0 ? "Marketplace" : "Online store", items,
    shippingCents: subtotal >= 15000 ? 0 : 500, taxCents: Math.round(subtotal * .08),
    address: `${120 + i} Market Street, Apt ${i + 1}\nSan Francisco, CA 94103\nUnited States`,
    shippingMethod: "Standard delivery · 3–5 business days",
  };
});

export function orderSubtotal(order: Order) { return order.items.reduce((sum, item) => sum + item.priceCents * item.quantity, 0); }
export function orderTotal(order: Order) { return orderSubtotal(order) + order.shippingCents + order.taxCents; }
export function formatMoney(cents: number) { return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(cents / 100); }
export function formatOrderDate(date: string) { return new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", year: "numeric", timeZone: "UTC" }).format(new Date(`${date}T00:00:00Z`)); }
export function ordersForPeriod(period: OrderPeriod) {
  const { start, end } = orderPeriods[period];
  return orders.filter((order) => order.date >= start && order.date <= end);
}
export function summarizeOrders(data: Order[]) {
  const active = data.filter((order) => order.status !== "Cancelled");
  return {
    count: data.length,
    collectedCents: data.filter((order) => order.payment === "Paid").reduce((sum, order) => sum + orderTotal(order), 0),
    processing: data.filter((order) => order.status === "Processing").length,
    averageCents: active.length ? Math.round(active.reduce((sum, order) => sum + orderTotal(order), 0) / active.length) : 0,
  };
}
