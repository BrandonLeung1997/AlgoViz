import type { AlgorithmMeta } from "@/lib/algorithms/types";

export const heapifyMeta: AlgorithmMeta = {
  slug: "heapify",
  title: "Heapify",
  summary:
    "Build a max-heap in place by sifting down from the last parent to the root.",
  status: "ready",
  family: "heaps",
  complexity: [
    { label: "Best", time: "O(n)", space: "O(1)" },
    { label: "Average", time: "O(n)", space: "O(1)" },
    { label: "Worst", time: "O(n)", space: "O(1)" },
  ],
  complexityNote:
    "This is Floyd’s bottom-up build-heap: sift-down from the last parent (n/2 − 1) to the root. Most nodes sit near the leaves, so the total work is O(n) — not O(n log n) from n inserts. Extra memory is O(1). Heap Sort uses this build, then extracts the root n times; this page only builds the heap.",
};
