import { describe, expect, it } from "vitest";
import { generateDfsSteps } from "@/lib/algorithms/dfs/generateSteps";
import { generateBfsSteps } from "@/lib/algorithms/bfs/generateSteps";
import type { Graph, Step } from "@/lib/algorithms/types";

function graphFromEdges(
  edges: [number, number][],
  extraNodes: number[] = [],
): Graph {
  const nodeSet = new Set<number>(extraNodes);
  const adj: Record<number, number[]> = {};
  for (const [a, b] of edges) {
    nodeSet.add(a);
    nodeSet.add(b);
    (adj[a] ??= []).push(b);
    (adj[b] ??= []).push(a);
  }
  for (const n of nodeSet) adj[n] ??= [];
  return { nodes: [...nodeSet].sort((a, b) => a - b), adj };
}

function reachable(graph: Graph, source: number): Set<number> {
  const seen = new Set<number>([source]);
  const queue = [source];
  while (queue.length > 0) {
    const u = queue.shift()!;
    for (const v of graph.adj[u] ?? []) {
      if (!seen.has(v)) {
        seen.add(v);
        queue.push(v);
      }
    }
  }
  return seen;
}

function discoveryOrder(steps: Step[]): number[] {
  const order: number[] = [];
  const seen = new Set<number>();
  for (const step of steps) {
    for (const n of step.graph?.visited ?? []) {
      if (!seen.has(n)) {
        seen.add(n);
        order.push(n);
      }
    }
  }
  return order;
}

describe("generateDfsSteps", () => {
  it("visits all reachable nodes from the source", () => {
    const graph = graphFromEdges([
      [0, 1],
      [0, 2],
      [1, 3],
      [1, 4],
      [2, 5],
    ]);
    const steps = generateDfsSteps(graph, 0);
    const last = steps[steps.length - 1]!;
    expect(last.graph).toBeDefined();
    expect(new Set(last.graph!.visited)).toEqual(reachable(graph, 0));
    expect(last.codeLineId).toBe("done");
  });

  it("does not mutate the original graph", () => {
    const graph = graphFromEdges([
      [0, 1],
      [1, 2],
    ]);
    const snapshot = structuredClone(graph);
    generateDfsSteps(graph, 0);
    expect(graph).toEqual(snapshot);
  });

  it("handles a single-node graph", () => {
    const graph = graphFromEdges([], [0]);
    const steps = generateDfsSteps(graph, 0);
    expect(steps.length).toBeGreaterThan(0);
    const last = steps[steps.length - 1]!;
    expect(last.graph!.visited).toEqual([0]);
    expect(last.graph!.frontier).toEqual([]);
    expect(last.codeLineId).toBe("done");
  });

  it("does not visit nodes in a disconnected component", () => {
    const graph = graphFromEdges(
      [
        [0, 1],
        [2, 3],
      ],
      [0, 1, 2, 3],
    );
    const steps = generateDfsSteps(graph, 0);
    const last = steps[steps.length - 1]!;
    expect(new Set(last.graph!.visited)).toEqual(new Set([0, 1]));
    expect(last.graph!.visited).not.toContain(2);
    expect(last.graph!.visited).not.toContain(3);
  });

  it("every step has explanation, codeLineId, and a cloned graph frame", () => {
    const graph = graphFromEdges([
      [0, 1],
      [0, 2],
      [1, 3],
    ]);
    const steps = generateDfsSteps(graph, 0);
    expect(steps.length).toBeGreaterThan(1);
    for (const step of steps) {
      expect(step.explanation.trim().length).toBeGreaterThan(0);
      expect(step.codeLineId.trim().length).toBeGreaterThan(0);
      expect(step.graph).toBeDefined();
      expect(step.graph!.nodes).toEqual([0, 1, 2, 3]);
      expect(step.graph!.source).toBe(0);
      expect(step.graph).not.toBe(graph);
    }
  });

  it("emits stack, pop, discover, backtracking, and done steps", () => {
    const steps = generateDfsSteps(
      graphFromEdges([
        [0, 1],
        [0, 2],
      ]),
      0,
    );
    const ids = new Set(steps.map((s) => s.codeLineId));
    expect(ids.has("init-stack")).toBe(true);
    expect(ids.has("pop")).toBe(true);
    expect(ids.has("discover")).toBe(true);
    expect(ids.has("done")).toBe(true);
    expect(steps.some((s) => /backtrack/i.test(s.explanation))).toBe(true);
  });

  it("visit order differs from BFS and DFS parent is not the unweighted shortest path", () => {
    const graph = graphFromEdges([
      [0, 1],
      [0, 2],
      [1, 3],
      [2, 3],
    ]);
    const bfsSteps = generateBfsSteps(graph, 0);
    const dfsSteps = generateDfsSteps(graph, 0);
    const bfsLast = bfsSteps[bfsSteps.length - 1]!;
    const dfsLast = dfsSteps[dfsSteps.length - 1]!;

    expect(discoveryOrder(dfsSteps)).not.toEqual(discoveryOrder(bfsSteps));
    expect(discoveryOrder(bfsSteps)).toEqual([0, 1, 2, 3]);
    expect(discoveryOrder(dfsSteps)).toEqual([0, 1, 3, 2]);

    expect(bfsLast.graph!.parent[2]).toBe(0);
    expect(dfsLast.graph!.parent[2]).toBe(3);
    expect(dfsLast.graph!.parent[2]).not.toBe(bfsLast.graph!.parent[2]);

    expect(bfsLast.graph!.parent[3]).toBe(1);
    expect(dfsLast.graph!.parent[3]).toBe(1);
  });
});
