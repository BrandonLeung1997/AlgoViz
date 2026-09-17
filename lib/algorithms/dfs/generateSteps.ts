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

export function generateDfsSteps(graph: Graph, source: number): Step[] {
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
  const stack: number[] = [];
  const parent: Record<number, number | null> = {};
  const treeEdges: GraphEdge[] = [];
  let lastDiscovered: number | null = null;
  let prevCurrent: number | null = null;

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
      frontier: [...stack],
      visited: [...visited],
      parent: { ...parent },
      path: reconstructPath(parent, source, target),
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
    });
    return steps;
  }

  const start = nodes.includes(source) ? source : nodes[0]!;

  pushStep(
    "fn-def",
    `Start iterative DFS from source ${start}. A stack is the frontier (BFS would use a queue).`,
    frame(null, [], start),
  );

  pushStep(
    "init-visited",
    "Visited starts empty. Nodes are marked when popped off the stack, not when pushed — unlike BFS.",
    frame(null, [], start),
  );

  stack.push(start);
  pushStep(
    "init-stack",
    `Push source ${start} onto the stack. The stack is the DFS frontier.`,
    frame(start, [], start),
  );

  parent[start] = null;
  pushStep(
    "init-parent",
    `Parent of ${start} is none — it is the root of the DFS tree.`,
    frame(start, [], start),
  );

  while (stack.length > 0) {
    pushStep(
      "loop",
      `Stack is ${JSON.stringify(stack)} — keep exploring until the stack is empty.`,
      frame(null, [], lastDiscovered ?? start),
    );

    const u = stack.pop()!;

    if (visited.has(u)) {
      pushStep(
        "skip-visited",
        `Pop ${u} — already visited. Backtrack past this leftover stack entry from an earlier branch.`,
        frame(u, [], lastDiscovered ?? start),
      );
      continue;
    }

    visited.add(u);
    if (parent[u] !== null && parent[u] !== undefined) {
      treeEdges.push({ from: parent[u]!, to: u });
    }
    lastDiscovered = u;
    const comingFrom = parent[u];
    const isBacktrack = prevCurrent !== null && comingFrom !== prevCurrent;
    const pathToU = reconstructPath(parent, start, u);
    const pathText = pathToU.length > 0 ? pathToU.join(" → ") : String(u);
    if (isBacktrack) {
      pushStep(
        "pop",
        `Backtrack: pop ${u}. Finished the branch at ${prevCurrent}; resume by visiting ${u} (parent ${comingFrom}). DFS tree path: ${pathText}.`,
        frame(u, [], u),
      );
    } else {
      pushStep(
        "pop",
        u === start
          ? `Pop ${u} and visit the source. Mark it visited.`
          : `Pop ${u} and go deeper from ${comingFrom}. Mark visited. DFS tree path: ${pathText}.`,
        frame(u, [], u),
      );
    }
    pushStep(
      "mark-visited",
      `Mark ${u} visited so leftover stack copies will be skipped.`,
      frame(u, [], u),
    );

    const neighbors = adj[u] ?? [];
    pushStep(
      "neighbors",
      neighbors.length === 0
        ? `Node ${u} has no neighbors — this branch is finished.`
        : `Scan neighbors of ${u} right-to-left (${[...neighbors].reverse().join(", ")}) so the stack visits left-to-right.`,
      frame(u, [], u),
    );

    for (let i = neighbors.length - 1; i >= 0; i -= 1) {
      const v = neighbors[i]!;
      if (!visited.has(v)) {
        parent[v] = u;
        stack.push(v);
        pushStep(
          "discover",
          `Discover ${v} from ${u}: set DFS-tree parent and push onto the stack. Tentative tree path: ${reconstructPath(parent, start, v).join(" → ")}.`,
          frame(u, [{ from: u, to: v }], v),
        );
      } else {
        pushStep(
          "discover",
          `Neighbor ${v} is already visited — skip. No tree edge (this is a back edge / cross edge, not a shortest-path skip).`,
          frame(u, [{ from: u, to: v }], u),
        );
      }
    }

    prevCurrent = u;
  }

  if (lastDiscovered !== null && lastDiscovered !== start) {
    const path = reconstructPath(parent, start, lastDiscovered);
    pushStep(
      "path",
      `Walk parent pointers along the DFS tree ${start} → ${lastDiscovered}: ${path.join(" → ")}. This is a tree path, not an unweighted shortest path.`,
      frame(lastDiscovered, [], lastDiscovered),
    );
  }

  const reached = [...visited].sort((a, b) => a - b);
  pushStep(
    "done",
    `DFS finished. Reachable nodes: ${reached.join(", ")}. The parent tree is a DFS tree — not unweighted shortest paths (contrast with BFS).`,
    frame(null, [], lastDiscovered ?? start),
  );

  return steps;
}
