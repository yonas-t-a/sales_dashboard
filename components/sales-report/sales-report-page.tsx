"use client";
import { useMemo, useState } from "react";
import Link from "next/link";
import type { ColumnDef } from "@tanstack/react-table";
import { ArrowRight, CalendarDays, CircleDollarSign, Download, Package, Receipt, ShoppingBag } from "lucide-react";
import { orders, orderPeriods, formatMoney, formatOrderDate, type OrderPeriod } from "@/data/orders";
import { buildSalesReport, type ReportProduct } from "@/data/sales-report";
import { DataTable } from "@/components/ui/data-table";
import { exportCsv } from "@/lib/export-csv";
import { SalesTrend } from "./sales-trend";
import shared from "@/components/leaderboard/leaderboard.module.css";
import dashboard from "@/components/dashboard/dashboard.module.css";
import styles from "./sales-report.module.css";

const columns: ColumnDef<ReportProduct>[] = [
  { accessorKey: "name", header: "Product", cell: ({ row }) => <div className={shared.member}><span className={`${shared.avatar} ${shared.purple}`}><Package aria-hidden="true" /></span><span><strong>{row.original.name}</strong><small>{row.original.sku}</small></span></div> },
  { accessorKey: "units", header: "Units sold" }, { accessorKey: "orders", header: "Paid orders" },
  { accessorKey: "salesCents", header: "Product sales", cell: ({ getValue }) => <strong>{formatMoney(getValue<number>())}</strong> },
  { accessorKey: "share", header: "Sales share", cell: ({ getValue }) => <div className={styles.share}><span>{getValue<number>().toFixed(1)}%</span><meter min={0} max={100} value={getValue<number>()} aria-label="Share of product sales" /></div> },
];
const searchText = (p: ReportProduct) => `${p.name} ${p.sku}`;
const exportRow = (p: ReportProduct) => [p.name, p.sku, p.units, p.orders, (p.salesCents / 100).toFixed(2), p.share.toFixed(2)];

export function SalesReportPage() {
  const [period, setPeriod] = useState<OrderPeriod>("month");
  const [channel, setChannel] = useState("All channels");
  const start = period === "all" ? orders.reduce((date, o) => o.date < date ? o.date : date, orders[0].date) : orderPeriods[period].start;
  const end = orderPeriods[period].end;
  const report = useMemo(() => buildSalesReport(orders, start, end, channel), [start, end, channel]);
  const onlineShare = report.salesCents ? report.channels[0].salesCents / report.salesCents * 100 : 0;
  const stats = [
    { label: "Product sales", value: formatMoney(report.salesCents), detail: "Paid orders · excludes shipping & tax", color: "purple", Icon: CircleDollarSign },
    { label: "Paid orders", value: report.paidOrders, detail: "Excludes pending and refunded orders", color: "green", Icon: ShoppingBag },
    { label: "Units sold", value: report.units, detail: "Items across included paid orders", color: "peach", Icon: Package },
    { label: "Average order value", value: formatMoney(report.averageCents), detail: "Product sales ÷ paid orders", color: "pink", Icon: Receipt },
  ];
  function downloadReport() {
    exportCsv(`dabang-sales-report-${start}-${end}-${channel.toLowerCase().replaceAll(" ", "-")}.csv`, [
      ["Sales report", "USD", "Demo data"], ["Start date", start], ["End date", end], ["Channel", channel], ["Basis", "Paid, non-cancelled orders; product sales exclude shipping and tax"],
      ["Product sales (USD)", (report.salesCents / 100).toFixed(2)], ["Paid orders", report.paidOrders], ["Units sold", report.units], ["Average product order value (USD)", (report.averageCents / 100).toFixed(2)],
      ["Shipping (USD)", (report.shippingCents / 100).toFixed(2)], ["Tax (USD)", (report.taxCents / 100).toFixed(2)], ["Total collected (USD)", (report.collectedCents / 100).toFixed(2)], [],
      ["Date", "Product sales (USD)", "Paid orders"], ...report.daily.map((d) => [d.date, (d.salesCents / 100).toFixed(2), d.orders]), [],
      ["Product", "SKU", "Units", "Paid orders", "Product sales (USD)", "Share (%)"], ...report.products.map(exportRow),
    ]);
  }
  return <main id="main-content" className={`${dashboard.dashboard} ${shared.page}`} aria-label="Sales report">
    <div className={shared.pageHeader}><div><div className={shared.headingLine}><h1>Sales performance</h1><span className={shared.demoBadge}>Demo data</span></div><p>A clear view of what’s selling and where your revenue comes from.</p></div><button className={styles.primary} onClick={downloadReport}><Download aria-hidden="true" />Download report</button></div>
    <div className={styles.reportFilters}><div className={shared.filters}><label><CalendarDays aria-hidden="true" /><select aria-label="Report period" value={period} onChange={(e) => setPeriod(e.target.value as OrderPeriod)}>{Object.entries(orderPeriods).map(([key, value]) => <option key={key} value={key}>{value.label}</option>)}</select></label><label><select aria-label="Sales channel" value={channel} onChange={(e) => setChannel(e.target.value)}>{["All channels", "Online store", "Marketplace"].map((v) => <option key={v}>{v}</option>)}</select></label></div><p>{formatOrderDate(start)} – {formatOrderDate(end)}</p></div>
    <section className={shared.stats} aria-label="Sales report summary">{stats.map(({ label, value, detail, color, Icon }) => <article className={`${shared.statCard} ${shared[color]}`} key={label}><span className={shared.statIcon}><Icon aria-hidden="true" /></span><span className={shared.statLabel}>{label}</span><strong>{value}</strong><small>{detail}</small></article>)}</section>
    <div className={styles.chartGrid}><SalesTrend key={`${period}-${channel}`} days={report.daily} />
      <section className={styles.panel} aria-labelledby="channels-heading"><div className={styles.panelHeader}><div><h2 id="channels-heading">Sales by channel</h2><p>Share of product sales</p></div></div><div className={styles.donut} role="img" aria-label={`Online store ${onlineShare.toFixed(1)}%, Marketplace ${(report.salesCents ? 100 - onlineShare : 0).toFixed(1)}% of sales`} style={{ background: report.salesCents ? `conic-gradient(#6159f7 0% ${onlineShare}%, #00d99a ${onlineShare}% 100%)` : "#eeedf5" }}><div><small>Total sales</small><strong>{formatMoney(report.salesCents)}</strong></div></div><div className={styles.channelLegend}>{report.channels.map((item, i) => <div key={item.name}><span><i style={{ background: i ? "#00d99a" : "#6159f7" }} />{item.name}</span><strong>{formatMoney(item.salesCents)}</strong><small>{report.salesCents ? (item.salesCents / report.salesCents * 100).toFixed(1) : "0.0"}%</small></div>)}</div></section>
    </div>
    <div className={styles.breakdown}><div><h2>Payment breakdown</h2><p>Reconciles with paid orders in your order list.</p></div><dl><div><dt>Product sales</dt><dd>{formatMoney(report.salesCents)}</dd></div><div><dt>Shipping</dt><dd>{formatMoney(report.shippingCents)}</dd></div><div><dt>Tax</dt><dd>{formatMoney(report.taxCents)}</dd></div><div><dt>Total collected</dt><dd>{formatMoney(report.collectedCents)}</dd></div></dl><Link href="/orders">View orders <ArrowRight aria-hidden="true" /></Link></div>
    <DataTable key={`${period}-${channel}`} data={report.products} columns={columns} title="Product performance" description="Product sales ranked by value. An order can contain multiple products." noun="products" searchLabel="Search report products" searchText={searchText} initialSorting={[{ id: "salesCents", desc: true }]} exportName={`dabang-product-sales-${start}-${end}-${channel.toLowerCase().replaceAll(" ", "-")}.csv`} exportHeaders={["Product", "SKU", "Units sold", "Paid orders", "Product sales (USD)", "Share (%)"]} exportRow={exportRow} />
    <details className={styles.methodology}><summary>How this report is calculated</summary><p>Based on the same demo orders as the Orders page, frozen at September 10, 2026. Dates are inclusive and use the order placement date, not the payment settlement date. Only paid, non-cancelled orders are included. Product sales exclude shipping and tax. Total collected adds those amounts back.</p><p>{report.pendingOrders} pending and {report.refundedOrders} refunded orders are excluded in this selection. Product-level order counts may overlap. Catalog edits do not change historical order prices.</p></details>
  </main>;
}
