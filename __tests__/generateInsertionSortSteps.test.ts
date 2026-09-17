import { describe, expect, it } from "vitest";
import { generateInsertionSortSteps } from "@/lib/algorithms/insertion-sort/generateSteps";

describe("generateInsertionSortSteps", () => {
  it("ends with a fully sorted array matching [...input].sort", () => {
    const input = [8, 3, 5, 1, 9, 2];
    const steps = generateInsertionSortSteps(input);
    expect(steps.length).toBeGreaterThan(0);
    const last = steps[steps.length - 1]!;
    expect(last.array).toEqual([...input].sort((a, b) => a - b));
    expect(last.codeLineId).toBe("done");
    expect(last.highlights.every((h) => h.kind === "sorted")).toBe(true);
    expect(last.highlights).toHaveLength(last.array.length);
  });

  it("does not mutate the original input array", () => {
    const input = [4, 2, 3];
    const copy = [...input];
    generateInsertionSortSteps(input);
    expect(input).toEqual(copy);
  });

  it("handles an empty array", () => {
    const steps = generateInsertionSortSteps([]);
    expect(steps.length).toBeGreaterThan(0);
    const last = steps[steps.length - 1]!;
    expect(last.array).toEqual([]);
    expect(last.codeLineId).toBe("done");
  });

  it("handles a single-element array", () => {
    const steps = generateInsertionSortSteps([7]);
    const last = steps[steps.length - 1]!;
    expect(last.array).toEqual([7]);
    expect(last.codeLineId).toBe("done");
    expect(last.highlights.every((h) => h.kind === "sorted")).toBe(true);
    expect(last.highlights).toHaveLength(1);
  });

  it("handles an already-sorted array", () => {
    const input = [1, 2, 3, 4];
    const steps = generateInsertionSortSteps(input);
    expect(steps[steps.length - 1]!.array).toEqual(input);
  });

  it("handles a reverse-sorted array", () => {
    const input = [4, 3, 2, 1];
    const steps = generateInsertionSortSteps(input);
    expect(steps[steps.length - 1]!.array).toEqual([1, 2, 3, 4]);
  });

  it("every step has a non-empty explanation and codeLineId", () => {
    for (const step of generateInsertionSortSteps([5, 1, 4, 2])) {
      expect(step.explanation.trim().length).toBeGreaterThan(0);
      expect(step.codeLineId.trim().length).toBeGreaterThan(0);
      expect(step.array).toHaveLength(4);
    }
  });

  it("emits shifts on unsorted input", () => {
    const ids = new Set(
      generateInsertionSortSteps([8, 3, 5, 1, 9, 2]).map((s) => s.codeLineId),
    );
    expect(ids.has("shift")).toBe(true);
    expect(ids.has("compare")).toBe(true);
    expect(ids.has("insert")).toBe(true);
  });

  it("marks the grown prefix as sorted after each insert", () => {
    const steps = generateInsertionSortSteps([4, 1, 3, 2]);
    const inserts = steps.filter((s) => s.codeLineId === "insert");
    expect(inserts.length).toBe(3);
    inserts.forEach((step, k) => {
      const prefixLen = k + 2;
      for (let i = 0; i < prefixLen; i += 1) {
        expect(
          step.highlights.some((h) => h.kind === "sorted" && h.index === i),
        ).toBe(true);
      }
    });
    const last = steps[steps.length - 1]!;
    expect(last.highlights.every((h) => h.kind === "sorted")).toBe(true);
    expect(last.highlights).toHaveLength(last.array.length);
  });
});
