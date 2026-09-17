import type { AlgorithmMeta } from "@/lib/algorithms/types";

export const linearSearchMeta: AlgorithmMeta = {
  slug: "linear-search",
  title: "Linear Search",
  summary: "Scan an array left to right and stop on the first match.",
  status: "ready",
  family: "searching",
  complexity: [
    { label: "Best", time: "O(1)", space: "O(1)" },
    { label: "Average", time: "O(n)", space: "O(1)" },
    { label: "Worst", time: "O(n)", space: "O(1)" },
  ],
  complexityNote:
    "Unlike binary search, the array does not need to be sorted. Best case hits index 0 in O(1); average and worst cases scan Θ(n) elements. Extra memory is O(1).",
};
