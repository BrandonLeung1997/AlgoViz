import type { AlgorithmMeta } from "@/lib/algorithms/types";

export const dfsMeta: AlgorithmMeta = {
  slug: "dfs",
  title: "DFS",
  summary:
    "Explore as far as possible along each branch before backtracking — a stack, not shortest paths.",
  status: "ready",
  family: "graphs",
  complexity: [
    { label: "Best", time: "O(V+E)", space: "O(V)" },
    { label: "Average", time: "O(V+E)", space: "O(V)" },
    { label: "Worst", time: "O(V+E)", space: "O(V)" },
  ],
  complexityNote:
    "Each vertex and edge is processed once. A stack is the frontier (BFS uses a queue). Parent pointers form a DFS tree — not unweighted shortest paths.",
};
