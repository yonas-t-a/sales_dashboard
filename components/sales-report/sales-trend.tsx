"use client";
import { useState, type PointerEvent } from "react";
import type { ReportDay } from "@/data/sales-report";
import { formatMoney, formatOrderDate } from "@/data/orders";
import styles from "./sales-report.module.css";

export function SalesTrend({ days }: { days: ReportDay[] }) {
  const [metric, setMetric] = useState<"salesCents" | "orders">("salesCents");
  const [selected, setSelected] = useState<number | null>(null);
  const max = Math.max(1, ...days.map((d) => d[metric]));
  const index = Math.min(selected ?? 0, days.length - 1);
  const x = (i: number) => 44 + i * 490 / Math.max(1, days.length - 1);
  const y = (v: number) => 160 - v / max * 122;
  const path = days.map((d, i) => `${i ? "L" : "M"}${x(i)},${y(d[metric])}`).join(" ");
  const valueLabel = (v: number) => metric === "salesCents" ? formatMoney(v) : `${v} orders`;
  function track(event: PointerEvent<SVGRectElement>) {
    const svg = event.currentTarget.ownerSVGElement, matrix = svg?.getScreenCTM();
    if (!svg || !matrix) return;
    const p = svg.createSVGPoint(); p.x = event.clientX; p.y = event.clientY;
    setSelected(Math.max(0, Math.min(days.length - 1, Math.round((p.matrixTransform(matrix.inverse()).x - 44) / 490 * (days.length - 1)))));
  }
  return <section className={styles.panel} aria-labelledby="sales-trend-heading">
    <div className={styles.panelHeader}><div><h2 id="sales-trend-heading">Sales overview</h2><p>Daily performance from paid orders</p></div><div className={styles.tabs} role="group" aria-label="Chart metric"><button aria-pressed={metric === "salesCents"} onClick={() => setMetric("salesCents")}>Sales</button><button aria-pressed={metric === "orders"} onClick={() => setMetric("orders")}>Orders</button></div></div>
    <svg className={styles.trend} viewBox="0 0 560 200" role="group" aria-label={`Daily ${metric === "salesCents" ? "product sales" : "paid orders"}`}>
      <defs><linearGradient id="report-sales-fill" x1="0" y1="0" x2="0" y2="1"><stop stopColor="#6159f7" stopOpacity=".2" /><stop offset="1" stopColor="#6159f7" stopOpacity=".01" /></linearGradient></defs>
      {[0, .25, .5, .75, 1].map((f) => <g key={f}><line x1="44" x2="534" y1={y(max * f)} y2={y(max * f)} stroke="#f0f1f7" /><text x="36" y={y(max * f) + 3} textAnchor="end" fill="#929cb6" fontSize="8">{metric === "salesCents" ? `$${Math.round(max * f / 100)}` : (max * f).toLocaleString("en-US", { maximumFractionDigits: 1 })}</text></g>)}
      <path d={`${path} L${x(days.length - 1)},160 L44,160 Z`} fill="url(#report-sales-fill)" /><path d={path} fill="none" stroke="#6159f7" strokeWidth="2.2" strokeLinejoin="round" />
      {days.map((d, i) => <g key={d.date}><circle cx={x(i)} cy={y(d[metric])} r="2.5" fill="#6159f7" stroke="white" strokeWidth="1" />{(i % Math.max(1, Math.ceil(days.length / 6)) === 0 || i === days.length - 1) && <text x={x(i)} y="181" textAnchor="middle" fill="#929cb6" fontSize="8">{d.date.slice(5).replace("-", "/")}</text>}</g>)}
      {selected !== null && <g pointerEvents="none"><line x1={x(index)} x2={x(index)} y1="30" y2="160" stroke="#a29af5" strokeDasharray="3 3" /><circle cx={x(index)} cy={y(days[index][metric])} r="4" fill="#6159f7" stroke="white" /></g>}
      <rect x="44" y="30" width="490" height="132" fill="transparent" className={styles.interaction} role="slider" tabIndex={0} aria-label="Sales report date" aria-valuemin={1} aria-valuemax={days.length} aria-valuenow={index + 1} aria-valuetext={`${formatOrderDate(days[index].date)}: ${valueLabel(days[index][metric])}`} onPointerMove={track} onPointerDown={track} onPointerLeave={() => setSelected(null)} onFocus={() => setSelected(0)} onBlur={() => setSelected(null)} onKeyDown={(e) => {
        if (["ArrowLeft", "ArrowRight", "Home", "End"].includes(e.key)) { e.preventDefault(); setSelected(e.key === "Home" ? 0 : e.key === "End" ? days.length - 1 : Math.max(0, Math.min(days.length - 1, index + (e.key === "ArrowRight" ? 1 : -1)))); }
        if (e.key === "Escape") e.currentTarget.blur();
      }} />
      {selected !== null && <g transform={`translate(${Math.min(410, Math.max(44, x(index) - 60))}, 3)`} pointerEvents="none" aria-hidden="true"><rect width="124" height="31" rx="5" fill="white" stroke="#e6e3f5" /><text x="8" y="12" fontSize="8" fill="#8991a9">{formatOrderDate(days[index].date)}</text><text x="8" y="24" fontSize="9" fontWeight="600" fill="#6159f7">{valueLabel(days[index][metric])}</text></g>}
    </svg>
    <p className={styles.chartCaption}><i />{metric === "salesCents" ? "Product sales · excludes shipping and tax" : "Paid orders · excludes pending and refunded orders"}</p>
  </section>;
}
