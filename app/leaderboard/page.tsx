import type { Metadata } from "next";
import { Leaderboard } from "@/components/leaderboard/leaderboard";

export const metadata: Metadata = { title: "Leaderboard | Dabang" };

export default function LeaderboardPage() {
  return <Leaderboard />;
}
