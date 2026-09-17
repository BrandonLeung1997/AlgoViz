import type { AlgorithmMeta } from "@/lib/algorithms/types";

export const lcsMeta: AlgorithmMeta = {
  slug: "lcs",
  title: "Longest Common Subsequence",
  summary:
    "Fill a table of prefix lengths, then walk matches to reconstruct an LCS.",
  status: "ready",
  family: "dp",
  complexity: [
    { label: "Best", time: "O(mn)", space: "O(mn)" },
    { label: "Average", time: "O(mn)", space: "O(mn)" },
    { label: "Worst", time: "O(mn)", space: "O(mn)" },
  ],
  complexityNote:
    "Each dp[i][j] is the LCS length of prefixes X[:i] and Y[:j]; the table is filled row-major. Reconstruction walks match cells (diagonal) or the larger neighbor. Naive recursion is exponential because subproblems overlap. A rolling array can use O(min(m, n)) space, but that optimization is out of this visualization’s scope — only the DP table is shown.",
};
