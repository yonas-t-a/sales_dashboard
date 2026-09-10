export type RankingMetric = "revenue" | "orders" | "attainment";
export type SalesRep = {
  id: string;
  name: string;
  role: string;
  region: string;
  color: string;
  revenue: number;
  orders: number;
  target: number;
  attainment: number;
  previous: Record<RankingMetric, number>;
};

export const rankingMetrics: Record<RankingMetric, string> = {
  revenue: "Revenue", orders: "Orders", attainment: "Target attainment",
};
export const leaderboardPeriods = {
  month: { label: "This month", dates: "Sep 1–10, 2026", comparison: "Aug 1–10, 2026", factor: 1 },
  week: { label: "This week", dates: "Sep 7–10, 2026", comparison: "Aug 31–Sep 3, 2026", factor: .36 },
  lastMonth: { label: "Last month", dates: "Aug 1–31, 2026", comparison: "Jul 1–31, 2026", factor: 2.7 },
} as const;
export type LeaderboardPeriod = keyof typeof leaderboardPeriods;

const reps = [
  { name: "Olivia Rhye", role: "Senior Sales Executive", region: "North America", color: "purple", revenue: 42850, orders: 128, target: 35000, previous: 36800 },
  { name: "Phoenix Baker", role: "Account Executive", region: "Europe", color: "blue", revenue: 38200, orders: 112, target: 32000, previous: 39900 },
  { name: "Lana Steiner", role: "Sales Executive", region: "Asia Pacific", color: "pink", revenue: 35600, orders: 135, target: 28000, previous: 29700 },
  { name: "Demi Wilkinson", role: "Account Executive", region: "Europe", color: "peach", revenue: 31900, orders: 96, target: 30000, previous: 33400 },
  { name: "Drew Cano", role: "Sales Executive", region: "North America", color: "green", revenue: 28750, orders: 102, target: 30000, previous: 27100 },
  { name: "Natali Craig", role: "Senior Sales Executive", region: "Asia Pacific", color: "purple", revenue: 26400, orders: 87, target: 25000, previous: 24800 },
  { name: "Orlando Diggs", role: "Account Executive", region: "North America", color: "blue", revenue: 24300, orders: 78, target: 28000, previous: 25400 },
  { name: "Andi Lane", role: "Sales Executive", region: "Europe", color: "pink", revenue: 22800, orders: 91, target: 24000, previous: 19700 },
  { name: "Kate Morrison", role: "Account Executive", region: "Asia Pacific", color: "peach", revenue: 21450, orders: 69, target: 22000, previous: 23100 },
  { name: "Alex Morgan", role: "Sales Executive", region: "North America", color: "green", revenue: 19800, orders: 73, target: 22000, previous: 18400 },
  { name: "Sam Wilson", role: "Account Executive", region: "Europe", color: "purple", revenue: 18200, orders: 62, target: 20000, previous: 19000 },
  { name: "Jamie Chen", role: "Sales Executive", region: "Asia Pacific", color: "blue", revenue: 16900, orders: 58, target: 18000, previous: 14800 },
];

export const salesRegions = [...new Set(reps.map(({ region }) => region))];

// Deterministic demo snapshots, frozen at September 10, 2026. No live CRM is connected.
export function getSalesReps(period: LeaderboardPeriod): SalesRep[] {
  const { factor } = leaderboardPeriods[period];
  return reps.map((rep, i) => {
    const variation = period === "week" ? .8 + (i % 4) * .15 : period === "lastMonth" ? .92 + (i % 3) * .08 : 1;
    const revenue = Math.round(rep.revenue * factor * variation);
    const orders = Math.round(rep.orders * factor * variation);
    const target = Math.round(rep.target * factor);
    const previousRevenue = Math.round(rep.previous * factor);
    return {
      ...rep, id: `rep-${i + 1}`, revenue, orders, target,
      attainment: Math.round(revenue / target * 100),
      previous: { revenue: previousRevenue, orders: Math.round(rep.orders * rep.previous / rep.revenue * factor), attainment: Math.round(previousRevenue / target * 100) },
    };
  });
}

export type RankedRep = SalesRep & { rank: number; movement: number };

export function rankSalesReps(reps: SalesRep[], metric: RankingMetric): RankedRep[] {
  const previous = [...reps].sort((a, b) => b.previous[metric] - a.previous[metric] || a.name.localeCompare(b.name));
  const sorted = [...reps].sort((a, b) => b[metric] - a[metric] || a.name.localeCompare(b.name));
  return sorted.map((rep) => {
    const rank = sorted.findIndex((item) => item[metric] === rep[metric]) + 1;
    const previousRank = previous.findIndex((item) => item.previous[metric] === rep.previous[metric]) + 1;
    return { ...rep, rank, movement: previousRank - rank };
  });
}

export const formatCurrency = (value: number) => new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(value);
export const formatMetric = (value: number, metric: RankingMetric) => metric === "revenue" ? formatCurrency(value) : metric === "attainment" ? `${value}%` : value.toLocaleString("en-US");
