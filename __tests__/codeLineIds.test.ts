import { describe, expect, it } from "vitest";
import { MERGE_SORT_CODE } from "@/lib/algorithms/merge-sort/code";
import { generateMergeSortSteps } from "@/lib/algorithms/merge-sort/generateSteps";
import { BINARY_SEARCH_CODE } from "@/lib/algorithms/binary-search/code";
import { generateBinarySearchSteps } from "@/lib/algorithms/binary-search/generateSteps";

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
