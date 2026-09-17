import { describe, expect, it } from "vitest";
import { generateLinearSearchSteps } from "@/lib/algorithms/linear-search/generateSteps";

describe("generateLinearSearchSteps", () => {
  it("finds the first match index and ends on found", () => {
    const input = [9, 3, 1];
    const steps = generateLinearSearchSteps(input, 3);
    expect(steps.length).toBeGreaterThan(0);
    const last = steps[steps.length - 1]!;
    expect(last.codeLineId).toBe("found");
    expect(last.array).toEqual([9, 3, 1]);
    const found = last.highlights.find((h) => h.kind === "sorted");
    expect(found).toBeDefined();
    expect(found!.index).toBe(1);
    expect(last.array[found!.index]).toBe(3);
  });

  it("stops at the first duplicate rather than a later match", () => {
    const steps = generateLinearSearchSteps([2, 5, 5, 1], 5);
    const last = steps[steps.length - 1]!;
    expect(last.codeLineId).toBe("found");
    const found = last.highlights.find((h) => h.kind === "sorted");
    expect(found?.index).toBe(1);
  });

  it("ends on not-found when the target is absent", () => {
    const steps = generateLinearSearchSteps([9, 3, 1], 4);
    expect(steps[steps.length - 1]!.codeLineId).toBe("not-found");
  });

  it("handles an empty array", () => {
    const steps = generateLinearSearchSteps([], 1);
    expect(steps.length).toBeGreaterThan(0);
    expect(steps[steps.length - 1]!.codeLineId).toBe("not-found");
    expect(steps[steps.length - 1]!.array).toEqual([]);
  });

  it("does not mutate the original input array", () => {
    const input = [4, 2, 3];
    const copy = [...input];
    generateLinearSearchSteps(input, 3);
    expect(input).toEqual(copy);
  });

  it("does not require or produce a sorted array", () => {
    const input = [9, 3, 1];
    const steps = generateLinearSearchSteps(input, 3);
    expect(steps[0]!.array).toEqual([9, 3, 1]);
    expect(steps[steps.length - 1]!.array).toEqual([9, 3, 1]);
    expect(steps[steps.length - 1]!.codeLineId).toBe("found");
  });

  it("highlights comparing on the current index before a hit", () => {
    const steps = generateLinearSearchSteps([9, 3, 1], 3);
    const compare = steps.find((s) => s.codeLineId === "compare");
    expect(compare).toBeDefined();
    expect(compare!.highlights.some((h) => h.kind === "comparing")).toBe(true);
  });

  it("every step has explanation, codeLineId, and a cloned array", () => {
    const input = [9, 3, 1, 7];
    const steps = generateLinearSearchSteps(input, 7);
    expect(steps.length).toBeGreaterThan(1);
    for (const step of steps) {
      expect(step.explanation.trim().length).toBeGreaterThan(0);
      expect(step.codeLineId.trim().length).toBeGreaterThan(0);
      expect(step.array).toEqual(input);
      expect(step.array).not.toBe(input);
    }
  });
});
