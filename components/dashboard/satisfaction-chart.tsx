"use client";

import { useState, type PointerEvent } from "react";
import { satisfaction } from "@/data/dashboard";
import { chartColors, Legend, linePoints, smoothLine } from "./chart";
import styles from "./dashboard.module.css";

export function SatisfactionChart() {
  const [period, setPeriod] = useState(3);
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  const series = [
    {
      id: "satisfaction-last",
      label: "Last Month",
      values: satisfaction.lastMonth,
      color: chartColors.blue,
    },
    {
      id: "satisfaction-this",
      label: "This Month",
      values: satisfaction.thisMonth,
      color: chartColors.green,
    },
  ];
  const active = hovered || focused;
  const markerX = 4 + (period * 232) / 6;
  const summary = `Period ${period + 1}: ${series.map(({ label, values }) => `${label} ${values[period]}`).join(", ")}`;

  function trackPointer(event: PointerEvent<SVGRectElement>) {
    const svg = event.currentTarget.ownerSVGElement;
    const matrix = svg?.getScreenCTM();
    if (!svg || !matrix) return;
    const point = svg.createSVGPoint();
    point.x = event.clientX;
    point.y = event.clientY;
    const { x } = point.matrixTransform(matrix.inverse());
    setPeriod(Math.max(0, Math.min(6, Math.round(((x - 4) / 232) * 6))));
    setHovered(true);
  }
  return (
    <section
      className={`${styles.card} ${styles.satisfaction}`}
      aria-labelledby="satisfaction-heading"
    >
      <h2 id="satisfaction-heading">Customer Satisfaction</h2>
      <svg
        className={styles.chart}
        viewBox="0 0 240 132"
        role="group"
        aria-label="Customer satisfaction comparison across seven periods"
      >
        <defs>
          {series.map(({ id, color }) => (
            <linearGradient key={id} id={id} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={color} stopOpacity=".25" />
              <stop offset="100%" stopColor={color} stopOpacity="0" />
            </linearGradient>
          ))}
        </defs>
        {series
          .slice()
          .reverse()
          .map(({ id, values, color }) => {
            const points = linePoints(values, 232, 105, 100, 4, 7);
            const line = smoothLine(points);
            return (
              <g key={id}>
                <path d={`${line} L 236 118 L 4 118 Z`} fill={`url(#${id})`} />
                <path d={line} fill="none" stroke={color} strokeWidth="1.3" />
                {points.map(({ x, y }, i) => (
                  <circle key={i} cx={x} cy={y} r="2.3" fill={color}>
                    <title>{`${id === "satisfaction-last" ? "Last month" : "This month"} · Period ${i + 1}: ${values[i]}`}</title>
                  </circle>
                ))}
              </g>
            );
          })}
        {active && (
          <g pointerEvents="none" aria-hidden="true">
            <line
              x1={markerX}
              x2={markerX}
              y1="7"
              y2="118"
              stroke={chartColors.blue}
              strokeWidth=".7"
              strokeDasharray="2 2"
            />
            {series.map(({ id, values, color }) => (
              <circle
                key={id}
                cx={markerX}
                cy={112 - (values[period] / 100) * 105}
                r="3.5"
                fill={color}
                stroke="white"
                strokeWidth="1"
              />
            ))}
          </g>
        )}
        <rect
          x="4"
          y="7"
          width="232"
          height="111"
          fill="transparent"
          className={styles.visitorInteraction}
          role="slider"
          tabIndex={0}
          aria-label="Customer satisfaction period"
          aria-valuemin={1}
          aria-valuemax={7}
          aria-valuenow={period + 1}
          aria-valuetext={summary}
          onPointerEnter={trackPointer}
          onPointerMove={trackPointer}
          onPointerDown={trackPointer}
          onPointerLeave={() => setHovered(false)}
          onPointerCancel={() => setHovered(false)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          onKeyDown={(event) => {
            if (
              [
                "ArrowRight",
                "ArrowUp",
                "ArrowLeft",
                "ArrowDown",
                "Home",
                "End",
              ].includes(event.key)
            ) {
              event.preventDefault();
              setPeriod((index) =>
                event.key === "Home"
                  ? 0
                  : event.key === "End"
                    ? 6
                    : Math.max(
                        0,
                        Math.min(
                          6,
                          index +
                            (["ArrowRight", "ArrowUp"].includes(event.key)
                              ? 1
                              : -1),
                        ),
                      ),
              );
            }
            if (event.key === "Escape") {
              setHovered(false);
              event.currentTarget.blur();
            }
          }}
        />
        {active && (
          <g
            transform={`translate(${markerX > 120 ? markerX - 112 : markerX + 8}, 10)`}
            pointerEvents="none"
            aria-hidden="true"
          >
            <rect
              width="104"
              height="49"
              rx="5"
              fill="white"
              stroke="#e8e7f2"
            />
            <text
              x="9"
              y="13"
              fill="#171d4d"
              fontSize="8"
              fontWeight="600"
            >{`Period ${period + 1}`}</text>
            {series.map(({ label, values, color }, index) => (
              <g key={label}>
                <circle cx="10" cy={25 + index * 13} r="2.5" fill={color} />
                <text x="17" y={28 + index * 13} fill="#59647c" fontSize="7">
                  {label}
                </text>
                <text
                  x="95"
                  y={28 + index * 13}
                  textAnchor="end"
                  fill="#171d4d"
                  fontSize="7"
                  fontWeight="600"
                >
                  {values[period]}
                </text>
              </g>
            ))}
          </g>
        )}
      </svg>
      <div className={styles.chartFooter}>
        <Legend
          items={[
            { label: "Last Month", color: chartColors.blue, value: "$3,004" },
            { label: "This Month", color: chartColors.green, value: "$4,504" },
          ]}
        />
      </div>
    </section>
  );
}
