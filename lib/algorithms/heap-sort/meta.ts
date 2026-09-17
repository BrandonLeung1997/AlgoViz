import type { AlgorithmMeta } from "@/lib/algorithms/types";

export const heapSortMeta: AlgorithmMeta = {
  slug: "heap-sort",
  title: "Heap Sort",
  summary:
    "Build an in-place max-heap, then repeatedly extract the root into a growing sorted suffix.",
  status: "ready",
  family: "sorting",
  complexity: [
    { label: "Best", time: "O(n log n)", space: "O(1)" },
    { label: "Average", time: "O(n log n)", space: "O(1)" },
    { label: "Worst", time: "O(n log n)", space: "O(1)" },
  ],
  complexityNote:
    "This visualization uses a 0-based max-heap. Building the heap is O(n), but the n extracts each cost O(log n), so best, average, and worst cases are all O(n log n). Extra memory is O(1).",
};
