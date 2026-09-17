import { describe, expect, it } from "vitest";
import {
  parseArrayInput,
  parseHeapInput,
  parseListInput,
  parseTargetInput,
  parseGraphInput,
  parseStringInput,
  formatGraphInput,
  MAX_ARRAY_LENGTH,
  MAX_GRAPH_NODES,
  MAX_HEAP_SIZE,
  MAX_LIST_LENGTH,
  MAX_STRING_LENGTH,
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

describe("parseHeapInput", () => {
  it("parses a heap-sized array", () => {
    expect(parseHeapInput("8, 3, 5, 1")).toEqual({
      ok: true,
      values: [8, 3, 5, 1],
    });
  });

  it("rejects arrays longer than MAX_HEAP_SIZE", () => {
    const raw = Array.from({ length: MAX_HEAP_SIZE + 1 }, (_, i) => i + 1).join(",");
    const result = parseHeapInput(raw);
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error).toContain(String(MAX_HEAP_SIZE));
    }
  });
});

describe("parseListInput", () => {
  it("parses a list-sized array", () => {
    expect(parseListInput("1, 2, 3, 4")).toEqual({
      ok: true,
      values: [1, 2, 3, 4],
    });
  });

  it("rejects arrays longer than MAX_LIST_LENGTH", () => {
    const raw = Array.from({ length: MAX_LIST_LENGTH + 1 }, (_, i) => i + 1).join(
      ",",
    );
    const result = parseListInput(raw);
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error).toContain(String(MAX_LIST_LENGTH));
    }
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

  it("parses weighted edges with colon or parentheses", () => {
    const colon = parseGraphInput("0-1:4, 1-2:1, 0-2:10");
    expect(colon.ok).toBe(true);
    if (!colon.ok) return;
    expect(colon.graph.nodes).toEqual([0, 1, 2]);
    expect(colon.graph.adj[0]).toEqual(expect.arrayContaining([1, 2]));
    expect(colon.graph.weights).toEqual({ "0-1": 4, "1-2": 1, "0-2": 10 });

    const parens = parseGraphInput("0-1 (4), 1-2 (1), 0-2 (10)");
    expect(parens.ok).toBe(true);
    if (!parens.ok) return;
    expect(parens.graph.weights).toEqual({ "0-1": 4, "1-2": 1, "0-2": 10 });
  });

  it("parses a weighted adjacency list without breaking unweighted lists", () => {
    const weighted = parseGraphInput("0:1:4,2:1; 1:0:4,2:1; 2:0:1,1:1");
    expect(weighted.ok).toBe(true);
    if (!weighted.ok) return;
    expect(weighted.graph.adj[0]).toEqual([1, 2]);
    expect(weighted.graph.weights?.["0-1"]).toBe(4);
    expect(weighted.graph.weights?.["0-2"]).toBe(1);
    expect(weighted.graph.weights?.["1-2"]).toBe(1);

    const unweighted = parseGraphInput("0:1,2; 1:0,3; 2:0; 3:1");
    expect(unweighted.ok).toBe(true);
    if (!unweighted.ok) return;
    expect(unweighted.graph.adj[0]).toEqual([1, 2]);
    expect(unweighted.graph.weights).toBeUndefined();
  });

  it("rejects negative edge weights", () => {
    const colon = parseGraphInput("0-1:-3");
    expect(colon.ok).toBe(false);
    if (colon.ok) return;
    expect(colon.error.toLowerCase()).toMatch(/negative/);

    const parens = parseGraphInput("0-1 (-2)");
    expect(parens.ok).toBe(false);
    if (parens.ok) return;
    expect(parens.error.toLowerCase()).toMatch(/negative/);

    const adj = parseGraphInput("0:1:-5");
    expect(adj.ok).toBe(false);
    if (adj.ok) return;
    expect(adj.error.toLowerCase()).toMatch(/negative/);
  });

  it("formats unweighted graphs as before and weighted graphs with colon weights", () => {
    const unweighted = parseGraphInput("0-1, 0-2, 1-3");
    expect(unweighted.ok).toBe(true);
    if (!unweighted.ok) return;
    expect(formatGraphInput(unweighted.graph)).toBe("0-1, 0-2, 1-3");

    const weighted = parseGraphInput("0-1:4, 1-2:1, 0-2:10");
    expect(weighted.ok).toBe(true);
    if (!weighted.ok) return;
    expect(formatGraphInput(weighted.graph)).toBe("0-1:4, 0-2:10, 1-2");
  });

  it("keeps undirected 0-1 as both directions when directed mode is off", () => {
    const result = parseGraphInput("0-1");
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.graph.adj[0]).toEqual([1]);
    expect(result.graph.adj[1]).toEqual([0]);
  });

  it("parses directed 0>1 and 0->1 as one-way edges", () => {
    const gt = parseGraphInput("0>1, 0>2, 1>3, 2>3", { directed: true });
    expect(gt.ok).toBe(true);
    if (!gt.ok) return;
    expect(gt.graph.nodes).toEqual([0, 1, 2, 3]);
    expect(gt.graph.adj[0]).toEqual(expect.arrayContaining([1, 2]));
    expect(gt.graph.adj[1]).toEqual([3]);
    expect(gt.graph.adj[2]).toEqual([3]);
    expect(gt.graph.adj[3]).toEqual([]);
    expect(gt.graph.adj[1]).not.toContain(0);

    const arrow = parseGraphInput("0->1, 1->2", { directed: true });
    expect(arrow.ok).toBe(true);
    if (!arrow.ok) return;
    expect(arrow.graph.adj[0]).toEqual([1]);
    expect(arrow.graph.adj[1]).toEqual([2]);
    expect(arrow.graph.adj[2]).toEqual([]);
    expect(arrow.graph.adj[1]).not.toContain(0);
  });

  it("rejects undirected 0-1 in directed mode so Kahn is never fed a 2-cycle by accident", () => {
    const result = parseGraphInput("0-1, 1-2", { directed: true });
    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.error.toLowerCase()).toMatch(/directed/);
    expect(result.error).toMatch(/>|→|->/);
  });

  it("keeps adjacency lists one-way in directed mode", () => {
    const result = parseGraphInput("0:1,2; 1:3; 2:3; 3:", { directed: true });
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.graph.adj[0]).toEqual([1, 2]);
    expect(result.graph.adj[3]).toEqual([]);
    expect(result.graph.adj[1]).not.toContain(0);
  });

  it("formats directed graphs with > and round-trips", () => {
    const parsed = parseGraphInput("0>1, 0>2, 1>3, 2>3", { directed: true });
    expect(parsed.ok).toBe(true);
    if (!parsed.ok) return;
    const formatted = formatGraphInput(parsed.graph, { directed: true });
    expect(formatted).toMatch(/>/);
    expect(formatted).not.toMatch(/\d-\d/);
    const again = parseGraphInput(formatted, { directed: true });
    expect(again.ok).toBe(true);
    if (!again.ok) return;
    expect(again.graph.adj).toEqual(parsed.graph.adj);
  });

  it("parses directed weighted edges including negatives when allowed", () => {
    const result = parseGraphInput("0>1:4, 0->2:-2", {
      directed: true,
      allowNegative: true,
    });
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.graph.nodes).toEqual([0, 1, 2]);
    expect(result.graph.adj[0]).toEqual(expect.arrayContaining([1, 2]));
    expect(result.graph.adj[1]).not.toContain(0);
    expect(result.graph.adj[2]).not.toContain(0);
    expect(result.graph.weights).toBeUndefined();
    expect(result.graph.directedWeights).toEqual({ "0>1": 4, "0>2": -2 });
  });

  it("parses positive directed weights without allowNegative", () => {
    const result = parseGraphInput("0>1:4, 1>2:1", { directed: true });
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.graph.directedWeights).toEqual({ "0>1": 4, "1>2": 1 });
    expect(result.graph.weights).toBeUndefined();
  });

  it("still rejects negatives in directed mode without allowNegative", () => {
    const result = parseGraphInput("0>1:-2", { directed: true });
    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.error.toLowerCase()).toMatch(/negative/);
  });

  it("formats directed weighted graphs and round-trips negatives", () => {
    const parsed = parseGraphInput("0>1:4, 0>2:-2", {
      directed: true,
      allowNegative: true,
    });
    expect(parsed.ok).toBe(true);
    if (!parsed.ok) return;
    const formatted = formatGraphInput(parsed.graph, { directed: true });
    expect(formatted).toMatch(/0>1:4/);
    expect(formatted).toMatch(/0>2:-2/);
    expect(formatted).not.toMatch(/\d-\d/);
    const again = parseGraphInput(formatted, {
      directed: true,
      allowNegative: true,
    });
    expect(again.ok).toBe(true);
    if (!again.ok) return;
    expect(again.graph.adj).toEqual(parsed.graph.adj);
    expect(again.graph.directedWeights).toEqual(parsed.graph.directedWeights);
  });

  it("parses directed weighted adjacency lists with negatives", () => {
    const result = parseGraphInput("0:1:4,2:-2; 1:; 2:", {
      directed: true,
      allowNegative: true,
    });
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.graph.adj[0]).toEqual([1, 2]);
    expect(result.graph.adj[1]).toEqual([]);
    expect(result.graph.adj[1]).not.toContain(0);
    expect(result.graph.weights).toBeUndefined();
    expect(result.graph.directedWeights?.["0>1"]).toBe(4);
    expect(result.graph.directedWeights?.["0>2"]).toBe(-2);
  });
});

describe("parseStringInput", () => {
  it("accepts an empty string as a valid LCS sequence", () => {
    expect(parseStringInput("")).toEqual({ ok: true, value: "" });
  });

  it("parses letters and digits and trims outer whitespace", () => {
    expect(parseStringInput(" ABCD ")).toEqual({ ok: true, value: "ABCD" });
    expect(parseStringInput("A1b2")).toEqual({ ok: true, value: "A1b2" });
  });

  it("rejects whitespace-only junk", () => {
    const result = parseStringInput("   ");
    expect(result.ok).toBe(false);
  });

  it("rejects punctuation, inner spaces, and other junk", () => {
    expect(parseStringInput("A B").ok).toBe(false);
    expect(parseStringInput("AB-CD").ok).toBe(false);
    expect(parseStringInput("hello!").ok).toBe(false);
  });

  it("rejects strings longer than MAX_STRING_LENGTH", () => {
    const raw = "A".repeat(MAX_STRING_LENGTH + 1);
    const result = parseStringInput(raw);
    expect(result.ok).toBe(false);
  });

  it("accepts a string at the length cap", () => {
    const raw = "A".repeat(MAX_STRING_LENGTH);
    expect(parseStringInput(raw)).toEqual({ ok: true, value: raw });
  });
});
