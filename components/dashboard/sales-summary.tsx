"use client";

import { salesSummary } from "@/data/dashboard";
import styles from "./dashboard.module.css";

function exportSales() {
  const csv = ["Metric,Value,Change", ...salesSummary.map(({ label, value, change }) => [label, value, change].map((field) => `"${field.replaceAll('"', '""')}"`).join(","))].join("\r\n");
  const url = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8;" }));
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = "dabang-sales-summary.csv";
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export function SalesSummary() {
  return (
    <section className={`${styles.card} ${styles.sales}`} aria-labelledby="sales-heading">
      <div className={styles.cardHeader}>
        <div><h2 id="sales-heading">Today’s Sales</h2><p className={styles.subtitle}>Sales Summary</p></div>
        <button className={styles.exportButton} onClick={exportSales}>
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true"><path d="M12 15V3m-4 4 4-4 4 4M5 12v7h14v-7" /></svg>
          Export
        </button>
      </div>
      <div className={styles.statGrid}>
        {salesSummary.map((stat) => (
          <div key={stat.label} className={`${styles.stat} ${styles[stat.color]}`}>
            <span className={styles.statIcon}><StatIcon name={stat.icon} /></span>
            <strong>{stat.value}</strong>
            <span className={styles.statLabel}>{stat.label}</span>
            <span className={styles.statChange}>{stat.change}</span>
          </div>
        ))}
      </div>
    </section>
  );
}

function StatIcon({ name }: { name: (typeof salesSummary)[number]["icon"] }) {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {name === "sales" && <><path d="M5 20h14V5H5Z" /><path d="M8 17v-5m4 5V9m4 8V7" /></>}
      {name === "orders" && <><path d="M6 3h8l4 4v14H6Z" fill="currentColor" /><path d="M14 3v5h4M9 12h5m-5 4h3" stroke="#ff947a" /></>}
      {name === "products" && <><path d="m3 13 10-10 7 1 1 7-10 10Z" fill="currentColor" /><circle cx="16" cy="7" r="1.4" stroke="#3cd856" /></>}
      {name === "customers" && <><circle cx="9" cy="7" r="3" fill="currentColor" /><path d="M3 20v-3a6 6 0 0 1 12 0v3Z" fill="currentColor" /><path d="M19 7v6m-3-3h6" /></>}
    </svg>
  );
}
