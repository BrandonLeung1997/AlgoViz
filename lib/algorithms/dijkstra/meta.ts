import type { AlgorithmMeta } from "@/lib/algorithms/types";

export const dijkstraMeta: AlgorithmMeta = {
  slug: "dijkstra",
  title: "Dijkstra",
  summary:
    "Find cheapest paths on weighted graphs with non-negative edges — a priority queue, not a BFS queue.",
  status: "ready",
  family: "graphs",
  complexity: [
    { label: "Best", time: "O((V+E) log V)", space: "O(V)" },
    { label: "Average", time: "O((V+E) log V)", space: "O(V)" },
    { label: "Worst", time: "O((V+E) log V)", space: "O(V)" },
  ],
  complexityNote:
    "A priority queue orders unsettled nodes by dist (BFS uses a FIFO queue). Non-negative weights only — BFS is the unweighted special case. Parent pointers reconstruct cheapest paths, not fewest hops.",
};
