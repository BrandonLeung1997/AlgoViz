import { describe, expect, it } from "vitest";
import { generateBellmanFordSteps } from "@/lib/algorithms/bellman-ford/generateSteps";
import { generateDijkstraSteps } from "@/lib/algorithms/dijkstra/generateSteps";
import { parseGraphInput } from "@/lib/algorithms/parseInput";
import {
  DEFAULT_BELLMAN_FORD_GRAPH,
  randomDirectedWeightedGraph,
} from "@/lib/algorithms/randomGraph";
import type { Graph } from "@/lib/algorithms/types";

function directedGraph(
  edges: [number, number, number?][],
  extraNodes: number[] = [],
): Graph {
  const nodeSet = new Set<number>(extraNodes);
  const adj: Record<number, number[]> = {};
  const directedWeights: Record<string, number> = {};
  for (const [a, b, w] of edges) {
    nodeSet.add(a);
    nodeSet.add(b);
    (adj[a] ??= []).push(b);
    adj[b] ??= [];
    directedWeights[`${a}>${b}`] = w ?? 1;
  }
  for (const n of nodeSet) adj[n] ??= [];
  const hasNonDefault = Object.values(directedWeights).some((w) => w !== 1);
  return {
    nodes: [...nodeSet].sort((a, b) => a - b),
    adj,
    directedWeights: hasNonDefault ? directedWeights : undefined,
  };
}

describe("generateBellmanFordSteps", () => {
  it("does not mutate the original graph", () => {
    const graph = directedGraph([
      [0, 1, 4],
      [1, 2, -3],
    ]);
    const snapshot = structuredClone(graph);
    generateBellmanFordSteps(graph, 0);
    expect(graph).toEqual(snapshot);
  });

  it("matches a hand-computed dist on a positive-weight graph", () => {
    const graph = directedGraph([
      [0, 1, 1],
      [1, 2, 1],
      [0, 2, 10],
    ]);
    const last = generateBellmanFordSteps(graph, 0).at(-1)!;
    expect(last.graph!.dist?.[0]).toBe(0);
    expect(last.graph!.dist?.[1]).toBe(1);
    expect(last.graph!.dist?.[2]).toBe(2);
    expect(last.graph!.parent[2]).toBe(1);
    expect(last.codeLineId).toBe("done");
  });

  it("uses a negative edge that beats Dijkstra on absolute weights", () => {
    const graph = directedGraph([
      [0, 1, 4],
      [0, 2, 5],
      [1, 2, -3],
    ]);
    const bf = generateBellmanFordSteps(graph, 0).at(-1)!;
    expect(bf.graph!.dist?.[2]).toBe(1);
    expect(bf.graph!.parent[2]).toBe(1);

    const absGraph: Graph = {
      nodes: [0, 1, 2],
      adj: { 0: [1, 2], 1: [0, 2], 2: [0, 1] },
      weights: { "0-1": 4, "0-2": 5, "1-2": 3 },
    };
    const dijkstra = generateDijkstraSteps(absGraph, 0).at(-1)!;
    expect(bf.graph!.dist![2]).toBeLessThan(dijkstra.graph!.dist![2]);
  });

  it("hits neg-cycle when a negative cycle is reachable from the source", () => {
    const graph = directedGraph([
      [0, 1, 1],
      [1, 2, -3],
      [2, 1, 1],
    ]);
    const steps = generateBellmanFordSteps(graph, 0);
    expect(steps.some((s) => s.codeLineId === "neg-cycle")).toBe(true);
    expect(steps.at(-1)!.codeLineId).toBe("neg-cycle");
  });

  it("keeps unreachable nodes at infinity for an isolated source", () => {
    const graph = directedGraph([[1, 2, 1]], [0, 1, 2]);
    const last = generateBellmanFordSteps(graph, 0).at(-1)!;
    expect(last.graph!.dist?.[0]).toBe(0);
    expect(last.graph!.dist?.[1]).toBe(Number.POSITIVE_INFINITY);
    expect(last.graph!.dist?.[2]).toBe(Number.POSITIVE_INFINITY);
    expect(last.codeLineId).toBe("done");
  });

  it("every step has explanation, codeLineId, and a cloned graph frame", () => {
    const graph = directedGraph([
      [0, 1, 4],
      [0, 2, 5],
      [1, 2, -3],
    ]);
    const steps = generateBellmanFordSteps(graph, 0);
    expect(steps.length).toBeGreaterThan(1);
    for (const step of steps) {
      expect(step.explanation.trim().length).toBeGreaterThan(0);
      expect(step.codeLineId.trim().length).toBeGreaterThan(0);
      expect(step.graph).toBeDefined();
      expect(step.graph!.nodes).toEqual([0, 1, 2]);
      expect(step.graph!.source).toBe(0);
      expect(step.graph).not.toBe(graph);
    }
  });

  it("parseGraphInput accepts 0>1:-2 style input for Bellman–Ford", () => {
    const parsed = parseGraphInput("0>1:4, 0>2:5, 1>2:-3", {
      directed: true,
      allowNegative: true,
    });
    expect(parsed.ok).toBe(true);
    if (!parsed.ok) return;
    const last = generateBellmanFordSteps(parsed.graph, 0).at(-1)!;
    expect(last.graph!.dist?.[2]).toBe(1);
  });

  it("default teaching graph has no negative cycle and uses the cheap negative path", () => {
    const steps = generateBellmanFordSteps(DEFAULT_BELLMAN_FORD_GRAPH, 0);
    expect(steps.some((s) => s.codeLineId === "neg-cycle")).toBe(false);
    const last = steps.at(-1)!;
    expect(last.codeLineId).toBe("done");
    expect(last.graph!.dist?.[0]).toBe(0);
    expect(last.graph!.dist?.[1]).toBe(4);
    expect(last.graph!.dist?.[2]).toBe(1);
    expect(last.graph!.dist?.[3]).toBe(2);
  });

  it("randomDirectedWeightedGraph stays small, allows negatives, and has no cycle", () => {
    let sawNegative = false;
    for (let i = 0; i < 40; i += 1) {
      const graph = randomDirectedWeightedGraph();
      expect(graph.nodes.length).toBeLessThanOrEqual(8);
      expect(graph.nodes.length).toBeGreaterThanOrEqual(2);
      for (const w of Object.values(graph.directedWeights ?? {})) {
        expect(Number.isInteger(w)).toBe(true);
        if (w < 0) sawNegative = true;
      }
      const last = generateBellmanFordSteps(graph, graph.nodes[0]!).at(-1)!;
      expect(last.codeLineId).toBe("done");
    }
    expect(sawNegative).toBe(true);
  });
});
