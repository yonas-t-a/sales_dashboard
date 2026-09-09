"use client";

import { useState, type PointerEvent } from "react";
import { visitors } from "@/data/dashboard";
import { chartColors, Legend, linePoints, smoothLine } from "./chart";
import styles from "./dashboard.module.css";

export function VisitorInsights() {
  const [monthIndex, setMonthIndex] = useState(7);
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  const series = [
    { label: "Loyal Customers", values: visitors.loyal, color: chartColors.purple },
    { label: "New Customers", values: visitors.new, color: chartColors.red },
    { label: "Unique Customers", values: visitors.unique, color: chartColors.lime },
  ];
  const marker = linePoints(visitors.new, 288, 98, 400, 26, 12)[monthIndex];
  const showTooltip = hovered || focused;
  const summary = `${visitors.months[monthIndex]}: ${series.map(({ label, values }) => `${label} ${values[monthIndex]}`).join(", ")}`;

  function trackPointer(event: PointerEvent<SVGRectElement>) {
    const svg = event.currentTarget.ownerSVGElement;
    const matrix = svg?.getScreenCTM();
    if (!svg || !matrix) return;
    // Account for responsive SVG scaling and the space around the plot.
    const point = svg.createSVGPoint();
    point.x = event.clientX;
    point.y = event.clientY;
    const { x } = point.matrixTransform(matrix.inverse());
    setMonthIndex(Math.max(0, Math.min(visitors.months.length - 1, Math.round((x - 26) / 288 * (visitors.months.length - 1)))));
    setHovered(true);
  }
  return (
    <section className={`${styles.card} ${styles.visitors}`} aria-labelledby="visitors-heading">
      <h2 id="visitors-heading">Visitor Insights</h2>
      <svg className={styles.chart} viewBox="0 0 340 146" role="group" aria-label="Monthly visitors: loyal, new, and unique customers from January to December">
        {[0, 100, 200, 300, 400].map((value) => {
          const y = 110 - value / 400 * 98;
          return <g key={value}><line x1="26" y1={y} x2="324" y2={y} className={styles.gridLine} /><text x="12" y={y + 3} textAnchor="end" className={styles.axisLabel}>{value}</text></g>;
        })}
        {series.map(({ label, values, color }) => (
          <g key={label}>
            <path d={smoothLine(linePoints(values, 288, 98, 400, 26, 12))} stroke={color} strokeWidth="2.2" fill="none" />
          </g>
        ))}
        <line x1={marker.x} x2={marker.x} y1="9" y2="111" stroke={chartColors.red} strokeWidth=".6" strokeDasharray="1 2" />
        {series.map(({ label, values, color }) => <circle key={label} cx={marker.x} cy={110 - values[monthIndex] / 400 * 98} r={showTooltip ? 3.5 : label === "New Customers" ? 4 : 0} fill={color} stroke="white" strokeWidth={showTooltip ? 1 : 0} />)}
        {visitors.months.map((month, i) => <text key={month} x={26 + i * 288 / 11} y="127" textAnchor="middle" className={styles.monthLabel}>{month}</text>)}
        <rect
          x="26" y="9" width="288" height="103" fill="transparent"
          className={styles.visitorInteraction}
          role="slider" tabIndex={0} aria-label="Visitor insights month"
          aria-valuemin={0} aria-valuemax={11} aria-valuenow={monthIndex} aria-valuetext={summary}
          onPointerEnter={trackPointer} onPointerMove={trackPointer} onPointerDown={trackPointer}
          onPointerLeave={() => setHovered(false)} onPointerCancel={() => setHovered(false)}
          onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
          onKeyDown={(event) => {
            if (["ArrowRight", "ArrowUp", "ArrowLeft", "ArrowDown", "Home", "End"].includes(event.key)) {
              event.preventDefault();
              setMonthIndex((index) => event.key === "Home" ? 0 : event.key === "End" ? 11 : Math.max(0, Math.min(11, index + (["ArrowRight", "ArrowUp"].includes(event.key) ? 1 : -1))));
            }
            if (event.key === "Escape") { setHovered(false); event.currentTarget.blur(); }
          }}
        />
        {showTooltip && (
          <g transform={`translate(${marker.x > 190 ? marker.x - 133 : marker.x + 9}, 14)`} pointerEvents="none" aria-hidden="true">
            <rect width="124" height="62" rx="5" fill="white" stroke="#e8e7f2" />
            <text x="9" y="13" fill="#171d4d" fontSize="8" fontWeight="600">{visitors.months[monthIndex]}</text>
            {series.map(({ label, values, color }, index) => <g key={label}>
              <circle cx="10" cy={25 + index * 13} r="2.5" fill={color} />
              <text x="17" y={28 + index * 13} fill="#59647c" fontSize="7">{label}</text>
              <text x="115" y={28 + index * 13} textAnchor="end" fill="#171d4d" fontSize="7" fontWeight="600">{values[monthIndex]}</text>
            </g>)}
          </g>
        )}
      </svg>
      <Legend items={series} />
    </section>
  );
}
