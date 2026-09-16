import { describe, expect, it } from "vitest";
import { MERGE_SORT_CODE } from "@/lib/algorithms/merge-sort/code";
import { generateMergeSortSteps } from "@/lib/algorithms/merge-sort/generateSteps";
import { BINARY_SEARCH_CODE } from "@/lib/algorithms/binary-search/code";
import { generateBinarySearchSteps } from "@/lib/algorithms/binary-search/generateSteps";
import { QUICK_SORT_CODE } from "@/lib/algorithms/quick-sort/code";
import { generateQuickSortSteps } from "@/lib/algorithms/quick-sort/generateSteps";
import { BFS_CODE } from "@/lib/algorithms/bfs/code";
import { generateBfsSteps } from "@/lib/algorithms/bfs/generateSteps";
import type { Graph } from "@/lib/algorithms/types";

describe("merge sort code line ids", () => {
  it("python, javascript, and cpp share the same id set", () => {
    const ids = (lang: keyof typeof MERGE_SORT_CODE) =>
      new Set(MERGE_SORT_CODE[lang].map((l) => l.id));
    expect(ids("javascript")).toEqual(ids("python"));
    expect(ids("cpp")).toEqual(ids("python"));
  });

  it("every generated step codeLineId exists in the listings", () => {
    const valid = new Set(MERGE_SORT_CODE.python.map((l) => l.id));
    for (const step of generateMergeSortSteps([9, 4, 1, 7, 3])) {
      expect(valid.has(step.codeLineId)).toBe(true);
    }
  });
});

describe("binary search code line ids", () => {
  it("python, javascript, and cpp share the same id set", () => {
    const ids = (lang: keyof typeof BINARY_SEARCH_CODE) =>
      new Set(BINARY_SEARCH_CODE[lang].map((l) => l.id));
    expect(ids("javascript")).toEqual(ids("python"));
    expect(ids("cpp")).toEqual(ids("python"));
  });

  it("every generated step codeLineId exists in the listings", () => {
    const valid = new Set(BINARY_SEARCH_CODE.python.map((l) => l.id));
    const runs = [
      generateBinarySearchSteps([1, 3, 5, 7, 9], 7),
      generateBinarySearchSteps([1, 3, 5, 7, 9], 4),
      generateBinarySearchSteps([1, 3, 5, 7, 9], 1),
      generateBinarySearchSteps([1, 3, 5, 7, 9], 9),
      generateBinarySearchSteps([], 1),
    ];
    for (const steps of runs) {
      for (const step of steps) {
        expect(valid.has(step.codeLineId)).toBe(true);
      }
    }
  });
});

describe("quick sort code line ids", () => {
  it("python, javascript, and cpp share the same id set", () => {
    const ids = (lang: keyof typeof QUICK_SORT_CODE) =>
      new Set(QUICK_SORT_CODE[lang].map((l) => l.id));
    expect(ids("javascript")).toEqual(ids("python"));
    expect(ids("cpp")).toEqual(ids("python"));
  });

  it("every generated step codeLineId exists in the listings", () => {
    const valid = new Set(QUICK_SORT_CODE.python.map((l) => l.id));
    const runs = [
      generateQuickSortSteps([9, 4, 1, 7, 3]),
      generateQuickSortSteps([1, 2, 3, 4]),
      generateQuickSortSteps([7]),
      generateQuickSortSteps([]),
    ];
    for (const steps of runs) {
      for (const step of steps) {
        expect(valid.has(step.codeLineId)).toBe(true);
      }
    }
  });
});

describe("bfs code line ids", () => {
  const demo: Graph = {
    nodes: [0, 1, 2, 3],
    adj: { 0: [1, 2], 1: [0, 3], 2: [0], 3: [1] },
  };

  it("python, javascript, and cpp share the same id set", () => {
    const ids = (lang: keyof typeof BFS_CODE) =>
      new Set(BFS_CODE[lang].map((l) => l.id));
    expect(ids("javascript")).toEqual(ids("python"));
    expect(ids("cpp")).toEqual(ids("python"));
  });

  it("every generated step codeLineId exists in the listings", () => {
    const valid = new Set(BFS_CODE.python.map((l) => l.id));
    const runs = [
      generateBfsSteps(demo, 0),
      generateBfsSteps({ nodes: [0], adj: { 0: [] } }, 0),
      generateBfsSteps(
        {
          nodes: [0, 1, 2],
          adj: { 0: [1], 1: [0], 2: [] },
        },
        0,
      ),
    ];
    for (const steps of runs) {
      for (const step of steps) {
        expect(valid.has(step.codeLineId)).toBe(true);
      }
    }
  });
});
