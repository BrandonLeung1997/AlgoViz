import { describe, expect, it } from "vitest";
import { generatePrimSteps } from "@/lib/algorithms/prim/generateSteps";
import type { Graph, GraphEdge } from "@/lib/algorithms/types";

function graphFromWeightedEdges(
  edges: [number, number, number?][],
  extraNodes: number[] = [],
): Graph {
  const nodeSet = new Set<number>(extraNodes);
  const adj: Record<number, number[]> = {};
  const weights: Record<string, number> = {};
  for (const [a, b, w] of edges) {
    nodeSet.add(a);
    nodeSet.add(b);
    (adj[a] ??= []).push(b);
    (adj[b] ??= []).push(a);
    const key = a < b ? `${a}-${b}` : `${b}-${a}`;
    weights[key] = w ?? 1;
  }
  for (const n of nodeSet) adj[n] ??= [];
  const hasNonDefault = Object.values(weights).some((w) => w !== 1);
  return {
    nodes: [...nodeSet].sort((a, b) => a - b),
    adj,
    weights: hasNonDefault ? weights : undefined,
  };
}

function edgeKey(edge: GraphEdge): string {
  const a = Math.min(edge.from, edge.to);
  const b = Math.max(edge.from, edge.to);
  return `${a}-${b}`;
}

function treeWeight(edges: GraphEdge[]): number {
  return edges.reduce((sum, e) => sum + (e.weight ?? 1), 0);
}

const TRIANGLE = graphFromWeightedEdges([
  [0, 1, 1],
  [1, 2, 1],
  [0, 2, 10],
]);

describe("generatePrimSteps", () => {
  it("does not mutate the original graph", () => {
    const graph = graphFromWeightedEdges([
      [0, 1, 4],
      [1, 2, 1],
    ]);
    const snapshot = structuredClone(graph);
    generatePrimSteps(graph, 0);
    expect(graph).toEqual(snapshot);
  });

  it("known triangle from source 0: MST weight 2 and does not include 0-2", () => {
    const last = generatePrimSteps(TRIANGLE, 0).at(-1)!;
    expect(treeWeight(last.graph!.treeEdges)).toBe(2);
    expect(last.graph!.treeEdges.map(edgeKey)).not.toContain("0-2");
    expect(new Set(last.graph!.treeEdges.map(edgeKey))).toEqual(
      new Set(["0-1", "1-2"]),
    );
    expect(new Set(last.graph!.visited)).toEqual(new Set([0, 1, 2]));
    expect(last.codeLineId).toBe("done");
  });

  it("different sources on a connected graph produce equal MST weight", () => {
    const weights = [0, 1, 2].map((source) => {
      const last = generatePrimSteps(TRIANGLE, source).at(-1)!;
      expect(last.codeLineId).toBe("done");
      expect(last.graph!.treeEdges).toHaveLength(2);
      expect(new Set(last.graph!.visited)).toEqual(new Set([0, 1, 2]));
      return treeWeight(last.graph!.treeEdges);
    });
    expect(new Set(weights)).toEqual(new Set([2]));
  });

  it("does not add a disconnected node", () => {
    const graph = graphFromWeightedEdges(
      [
        [0, 1, 1],
        [2, 3, 2],
      ],
      [0, 1, 2, 3],
    );
    const last = generatePrimSteps(graph, 0).at(-1)!;
    expect(last.codeLineId).toBe("done");
    expect(new Set(last.graph!.visited)).toEqual(new Set([0, 1]));
    expect(last.graph!.visited).not.toContain(2);
    expect(last.graph!.visited).not.toContain(3);
    expect(new Set(last.graph!.treeEdges.map(edgeKey))).toEqual(
      new Set(["0-1"]),
    );
  });

  it("handles a single-node graph", () => {
    const graph = graphFromWeightedEdges([], [0]);
    const steps = generatePrimSteps(graph, 0);
    expect(steps.length).toBeGreaterThan(0);
    const last = steps[steps.length - 1]!;
    expect(last.graph!.visited).toEqual([0]);
    expect(last.graph!.treeEdges).toEqual([]);
    expect(last.graph!.frontier).toEqual([]);
    expect(last.codeLineId).toBe("done");
  });

  it("grows from the source and records Prim keys in dist", () => {
    const last = generatePrimSteps(TRIANGLE, 0).at(-1)!;
    expect(last.graph!.source).toBe(0);
    expect(last.graph!.dist?.[0]).toBe(0);
    expect(last.graph!.dist?.[1]).toBe(1);
    expect(last.graph!.dist?.[2]).toBe(1);
  });

  it("emits pick, consider, and add-edge steps", () => {
    const steps = generatePrimSteps(TRIANGLE, 0);
    const ids = new Set(steps.map((s) => s.codeLineId));
    expect(ids.has("fn-def")).toBe(true);
    expect(ids.has("init")).toBe(true);
    expect(ids.has("pick")).toBe(true);
    expect(ids.has("consider")).toBe(true);
    expect(ids.has("add-edge")).toBe(true);
    expect(ids.has("done")).toBe(true);
  });

  it("every step has explanation, codeLineId, and a cloned graph frame", () => {
    const steps = generatePrimSteps(TRIANGLE, 0);
    expect(steps.length).toBeGreaterThan(1);
    for (const step of steps) {
      expect(step.explanation.trim().length).toBeGreaterThan(0);
      expect(step.codeLineId.trim().length).toBeGreaterThan(0);
      expect(step.graph).toBeDefined();
      expect(step.graph!.nodes).toEqual([0, 1, 2]);
      expect(step.graph!.source).toBe(0);
      expect(step.graph).not.toBe(TRIANGLE);
    }
  });
});
