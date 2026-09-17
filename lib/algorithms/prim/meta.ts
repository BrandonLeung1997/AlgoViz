import type { AlgorithmMeta } from "@/lib/algorithms/types";

export const primMeta: AlgorithmMeta = {
  slug: "prim",
  title: "Prim",
  summary:
    "Grow a minimum spanning tree from a start vertex by repeatedly adding the cheapest edge that leaves the tree.",
  status: "ready",
  family: "graphs",
  complexity: [
    { label: "Best", time: "O(V²)", space: "O(V)" },
    { label: "Average", time: "O(V²)", space: "O(V)" },
    { label: "Worst", time: "O(V²)", space: "O(V)" },
  ],
  complexityNote:
    "This visualization scans remaining vertices for the smallest Prim key, so O(V²) time and O(V) extra space. A binary heap is O(E log V). Kruskal sorts every undirected edge globally; Prim grows from a source and only spans that component.",
};
