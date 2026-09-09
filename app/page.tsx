import { SalesSummary } from "@/components/dashboard/sales-summary";
import { VisitorInsights } from "@/components/dashboard/visitor-insights";
import { RevenueChart } from "@/components/dashboard/revenue-chart";
import { SatisfactionChart } from "@/components/dashboard/satisfaction-chart";
import { TargetChart } from "@/components/dashboard/target-chart";
import { TopProducts } from "@/components/dashboard/top-products";
import { CountryMap } from "@/components/dashboard/country-map";
import { VolumeChart } from "@/components/dashboard/volume-chart";
import styles from "@/components/dashboard/dashboard.module.css";

export default function Home() {
  return (
    <main id="main-content" className={styles.dashboard} aria-label="Dashboard">
      <div className={styles.overview}><SalesSummary /><VisitorInsights /></div>
      <div className={styles.details}>
        <RevenueChart /><SatisfactionChart /><TargetChart />
        <TopProducts /><CountryMap /><VolumeChart />
      </div>
    </main>
  );
}
