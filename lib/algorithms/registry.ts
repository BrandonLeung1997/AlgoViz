import type { AlgorithmMeta } from "@/lib/algorithms/types";
import { binarySearchMeta } from "@/lib/algorithms/binary-search/meta";
import { mergeSortMeta } from "@/lib/algorithms/merge-sort/meta";
import { quickSortMeta } from "@/lib/algorithms/quick-sort/meta";

export const algorithms: AlgorithmMeta[] = [
  mergeSortMeta,
  binarySearchMeta,
  quickSortMeta,
];

export function getAlgorithm(slug: string): AlgorithmMeta | undefined {
  return algorithms.find((a) => a.slug === slug);
}
