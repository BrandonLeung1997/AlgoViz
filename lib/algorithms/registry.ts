import type { AlgorithmMeta } from "@/lib/algorithms/types";
import { binarySearchMeta } from "@/lib/algorithms/binary-search/meta";
import { linearSearchMeta } from "@/lib/algorithms/linear-search/meta";
import { mergeSortMeta } from "@/lib/algorithms/merge-sort/meta";
import { quickSortMeta } from "@/lib/algorithms/quick-sort/meta";
import { bubbleSortMeta } from "@/lib/algorithms/bubble-sort/meta";
import { insertionSortMeta } from "@/lib/algorithms/insertion-sort/meta";
import { selectionSortMeta } from "@/lib/algorithms/selection-sort/meta";
import { heapSortMeta } from "@/lib/algorithms/heap-sort/meta";
import { bfsMeta } from "@/lib/algorithms/bfs/meta";
import { dfsMeta } from "@/lib/algorithms/dfs/meta";
import { dijkstraMeta } from "@/lib/algorithms/dijkstra/meta";
import { bellmanFordMeta } from "@/lib/algorithms/bellman-ford/meta";
import { kruskalMeta } from "@/lib/algorithms/kruskal/meta";
import { primMeta } from "@/lib/algorithms/prim/meta";
import { topologicalSortMeta } from "@/lib/algorithms/topological-sort/meta";
import { lcsMeta } from "@/lib/algorithms/lcs/meta";
import { editDistanceMeta } from "@/lib/algorithms/edit-distance/meta";

export const algorithms: AlgorithmMeta[] = [
  mergeSortMeta,
  quickSortMeta,
  bubbleSortMeta,
  insertionSortMeta,
  selectionSortMeta,
  heapSortMeta,
  linearSearchMeta,
  binarySearchMeta,
  bfsMeta,
  dfsMeta,
  dijkstraMeta,
  bellmanFordMeta,
  kruskalMeta,
  primMeta,
  topologicalSortMeta,
  lcsMeta,
  editDistanceMeta,
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
