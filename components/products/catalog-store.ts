"use client";

import { useSyncExternalStore } from "react";
import {
  initialProducts,
  validateProduct,
  type Product,
} from "@/data/products";

const key = "dabang-products-v1";
const eventName = "dabang-products-change";
let cachedRaw: string | null | undefined;
let cachedProducts = initialProducts;

function getSnapshot(): Product[] {
  try {
    const raw = localStorage.getItem(key);
    if (raw === cachedRaw) return cachedProducts;
    cachedRaw = raw;
    if (!raw) return (cachedProducts = initialProducts);
    const parsed: unknown = JSON.parse(raw);
    if (
      !Array.isArray(parsed) ||
      !parsed.every(
        (p) =>
          p &&
          typeof p.id === "string" &&
          typeof p.name === "string" &&
          typeof p.sku === "string" &&
          typeof p.description === "string" &&
          !validateProduct(p, []),
      ) ||
      new Set(parsed.map((p) => p.id)).size !== parsed.length ||
      new Set(parsed.map((p) => p.sku.toLowerCase())).size !== parsed.length
    )
      return (cachedProducts = initialProducts);
    return (cachedProducts = parsed);
  } catch {
    return (cachedProducts = initialProducts);
  }
}
function subscribe(callback: () => void) {
  window.addEventListener("storage", callback);
  window.addEventListener(eventName, callback);
  return () => {
    window.removeEventListener("storage", callback);
    window.removeEventListener(eventName, callback);
  };
}
export function useCatalog() {
  return useSyncExternalStore(subscribe, getSnapshot, () => initialProducts);
}
export function saveProduct(product: Product) {
  const current = getSnapshot();
  const error = validateProduct(product, current);
  if (error) throw new Error(error);
  const next = current.some(({ id }) => id === product.id)
    ? current.map((item) => (item.id === product.id ? product : item))
    : [product, ...current];
  try {
    localStorage.setItem(key, JSON.stringify(next));
  } catch {
    throw new Error(
      "Your browser could not save this product. Enable local storage or free some space, then try again.",
    );
  }
  window.dispatchEvent(new Event(eventName));
}
