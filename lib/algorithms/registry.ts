import type { AlgorithmMeta } from "@/lib/algorithms/types";
import { binarySearchMeta } from "@/lib/algorithms/binary-search/meta";
import { mergeSortMeta } from "@/lib/algorithms/merge-sort/meta";
import { quickSortMeta } from "@/lib/algorithms/quick-sort/meta";
import { bfsMeta } from "@/lib/algorithms/bfs/meta";
import { dfsMeta } from "@/lib/algorithms/dfs/meta";
import { dijkstraMeta } from "@/lib/algorithms/dijkstra/meta";

const topologicalSortMeta: AlgorithmMeta = {
  slug: "topological-sort",
  title: "Topological Sort",
  summary: "Order vertices of a DAG so every edge goes from earlier to later.",
  status: "coming-soon",
  family: "graphs",
  complexity: [
    { label: "Best", time: "O(V+E)", space: "O(V)" },
    { label: "Average", time: "O(V+E)", space: "O(V)" },
    { label: "Worst", time: "O(V+E)", space: "O(V)" },
  ],
  complexityNote: "Kahn’s algorithm uses a queue of in-degree-zero nodes; DFS finishing times also work.",
};

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
