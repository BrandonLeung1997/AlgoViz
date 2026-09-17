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
  highlights.push({ index: frame.source, kind: "source" });
  if (frame.current !== null) {
    highlights.push({ index: frame.current, kind: "current" });
  }
  return highlights;
}

function fmtDist(value: number): string {
  return Number.isFinite(value) ? String(value) : "∞";
}

function fmtEdge(edge: GraphEdge): string {
  return `${edge.from}-${edge.to}:${edge.weight ?? 1}`;
}

export function generatePrimSteps(graph: Graph, source: number): Step[] {
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
  const visited = new Set<number>();
  const dist = new Map<number, number>();
  for (const n of nodes) dist.set(n, Number.POSITIVE_INFINITY);
  const parent: Record<number, number | null> = {};
  const treeEdges: GraphEdge[] = [];
  let lastAdded: number | null = null;

  const frontierNodes = (): number[] =>
    nodes.filter((n) => !visited.has(n) && Number.isFinite(dist.get(n)!));

  const distRecord = (): Record<number, number> => {
    const out: Record<number, number> = {};
    for (const n of nodes) out[n] = dist.get(n) ?? Number.POSITIVE_INFINITY;
    return out;
  };

  const pickMin = (): number | undefined => {
    let best: number | undefined;
    let bestDist = Number.POSITIVE_INFINITY;
    for (const n of nodes) {
      if (visited.has(n)) continue;
      const d = dist.get(n) ?? Number.POSITIVE_INFINITY;
      if (!Number.isFinite(d)) continue;
      if (best === undefined || d < bestDist) {
        bestDist = d;
        best = n;
      }
    }
    return best;
  };

  const frame = (
    current: number | null,
    relaxedEdges: GraphEdge[] = [],
  ): GraphFrame => ({
    nodes: [...nodes],
    edges: edges.map((e) => ({ ...e })),
    source: nodes.includes(source) ? source : (nodes[0] ?? source),
    current,
    frontier: frontierNodes(),
    visited: [...visited].sort((a, b) => a - b),
    parent: { ...parent },
    path: [],
    treeEdges: treeEdges.map((e) => ({ ...e })),
    relaxedEdges: relaxedEdges.map((e) => ({ ...e })),
    dist: distRecord(),
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
      source,
      current: null,
      frontier: [],
      visited: [],
      parent: {},
      path: [],
      treeEdges: [],
      relaxedEdges: [],
      dist: {},
    });
    return steps;
  }

  const start = nodes.includes(source) ? source : nodes[0]!;

  pushStep(
    "fn-def",
    `Start Prim from source ${start}. Grow an MST by repeatedly adding the cheapest edge out of the tree — not a global edge sort like Kruskal.`,
    frame(null),
  );

  dist.set(start, 0);
  parent[start] = null;
  pushStep(
    "init",
    `Initialize Prim keys: dist[${start}] = 0, every other node is ∞. dist is the cheapest known edge into a node, not path-from-source cost.`,
    frame(start),
  );

  while (true) {
    const u = pickMin();
    if (u === undefined) break;

    const incoming = parent[u];
    const pickEdge =
      incoming !== null && incoming !== undefined
        ? [{ from: incoming, to: u, weight: dist.get(u)! }]
        : [];
    pushStep(
      "pick",
      `Pick remaining node ${u} with smallest Prim key (scan). dist[${u}] = ${fmtDist(dist.get(u)!)}.`,
      frame(u, pickEdge),
    );

    visited.add(u);
    if (incoming !== null && incoming !== undefined) {
      treeEdges.push({
        from: incoming,
        to: u,
        weight: dist.get(u)!,
      });
      lastAdded = u;
      const total = treeEdges.reduce((s, e) => s + (e.weight ?? 1), 0);
      pushStep(
        "add-edge",
        `Add ${fmtEdge(treeEdges[treeEdges.length - 1]!)} to the MST (weight so far ${total}).`,
        frame(u, pickEdge),
      );
    } else {
      lastAdded = u;
      pushStep(
        "add-edge",
        `Add source ${u} to the tree. No incoming MST edge.`,
        frame(u),
      );
    }

    const neighbors = adj[u] ?? [];
    for (const v of neighbors) {
      if (visited.has(v)) continue;
      const w = getEdgeWeight(graphView, u, v);
      const relaxed: GraphEdge = { from: u, to: v, weight: w };
      const currentKey = dist.get(v) ?? Number.POSITIVE_INFINITY;
      if (w < currentKey) {
        dist.set(v, w);
        parent[v] = u;
        pushStep(
          "consider",
          `Consider cut edge ${fmtEdge(relaxed)}: Prim key dist[${v}] ${fmtDist(currentKey)} → ${w} via ${u}.`,
          frame(u, [relaxed]),
        );
      } else {
        pushStep(
          "consider",
          `Consider cut edge ${fmtEdge(relaxed)}: no improvement (dist[${v}] stays ${fmtDist(currentKey)}).`,
          frame(u, [relaxed]),
        );
      }
    }
  }

  const reached = [...visited].sort((a, b) => a - b);
  const total = treeEdges.reduce((s, e) => s + (e.weight ?? 1), 0);
  const missed = nodes.filter((n) => !visited.has(n));
  pushStep(
    "done",
    missed.length > 0
      ? `Done. MST of source ${start}'s component: nodes ${reached.join(", ")} totaling weight ${total}. Unreached ${missed.join(", ")} stay outside the tree — Prim does not invent edges.`
      : nodes.length === 1
        ? `Done. A single node is a trivial MST with no edges.`
        : `Done. MST grown from ${start} has ${treeEdges.length} edges totaling weight ${total}.`,
    frame(lastAdded),
  );

  return steps;
}
