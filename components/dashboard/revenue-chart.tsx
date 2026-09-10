import { revenue } from "@/data/dashboard";
import { Chart, chartColors, Legend } from "./chart";
import styles from "./dashboard.module.css";

export function RevenueChart() {
  return (
    <section
      className={`${styles.card} ${styles.revenue}`}
      aria-labelledby="revenue-heading"
    >
      <h2 id="revenue-heading">Total Revenue</h2>
      <Chart
        label="Online and offline sales by day of the week, in dollars"
        width={360}
        height={146}
      >
        {[0, 5000, 10000, 15000, 20000, 25000].map((value) => {
          const y = 115 - (value / 25000) * 96;
          return (
            <g key={value}>
              <line
                x1="24"
                x2="357"
                y1={y}
                y2={y}
                className={styles.gridLine}
              />
              <text x="1" y={y + 3} className={styles.axisLabel}>
                {value ? `${value / 1000}k` : "0"}
              </text>
            </g>
          );
        })}
        {revenue.map(({ day, online, offline }, i) => (
          <g key={day}>
            <rect
              x={38 + i * 47.5}
              y={115 - (online / 25000) * 96}
              width="7"
              height={(online / 25000) * 96}
              rx="1"
              fill={chartColors.blue}
            >
              <title>{`${day} · Online sales: $${online.toLocaleString("en-US")}`}</title>
            </rect>
            <rect
              x={47 + i * 47.5}
              y={115 - (offline / 25000) * 96}
              width="7"
              height={(offline / 25000) * 96}
              rx="1"
              fill={chartColors.green}
            >
              <title>{`${day} · Offline sales: $${offline.toLocaleString("en-US")}`}</title>
            </rect>
            <text
              x={46 + i * 47.5}
              y="132"
              textAnchor="middle"
              className={styles.axisLabel}
            >
              {day}
            </text>
          </g>
        ))}
      </Chart>
      <Legend
        items={[
          { label: "Online Sales", color: chartColors.blue },
          { label: "Offline Sales", color: chartColors.green },
        ]}
      />
    </section>
  );
}
