import assert from "node:assert/strict";
import test from "node:test";
import { getSalesReps, rankSalesReps, leaderboardPeriods } from "../data/leaderboard.ts";

test("rankings use the selected metric", () => {
  const reps = getSalesReps("month");
  assert.equal(rankSalesReps(reps, "revenue")[0].name, "Olivia Rhye");
  assert.equal(rankSalesReps(reps, "orders")[0].name, "Lana Steiner");
  assert.equal(rankSalesReps(reps, "attainment")[0].name, "Lana Steiner");
});

test("region ranks and movement are calculated within the selected team", () => {
  const europe = getSalesReps("month").filter((rep) => rep.region === "Europe");
  const ranked = rankSalesReps(europe, "revenue");
  assert.deepEqual(ranked.map((rep) => rep.rank), [1, 2, 3, 4]);
  assert.equal(ranked[0].name, "Phoenix Baker");
  assert.equal(ranked[0].movement, 0);
});

test("equal results share competition ranks and previous-rank comparisons", () => {
  const reps = getSalesReps("month").slice(0, 3).map((rep, i) => ({ ...rep, revenue: i < 2 ? 100 : 50, previous: { ...rep.previous, revenue: i === 2 ? 120 : 80 } }));
  const ranked = rankSalesReps(reps, "revenue");
  assert.deepEqual(ranked.map((rep) => rep.rank), [1, 1, 3]);
  assert.deepEqual(ranked.map((rep) => rep.movement), [1, 1, -2]);
});

test("snapshots keep attainment consistent with revenue and targets", () => {
  for (const period of Object.keys(leaderboardPeriods)) {
    const reps = getSalesReps(period);
    assert.equal(new Set(reps.map((rep) => rep.id)).size, reps.length);
    for (const rep of reps) {
      assert.ok(rep.target > 0);
      assert.equal(rep.attainment, Math.round(rep.revenue / rep.target * 100));
    }
  }
  assert.notEqual(getSalesReps("month")[0].revenue, getSalesReps("week")[0].revenue);
});
