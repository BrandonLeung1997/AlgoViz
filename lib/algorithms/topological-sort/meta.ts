import type { AlgorithmMeta } from "@/lib/algorithms/types";

export const topologicalSortMeta: AlgorithmMeta = {
  slug: "topological-sort",
  title: "Topological Sort",
  summary:
    "Order vertices of a DAG so every directed edge goes from earlier to later — Kahn’s algorithm.",
  status: "ready",
  family: "graphs",
  complexity: [
    { label: "Best", time: "O(V+E)", space: "O(V)" },
    { label: "Average", time: "O(V+E)", space: "O(V)" },
    { label: "Worst", time: "O(V+E)", space: "O(V)" },
  ],
  complexityNote:
    "Kahn’s algorithm uses a queue of in-degree-zero nodes; DFS finishing times also work. Only DAGs have a valid topological order.",
};
