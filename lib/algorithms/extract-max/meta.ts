import type { AlgorithmMeta } from "@/lib/algorithms/types";

export const extractMaxMeta: AlgorithmMeta = {
  slug: "extract-max",
  title: "Extract Max",
  summary:
    "Remove the root of a max-heap, then sift the new root down until every parent is ≥ its children.",
  status: "ready",
  family: "heaps",
  complexity: [
    { label: "Best", time: "O(1)", space: "O(1)" },
    { label: "Average", time: "O(log n)", space: "O(1)" },
    { label: "Worst", time: "O(log n)", space: "O(1)" },
  ],
  complexityNote:
    "Extract-max swaps the root with the last leaf, pops it, and sifts down. Height is log n, so time is O(log n) with O(1) extra memory. Heap Sort repeats this n times and leaves a sorted suffix; this page extracts once and shrinks the heap.",
};
