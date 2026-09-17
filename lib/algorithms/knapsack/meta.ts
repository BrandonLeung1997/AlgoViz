import type { AlgorithmMeta } from "@/lib/algorithms/types";

export const knapsackMeta: AlgorithmMeta = {
  slug: "knapsack",
  title: "0/1 Knapsack",
  summary:
    "Fill an items × capacity table: skip the item, or take it once if it fits, then reconstruct one best subset.",
  status: "ready",
  family: "dp",
  complexity: [
    { label: "Best", time: "O(nW)", space: "O(nW)" },
    { label: "Average", time: "O(nW)", space: "O(nW)" },
    { label: "Worst", time: "O(nW)", space: "O(nW)" },
  ],
  complexityNote:
    "dp[i][w] is the best value using the first i items with capacity w. Each item is considered once (0/1), not unbounded knapsack. Reconstruction walks back from dp[n][W], taking an item when the value differs from the skip cell above. A rolling array can use O(W) space, but that optimization is out of this visualization’s scope — only the DP table is shown.",
};
