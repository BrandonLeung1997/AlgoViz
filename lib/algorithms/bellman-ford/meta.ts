import type { AlgorithmMeta } from "@/lib/algorithms/types";

export const bellmanFordMeta: AlgorithmMeta = {
  slug: "bellman-ford",
  title: "Bellman–Ford",
  summary:
    "Find cheapest paths on directed graphs that may have negative edges — relax every edge |V|−1 times, then look for a negative cycle.",
  status: "ready",
  family: "graphs",
  complexity: [
    { label: "Best", time: "O(VE)", space: "O(V)" },
    { label: "Average", time: "O(VE)", space: "O(V)" },
    { label: "Worst", time: "O(VE)", space: "O(V)" },
  ],
  complexityNote:
    "Works with negative edges; Dijkstra does not. A negative cycle reachable from the source means shortest paths are not well-defined.",
};
