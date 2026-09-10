import { targets } from "@/data/dashboard";
import { Chart } from "./chart";
import styles from "./dashboard.module.css";

export function TargetChart() {
  return (
    <section
      className={`${styles.card} ${styles.targets}`}
      aria-labelledby="target-heading"
    >
      <h2 id="target-heading">Target vs Reality</h2>
      <Chart
        label="Monthly actual sales compared with targets, January through July"
        width={210}
        height={114}
      >
        {targets.map(({ month, reality, target }, i) => (
          <g key={month}>
            <rect
              x={i * 30 + 1}
              y={96 - reality * 0.78}
              width="9"
              height={reality * 0.78}
              rx="2"
              fill="#48b693"
            >
              <title>{`${month} · Reality: ${reality}`}</title>
            </rect>
            <rect
              x={i * 30 + 12}
              y={96 - target * 0.78}
              width="9"
              height={target * 0.78}
              rx="2"
              fill="#ffd000"
            >
              <title>{`${month} · Target: ${target}`}</title>
            </rect>
            <text
              x={i * 30 + 11}
              y="109"
              textAnchor="middle"
              className={styles.axisLabel}
            >
              {month}
            </text>
          </g>
        ))}
      </Chart>
      <div className={styles.targetLegend}>
        <TargetRow
          title="Reality Sales"
          subtitle="Global"
          value="8.823"
          color="green"
        />
        <TargetRow
          title="Target Sales"
          subtitle="Commercial"
          value="12.122"
          color="orange"
        />
      </div>
    </section>
  );
}

function TargetRow({
  title,
  subtitle,
  value,
  color,
}: {
  title: string;
  subtitle: string;
  value: string;
  color: "green" | "orange";
}) {
  return (
    <div className={`${styles.targetRow} ${styles[color]}`}>
      <span className={styles.targetIcon}>
        <svg
          width="12"
          height="12"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          aria-hidden="true"
        >
          <rect x="5" y="7" width="14" height="14" rx="2" />
          <path d="M9 8V5a3 3 0 0 1 6 0v3M9 12h6" />
        </svg>
      </span>
      <span>
        <strong>{title}</strong>
        <small>{subtitle}</small>
      </span>
      <span className={styles.targetValue}>{value}</span>
    </div>
  );
}
