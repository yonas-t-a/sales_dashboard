import { volume } from "@/data/dashboard";
import { Chart, chartColors, Legend } from "./chart";
import styles from "./dashboard.module.css";

export function VolumeChart() {
  return (
    <section className={`${styles.card} ${styles.volume}`} aria-labelledby="volume-heading">
      <h2 id="volume-heading">Volume vs Service Level</h2>
      <Chart label="Volume and services across six periods" width={210} height={135}>
        {volume.map((item, i) => <g key={i}>
          <rect x={18 + i * 32} y={123 - item.volume * .85} width="7" height={item.volume * .85} rx="1" fill={chartColors.blue}><title>{`Period ${i + 1} · Volume: ${item.volume}`}</title></rect>
          <rect x={18 + i * 32} y={123 - item.services * .85} width="7" height={item.services * .85} rx="1" fill={chartColors.green}><title>{`Period ${i + 1} · Services: ${item.services}`}</title></rect>
        </g>)}
      </Chart>
      <div className={styles.chartFooter}><Legend items={[{ label: "Volume", color: chartColors.blue, value: "1,135" }, { label: "Services", color: chartColors.green, value: "635" }]} /></div>
    </section>
  );
}
