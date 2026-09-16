import { describe, expect, it } from "vitest";
import { generateBfsSteps } from "@/lib/algorithms/bfs/generateSteps";
import type { Graph } from "@/lib/algorithms/types";

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

describe("generateBfsSteps", () => {
  it("visits all reachable nodes from the source", () => {
    const graph = graphFromEdges(
      [
        [0, 1],
        [0, 2],
        [1, 3],
        [1, 4],
        [2, 5],
      ],
    );
    const steps = generateBfsSteps(graph, 0);
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
    generateBfsSteps(graph, 0);
    expect(graph).toEqual(snapshot);
  });

  it("handles a single-node graph", () => {
    const graph = graphFromEdges([], [0]);
    const steps = generateBfsSteps(graph, 0);
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
    const steps = generateBfsSteps(graph, 0);
    const last = steps[steps.length - 1]!;
    expect(new Set(last.graph!.visited)).toEqual(new Set([0, 1]));
    expect(last.graph!.visited).not.toContain(2);
    expect(last.graph!.visited).not.toContain(3);
  });

  it("parent pointers yield unweighted shortest paths", () => {
    const graph = graphFromEdges([
      [0, 1],
      [1, 2],
      [0, 2],
    ]);
    const steps = generateBfsSteps(graph, 0);
    const last = steps[steps.length - 1]!;
    const parent = last.graph!.parent;
    expect(parent[0]).toBeNull();
    expect(parent[2]).toBe(0);
    expect(parent[1]).toBe(0);
  });

  it("every step has explanation, codeLineId, and a cloned graph frame", () => {
    const graph = graphFromEdges([
      [0, 1],
      [0, 2],
      [1, 3],
    ]);
    const steps = generateBfsSteps(graph, 0);
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

  it("emits enqueue, dequeue, discover, and path reconstruction steps", () => {
    const ids = new Set(
      generateBfsSteps(
        graphFromEdges([
          [0, 1],
          [1, 2],
        ]),
        0,
      ).map((s) => s.codeLineId),
    );
    expect(ids.has("init-queue")).toBe(true);
    expect(ids.has("dequeue")).toBe(true);
    expect(ids.has("discover")).toBe(true);
    expect(ids.has("path")).toBe(true);
    expect(ids.has("done")).toBe(true);
  });
});
