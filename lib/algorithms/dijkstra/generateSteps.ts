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

export function generateDijkstraSteps(graph: Graph, source: number): Step[] {
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
  const settled = new Set<number>();
  const pq: { dist: number; node: number }[] = [];
  const dist = new Map<number, number>();
  for (const n of nodes) dist.set(n, Number.POSITIVE_INFINITY);
  const parent: Record<number, number | null> = {};
  const treeEdges: GraphEdge[] = [];
  let lastSettled: number | null = null;

  const frontierNodes = (): number[] => {
    const best = new Map<number, number>();
    for (const item of pq) {
      const prev = best.get(item.node);
      if (prev === undefined || item.dist < prev) best.set(item.node, item.dist);
    }
    return [...best.entries()]
      .sort((a, b) => a[1] - b[1] || a[0] - b[0])
      .map(([node]) => node);
  };

  const distRecord = (): Record<number, number> => {
    const out: Record<number, number> = {};
    for (const n of nodes) out[n] = dist.get(n) ?? Number.POSITIVE_INFINITY;
    return out;
  };

  const extractMin = (): { dist: number; node: number } | undefined => {
    if (pq.length === 0) return undefined;
    let best = 0;
    for (let i = 1; i < pq.length; i += 1) {
      if (pq[i]!.dist < pq[best]!.dist) best = i;
    }
    return pq.splice(best, 1)[0];
  };

  const frame = (
    current: number | null,
    relaxedEdges: GraphEdge[] = [],
    pathTarget: number | null = current,
  ): GraphFrame => {
    const target = pathTarget ?? lastSettled ?? source;
    return {
      nodes: [...nodes],
      edges: edges.map((e) => ({ ...e })),
      source,
      current,
      frontier: frontierNodes(),
      visited: [...settled],
      parent: { ...parent },
      path: reconstructPath(parent, source, target),
      treeEdges: treeEdges.map((e) => ({ ...e })),
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

  pushStep(
    "fn-def",
    `Start Dijkstra from source ${start}. Distances are path costs, not hop counts.`,
    frame(null, [], start),
  );

  dist.set(start, 0);
  pushStep(
    "init-dist",
    `Initialize dist: source ${start} is 0, every other node is ∞.`,
    frame(start, [], start),
  );

  parent[start] = null;
  pushStep(
    "init-parent",
    `Parent of ${start} is none — it is the root of the shortest-path tree.`,
    frame(start, [], start),
  );

  pq.push({ dist: 0, node: start });
  pushStep(
    "init-pq",
    `Push source ${start} into the priority queue. Extract-min always takes the unsettled node with smallest dist.`,
    frame(start, [], start),
  );

  pushStep(
    "init-settled",
    "Settled starts empty. Once a node is extracted, it is never processed again (non-negative weights).",
    frame(start, [], start),
  );

  while (pq.length > 0) {
    pushStep(
      "loop",
      `Priority queue is ${JSON.stringify(frontierNodes())} — keep extract-min until the frontier is empty.`,
      frame(null, [], lastSettled ?? start),
    );

    const extracted = extractMin();
    if (!extracted) break;
    const u = extracted.node;
    pushStep(
      "extract-min",
      `Extract-min: take node ${u} with dist ${fmtDist(extracted.dist)}.`,
      frame(u, [], u),
    );

    if (settled.has(u)) {
      pushStep(
        "skip-settled",
        `Node ${u} is already settled — skip this leftover priority-queue entry.`,
        frame(u, [], lastSettled ?? start),
      );
      continue;
    }

    settled.add(u);
    if (parent[u] !== null && parent[u] !== undefined) {
      const from = parent[u]!;
      treeEdges.push({
        from,
        to: u,
        weight: getEdgeWeight(graphView, from, u),
      });
    }
    lastSettled = u;
    pushStep(
      "mark-settled",
      u === start
        ? `Settle source ${u}. Dist 0 is final.`
        : `Settle ${u}. The shortest path from ${start} to ${u} is now final (dist ${fmtDist(dist.get(u)!)}).`,
      frame(u, [], u),
    );

    const neighbors = adj[u] ?? [];
    pushStep(
      "neighbors",
      neighbors.length === 0
        ? `Node ${u} has no outgoing edges to relax.`
        : `Relax outgoing edges of ${u}: ${neighbors.map((v) => `${v} (w=${getEdgeWeight(graphView, u, v)})`).join(", ")}.`,
      frame(u, [], u),
    );

    for (const v of neighbors) {
      const w = getEdgeWeight(graphView, u, v);
      const relaxed: GraphEdge = { from: u, to: v, weight: w };
      if (settled.has(v)) {
        pushStep(
          "relax",
          `Neighbor ${v} is already settled — skip. Non-negative weights mean its shortest path cannot improve.`,
          frame(u, [relaxed], u),
        );
        continue;
      }
      const alt = dist.get(u)! + w;
      const current = dist.get(v) ?? Number.POSITIVE_INFINITY;
      if (alt < current) {
        dist.set(v, alt);
        parent[v] = u;
        pq.push({ dist: alt, node: v });
        pushStep(
          "relax",
          `Relax ${u}→${v} (weight ${w}): dist[${v}] ${fmtDist(current)} → ${fmtDist(alt)} via ${u}. Re-push ${v} into the PQ (decrease-key).`,
          frame(u, [relaxed], v),
        );
      } else {
        pushStep(
          "relax",
          `Relax ${u}→${v} (weight ${w}): no improvement (dist[${v}] stays ${fmtDist(current)}).`,
          frame(u, [relaxed], u),
        );
      }
    }
  }

  if (lastSettled !== null && lastSettled !== start) {
    const path = reconstructPath(parent, start, lastSettled);
    const cost = dist.get(lastSettled);
    pushStep(
      "path",
      `Walk parent pointers for a shortest path ${start} → ${lastSettled}: ${path.join(" → ")} (cost ${fmtDist(cost ?? Number.POSITIVE_INFINITY)}).`,
      frame(lastSettled, [], lastSettled),
    );
  }

  const reached = [...settled].sort((a, b) => a - b);
  pushStep(
    "done",
    `Dijkstra finished. Reachable nodes: ${reached.join(", ")}. Parent pointers store shortest paths from ${start} by cost, not fewest hops (contrast with BFS).`,
    frame(null, [], lastSettled ?? start),
  );

  return steps;
}
