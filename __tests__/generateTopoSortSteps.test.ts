import { describe, expect, it } from "vitest";
import { generateTopoSortSteps } from "@/lib/algorithms/topological-sort/generateSteps";
import { parseGraphInput } from "@/lib/algorithms/parseInput";
import { randomDag, randomGraph } from "@/lib/algorithms/randomGraph";
import type { Graph } from "@/lib/algorithms/types";

function graphFromDirectedEdges(
  edges: [number, number][],
  extraNodes: number[] = [],
): Graph {
  const nodeSet = new Set<number>(extraNodes);
  const adj: Record<number, number[]> = {};
  for (const [a, b] of edges) {
    nodeSet.add(a);
    nodeSet.add(b);
    (adj[a] ??= []).push(b);
  }
  for (const n of nodeSet) adj[n] ??= [];
  return { nodes: [...nodeSet].sort((a, b) => a - b), adj };
}

function finalOrder(graph: Graph): number[] {
  const steps = generateTopoSortSteps(graph);
  return steps.at(-1)?.graph?.path ?? [];
}

function isValidTotalOrder(graph: Graph, order: number[]): boolean {
  const index = new Map(order.map((n, i) => [n, i]));
  if (order.length !== graph.nodes.length) return false;
  if (new Set(order).size !== order.length) return false;
  for (const u of graph.nodes) {
    for (const v of graph.adj[u] ?? []) {
      const iu = index.get(u);
      const iv = index.get(v);
      if (iu === undefined || iv === undefined || iu >= iv) return false;
    }
  }
  return true;
}

describe("generateTopoSortSteps", () => {
  it("produces a valid total order for every directed edge u→v", () => {
    const graph = graphFromDirectedEdges([
      [0, 1],
      [0, 2],
      [1, 3],
      [2, 3],
    ]);
    const order = finalOrder(graph);
    expect(isValidTotalOrder(graph, order)).toBe(true);
  });

  it("does not mutate the original graph", () => {
    const graph = graphFromDirectedEdges([
      [0, 1],
      [1, 2],
    ]);
    const snapshot = structuredClone(graph);
    generateTopoSortSteps(graph);
    expect(graph).toEqual(snapshot);
  });

  it("handles a single-node graph", () => {
    const graph = graphFromDirectedEdges([], [0]);
    const steps = generateTopoSortSteps(graph);
    expect(steps.length).toBeGreaterThan(0);
    const last = steps[steps.length - 1]!;
    expect(last.graph!.path).toEqual([0]);
    expect(last.graph!.frontier).toEqual([]);
    expect(last.codeLineId).toBe("done");
  });

  it("orders a disconnected DAG from multiple in-degree-0 starts", () => {
    const graph = graphFromDirectedEdges(
      [
        [0, 1],
        [2, 3],
      ],
      [0, 1, 2, 3],
    );
    const order = finalOrder(graph);
    expect(isValidTotalOrder(graph, order)).toBe(true);
    const index = new Map(order.map((n, i) => [n, i]));
    expect(index.get(0)!).toBeLessThan(index.get(1)!);
    expect(index.get(2)!).toBeLessThan(index.get(3)!);
  });

  it("classic diamond: 0 first, 3 last, 1 and 2 in between", () => {
    const graph = graphFromDirectedEdges([
      [0, 1],
      [0, 2],
      [1, 3],
      [2, 3],
    ]);
    const order = finalOrder(graph);
    expect(order[0]).toBe(0);
    expect(order.at(-1)).toBe(3);
    expect(new Set(order.slice(1, -1))).toEqual(new Set([1, 2]));
    expect(isValidTotalOrder(graph, order)).toBe(true);
  });

  it("cycle 0→1→2→0 does not claim a full order", () => {
    const graph = graphFromDirectedEdges([
      [0, 1],
      [1, 2],
      [2, 0],
    ]);
    const steps = generateTopoSortSteps(graph);
    const last = steps[steps.length - 1]!;
    expect(last.graph!.path.length).toBeLessThan(3);
    expect(last.explanation.toLowerCase()).toMatch(/cycle/);
    expect(last.codeLineId).toBe("cycle");
    expect(isValidTotalOrder(graph, last.graph!.path)).toBe(false);
  });

  it("every step has explanation, codeLineId, and a cloned graph frame", () => {
    const graph = graphFromDirectedEdges([
      [0, 1],
      [0, 2],
      [1, 3],
    ]);
    const steps = generateTopoSortSteps(graph);
    expect(steps.length).toBeGreaterThan(1);
    for (const step of steps) {
      expect(step.explanation.trim().length).toBeGreaterThan(0);
      expect(step.codeLineId.trim().length).toBeGreaterThan(0);
      expect(step.graph).toBeDefined();
      expect(step.graph!.nodes).toEqual([0, 1, 2, 3]);
      expect(step.graph).not.toBe(graph);
    }
  });

  it("uses Kahn language: in-degree, enqueue, dequeue, order — not shortest-path", () => {
    const steps = generateTopoSortSteps(
      graphFromDirectedEdges([
        [0, 1],
        [0, 2],
        [1, 3],
        [2, 3],
      ]),
    );
    const ids = new Set(steps.map((s) => s.codeLineId));
    expect(ids.has("init-indegree")).toBe(true);
    expect(ids.has("init-queue")).toBe(true);
    expect(ids.has("dequeue")).toBe(true);
    expect(ids.has("enqueue")).toBe(true);
    expect(ids.has("done")).toBe(true);
    const text = steps.map((s) => s.explanation).join("\n").toLowerCase();
    expect(text).toMatch(/in-degree/);
    expect(text).toMatch(/enqueue/);
    expect(text).toMatch(/dequeue/);
    expect(text).toMatch(/order/);
    expect(text).not.toMatch(/shortest path/);
    expect(text).not.toMatch(/extract-min/);
    expect(text).not.toMatch(/\brelax/);
  });

  it("growing path strip is the topological order", () => {
    const steps = generateTopoSortSteps(
      graphFromDirectedEdges([
        [0, 1],
        [1, 2],
      ]),
    );
    const appends = steps.filter((s) => s.codeLineId === "append");
    expect(appends.length).toBe(3);
    expect(appends[0]!.graph!.path).toEqual([0]);
    expect(appends[1]!.graph!.path).toEqual([0, 1]);
    expect(appends[2]!.graph!.path).toEqual([0, 1, 2]);
    expect(steps.at(-1)!.graph!.path).toEqual([0, 1, 2]);
  });

  it("contrasts with BFS: queue is in-degree-zero nodes, not a single-source frontier", () => {
    const graph = graphFromDirectedEdges(
      [
        [0, 1],
        [2, 3],
      ],
      [0, 1, 2, 3],
    );
    const steps = generateTopoSortSteps(graph);
    const seeded = steps.find((s) => s.codeLineId === "init-queue");
    expect(seeded).toBeDefined();
    expect(new Set(seeded!.graph!.frontier)).toEqual(new Set([0, 2]));
    expect(seeded!.explanation.toLowerCase()).toMatch(/in-degree/);
  });
});

describe("directed parse and randomize for topological sort", () => {
  it("does not treat undirected 0-1 as a DAG in directed parse", () => {
    const undirected = parseGraphInput("0-1, 1-2");
    expect(undirected.ok).toBe(true);
    if (!undirected.ok) return;
    expect(undirected.graph.adj[0]).toContain(1);
    expect(undirected.graph.adj[1]).toContain(0);

    const directed = parseGraphInput("0-1, 1-2", { directed: true });
    expect(directed.ok).toBe(false);
  });

  it("parseGraphInput directed diamond feeds Kahn a valid order", () => {
    const parsed = parseGraphInput("0>1, 0>2, 1>3, 2>3", { directed: true });
    expect(parsed.ok).toBe(true);
    if (!parsed.ok) return;
    const order = finalOrder(parsed.graph);
    expect(order[0]).toBe(0);
    expect(order.at(-1)).toBe(3);
    expect(isValidTotalOrder(parsed.graph, order)).toBe(true);
  });

  it("randomDag never emits a cycle and stays within 12 nodes", () => {
    for (let i = 0; i < 40; i += 1) {
      const graph = randomDag();
      expect(graph.nodes.length).toBeGreaterThan(0);
      expect(graph.nodes.length).toBeLessThanOrEqual(12);
      const order = finalOrder(graph);
      expect(isValidTotalOrder(graph, order)).toBe(true);
    }
  });

  it("randomGraph stays undirected by default for BFS/DFS", () => {
    for (let i = 0; i < 20; i += 1) {
      const graph = randomGraph(5);
      for (const u of graph.nodes) {
        for (const v of graph.adj[u] ?? []) {
          expect(graph.adj[v] ?? []).toContain(u);
        }
      }
    }
  });
});
