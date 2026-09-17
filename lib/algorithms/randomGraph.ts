import {
  MAX_GRAPH_NODES,
  undirectedEdgeKey,
  type Graph,
} from "@/lib/algorithms/types";

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

/** Weighted teaching graph: fewest hops 0→2 is not the cheapest path. */
export const DEFAULT_DIJKSTRA_GRAPH: Graph = {
  nodes: [0, 1, 2, 3, 4],
  adj: {
    0: [1, 2, 4],
    1: [0, 2, 3],
    2: [0, 1, 3],
    3: [1, 2, 4],
    4: [0, 3],
  },
  weights: {
    "0-1": 1,
    "0-2": 10,
    "0-4": 2,
    "1-2": 1,
    "1-3": 8,
    "2-3": 2,
    "3-4": 1,
  },
};

export function randomGraph(
  nodeCount = 7,
  options: { weights?: boolean } = {},
): Graph {
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

  if (!options.weights) return { nodes, adj };

  const weights: Record<string, number> = {};
  for (const u of nodes) {
    for (const v of adj[u] ?? []) {
      if (u >= v) continue;
      weights[undirectedEdgeKey(u, v)] = 1 + Math.floor(Math.random() * 9);
    }
  }
  return { nodes, adj, weights };
}

export function randomWeightedGraph(nodeCount = 7): Graph {
  return randomGraph(nodeCount, { weights: true });
}

/** Classic teaching DAG: 0→1, 0→2, 1→3, 2→3. */
export const DEFAULT_TOPO_GRAPH: Graph = {
  nodes: [0, 1, 2, 3],
  adj: {
    0: [1, 2],
    1: [3],
    2: [3],
    3: [],
  },
};

/** Directed acyclic graph only — never emits a cycle. */
export function randomDag(nodeCount = 7): Graph {
  const n = Math.min(Math.max(nodeCount, 2), MAX_GRAPH_NODES);
  const nodes = Array.from({ length: n }, (_, i) => i);
  const adj: Record<number, number[]> = {};
  for (const node of nodes) adj[node] = [];

  const add = (from: number, to: number) => {
    if (from === to) return;
    if (!adj[from]!.includes(to)) adj[from]!.push(to);
  };

  const order = [...nodes];
  for (let i = order.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [order[i], order[j]] = [order[j]!, order[i]!];
  }

  for (let i = 1; i < order.length; i += 1) {
    if (i === 1 || Math.random() < 0.7) {
      const parent = order[Math.floor(Math.random() * i)]!;
      add(parent, order[i]!);
    }
  }

  const extra = Math.max(1, Math.floor(n / 3));
  for (let i = 0; i < extra; i += 1) {
    const a = Math.floor(Math.random() * n);
    const b = Math.floor(Math.random() * n);
    if (a === b) continue;
    const earlier = Math.min(a, b);
    const later = Math.max(a, b);
    add(order[earlier]!, order[later]!);
  }

  return { nodes, adj };
}
