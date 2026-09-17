import type { AlgorithmMeta } from "@/lib/algorithms/types";

export const bubbleSortMeta: AlgorithmMeta = {
  slug: "bubble-sort",
  title: "Bubble Sort",
  summary: "Repeatedly swap adjacent out-of-order pairs until the array is sorted.",
  status: "ready",
  family: "sorting",
  complexity: [
    { label: "Best", time: "O(n)", space: "O(1)" },
    { label: "Average", time: "O(n²)", space: "O(1)" },
    { label: "Worst", time: "O(n²)", space: "O(1)" },
  ],
  complexityNote:
    "This visualization is the adjacent-swap version. Each pass bubbles the next largest value to the end. If a pass does no swaps, the rest is already sorted and we stop — that early exit is why the best case is O(n).",
};
