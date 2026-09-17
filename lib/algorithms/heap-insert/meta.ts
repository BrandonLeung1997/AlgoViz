import type { AlgorithmMeta } from "@/lib/algorithms/types";

export const heapInsertMeta: AlgorithmMeta = {
  slug: "heap-insert",
  title: "Heap Insert",
  summary:
    "Append a value to a max-heap and sift it up until every parent is ≥ its children.",
  status: "ready",
  family: "heaps",
  complexity: [
    { label: "Best", time: "O(1)", space: "O(1)" },
    { label: "Average", time: "O(log n)", space: "O(1)" },
    { label: "Worst", time: "O(log n)", space: "O(1)" },
  ],
  complexityNote:
    "Insert appends at the next leaf and sifts up. Height is log n, so time is O(log n) with O(1) extra memory. Heapify and extract-max sift down instead; this page only inserts.",
};
