import assert from "node:assert/strict";
import test from "node:test";
import {
  initialProducts,
  stockLabel,
  summarizeProducts,
  validateProduct,
} from "../data/products.ts";

test("stock thresholds distinguish unavailable, low, and healthy inventory", () => {
  assert.equal(stockLabel(0), "Out of stock");
  assert.equal(stockLabel(1), "Low stock");
  assert.equal(stockLabel(10), "Low stock");
  assert.equal(stockLabel(11), "In stock");
});
test("summary excludes archives and limits alerts to active products", () => {
  assert.deepEqual(summarizeProducts(initialProducts), {
    total: 11,
    active: 9,
    low: 3,
    out: 1,
  });
  assert.deepEqual(summarizeProducts([]), {
    total: 0,
    active: 0,
    low: 0,
    out: 0,
  });
});
test("SKU validation is case insensitive and permits editing the same record", () => {
  assert.equal(validateProduct(initialProducts[0], initialProducts), null);
  assert.match(
    validateProduct(
      { ...initialProducts[0], id: "new", sku: "hd-001" },
      initialProducts,
    ),
    /already exists/,
  );
});
test("invalid prices and fractional or negative inventory cannot be saved", () => {
  const base = initialProducts[0];
  for (const priceCents of [0, -1, 1.5, NaN, 100000001])
    assert.ok(validateProduct({ ...base, priceCents }, initialProducts));
  for (const stock of [-1, 1.5, NaN, 1000001])
    assert.ok(validateProduct({ ...base, stock }, initialProducts));
  assert.equal(
    validateProduct({ ...base, priceCents: 1, stock: 0 }, initialProducts),
    null,
  );
});
