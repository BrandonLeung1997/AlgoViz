import type { AlgorithmMeta } from "@/lib/algorithms/types";
import { binarySearchMeta } from "@/lib/algorithms/binary-search/meta";
import { mergeSortMeta } from "@/lib/algorithms/merge-sort/meta";

export const algorithms: AlgorithmMeta[] = [
  mergeSortMeta,
  binarySearchMeta,
  {
    slug: "quick-sort",
    title: "Quick Sort",
    summary: "Partition around a pivot and recurse on both sides.",
    status: "coming-soon",
    complexity: [
      { label: "Best", time: "O(n log n)", space: "O(log n)" },
      { label: "Average", time: "O(n log n)", space: "O(log n)" },
      { label: "Worst", time: "O(n²)", space: "O(log n)" },
    ],
    complexityNote: "Coming soon.",
  },
];

export function getAlgorithm(slug: string): AlgorithmMeta | undefined {
  return algorithms.find((a) => a.slug === slug);
}
