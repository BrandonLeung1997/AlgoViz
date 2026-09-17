import type { AlgorithmMeta } from "@/lib/algorithms/types";

export const editDistanceMeta: AlgorithmMeta = {
  slug: "edit-distance",
  title: "Edit Distance",
  summary:
    "Fill a table of prefix distances: match copies the diagonal, otherwise take 1 plus the cheapest insert, delete, or replace.",
  status: "ready",
  family: "dp",
  complexity: [
    { label: "Best", time: "O(mn)", space: "O(mn)" },
    { label: "Average", time: "O(mn)", space: "O(mn)" },
    { label: "Worst", time: "O(mn)", space: "O(mn)" },
  ],
  complexityNote:
    "Each dp[i][j] is the Levenshtein distance of prefixes X[:i] and Y[:j]; the table is filled row-major. Insert, delete, and replace each cost 1 — this visualization does not include transpose (Damerau). Naive recursion is exponential because subproblems overlap. A rolling array can use O(min(m, n)) space, but that optimization is out of this visualization’s scope — only the DP table is shown.",
};
