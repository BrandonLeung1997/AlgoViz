import { describe, expect, it } from "vitest";
import { generateDijkstraSteps } from "@/lib/algorithms/dijkstra/generateSteps";
import { generateBfsSteps } from "@/lib/algorithms/bfs/generateSteps";
import { parseGraphInput } from "@/lib/algorithms/parseInput";
import { randomGraph } from "@/lib/algorithms/randomGraph";
import type { Graph } from "@/lib/algorithms/types";

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

describe("generateDijkstraSteps", () => {
  it("visits all reachable nodes from the source", () => {
    const graph = graphFromWeightedEdges([
      [0, 1, 2],
      [0, 2, 5],
      [1, 3, 1],
      [1, 4, 4],
      [2, 5, 1],
    ]);
    const steps = generateDijkstraSteps(graph, 0);
    const last = steps[steps.length - 1]!;
    expect(last.graph).toBeDefined();
    expect(new Set(last.graph!.visited)).toEqual(reachable(graph, 0));
    expect(last.codeLineId).toBe("done");
  });

  it("does not mutate the original graph", () => {
    const graph = graphFromWeightedEdges([
      [0, 1, 4],
      [1, 2, 1],
    ]);
    const snapshot = structuredClone(graph);
    generateDijkstraSteps(graph, 0);
    expect(graph).toEqual(snapshot);
  });

  it("handles a single-node graph", () => {
    const graph = graphFromWeightedEdges([], [0]);
    const steps = generateDijkstraSteps(graph, 0);
    expect(steps.length).toBeGreaterThan(0);
    const last = steps[steps.length - 1]!;
    expect(last.graph!.visited).toEqual([0]);
    expect(last.graph!.frontier).toEqual([]);
    expect(last.codeLineId).toBe("done");
  });

  it("does not visit nodes in a disconnected component", () => {
    const graph = graphFromWeightedEdges(
      [
        [0, 1, 1],
        [2, 3, 1],
      ],
      [0, 1, 2, 3],
    );
    const steps = generateDijkstraSteps(graph, 0);
    const last = steps[steps.length - 1]!;
    expect(new Set(last.graph!.visited)).toEqual(new Set([0, 1]));
    expect(last.graph!.visited).not.toContain(2);
    expect(last.graph!.visited).not.toContain(3);
  });

  it("relaxes a cheap two-edge path instead of an expensive direct edge", () => {
    const graph = graphFromWeightedEdges([
      [0, 1, 1],
      [1, 2, 1],
      [0, 2, 10],
    ]);
    const steps = generateDijkstraSteps(graph, 0);
    const last = steps[steps.length - 1]!;
    expect(last.graph!.parent[2]).toBe(1);
    expect(last.graph!.parent[0]).toBeNull();
    expect(last.graph!.dist?.[2]).toBe(2);
    expect(last.graph!.path).toEqual([0, 1, 2]);
  });

  it("contrasts with BFS on the same unweighted topology", () => {
    const graph = graphFromWeightedEdges([
      [0, 1, 1],
      [1, 2, 1],
      [0, 2, 10],
    ]);
    const dijkstra = generateDijkstraSteps(graph, 0);
    const bfs = generateBfsSteps(graph, 0);
    const dLast = dijkstra[dijkstra.length - 1]!;
    const bLast = bfs[bfs.length - 1]!;
    expect(dLast.graph!.parent[2]).toBe(1);
    expect(bLast.graph!.parent[2]).toBe(0);
  });

  it("every step has explanation, codeLineId, and a cloned graph frame", () => {
    const graph = graphFromWeightedEdges([
      [0, 1, 2],
      [0, 2, 9],
      [1, 3, 1],
    ]);
    const steps = generateDijkstraSteps(graph, 0);
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

  it("emits extract-min, relax, and shortest-path language", () => {
    const steps = generateDijkstraSteps(
      graphFromWeightedEdges([
        [0, 1, 1],
        [1, 2, 1],
        [0, 2, 10],
      ]),
      0,
    );
    const ids = new Set(steps.map((s) => s.codeLineId));
    expect(ids.has("init-pq")).toBe(true);
    expect(ids.has("extract-min")).toBe(true);
    expect(ids.has("relax")).toBe(true);
    expect(ids.has("path")).toBe(true);
    expect(ids.has("done")).toBe(true);
    const text = steps.map((s) => s.explanation).join("\n").toLowerCase();
    expect(text).toMatch(/extract-min/);
    expect(text).toMatch(/relax/);
    expect(text).toMatch(/shortest path/);
    expect(text).not.toMatch(/\bdequeue\b/);
    expect(text).not.toMatch(/\bbacktrack\b/);
  });

  it("never re-extracts a settled node for processing", () => {
    const steps = generateDijkstraSteps(
      graphFromWeightedEdges([
        [0, 1, 1],
        [1, 2, 1],
        [0, 2, 10],
      ]),
      0,
    );
    const processed: number[] = [];
    for (const step of steps) {
      if (step.codeLineId === "mark-settled" && step.graph?.current !== null) {
        processed.push(step.graph!.current!);
      }
    }
    expect(processed).toEqual([...new Set(processed)]);
  });
});

describe("weighted parse and randomize", () => {
  it("parseGraphInput round-trips the cheap-path teaching graph", () => {
    const parsed = parseGraphInput("0-1:1, 1-2:1, 0-2:10");
    expect(parsed.ok).toBe(true);
    if (!parsed.ok) return;
    const last = generateDijkstraSteps(parsed.graph, 0).at(-1)!;
    expect(last.graph!.parent[2]).toBe(1);
    expect(last.graph!.dist?.[2]).toBe(2);
  });

  it("never produces negative weights when randomizing a weighted graph", () => {
    for (let i = 0; i < 40; i += 1) {
      const graph = randomGraph(7, { weights: true });
      for (const w of Object.values(graph.weights ?? {})) {
        expect(w).toBeGreaterThan(0);
        expect(Number.isInteger(w)).toBe(true);
      }
      const edges: [number, number][] = [];
      for (const u of graph.nodes) {
        for (const v of graph.adj[u] ?? []) {
          if (u < v) edges.push([u, v]);
        }
      }
      expect(edges.length).toBeGreaterThan(0);
      expect(graph.weights).toBeDefined();
      for (const [u, v] of edges) {
        const key = `${u}-${v}`;
        expect(graph.weights![key]).toBeGreaterThan(0);
      }
    }
  });
});
