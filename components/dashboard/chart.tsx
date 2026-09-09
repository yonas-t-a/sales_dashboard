import type { ReactNode } from "react";
import styles from "./dashboard.module.css";

export const chartColors = { blue: "#0095ff", green: "#00df94", purple: "#a600ff", red: "#ff4052", lime: "#22df3c" };

export function Chart({ label, children, width = 340, height = 150 }: { label: string; children: ReactNode; width?: number; height?: number }) {
  return <svg className={styles.chart} viewBox={`0 0 ${width} ${height}`} role="img" aria-label={label}>{children}</svg>;
}

export function Legend({ items }: { items: { label: string; color: string; value?: string }[] }) {
  return (
    <div className={styles.legend}>
      {items.map(({ label, color, value }) => (
        <div key={label} className={value ? styles.legendWithValue : undefined}>
          <span className={styles.legendLabel}><i style={{ background: color }} />{label}</span>
          {value && <strong>{value}</strong>}
        </div>
      ))}
    </div>
  );
}

export function linePoints(values: number[], width: number, height: number, max: number, left = 0, top = 0) {
  return values.map((value, index) => ({ x: left + index * width / (values.length - 1), y: top + height - value / max * height }));
}

export function smoothLine(points: { x: number; y: number }[]) {
  return points.reduce((path, point, index) => {
    if (!index) return `M ${point.x} ${point.y}`;
    const previous = points[index - 1];
    const before = points[Math.max(0, index - 2)];
    const after = points[Math.min(points.length - 1, index + 1)];
    return `${path} C ${previous.x + (point.x - before.x) / 6} ${previous.y + (point.y - before.y) / 6}, ${point.x - (after.x - previous.x) / 6} ${point.y - (after.y - previous.y) / 6}, ${point.x} ${point.y}`;
  }, "");
}
