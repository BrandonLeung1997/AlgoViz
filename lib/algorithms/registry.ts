import type { AlgorithmMeta } from "@/lib/algorithms/types";
import { mergeSortMeta } from "@/lib/algorithms/merge-sort/meta";

export const algorithms: AlgorithmMeta[] = [
  mergeSortMeta,
  {
    slug: "binary-search",
    title: "Binary Search",
    summary: "Find a target in a sorted array by halving the search space.",
    status: "coming-soon",
    complexity: [
      { label: "Best", time: "O(1)", space: "O(1)" },
      { label: "Average", time: "O(log n)", space: "O(1)" },
      { label: "Worst", time: "O(log n)", space: "O(1)" },
    ],
    complexityNote: "Coming soon.",
  },
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
