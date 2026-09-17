import type { AlgorithmMeta } from "@/lib/algorithms/types";

export const coinChangeMeta: AlgorithmMeta = {
  slug: "coin-change",
  title: "Coin Change",
  summary:
    "Fill a coins × amount table: skip a denomination, or take it again from the same row, then reconstruct the fewest coins — or show impossible.",
  status: "ready",
  family: "dp",
  complexity: [
    { label: "Best", time: "O(n·amount)", space: "O(n·amount)" },
    { label: "Average", time: "O(n·amount)", space: "O(n·amount)" },
    { label: "Worst", time: "O(n·amount)", space: "O(n·amount)" },
  ],
  complexityNote:
    "dp[i][a] is the fewest coins using the first i denominations to make amount a (∞ if unreachable). Unlike 0/1 knapsack, a coin may be reused — taking coin c reads dp[i][a−c] on the same row. Greedy (US coins) is not this visualization. A 1D rolling array uses O(amount) space, but only the 2D table is shown.",
};
