import type { AlgorithmMeta } from "@/lib/algorithms/types";

export const kruskalMeta: AlgorithmMeta = {
  slug: "kruskal",
  title: "Kruskal",
  summary:
    "Build a minimum spanning forest by sorting undirected edges and skipping any edge that would form a cycle.",
  status: "ready",
  family: "graphs",
  complexity: [
    { label: "Best", time: "O(E log E)", space: "O(V)" },
    { label: "Average", time: "O(E log E)", space: "O(V)" },
    { label: "Worst", time: "O(E log E)", space: "O(V)" },
  ],
  complexityNote:
    "O(E log E) from sorting edges; Union-Find with path compression and union-by-rank is almost O(E). Extra space O(V) for parent/rank. Undirected weighted graphs only. A disconnected input yields a forest of MSTs — this viz does not invent edges.",
};
