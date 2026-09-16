import type { Graph, GraphEdge, GraphFrame, Highlight, Step } from "@/lib/algorithms/types";

function cloneAdj(adj: Graph["adj"]): Record<number, number[]> {
  const cloned: Record<number, number[]> = {};
  for (const [key, neighbors] of Object.entries(adj)) {
    cloned[Number(key)] = [...neighbors];
  }
  return cloned;
}

function uniqueEdges(adj: Record<number, number[]>): GraphEdge[] {
  const edges: GraphEdge[] = [];
  const seen = new Set<string>();
  for (const [key, neighbors] of Object.entries(adj)) {
    const u = Number(key);
    for (const v of neighbors) {
      const from = Math.min(u, v);
      const to = Math.max(u, v);
      const id = `${from}-${to}`;
      if (seen.has(id)) continue;
      seen.add(id);
      edges.push({ from, to });
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

function graphHighlights(
  frame: GraphFrame,
): Highlight[] {
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

export function generateBfsSteps(graph: Graph, source: number): Step[] {
  const adj = cloneAdj(graph.adj);
  const nodeSet = new Set<number>(graph.nodes);
  for (const key of Object.keys(adj)) nodeSet.add(Number(key));
  for (const neighbors of Object.values(adj)) {
    for (const v of neighbors) nodeSet.add(v);
  }
  const nodes = [...nodeSet].sort((a, b) => a - b);
  const edges = uniqueEdges(adj);

  const steps: Step[] = [];
  const visited = new Set<number>();
  const queue: number[] = [];
  const parent: Record<number, number | null> = {};
  const treeEdges: GraphEdge[] = [];
  let lastDiscovered: number | null = null;

  const frame = (
    current: number | null,
    relaxedEdges: GraphEdge[] = [],
    pathTarget: number | null = current,
  ): GraphFrame => {
    const target = pathTarget ?? lastDiscovered ?? source;
    return {
      nodes: [...nodes],
      edges: edges.map((e) => ({ ...e })),
      source,
      current,
      frontier: [...queue],
      visited: [...visited],
      parent: { ...parent },
      path: reconstructPath(parent, source, target),
      treeEdges: treeEdges.map((e) => ({ ...e })),
      relaxedEdges: relaxedEdges.map((e) => ({ ...e })),
    };
  };

  const push = (codeLineId: string, explanation: string, graphFrame: GraphFrame) => {
    steps.push({
      array: [],
      highlights: graphHighlights(graphFrame),
      graph: graphFrame,
      codeLineId,
      explanation,
    });
  };

  if (nodes.length === 0) {
    push("done", "Empty graph — nothing to search.", {
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
    });
    return steps;
  }

  const start = nodes.includes(source) ? source : nodes[0]!;

  push(
    "fn-def",
    `Start BFS from source ${start}.`,
    frame(null, [], start),
  );

  visited.add(start);
  push(
    "init-visited",
    `Mark source ${start} as visited so it is never enqueued again.`,
    frame(start, [], start),
  );

  queue.push(start);
  push(
    "init-queue",
    `Enqueue source ${start}. The queue is the BFS frontier.`,
    frame(start, [], start),
  );

  parent[start] = null;
  push(
    "init-parent",
    `Parent of ${start} is none — it is the root of the BFS tree.`,
    frame(start, [], start),
  );

  while (queue.length > 0) {
    push(
      "loop",
      `Queue is ${JSON.stringify(queue)} — keep exploring until the frontier is empty.`,
      frame(null, [], lastDiscovered ?? start),
    );

    const u = queue.shift()!;
    push(
      "dequeue",
      `Dequeue ${u}. Visit its neighbors next.`,
      frame(u, [], u),
    );

    const neighbors = adj[u] ?? [];
    push(
      "neighbors",
      neighbors.length === 0
        ? `Node ${u} has no neighbors.`
        : `Scan neighbors of ${u}: ${neighbors.join(", ")}.`,
      frame(u, [], u),
    );

    for (const v of neighbors) {
      if (!visited.has(v)) {
        visited.add(v);
        parent[v] = u;
        treeEdges.push({ from: u, to: v });
        queue.push(v);
        lastDiscovered = v;
        push(
          "discover",
          `Discover ${v} from ${u}: mark visited, set parent, enqueue. Shortest path: ${reconstructPath(parent, start, v).join(" → ")}.`,
          frame(u, [{ from: u, to: v }], v),
        );
      } else {
        push(
          "discover",
          `Neighbor ${v} is already visited — skip to preserve the first (shortest) parent.`,
          frame(u, [{ from: u, to: v }], u),
        );
      }
    }
  }

  if (lastDiscovered !== null && lastDiscovered !== start) {
    const path = reconstructPath(parent, start, lastDiscovered);
    push(
      "path",
      `Walk parent pointers for an unweighted shortest path ${start} → ${lastDiscovered}: ${path.join(" → ")}.`,
      frame(lastDiscovered, [], lastDiscovered),
    );
  }

  const reached = [...visited].sort((a, b) => a - b);
  push(
    "done",
    `BFS finished. Reachable nodes: ${reached.join(", ")}. The parent tree stores unweighted shortest paths from ${start}.`,
    frame(null, [], lastDiscovered ?? start),
  );

  return steps;
}
