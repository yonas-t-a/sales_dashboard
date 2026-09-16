import assert from "node:assert/strict";
import test from "node:test";
import { buildSalesReport } from "../data/sales-report.ts";
import { orders, orderTotal } from "../data/orders.ts";
test("products, daily sales, channels and order payments reconcile", () => {
  const r = buildSalesReport(orders, "2026-09-01", "2026-09-10");
  for (const rows of [r.products, r.daily, r.channels]) assert.equal(rows.reduce((sum, row) => sum + row.salesCents, 0), r.salesCents);
  assert.equal(r.collectedCents, r.salesCents + r.shippingCents + r.taxCents);
  assert.equal(r.collectedCents, orders.filter((o) => o.date >= "2026-09-01" && o.payment === "Paid").reduce((sum, o) => sum + orderTotal(o), 0));
  assert.equal(r.paidOrders, 9); assert.equal(r.pendingOrders, 2); assert.equal(r.refundedOrders, 2); assert.equal(r.daily.length, 10);
});
test("channel filters partition totals", () => {
  const [all, online, market] = ["All channels", "Online store", "Marketplace"].map((c) => buildSalesReport(orders, "2026-08-25", "2026-09-10", c));
  assert.equal(all.salesCents, online.salesCents + market.salesCents);
  assert.equal(all.paidOrders, online.paidOrders + market.paidOrders);
});
test("empty periods retain zero dates without invalid averages", () => {
  const r = buildSalesReport(orders, "2026-01-01", "2026-01-03");
  assert.equal(r.salesCents, 0); assert.equal(r.averageCents, 0); assert.equal(r.daily.length, 3); assert.equal(r.products.length, 0);
});
test("boundaries are inclusive and each product counts an order once", () => {
  const o = { ...orders[0], items: [orders[0].items[0], orders[0].items[0]] };
  const r = buildSalesReport([o], o.date, o.date);
  assert.equal(r.paidOrders, 1); assert.equal(r.products[0].orders, 1); assert.equal(r.products[0].units, 2 * o.items[0].quantity);
});
