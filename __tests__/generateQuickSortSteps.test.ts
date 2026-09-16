import { describe, expect, it } from "vitest";
import { generateQuickSortSteps } from "@/lib/algorithms/quick-sort/generateSteps";

describe("generateQuickSortSteps", () => {
  it("ends with a fully sorted array matching [...input].sort", () => {
    const input = [8, 3, 5, 1, 9, 2];
    const steps = generateQuickSortSteps(input);
    expect(steps.length).toBeGreaterThan(0);
    const last = steps[steps.length - 1]!;
    expect(last.array).toEqual([...input].sort((a, b) => a - b));
    expect(last.codeLineId).toBe("done");
  });

  it("does not mutate the original input array", () => {
    const input = [4, 2, 3];
    const copy = [...input];
    generateQuickSortSteps(input);
    expect(input).toEqual(copy);
  });

  it("handles a single-element array", () => {
    const steps = generateQuickSortSteps([7]);
    expect(steps[steps.length - 1]!.array).toEqual([7]);
  });

  it("handles an already-sorted array", () => {
    const input = [1, 2, 3, 4];
    const steps = generateQuickSortSteps(input);
    expect(steps[steps.length - 1]!.array).toEqual(input);
  });

  it("every step has a non-empty explanation and codeLineId", () => {
    for (const step of generateQuickSortSteps([5, 1, 4, 2])) {
      expect(step.explanation.trim().length).toBeGreaterThan(0);
      expect(step.codeLineId.trim().length).toBeGreaterThan(0);
      expect(step.array).toHaveLength(4);
    }
  });

  it("chooses a last-element pivot and highlights it", () => {
    const steps = generateQuickSortSteps([8, 3, 5, 1]);
    const pivotStep = steps.find((s) => s.codeLineId === "choose-pivot");
    expect(pivotStep).toBeDefined();
    const pivot = pivotStep!.highlights.find((h) => h.kind === "pivot");
    expect(pivot).toBeDefined();
    expect(pivot!.index).toBe(3);
    expect(pivotStep!.array[pivot!.index]).toBe(1);
  });

  it("emits partition compares, swaps, and left/right recursion", () => {
    const ids = new Set(
      generateQuickSortSteps([8, 3, 5, 1, 9, 2]).map((s) => s.codeLineId),
    );
    expect(ids.has("compare")).toBe(true);
    expect(ids.has("swap")).toBe(true);
    expect(ids.has("pivot-place")).toBe(true);
    expect(ids.has("recurse-left")).toBe(true);
    expect(ids.has("recurse-right")).toBe(true);
  });

  it("marks placed pivots as sorted before finishing", () => {
    const steps = generateQuickSortSteps([4, 1, 3, 2]);
    const placed = steps.find((s) => s.codeLineId === "pivot-place");
    expect(placed).toBeDefined();
    expect(placed!.highlights.some((h) => h.kind === "sorted")).toBe(true);
    const last = steps[steps.length - 1]!;
    expect(last.highlights.every((h) => h.kind === "sorted")).toBe(true);
    expect(last.highlights).toHaveLength(last.array.length);
  });
});
