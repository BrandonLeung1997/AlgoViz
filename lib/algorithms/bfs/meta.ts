import type { AlgorithmMeta } from "@/lib/algorithms/types";

export const bfsMeta: AlgorithmMeta = {
  slug: "bfs",
  title: "BFS",
  summary:
    "Explore layer by layer with a queue — unweighted shortest paths from a source.",
  status: "ready",
  family: "graphs",
  complexity: [
    { label: "Best", time: "O(V+E)", space: "O(V)" },
    { label: "Average", time: "O(V+E)", space: "O(V)" },
    { label: "Worst", time: "O(V+E)", space: "O(V)" },
  ],
  complexityNote:
    "Each vertex and edge is processed once. A queue is the frontier (DFS would use a stack). Parent pointers reconstruct unweighted shortest paths.",
};
