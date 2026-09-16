import type { AlgorithmMeta } from "@/lib/algorithms/types";

export const quickSortMeta: AlgorithmMeta = {
  slug: "quick-sort",
  title: "Quick Sort",
  summary: "Partition around a pivot and recurse on both sides.",
  status: "ready",
  complexity: [
    { label: "Best", time: "O(n log n)", space: "O(log n)" },
    { label: "Average", time: "O(n log n)", space: "O(log n)" },
    { label: "Worst", time: "O(n²)", space: "O(log n)" },
  ],
  complexityNote:
    "This visualization uses a last-element (Lomuto) pivot. Balanced splits give O(n log n); already-sorted or otherwise unbalanced partitions fall to O(n²). Recursion depth is O(log n) on average (O(n) worst). Random or median-of-three pivots avoid the common worst case — not shown here.",
};
