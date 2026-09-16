import { describe, expect, it } from "vitest";
import { generateMergeSortSteps } from "@/lib/algorithms/merge-sort/generateSteps";

describe("generateMergeSortSteps", () => {
  it("ends with a fully sorted array matching [...input].sort", () => {
    const input = [8, 3, 5, 1, 9, 2];
    const steps = generateMergeSortSteps(input);
    expect(steps.length).toBeGreaterThan(0);
    const last = steps[steps.length - 1]!;
    expect(last.array).toEqual([...input].sort((a, b) => a - b));
    expect(last.codeLineId).toBe("done");
  });

  it("does not mutate the original input array", () => {
    const input = [4, 2, 3];
    const copy = [...input];
    generateMergeSortSteps(input);
    expect(input).toEqual(copy);
  });

  it("handles a single-element array", () => {
    const steps = generateMergeSortSteps([7]);
    expect(steps[steps.length - 1]!.array).toEqual([7]);
  });

  it("handles an already-sorted array", () => {
    const input = [1, 2, 3, 4];
    const steps = generateMergeSortSteps(input);
    expect(steps[steps.length - 1]!.array).toEqual(input);
  });

  it("every step has a non-empty explanation and codeLineId", () => {
    for (const step of generateMergeSortSteps([5, 1, 4, 2])) {
      expect(step.explanation.trim().length).toBeGreaterThan(0);
      expect(step.codeLineId.trim().length).toBeGreaterThan(0);
      expect(step.array).toHaveLength(4);
    }
  });
});
