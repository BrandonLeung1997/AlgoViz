import type { AlgorithmMeta } from "@/lib/algorithms/types";

export const selectionSortMeta: AlgorithmMeta = {
  slug: "selection-sort",
  title: "Selection Sort",
  summary:
    "Each pass scans the unsorted suffix for its minimum, then swaps that value into the next sorted prefix slot.",
  status: "ready",
  family: "sorting",
  complexity: [
    { label: "Best", time: "O(n²)", space: "O(1)" },
    { label: "Average", time: "O(n²)", space: "O(1)" },
    { label: "Worst", time: "O(n²)", space: "O(1)" },
  ],
  complexityNote:
    "Selection sort always scans the remaining suffix — there is no early exit like bubble sort. Every pass does Θ(n − i) comparisons, so best, average, and worst cases are all O(n²). Extra memory is O(1).",
};
