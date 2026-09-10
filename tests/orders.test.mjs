import assert from "node:assert/strict";
import test from "node:test";
import { orders, ordersForPeriod, orderSubtotal, orderTotal, summarizeOrders } from "../data/orders.ts";

test("order totals reconcile to line items, shipping, and tax in integer cents", () => {
  for (const order of orders) {
    assert.equal(orderSubtotal(order), order.items.reduce((sum, item) => sum + item.quantity * item.priceCents, 0));
    assert.equal(orderTotal(order), orderSubtotal(order) + order.shippingCents + order.taxCents);
    assert.ok(Number.isInteger(orderTotal(order)));
  }
  assert.equal(orderTotal(orders[0]), 13622);
});

test("date ranges include boundaries and exclude older orders", () => {
  const month = ordersForPeriod("month");
  assert.equal(month.length, 13);
  assert.equal(ordersForPeriod("week").length, 10);
  assert.equal(ordersForPeriod("all").length, 16);
  assert.ok(month.some((order) => order.date === "2026-09-01"));
  assert.ok(month.every((order) => order.date >= "2026-09-01" && order.date <= "2026-09-10"));
});

test("collected payments exclude pending and refunded orders", () => {
  const data = ordersForPeriod("month");
  const summary = summarizeOrders(data);
  assert.equal(summary.collectedCents, data.filter((order) => order.payment === "Paid").reduce((sum, order) => sum + orderTotal(order), 0));
  assert.equal(summary.processing, 3);
  const active = data.filter((order) => order.status !== "Cancelled");
  assert.equal(summary.averageCents, Math.round(active.reduce((sum, order) => sum + orderTotal(order), 0) / active.length));
});

test("empty summaries are finite and cancelled demo orders are refunded", () => {
  assert.deepEqual(summarizeOrders([]), { count: 0, collectedCents: 0, processing: 0, averageCents: 0 });
  assert.ok(orders.filter((order) => order.status === "Cancelled").every((order) => order.payment === "Refunded"));
  assert.equal(new Set(orders.map((order) => order.id)).size, orders.length);
});
