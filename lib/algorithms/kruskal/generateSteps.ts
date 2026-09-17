import type { Graph, GraphEdge, GraphFrame, Highlight, Step } from "@/lib/algorithms/types";
import { getEdgeWeight } from "@/lib/algorithms/types";

function cloneAdj(adj: Graph["adj"]): Record<number, number[]> {
  const cloned: Record<number, number[]> = {};
  for (const [key, neighbors] of Object.entries(adj)) {
    cloned[Number(key)] = [...neighbors];
  }
  return cloned;
}

function uniqueEdges(graph: Graph): GraphEdge[] {
  const edges: GraphEdge[] = [];
  const seen = new Set<string>();
  for (const [key, neighbors] of Object.entries(graph.adj)) {
    const u = Number(key);
    for (const v of neighbors) {
      const from = Math.min(u, v);
      const to = Math.max(u, v);
      const id = `${from}-${to}`;
      if (seen.has(id)) continue;
      seen.add(id);
      edges.push({ from, to, weight: getEdgeWeight(graph, from, to) });
    }
  }
  return edges;
}

function graphHighlights(frame: GraphFrame): Highlight[] {
  const highlights: Highlight[] = [];
  for (const node of frame.visited) {
    highlights.push({ index: node, kind: "visited" });
  }
  for (const node of frame.frontier) {
    highlights.push({ index: node, kind: "frontier" });
  }
  if (frame.nodes.includes(frame.source)) {
    highlights.push({ index: frame.source, kind: "source" });
  }
  if (frame.current !== null) {
    highlights.push({ index: frame.current, kind: "current" });
  }
  return highlights;
}

function fmtEdge(edge: GraphEdge): string {
  return `${edge.from}-${edge.to}:${edge.weight ?? 1}`;
}

export function generateKruskalSteps(graph: Graph): Step[] {
  const adj = cloneAdj(graph.adj);
  const weights = graph.weights ? { ...graph.weights } : undefined;
  const graphView: Graph = { nodes: [...graph.nodes], adj, weights };
  const nodeSet = new Set<number>(graph.nodes);
  for (const key of Object.keys(adj)) nodeSet.add(Number(key));
  for (const neighbors of Object.values(adj)) {
    for (const v of neighbors) nodeSet.add(v);
  }
  const nodes = [...nodeSet].sort((a, b) => a - b);
  graphView.nodes = nodes;
  const edges = uniqueEdges(graphView);

  const steps: Step[] = [];
  const parentUf: Record<number, number> = {};
  const rank: Record<number, number> = {};
  const mstParent: Record<number, number | null> = {};
  const treeEdges: GraphEdge[] = [];
  const inMst = new Set<number>();
  // Dummy source: Kruskal has no start vertex. Use a non-node so GraphCanvas
  // does not paint a false “source”.
  const dummySource = -1;

  for (const n of nodes) {
    parentUf[n] = n;
    rank[n] = 0;
  }

  const find = (x: number): number => {
    let root = x;
    while (parentUf[root] !== root) root = parentUf[root]!;
    let cur = x;
    while (cur !== root) {
      const next = parentUf[cur]!;
      parentUf[cur] = root;
      cur = next;
    }
    return root;
  };

  const union = (a: number, b: number): void => {
    const ra = find(a);
    const rb = find(b);
    if (ra === rb) return;
    if ((rank[ra] ?? 0) < (rank[rb] ?? 0)) {
      parentUf[ra] = rb;
    } else if ((rank[rb] ?? 0) < (rank[ra] ?? 0)) {
      parentUf[rb] = ra;
    } else {
      parentUf[rb] = ra;
      rank[ra] = (rank[ra] ?? 0) + 1;
    }
  };

  const frame = (
    current: number | null,
    relaxedEdges: GraphEdge[] = [],
  ): GraphFrame => ({
    nodes: [...nodes],
    edges: edges.map((e) => ({ ...e })),
    source: dummySource,
    current,
    frontier: [],
    visited: [...inMst].sort((a, b) => a - b),
    parent: { ...mstParent },
    path: [],
    treeEdges: treeEdges.map((e) => ({ ...e })),
    relaxedEdges: relaxedEdges.map((e) => ({ ...e })),
  });

  const pushStep = (
    codeLineId: string,
    explanation: string,
    graphFrame: GraphFrame,
  ) => {
    steps.push({
      array: [],
      highlights: graphHighlights(graphFrame),
      graph: graphFrame,
      codeLineId,
      explanation,
    });
  };

  if (nodes.length === 0) {
    pushStep("done", "Empty graph — nothing to span.", {
      nodes: [],
      edges: [],
      source: dummySource,
      current: null,
      frontier: [],
      visited: [],
      parent: {},
      path: [],
      treeEdges: [],
      relaxedEdges: [],
    });
    return steps;
  }

  pushStep(
    "fn-def",
    "Start Kruskal: grow a minimum spanning forest by scanning edges from lightest to heaviest. No source vertex.",
    frame(null),
  );

  const sorted = [...edges].sort((a, b) => {
    const wa = a.weight ?? 1;
    const wb = b.weight ?? 1;
    if (wa !== wb) return wa - wb;
    if (a.from !== b.from) return a.from - b.from;
    return a.to - b.to;
  });

  pushStep(
    "sort-edges",
    sorted.length === 0
      ? "No edges to sort. Isolated nodes are a forest of one-node trees."
      : `Sort edges by weight: ${sorted.map(fmtEdge).join(", ")}.`,
    frame(null),
  );

  for (const edge of sorted) {
    const w = edge.weight ?? 1;
    const considering: GraphEdge = { from: edge.from, to: edge.to, weight: w };
    pushStep(
      "consider",
      `Consider edge ${fmtEdge(considering)}. Accept it only if its ends are in different components.`,
      frame(edge.from, [considering]),
    );

    if (find(edge.from) === find(edge.to)) {
      pushStep(
        "skip-cycle",
        `Skip ${fmtEdge(considering)} — ${edge.from} and ${edge.to} are already connected, so this edge would form a cycle.`,
        frame(edge.from, [considering]),
      );
      continue;
    }

    const uVisited = inMst.has(edge.from);
    const vVisited = inMst.has(edge.to);
    if (!uVisited && !vVisited) {
      mstParent[edge.from] = null;
      mstParent[edge.to] = edge.from;
    } else if (uVisited && !vVisited) {
      mstParent[edge.to] = edge.from;
    } else if (vVisited && !uVisited) {
      mstParent[edge.from] = edge.to;
    }
    union(edge.from, edge.to);
    inMst.add(edge.from);
    inMst.add(edge.to);
    treeEdges.push({ from: edge.from, to: edge.to, weight: w });
    pushStep(
      "union",
      `Union ${edge.from} and ${edge.to}. Add ${fmtEdge(considering)} to the MST (weight so far ${treeEdges.reduce((s, e) => s + (e.weight ?? 1), 0)}).`,
      frame(edge.from, [considering]),
    );
  }

  const n = nodes.length;
  const accepted = treeEdges.length;
  const components = n - accepted;
  const total = treeEdges.reduce((s, e) => s + (e.weight ?? 1), 0);
  pushStep(
    "done",
    n === 1
      ? "Done. A single node is a trivial MST with no edges."
      : accepted === 0
        ? `Done. No edges were accepted — a forest of ${n} isolated nodes.`
        : components > 1
          ? `Done. MST forest has ${accepted} edges (n−c = ${n}−${components}) totaling weight ${total}. Disconnected graphs stay a forest; no edges are invented.`
          : `Done. MST has ${accepted} edges totaling weight ${total}.`,
    frame(null),
  );

  return steps;
}
