import type { AlgorithmMeta } from "@/lib/algorithms/types";

export const insertionSortMeta: AlgorithmMeta = {
  slug: "insertion-sort",
  title: "Insertion Sort",
  summary:
    "Grow a sorted prefix by inserting each next value into its place, shifting larger elements right.",
  status: "ready",
  family: "sorting",
  complexity: [
    { label: "Best", time: "O(n)", space: "O(1)" },
    { label: "Average", time: "O(n²)", space: "O(1)" },
    { label: "Worst", time: "O(n²)", space: "O(1)" },
  ],
  complexityNote:
    "This visualization shifts in place (not a separate list). Each new key walks left through the sorted prefix. Already-sorted input compares once per key and never shifts, which is why the best case is O(n).",
};
