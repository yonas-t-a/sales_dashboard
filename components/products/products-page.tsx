"use client";

import { useMemo, useState } from "react";
import type { ColumnDef } from "@tanstack/react-table";
import {
  Archive,
  ArrowRight,
  CheckCheck,
  CircleAlert,
  Package,
  Pencil,
  Plus,
} from "lucide-react";
import {
  productCategories,
  productStatuses,
  stockLabel,
  summarizeProducts,
  type Product,
} from "@/data/products";
import { formatMoney } from "@/data/orders";
import { DataTable } from "@/components/ui/data-table";
import { useCatalog } from "./catalog-store";
import { ProductEditor } from "./product-editor";
import { ProductIcon } from "./product-icon";
import shared from "@/components/leaderboard/leaderboard.module.css";
import dashboard from "@/components/dashboard/dashboard.module.css";
import styles from "./products.module.css";

const searchText = (product: Product) =>
  `${product.name} ${product.sku} ${product.category}`;
const exportRow = (p: Product) => [
  p.name,
  p.sku,
  p.category,
  p.status,
  (p.priceCents / 100).toFixed(2),
  p.stock,
  stockLabel(p.stock),
];
export function ProductsPage() {
  const products = useCatalog();
  const [status, setStatus] = useState("All products");
  const [category, setCategory] = useState("All categories");
  const [stock, setStock] = useState("All inventory");
  const [editor, setEditor] = useState<{ product: Product | null } | null>(
    null,
  );
  const [message, setMessage] = useState("");
  const summary = summarizeProducts(products);
  const scoped = useMemo(
    () =>
      products.filter(
        (p) =>
          (category === "All categories" || p.category === category) &&
          (stock === "All inventory" || stockLabel(p.stock) === stock),
      ),
    [products, category, stock],
  );
  const filtered = useMemo(
    () =>
      scoped.filter((p) => status === "All products" || p.status === status),
    [scoped, status],
  );
  const columns = useMemo<ColumnDef<Product>[]>(
    () => [
      {
        accessorKey: "name",
        header: "Product",
        cell: ({ row }) => (
          <div className={shared.member}>
            <ProductIcon category={row.original.category} />
            <span>
              <button
                className={styles.productName}
                onClick={() => setEditor({ product: row.original })}
              >
                {row.original.name}
              </button>
              <small>{row.original.sku}</small>
            </span>
          </div>
        ),
      },
      { accessorKey: "category", header: "Category" },
      {
        accessorKey: "status",
        header: "Status",
        cell: ({ getValue }) => (
          <span className={styles.badge} data-status={getValue<string>()}>
            <i aria-hidden="true" />
            {getValue<string>()}
          </span>
        ),
      },
      {
        accessorKey: "priceCents",
        header: "Price",
        cell: ({ getValue }) => (
          <strong>{formatMoney(getValue<number>())}</strong>
        ),
      },
      {
        accessorKey: "stock",
        header: "Inventory",
        cell: ({ getValue }) => (
          <div
            className={styles.inventory}
            data-stock={stockLabel(getValue<number>())}
          >
            <strong>
              {getValue<number>().toLocaleString("en-US")} in stock
            </strong>
            <small>{stockLabel(getValue<number>())}</small>
          </div>
        ),
      },
      {
        id: "actions",
        header: "Edit",
        enableSorting: false,
        cell: ({ row }) => (
          <button
            className={shared.button}
            aria-label={`Edit ${row.original.name}`}
            onClick={() => setEditor({ product: row.original })}
          >
            <Pencil aria-hidden="true" />
          </button>
        ),
      },
    ],
    [],
  );
  const stats = [
    {
      label: "Total products",
      value: summary.total,
      detail: "Active and draft catalog entries",
      color: "purple",
      Icon: Package,
    },
    {
      label: "Active products",
      value: summary.active,
      detail: "Published in your demo catalog",
      color: "green",
      Icon: CheckCheck,
    },
    {
      label: "Low stock",
      value: summary.low,
      detail: "Active products with 1–10 units",
      color: "peach",
      Icon: CircleAlert,
    },
    {
      label: "Out of stock",
      value: summary.out,
      detail: "Active products with no inventory",
      color: "pink",
      Icon: Archive,
    },
  ];
  function resetFilters() {
    setStatus("All products");
    setCategory("All categories");
    setStock("All inventory");
  }
  return (
    <main
      id="main-content"
      className={`${dashboard.dashboard} ${shared.page}`}
      aria-label="Products"
    >
      <div className={shared.pageHeader}>
        <div>
          <div className={shared.headingLine}>
            <h1>Product catalog</h1>
            <span className={shared.demoBadge}>Demo data</span>
          </div>
          <p>Keep your catalog organized and your inventory ready to sell.</p>
        </div>
        <button
          className={styles.primary}
          onClick={() => setEditor({ product: null })}
        >
          <Plus aria-hidden="true" />
          Add product
        </button>
      </div>
      <section className={shared.stats} aria-label="Product summary">
        {stats.map(({ label, value, detail, color, Icon }) => (
          <article
            key={label}
            className={`${shared.statCard} ${shared[color]}`}
          >
            <span className={shared.statIcon}>
              <Icon aria-hidden="true" />
            </span>
            <span className={shared.statLabel}>{label}</span>
            <strong>{value}</strong>
            <small>{detail}</small>
          </article>
        ))}
      </section>
      {summary.low > 0 && (
        <div className={styles.notice}>
          <span className={styles.noticeIcon}>
            <CircleAlert aria-hidden="true" />
          </span>
          <div>
            <strong>{summary.low} products are running low</strong>
            <p>Review inventory before your next orders arrive.</p>
          </div>
          <button
            onClick={() => {
              setStatus("Active");
              setCategory("All categories");
              setStock("Low stock");
            }}
          >
            Review stock <ArrowRight aria-hidden="true" />
          </button>
        </div>
      )}
      {message && (
        <div className={styles.success} role="status">
          <CheckCheck aria-hidden="true" />
          {message}
          <button
            aria-label="Dismiss notification"
            onClick={() => setMessage("")}
          >
            Dismiss
          </button>
        </div>
      )}
      <DataTable
        key={`${status}-${category}-${stock}`}
        data={filtered}
        columns={columns}
        title="All products"
        description="Manage product information, pricing, and stock levels."
        searchLabel="Search products or SKU"
        searchText={searchText}
        noun="products"
        initialSorting={[]}
        exportName="dabang-products.csv"
        exportHeaders={[
          "Product",
          "SKU",
          "Category",
          "Status",
          "Price (USD)",
          "Stock",
          "Inventory status",
        ]}
        exportRow={exportRow}
        toolbar={
          <div className={styles.toolbar}>
            <div
              className={styles.tabs}
              role="group"
              aria-label="Catalog status"
            >
              {["All products", ...productStatuses].map((value) => (
                <button
                  key={value}
                  aria-pressed={status === value}
                  onClick={() => setStatus(value)}
                >
                  {value}
                  <span>
                    {value === "All products"
                      ? scoped.length
                      : scoped.filter((p) => p.status === value).length}
                  </span>
                </button>
              ))}
            </div>
            <div className={`${shared.filters} ${styles.filters}`}>
              <label>
                <select
                  aria-label="Product category"
                  value={category}
                  onChange={(event) => setCategory(event.target.value)}
                >
                  {["All categories", ...productCategories].map((value) => (
                    <option key={value}>{value}</option>
                  ))}
                </select>
              </label>
              <label>
                <select
                  aria-label="Inventory status"
                  value={stock}
                  onChange={(event) => setStock(event.target.value)}
                >
                  {[
                    "All inventory",
                    "In stock",
                    "Low stock",
                    "Out of stock",
                  ].map((value) => (
                    <option key={value}>{value}</option>
                  ))}
                </select>
              </label>
              {(status !== "All products" ||
                category !== "All categories" ||
                stock !== "All inventory") && (
                <button className={shared.button} onClick={resetFilters}>
                  Reset filters
                </button>
              )}
            </div>
          </div>
        }
      />
      <p className={shared.pageNote}>
        Demo catalog · Changes are saved in this browser. Summary cards cover
        the full catalog; filters apply to the table. Prices are in USD.
      </p>
      {editor && (
        <ProductEditor
          product={editor.product}
          onClose={() => setEditor(null)}
          onSave={(name) => setMessage(`${name} saved to your demo catalog.`)}
        />
      )}
    </main>
  );
}
