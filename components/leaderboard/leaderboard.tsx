"use client";

import { useMemo, useState } from "react";
import {
  Award,
  CalendarDays,
  CheckCheck,
  CircleDollarSign,
  ShoppingBag,
  Target,
  Trophy,
  TrendingUp,
} from "lucide-react";
import {
  formatCurrency,
  formatMetric,
  getSalesReps,
  leaderboardPeriods,
  rankingMetrics,
  rankSalesReps,
  salesRegions,
  type LeaderboardPeriod,
  type RankingMetric,
} from "@/data/leaderboard";
import { RepAvatar } from "./rep-avatar";
import { RankingsTable } from "./rankings-table";
import dashboardStyles from "@/components/dashboard/dashboard.module.css";
import styles from "./leaderboard.module.css";

export function Leaderboard() {
  const [period, setPeriod] = useState<LeaderboardPeriod>("month");
  const [region, setRegion] = useState("All regions");
  const [metric, setMetric] = useState<RankingMetric>("revenue");
  const reps = useMemo(
    () =>
      getSalesReps(period).filter(
        (rep) => region === "All regions" || rep.region === region,
      ),
    [period, region],
  );
  const ranked = useMemo(() => rankSalesReps(reps, metric), [reps, metric]);
  const totalRevenue = reps.reduce((total, rep) => total + rep.revenue, 0);
  const previousRevenue = reps.reduce(
    (total, rep) => total + rep.previous.revenue,
    0,
  );
  const revenueChange = (totalRevenue / previousRevenue - 1) * 100;
  const totalOrders = reps.reduce((total, rep) => total + rep.orders, 0);
  const target = reps.reduce((total, rep) => total + rep.target, 0);
  const onTarget = reps.filter((rep) => rep.revenue >= rep.target).length;
  const stats = [
    {
      label: "Team revenue",
      value: formatCurrency(totalRevenue),
      detail: `${revenueChange >= 0 ? "+" : ""}${revenueChange.toFixed(1)}% vs previous period`,
      color: "pink",
      Icon: CircleDollarSign,
    },
    {
      label: "Orders closed",
      value: totalOrders.toLocaleString("en-US"),
      detail: `Across ${reps.length} sales representatives`,
      color: "peach",
      Icon: ShoppingBag,
    },
    {
      label: "Team target achieved",
      value: `${Math.round((totalRevenue / target) * 100)}%`,
      detail: `${formatCurrency(target)} revenue target`,
      color: "green",
      Icon: Target,
    },
    {
      label: "On-target performers",
      value: `${onTarget} / ${reps.length}`,
      detail: "At or above their revenue target",
      color: "purple",
      Icon: CheckCheck,
    },
  ];

  return (
    <main
      id="main-content"
      className={`${dashboardStyles.dashboard} ${styles.page}`}
      aria-label="Sales leaderboard"
    >
      <div className={styles.pageHeader}>
        <div>
          <div className={styles.headingLine}>
            <h1>Sales leaderboard</h1>
            <span className={styles.demoBadge}>Demo data</span>
          </div>
          <p>Celebrate your top performers. Keep your team moving forward.</p>
        </div>
        <div className={styles.filters}>
          <label>
            <CalendarDays aria-hidden="true" />
            <select
              aria-label="Leaderboard period"
              value={period}
              onChange={(event) =>
                setPeriod(event.target.value as LeaderboardPeriod)
              }
            >
              {Object.entries(leaderboardPeriods).map(([key, value]) => (
                <option key={key} value={key}>
                  {value.label}
                </option>
              ))}
            </select>
          </label>
          <label>
            <select
              aria-label="Sales region"
              value={region}
              onChange={(event) => setRegion(event.target.value)}
            >
              {["All regions", ...salesRegions].map((item) => (
                <option key={item}>{item}</option>
              ))}
            </select>
          </label>
        </div>
      </div>
      <div className={styles.periodNote}>
        <span>{leaderboardPeriods[period].dates}</span>
        <span>Compared with {leaderboardPeriods[period].comparison}</span>
      </div>

      <section className={styles.stats} aria-label="Team performance summary">
        {stats.map(({ label, value, detail, color, Icon }) => (
          <article
            key={label}
            className={`${styles.statCard} ${styles[color]}`}
          >
            <span className={styles.statIcon}>
              <Icon aria-hidden="true" />
            </span>
            <span className={styles.statLabel}>{label}</span>
            <strong>{value}</strong>
            <small>{detail}</small>
          </article>
        ))}
      </section>

      <section
        className={styles.performers}
        aria-labelledby="performers-heading"
      >
        <div className={styles.sectionHeader}>
          <div>
            <h2 id="performers-heading">
              <Trophy aria-hidden="true" />
              Top performers
            </h2>
            <p>A little recognition for a big impact.</p>
          </div>
          <div className={styles.metricTabs} role="group" aria-label="Rank by">
            {Object.entries(rankingMetrics).map(([key, label]) => (
              <button
                key={key}
                aria-pressed={metric === key}
                onClick={() => setMetric(key as RankingMetric)}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
        <div className={styles.podium}>
          {ranked.slice(0, 3).map((rep, i) => (
            <article
              key={rep.id}
              className={`${styles.performer} ${i === 0 ? styles.winner : ""}`}
            >
              <div className={styles.performerTop}>
                <span className={styles.place}>
                  {i === 0 ? (
                    <Trophy aria-hidden="true" />
                  ) : (
                    <Award aria-hidden="true" />
                  )}
                  Rank #{rep.rank}
                </span>
                {i === 0 && (
                  <span className={styles.leaderBadge}>Leading the way</span>
                )}
              </div>
              <div className={styles.performerIdentity}>
                <RepAvatar rep={rep} large />
                <div>
                  <h3>{rep.name}</h3>
                  <p>{rep.region}</p>
                </div>
              </div>
              <div className={styles.performerValue}>
                <strong>{formatMetric(rep[metric], metric)}</strong>
                <span>{rankingMetrics[metric]}</span>
              </div>
              <div className={styles.performerFooter}>
                <span>
                  <TrendingUp aria-hidden="true" />
                  {rep.attainment}% of target
                </span>
                <span>{rep.orders} orders</span>
              </div>
            </article>
          ))}
        </div>
      </section>

      <RankingsTable
        key={`${period}-${region}-${metric}`}
        data={ranked}
        context={`Ranked by ${rankingMetrics[metric].toLowerCase()} · ${region} · Rank change vs previous period`}
        exportName={`dabang-leaderboard-${period}-${region.toLowerCase().replaceAll(" ", "-")}-${metric}.csv`}
      />
      <p className={styles.pageNote}>
        Demo snapshot · September 10, 2026. Revenue is shown in USD. Equal
        results share a rank; target attainment is revenue divided by the
        period’s target.
      </p>
    </main>
  );
}
