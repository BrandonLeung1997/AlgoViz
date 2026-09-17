import type { Graph, GraphEdge, GraphFrame, Highlight, Step } from "@/lib/algorithms/types";

function cloneAdj(adj: Graph["adj"]): Record<number, number[]> {
  const cloned: Record<number, number[]> = {};
  for (const [key, neighbors] of Object.entries(adj)) {
    cloned[Number(key)] = [...neighbors];
  }
  return cloned;
}

function directedEdges(adj: Record<number, number[]>): GraphEdge[] {
  const edges: GraphEdge[] = [];
  const seen = new Set<string>();
  for (const [key, neighbors] of Object.entries(adj)) {
    const u = Number(key);
    for (const v of neighbors) {
      const id = `${u}>${v}`;
      if (seen.has(id)) continue;
      seen.add(id);
      edges.push({ from: u, to: v });
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

function fmtIndegree(nodes: number[], indegree: Record<number, number>): string {
  return nodes.map((n) => `${n}:${indegree[n] ?? 0}`).join(", ");
}

export function generateTopoSortSteps(graph: Graph): Step[] {
  const adj = cloneAdj(graph.adj);
  const nodeSet = new Set<number>(graph.nodes);
  for (const key of Object.keys(adj)) nodeSet.add(Number(key));
  for (const neighbors of Object.values(adj)) {
    for (const v of neighbors) nodeSet.add(v);
  }
  const nodes = [...nodeSet].sort((a, b) => a - b);
  const edges = directedEdges(adj);

  const steps: Step[] = [];
  const indegree: Record<number, number> = {};
  for (const n of nodes) indegree[n] = 0;
  const queue: number[] = [];
  const order: number[] = [];
  const parent: Record<number, number | null> = {};
  const treeEdges: GraphEdge[] = [];

  const frame = (
    current: number | null,
    relaxedEdges: GraphEdge[] = [],
  ): GraphFrame => {
    const sources = nodes.filter((n) => (indegree[n] ?? 0) === 0 || order.includes(n));
    const source = order[0] ?? queue[0] ?? sources[0] ?? nodes[0] ?? -1;
    return {
      nodes: [...nodes],
      edges: edges.map((e) => ({ ...e })),
      source,
      current,
      frontier: [...queue],
      visited: [...order],
      parent: { ...parent },
      path: [...order],
      treeEdges: treeEdges.map((e) => ({ ...e })),
      relaxedEdges: relaxedEdges.map((e) => ({ ...e })),
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
    pushStep("done", "Empty graph — nothing to order.", {
      nodes: [],
      edges: [],
      source: -1,
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
    "Start Kahn’s algorithm: produce a linear order of a directed acyclic graph.",
    frame(null),
  );

  pushStep(
    "init-indegree",
    `Initialize in-degree of every node to 0: ${fmtIndegree(nodes, indegree)}.`,
    frame(null),
  );

  for (const u of nodes) {
    for (const v of adj[u] ?? []) {
      indegree[v] = (indegree[v] ?? 0) + 1;
    }
  }

  pushStep(
    "count-v",
    `Count outgoing edges into in-degree[]: ${fmtIndegree(nodes, indegree)}.`,
    frame(null),
  );

  for (const n of nodes) {
    if ((indegree[n] ?? 0) === 0) {
      queue.push(n);
      parent[n] = null;
    }
  }

  pushStep(
    "init-queue",
    queue.length === 0
      ? "No in-degree-0 nodes to enqueue. Kahn uses a queue of sources — unlike BFS, this is not discovery from a single source."
      : `Enqueue every in-degree-0 node: ${JSON.stringify(queue)}. Kahn’s queue is DAG sources, not a BFS frontier from one source.`,
    frame(queue[0] ?? null),
  );

  pushStep(
    "init-order",
    "Order starts empty. Each dequeue appends the next vertex in the topological order.",
    frame(null),
  );

  while (queue.length > 0) {
    pushStep(
      "loop",
      `Queue is ${JSON.stringify(queue)} — dequeue in-degree-zero nodes until the frontier is empty.`,
      frame(null),
    );

    const u = queue.shift()!;
    pushStep(
      "dequeue",
      `Dequeue ${u}. Append it to the order next.`,
      frame(u),
    );

    order.push(u);
    pushStep(
      "append",
      `Append ${u} to the order: [${order.join(", ")}].`,
      frame(u),
    );

    const neighbors = adj[u] ?? [];
    pushStep(
      "neighbors",
      neighbors.length === 0
        ? `Node ${u} has no outgoing edges.`
        : `Scan outgoing neighbors of ${u}: ${neighbors.join(", ")}. Decrement their in-degree.`,
      frame(u),
    );

    for (const v of neighbors) {
      indegree[v] = (indegree[v] ?? 0) - 1;
      const relaxed: GraphEdge = { from: u, to: v };
      if (indegree[v] === 0) {
        parent[v] = u;
        treeEdges.push({ from: u, to: v });
        queue.push(v);
        pushStep(
          "enqueue",
          `In-degree of ${v} hits 0 after edge ${u}→${v} — enqueue ${v}. Queue is ${JSON.stringify(queue)}.`,
          frame(u, [relaxed]),
        );
      } else {
        pushStep(
          "decrement",
          `Decrement in-degree[${v}] → ${indegree[v]} (edge ${u}→${v}). Not 0 yet, so do not enqueue.`,
          frame(u, [relaxed]),
        );
      }
    }
  }

  const leftover = nodes.filter((n) => !order.includes(n));
  if (leftover.length > 0) {
    pushStep(
      "cycle",
      `Cycle: leftover nodes ${leftover.join(", ")} never reached in-degree 0, so there is no valid topological order. Stop — do not pretend they belong in the order.`,
      frame(null),
    );
    return steps;
  }

  pushStep(
    "done",
    `Done. Order [${order.join(", ")}] is a valid topological sort: every directed edge goes from earlier to later. This is not a BFS layer order unless the DAG happens to make them coincide.`,
    frame(null),
  );

  return steps;
}
