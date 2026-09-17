import type { AlgorithmMeta } from "@/lib/algorithms/types";
import { binarySearchMeta } from "@/lib/algorithms/binary-search/meta";
import { mergeSortMeta } from "@/lib/algorithms/merge-sort/meta";
import { quickSortMeta } from "@/lib/algorithms/quick-sort/meta";
import { bfsMeta } from "@/lib/algorithms/bfs/meta";
import { dfsMeta } from "@/lib/algorithms/dfs/meta";
import { dijkstraMeta } from "@/lib/algorithms/dijkstra/meta";
import { topologicalSortMeta } from "@/lib/algorithms/topological-sort/meta";

export const algorithms: AlgorithmMeta[] = [
  mergeSortMeta,
  quickSortMeta,
  binarySearchMeta,
  bfsMeta,
  dfsMeta,
  dijkstraMeta,
  topologicalSortMeta,
];

export const FAMILY_ORDER = ["sorting", "searching", "graphs"] as const;

export const FAMILY_TITLES: Record<(typeof FAMILY_ORDER)[number], string> = {
  sorting: "Sorting",
  searching: "Searching",
  graphs: "Graphs",
};

export function getAlgorithm(slug: string): AlgorithmMeta | undefined {
  return algorithms.find((a) => a.slug === slug);
}
