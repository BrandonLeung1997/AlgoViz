import type { AlgorithmMeta } from "@/lib/algorithms/types";
import { binarySearchMeta } from "@/lib/algorithms/binary-search/meta";
import { mergeSortMeta } from "@/lib/algorithms/merge-sort/meta";
import { quickSortMeta } from "@/lib/algorithms/quick-sort/meta";
import { bubbleSortMeta } from "@/lib/algorithms/bubble-sort/meta";
import { insertionSortMeta } from "@/lib/algorithms/insertion-sort/meta";
import { bfsMeta } from "@/lib/algorithms/bfs/meta";
import { dfsMeta } from "@/lib/algorithms/dfs/meta";
import { dijkstraMeta } from "@/lib/algorithms/dijkstra/meta";
import { topologicalSortMeta } from "@/lib/algorithms/topological-sort/meta";
import { lcsMeta } from "@/lib/algorithms/lcs/meta";

export const algorithms: AlgorithmMeta[] = [
  mergeSortMeta,
  quickSortMeta,
  bubbleSortMeta,
  insertionSortMeta,
  binarySearchMeta,
  bfsMeta,
  dfsMeta,
  dijkstraMeta,
  topologicalSortMeta,
  lcsMeta,
];

export const FAMILY_ORDER = ["sorting", "searching", "graphs", "dp"] as const;

export const FAMILY_TITLES: Record<(typeof FAMILY_ORDER)[number], string> = {
  sorting: "Sorting",
  searching: "Searching",
  graphs: "Graphs",
  dp: "Dynamic Programming",
};

export function getAlgorithm(slug: string): AlgorithmMeta | undefined {
  return algorithms.find((a) => a.slug === slug);
}
