import { describe, expect, it } from "vitest";
import { generateHeapSortSteps } from "@/lib/algorithms/heap-sort/generateSteps";

describe("generateHeapSortSteps", () => {
  it("ends with a fully sorted array matching [...input].sort", () => {
    const input = [8, 3, 5, 1, 9, 2];
    const steps = generateHeapSortSteps(input);
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
    generateHeapSortSteps(input);
    expect(input).toEqual(copy);
  });

  it("handles an empty array", () => {
    const steps = generateHeapSortSteps([]);
    expect(steps.length).toBeGreaterThan(0);
    const last = steps[steps.length - 1]!;
    expect(last.array).toEqual([]);
    expect(last.codeLineId).toBe("done");
  });

  it("handles a single-element array", () => {
    const steps = generateHeapSortSteps([7]);
    const last = steps[steps.length - 1]!;
    expect(last.array).toEqual([7]);
    expect(last.codeLineId).toBe("done");
    expect(last.highlights.every((h) => h.kind === "sorted")).toBe(true);
    expect(last.highlights).toHaveLength(1);
  });

  it("handles duplicates", () => {
    const input = [3, 1, 1, 2];
    const steps = generateHeapSortSteps(input);
    expect(steps[steps.length - 1]!.array).toEqual([1, 1, 2, 3]);
  });

  it("every step has a non-empty explanation and codeLineId", () => {
    for (const step of generateHeapSortSteps([5, 1, 4, 2])) {
      expect(step.explanation.trim().length).toBeGreaterThan(0);
      expect(step.codeLineId.trim().length).toBeGreaterThan(0);
      expect(step.array).toHaveLength(4);
    }
  });

  it("emits build/sift then extract phases", () => {
    const ids = generateHeapSortSteps([8, 3, 5, 1]).map((s) => s.codeLineId);
    const firstBuild = ids.indexOf("build");
    const firstSift = ids.indexOf("sift");
    const firstExtract = ids.indexOf("extract");
    expect(firstBuild).toBeGreaterThanOrEqual(0);
    expect(firstSift).toBeGreaterThanOrEqual(0);
    expect(firstExtract).toBeGreaterThan(firstBuild);
    expect(firstExtract).toBeGreaterThan(firstSift);
  });

  it("grows a sorted suffix after each extract", () => {
    const steps = generateHeapSortSteps([4, 1, 3, 2]);
    const extracts = steps.filter((s) => s.codeLineId === "extract");
    expect(extracts).toHaveLength(3);
    extracts.forEach((step, i) => {
      for (let k = 0; k <= i; k += 1) {
        expect(
          step.highlights.some(
            (h) => h.kind === "sorted" && h.index === 3 - k,
          ),
        ).toBe(true);
      }
    });
    const last = steps[steps.length - 1]!;
    expect(last.highlights.every((h) => h.kind === "sorted")).toBe(true);
    expect(last.highlights).toHaveLength(last.array.length);
  });
});
