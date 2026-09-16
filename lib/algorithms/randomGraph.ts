import { MAX_GRAPH_NODES, type Graph } from "@/lib/algorithms/types";

export const DEFAULT_BFS_GRAPH: Graph = {
  nodes: [0, 1, 2, 3, 4, 5],
  adj: {
    0: [1, 2],
    1: [0, 3, 4],
    2: [0, 5],
    3: [1],
    4: [1],
    5: [2],
  },
};

export function randomGraph(nodeCount = 7): Graph {
  const n = Math.min(Math.max(nodeCount, 2), MAX_GRAPH_NODES);
  const nodes = Array.from({ length: n }, (_, i) => i);
  const adj: Record<number, number[]> = {};
  for (const node of nodes) adj[node] = [];

  const add = (a: number, b: number) => {
    if (a === b) return;
    if (!adj[a]!.includes(b)) adj[a]!.push(b);
    if (!adj[b]!.includes(a)) adj[b]!.push(a);
  };

  const order = [...nodes];
  for (let i = order.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [order[i], order[j]] = [order[j]!, order[i]!];
  }
  for (let i = 1; i < order.length; i += 1) {
    const parent = order[Math.floor(Math.random() * i)]!;
    add(order[i]!, parent);
  }

  const extra = Math.max(1, Math.floor(n / 3));
  for (let i = 0; i < extra; i += 1) {
    const a = Math.floor(Math.random() * n);
    const b = Math.floor(Math.random() * n);
    add(a, b);
  }

  return { nodes, adj };
}
