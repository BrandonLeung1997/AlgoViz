import type { Graph, GraphEdge, GraphFrame, Highlight, Step } from "@/lib/algorithms/types";
import { getDirectedEdgeWeight } from "@/lib/algorithms/types";

function cloneAdj(adj: Graph["adj"]): Record<number, number[]> {
  const cloned: Record<number, number[]> = {};
  for (const [key, neighbors] of Object.entries(adj)) {
    cloned[Number(key)] = [...neighbors];
  }
  return cloned;
}

function directedEdges(graph: Graph): GraphEdge[] {
  const edges: GraphEdge[] = [];
  const seen = new Set<string>();
  for (const [key, neighbors] of Object.entries(graph.adj)) {
    const u = Number(key);
    for (const v of neighbors) {
      const id = `${u}>${v}`;
      if (seen.has(id)) continue;
      seen.add(id);
      edges.push({ from: u, to: v, weight: getDirectedEdgeWeight(graph, u, v) });
    }
  }
  return edges;
}

function reconstructPath(
  parent: Record<number, number | null>,
  source: number,
  target: number,
): number[] {
  if (!(target in parent)) return [];
  const path: number[] = [];
  const guard = new Set<number>();
  let cur: number | null = target;
  while (cur !== null) {
    if (guard.has(cur)) break;
    guard.add(cur);
    path.push(cur);
    if (cur === source) break;
    cur = parent[cur] ?? null;
  }
  path.reverse();
  return path[0] === source ? path : [];
}

function treeFromParent(
  parent: Record<number, number | null>,
  graph: Graph,
): GraphEdge[] {
  const edges: GraphEdge[] = [];
  for (const [childKey, from] of Object.entries(parent)) {
    if (from === null || from === undefined) continue;
    const to = Number(childKey);
    edges.push({
      from,
      to,
      weight: getDirectedEdgeWeight(graph, from, to),
    });
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

export function generateBellmanFordSteps(graph: Graph, source: number): Step[] {
  const adj = cloneAdj(graph.adj);
  const directedWeights = graph.directedWeights
    ? { ...graph.directedWeights }
    : undefined;
  const graphView: Graph = { nodes: [...graph.nodes], adj, directedWeights };
  const nodeSet = new Set<number>(graph.nodes);
  for (const key of Object.keys(adj)) nodeSet.add(Number(key));
  for (const neighbors of Object.values(adj)) {
    for (const v of neighbors) nodeSet.add(v);
  }
  const nodes = [...nodeSet].sort((a, b) => a - b);
  graphView.nodes = nodes;
  const edges = directedEdges(graphView);

  const steps: Step[] = [];
  const dist = new Map<number, number>();
  for (const n of nodes) dist.set(n, Number.POSITIVE_INFINITY);
  const parent: Record<number, number | null> = {};
  let lastTarget: number | null = null;
  let src = source;

  const distRecord = (): Record<number, number> => {
    const out: Record<number, number> = {};
    for (const n of nodes) out[n] = dist.get(n) ?? Number.POSITIVE_INFINITY;
    return out;
  };

  const reachable = (): number[] =>
    nodes.filter((n) => Number.isFinite(dist.get(n) ?? Number.POSITIVE_INFINITY));

  const frame = (
    current: number | null,
    relaxedEdges: GraphEdge[] = [],
    pathTarget: number | null = current,
  ): GraphFrame => {
    const target = pathTarget ?? lastTarget ?? src;
    return {
      nodes: [...nodes],
      edges: edges.map((e) => ({ ...e })),
      source: src,
      current,
      frontier: [],
      visited: reachable(),
      parent: { ...parent },
      path: reconstructPath(parent, src, target),
      treeEdges: treeFromParent(parent, graphView),
      relaxedEdges: relaxedEdges.map((e) => ({ ...e })),
      dist: distRecord(),
    };
  };

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
    pushStep("done", "Empty graph — nothing to search.", {
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
  src = start;

  pushStep(
    "fn-def",
    `Start Bellman–Ford from source ${start}. Distances may use negative edges; Dijkstra cannot.`,
    frame(null, [], start),
  );

  dist.set(start, 0);
  parent[start] = null;
  lastTarget = start;
  pushStep(
    "init",
    `Initialize dist: source ${start} is 0, every other node is ∞. Parent of ${start} is none.`,
    frame(start, [], start),
  );

  const passes = Math.max(0, nodes.length - 1);
  for (let pass = 1; pass <= passes; pass += 1) {
    for (const edge of edges) {
      const u = edge.from;
      const v = edge.to;
      const w = edge.weight ?? getDirectedEdgeWeight(graphView, u, v);
      const du = dist.get(u) ?? Number.POSITIVE_INFINITY;
      if (!Number.isFinite(du)) continue;
      const relaxed: GraphEdge = { from: u, to: v, weight: w };
      const current = dist.get(v) ?? Number.POSITIVE_INFINITY;
      pushStep(
        "relax",
        `Pass ${pass}: relax ${u}→${v} (weight ${w}). dist[${u}]=${fmtDist(du)}, dist[${v}]=${fmtDist(current)}.`,
        frame(u, [relaxed], lastTarget ?? start),
      );
      const alt = du + w;
      if (alt < current) {
        dist.set(v, alt);
        parent[v] = u;
        lastTarget = v;
        pushStep(
          "update",
          `Update: dist[${v}] ${fmtDist(current)} → ${fmtDist(alt)} via ${u}.`,
          frame(u, [relaxed], v),
        );
      }
    }
    pushStep(
      "pass-end",
      `End of pass ${pass} of ${passes} (|V|−1). A cheapest path using at most ${pass} edges is now known, if one exists.`,
      frame(null, [], lastTarget ?? start),
    );
  }

  for (const edge of edges) {
    const u = edge.from;
    const v = edge.to;
    const w = edge.weight ?? getDirectedEdgeWeight(graphView, u, v);
    const du = dist.get(u) ?? Number.POSITIVE_INFINITY;
    if (!Number.isFinite(du)) continue;
    const current = dist.get(v) ?? Number.POSITIVE_INFINITY;
    if (du + w < current) {
      const relaxed: GraphEdge = { from: u, to: v, weight: w };
      pushStep(
        "neg-cycle",
        `Negative cycle reachable from ${start}: ${u}→${v} (weight ${w}) still improves dist[${v}]. Shortest paths are not well-defined.`,
        frame(u, [relaxed], v),
      );
      return steps;
    }
  }

  const reached = reachable();
  pushStep(
    "done",
    `Bellman–Ford finished. Reachable nodes: ${reached.join(", ") || "none"}. Parent pointers store shortest paths from ${start}.`,
    frame(null, [], lastTarget ?? start),
  );

  return steps;
}
