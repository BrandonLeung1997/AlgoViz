import { describe, expect, it } from "vitest";
import {
  parseArrayInput,
  parseTargetInput,
  parseGraphInput,
  MAX_ARRAY_LENGTH,
  MAX_GRAPH_NODES,
} from "@/lib/algorithms/parseInput";

describe("parseArrayInput", () => {
  it("parses comma-separated integers", () => {
    expect(parseArrayInput("8, 3, 5, 1")).toEqual({
      ok: true,
      values: [8, 3, 5, 1],
    });
  });

  it("rejects empty input", () => {
    const result = parseArrayInput("  ");
    expect(result.ok).toBe(false);
  });

  it("rejects non-integers", () => {
    const result = parseArrayInput("1, a, 3");
    expect(result.ok).toBe(false);
  });

  it("rejects arrays longer than MAX_ARRAY_LENGTH", () => {
    const raw = Array.from({ length: MAX_ARRAY_LENGTH + 1 }, (_, i) => i + 1).join(",");
    const result = parseArrayInput(raw);
    expect(result.ok).toBe(false);
  });
});

describe("parseTargetInput", () => {
  it("parses a single integer", () => {
    expect(parseTargetInput("7")).toEqual({ ok: true, value: 7 });
    expect(parseTargetInput(" -12 ")).toEqual({ ok: true, value: -12 });
  });

  it("rejects empty input", () => {
    const result = parseTargetInput("  ");
    expect(result.ok).toBe(false);
  });

  it("rejects non-integers", () => {
    const result = parseTargetInput("7.5");
    expect(result.ok).toBe(false);
  });
});

describe("parseGraphInput", () => {
  it("parses an undirected edge list", () => {
    const result = parseGraphInput("0-1, 0-2, 1-3");
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.graph.nodes).toEqual([0, 1, 2, 3]);
    expect(result.graph.adj[0]).toEqual(expect.arrayContaining([1, 2]));
    expect(result.graph.adj[1]).toEqual(expect.arrayContaining([0, 3]));
    expect(result.graph.adj[2]).toEqual([0]);
  });

  it("parses an adjacency list", () => {
    const result = parseGraphInput("0:1,2; 1:0,3; 2:0; 3:1");
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.graph.nodes).toEqual([0, 1, 2, 3]);
    expect(result.graph.adj[0]).toEqual([1, 2]);
    expect(result.graph.adj[3]).toEqual([1]);
  });

  it("parses a single isolated node", () => {
    const result = parseGraphInput("0");
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.graph).toEqual({ nodes: [0], adj: { 0: [] } });
  });

  it("rejects empty input", () => {
    expect(parseGraphInput("  ").ok).toBe(false);
  });

  it("rejects graphs with more than MAX_GRAPH_NODES", () => {
    const edges = Array.from({ length: MAX_GRAPH_NODES }, (_, i) => `${i}-${i + 1}`);
    const result = parseGraphInput(edges.join(", "));
    expect(result.ok).toBe(false);
  });

  it("rejects malformed tokens", () => {
    expect(parseGraphInput("0-1, nope").ok).toBe(false);
  });
});
