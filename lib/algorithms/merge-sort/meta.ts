import type { AlgorithmMeta } from "@/lib/algorithms/types";

export const mergeSortMeta: AlgorithmMeta = {
  slug: "merge-sort",
  title: "Merge Sort",
  summary:
    "Divide the array, sort each half, then merge — stable O(n log n) sorting.",
  status: "ready",
  complexity: [
    { label: "Best", time: "O(n log n)", space: "O(n)" },
    { label: "Average", time: "O(n log n)", space: "O(n)" },
    { label: "Worst", time: "O(n log n)", space: "O(n)" },
  ],
  complexityNote:
    "Divide depth is log n; each level does O(n) merge work; merging needs an auxiliary array.",
};
