import type { AlgorithmMeta } from "@/lib/algorithms/types";

export const binarySearchMeta: AlgorithmMeta = {
  slug: "binary-search",
  title: "Binary Search",
  summary: "Find a target in a sorted array by halving the search space.",
  status: "ready",
  family: "searching",
  complexity: [
    { label: "Best", time: "O(1)", space: "O(1)" },
    { label: "Average", time: "O(log n)", space: "O(1)" },
    { label: "Worst", time: "O(log n)", space: "O(1)" },
  ],
  complexityNote:
    "Each probe halves the remaining window, so the search depth is log n; only a few index pointers are stored.",
};
