import { describe, expect, it } from "vitest";
import { generateKruskalSteps } from "@/lib/algorithms/kruskal/generateSteps";
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

function countComponents(graph: Graph): number {
  const seen = new Set<number>();
  let count = 0;
  for (const start of graph.nodes) {
    if (seen.has(start)) continue;
    count += 1;
    const queue = [start];
    seen.add(start);
    while (queue.length > 0) {
      const u = queue.shift()!;
      for (const v of graph.adj[u] ?? []) {
        if (!seen.has(v)) {
          seen.add(v);
          queue.push(v);
        }
      }
    }
  }
  return count;
}

const TRIANGLE = graphFromWeightedEdges([
  [0, 1, 1],
  [1, 2, 1],
  [0, 2, 10],
]);

describe("generateKruskalSteps", () => {
  it("does not mutate the original graph", () => {
    const graph = graphFromWeightedEdges([
      [0, 1, 4],
      [1, 2, 1],
    ]);
    const snapshot = structuredClone(graph);
    generateKruskalSteps(graph);
    expect(graph).toEqual(snapshot);
  });

  it("known triangle: MST weight 2 and does not include 0-2", () => {
    const last = generateKruskalSteps(TRIANGLE).at(-1)!;
    expect(treeWeight(last.graph!.treeEdges)).toBe(2);
    expect(last.graph!.treeEdges.map(edgeKey)).not.toContain("0-2");
    expect(new Set(last.graph!.treeEdges.map(edgeKey))).toEqual(
      new Set(["0-1", "1-2"]),
    );
    expect(last.codeLineId).toBe("done");
  });

  it("emits a skip-cycle step on the triangle", () => {
    const steps = generateKruskalSteps(TRIANGLE);
    expect(steps.some((s) => s.codeLineId === "skip-cycle")).toBe(true);
    const skip = steps.find((s) => s.codeLineId === "skip-cycle")!;
    expect(skip.graph!.relaxedEdges.map(edgeKey)).toEqual(["0-2"]);
  });

  it("builds a forest for two disconnected edges and still finishes", () => {
    const graph = graphFromWeightedEdges(
      [
        [0, 1, 1],
        [2, 3, 2],
      ],
      [0, 1, 2, 3],
    );
    const last = generateKruskalSteps(graph).at(-1)!;
    expect(last.codeLineId).toBe("done");
    expect(new Set(last.graph!.treeEdges.map(edgeKey))).toEqual(
      new Set(["0-1", "2-3"]),
    );
    expect(treeWeight(last.graph!.treeEdges)).toBe(3);
  });

  it("handles a single-node graph", () => {
    const graph = graphFromWeightedEdges([], [0]);
    const steps = generateKruskalSteps(graph);
    expect(steps.length).toBeGreaterThan(0);
    const last = steps[steps.length - 1]!;
    expect(last.graph!.treeEdges).toEqual([]);
    expect(last.graph!.frontier).toEqual([]);
    expect(last.graph!.path).toEqual([]);
    expect(last.codeLineId).toBe("done");
  });

  it("final treeEdges count is n - c (c = components)", () => {
    const graphs = [
      TRIANGLE,
      graphFromWeightedEdges(
        [
          [0, 1, 1],
          [2, 3, 1],
        ],
        [0, 1, 2, 3],
      ),
      graphFromWeightedEdges([], [0]),
      graphFromWeightedEdges(
        [
          [0, 1, 1],
          [1, 2, 2],
          [3, 4, 1],
        ],
        [0, 1, 2, 3, 4],
      ),
    ];
    for (const graph of graphs) {
      const last = generateKruskalSteps(graph).at(-1)!;
      const n = graph.nodes.length;
      const c = countComponents(graph);
      expect(last.graph!.treeEdges).toHaveLength(n - c);
      expect(last.codeLineId).toBe("done");
    }
  });

  it("every step has explanation, codeLineId, and a cloned graph frame", () => {
    const steps = generateKruskalSteps(TRIANGLE);
    expect(steps.length).toBeGreaterThan(1);
    for (const step of steps) {
      expect(step.explanation.trim().length).toBeGreaterThan(0);
      expect(step.codeLineId.trim().length).toBeGreaterThan(0);
      expect(step.graph).toBeDefined();
      expect(step.graph!.nodes).toEqual([0, 1, 2]);
      expect(step.graph!.frontier).toEqual([]);
      expect(step.graph).not.toBe(TRIANGLE);
    }
  });
});
