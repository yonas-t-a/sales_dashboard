import type { Order } from "./orders";

export type ReportProduct = { id: string; name: string; sku: string; units: number; orders: number; salesCents: number; share: number };
export type ReportDay = { date: string; salesCents: number; orders: number };
export function buildSalesReport(source: Order[], start: string, end: string, channel = "All channels") {
  const scoped = source.filter((o) => o.date >= start && o.date <= end && (channel === "All channels" || o.channel === channel));
  const paid = scoped.filter((o) => o.payment === "Paid" && o.status !== "Cancelled");
  const products = new Map<string, ReportProduct>();
  const daily = new Map<string, ReportDay>();
  for (let time = Date.parse(`${start}T00:00:00Z`); time <= Date.parse(`${end}T00:00:00Z`); time += 86400000) {
    const date = new Date(time).toISOString().slice(0, 10);
    daily.set(date, { date, salesCents: 0, orders: 0 });
  }
  const channels = ["Online store", "Marketplace"].map((name) => ({ name, salesCents: 0, orders: 0 }));
  let salesCents = 0, shippingCents = 0, taxCents = 0, units = 0;
  for (const order of paid) {
    let subtotal = 0;
    const counted = new Set<string>();
    for (const item of order.items) {
      const amount = item.quantity * item.priceCents;
      subtotal += amount; units += item.quantity;
      const p = products.get(item.sku) ?? { id: item.sku, sku: item.sku, name: item.name, units: 0, orders: 0, salesCents: 0, share: 0 };
      p.units += item.quantity; p.salesCents += amount;
      if (!counted.has(item.sku)) p.orders += 1;
      counted.add(item.sku); products.set(item.sku, p);
    }
    salesCents += subtotal; shippingCents += order.shippingCents; taxCents += order.taxCents;
    const day = daily.get(order.date)!; day.salesCents += subtotal; day.orders += 1;
    const row = channels.find(({ name }) => name === order.channel)!; row.salesCents += subtotal; row.orders += 1;
  }
  return {
    salesCents, shippingCents, taxCents, collectedCents: salesCents + shippingCents + taxCents,
    paidOrders: paid.length, units, averageCents: paid.length ? Math.round(salesCents / paid.length) : 0,
    pendingOrders: scoped.filter((o) => o.payment === "Pending").length,
    refundedOrders: scoped.filter((o) => o.payment === "Refunded").length,
    products: [...products.values()].map((p) => ({ ...p, share: salesCents ? p.salesCents / salesCents * 100 : 0 })).sort((a, b) => b.salesCents - a.salesCents || a.name.localeCompare(b.name)),
    daily: [...daily.values()], channels,
  };
}
