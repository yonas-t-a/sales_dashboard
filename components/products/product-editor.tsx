"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import { Package, Save, X } from "lucide-react";
import {
  productCategories,
  productStatuses,
  type Product,
} from "@/data/products";
import { saveProduct } from "./catalog-store";
import shared from "@/components/leaderboard/leaderboard.module.css";
import styles from "./products.module.css";

export function ProductEditor({
  product,
  onClose,
  onSave,
}: {
  product: Product | null;
  onClose: () => void;
  onSave: (name: string) => void;
}) {
  const dialog = useRef<HTMLDialogElement>(null);
  const [error, setError] = useState("");
  useEffect(() => {
    dialog.current?.showModal();
  }, []);

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const price = String(data.get("price"));
    if (!/^\d+(\.\d{1,2})?$/.test(price)) {
      setError("Enter a price with at most two decimal places.");
      return;
    }
    const next: Product = {
      id: product?.id ?? crypto.randomUUID(),
      name: String(data.get("name")).trim(),
      sku: String(data.get("sku")).trim().toUpperCase(),
      category: String(data.get("category")) as Product["category"],
      status: String(data.get("status")) as Product["status"],
      priceCents: Math.round(Number(price) * 100),
      stock: Number(data.get("stock")),
      description: String(data.get("description")).trim(),
    };
    try {
      saveProduct(next);
      onSave(next.name);
      dialog.current?.close();
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Unable to save. Please try again.",
      );
    }
  }
  return (
    <dialog
      ref={dialog}
      className={styles.dialog}
      aria-labelledby="product-editor-title"
      onClose={onClose}
    >
      <form onSubmit={submit} className={styles.editor}>
        <header className={styles.editorHeader}>
          <div>
            <span className={styles.eyebrow}>
              <Package aria-hidden="true" />
              PRODUCT CATALOG
            </span>
            <h2 id="product-editor-title">
              {product ? "Edit product" : "Add product"}
            </h2>
            <p>Changes are saved to this browser’s demo catalog.</p>
          </div>
          <button
            type="button"
            className={shared.button}
            aria-label="Close product editor"
            onClick={() => dialog.current?.close()}
          >
            <X aria-hidden="true" />
          </button>
        </header>
        <div className={styles.formGrid}>
          <label className={styles.full}>
            Product name
            <input
              autoFocus
              name="name"
              required
              maxLength={100}
              defaultValue={product?.name}
              placeholder="e.g. Ceramic Table Lamp"
            />
          </label>
          <label>
            SKU
            <input
              name="sku"
              required
              minLength={2}
              maxLength={30}
              pattern="[A-Za-z0-9][A-Za-z0-9_\-]{1,29}"
              defaultValue={product?.sku}
              placeholder="e.g. HL-013"
            />
          </label>
          <label>
            Category
            <select
              name="category"
              defaultValue={product?.category ?? productCategories[0]}
            >
              {productCategories.map((value) => (
                <option key={value}>{value}</option>
              ))}
            </select>
          </label>
          <label>
            Price (USD)
            <input
              name="price"
              type="number"
              inputMode="decimal"
              required
              min="0.01"
              max="1000000"
              step="0.01"
              defaultValue={
                product ? (product.priceCents / 100).toFixed(2) : ""
              }
              placeholder="0.00"
            />
          </label>
          <label>
            Stock quantity
            <input
              name="stock"
              type="number"
              inputMode="numeric"
              required
              min="0"
              max="1000000"
              step="1"
              defaultValue={product?.stock ?? 0}
            />
          </label>
          <label className={styles.full}>
            Catalog status
            <select name="status" defaultValue={product?.status ?? "Draft"}>
              {productStatuses.map((value) => (
                <option key={value}>{value}</option>
              ))}
            </select>
            <small>
              Drafts are not published. Archived products stay available for
              reference.
            </small>
          </label>
          <label className={styles.full}>
            Description <span className={styles.optional}>(optional)</span>
            <textarea
              name="description"
              rows={3}
              maxLength={1000}
              defaultValue={product?.description}
              placeholder="Describe the product and its key features."
            />
          </label>
        </div>
        {error && (
          <p role="alert" className={styles.error}>
            {error}
          </p>
        )}
        <footer className={styles.editorFooter}>
          <button
            type="button"
            className={shared.button}
            onClick={() => dialog.current?.close()}
          >
            Cancel
          </button>
          <button type="submit" className={styles.primary}>
            <Save aria-hidden="true" />
            {product ? "Save changes" : "Add product"}
          </button>
        </footer>
      </form>
    </dialog>
  );
}
