import { describe, expect, it } from "vitest";
import { generateBubbleSortSteps } from "@/lib/algorithms/bubble-sort/generateSteps";

describe("generateBubbleSortSteps", () => {
  it("ends with a fully sorted array matching [...input].sort", () => {
    const input = [8, 3, 5, 1, 9, 2];
    const steps = generateBubbleSortSteps(input);
    expect(steps.length).toBeGreaterThan(0);
    const last = steps[steps.length - 1]!;
    expect(last.array).toEqual([...input].sort((a, b) => a - b));
    expect(last.codeLineId).toBe("done");
  });

  it("does not mutate the original input array", () => {
    const input = [4, 2, 3];
    const copy = [...input];
    generateBubbleSortSteps(input);
    expect(input).toEqual(copy);
  });

  it("handles an empty array", () => {
    const steps = generateBubbleSortSteps([]);
    expect(steps.length).toBeGreaterThan(0);
    const last = steps[steps.length - 1]!;
    expect(last.array).toEqual([]);
    expect(last.codeLineId).toBe("done");
  });

  it("handles a single-element array", () => {
    const steps = generateBubbleSortSteps([7]);
    const last = steps[steps.length - 1]!;
    expect(last.array).toEqual([7]);
    expect(last.codeLineId).toBe("done");
    expect(last.highlights.every((h) => h.kind === "sorted")).toBe(true);
    expect(last.highlights).toHaveLength(1);
  });

  it("handles an already-sorted array", () => {
    const input = [1, 2, 3, 4];
    const steps = generateBubbleSortSteps(input);
    expect(steps[steps.length - 1]!.array).toEqual(input);
  });

  it("every step has a non-empty explanation and codeLineId", () => {
    for (const step of generateBubbleSortSteps([5, 1, 4, 2])) {
      expect(step.explanation.trim().length).toBeGreaterThan(0);
      expect(step.codeLineId.trim().length).toBeGreaterThan(0);
      expect(step.array).toHaveLength(4);
    }
  });

  it("emits compares and swaps", () => {
    const ids = new Set(
      generateBubbleSortSteps([8, 3, 5, 1, 9, 2]).map((s) => s.codeLineId),
    );
    expect(ids.has("compare")).toBe(true);
    expect(ids.has("swap")).toBe(true);
  });

  it("early-exits on already-sorted input", () => {
    const steps = generateBubbleSortSteps([1, 2, 3, 4]);
    expect(steps.some((s) => s.codeLineId === "early-exit")).toBe(true);
    const passCount = steps.filter((s) => s.codeLineId === "pass").length;
    expect(passCount).toBe(1);
  });

  it("marks the bubbled suffix as sorted after a pass", () => {
    const steps = generateBubbleSortSteps([4, 1, 3, 2]);
    const passEnd = steps.find((s) => s.codeLineId === "pass-end");
    expect(passEnd).toBeDefined();
    expect(
      passEnd!.highlights.some((h) => h.kind === "sorted" && h.index === 3),
    ).toBe(true);
    const last = steps[steps.length - 1]!;
    expect(last.highlights.every((h) => h.kind === "sorted")).toBe(true);
    expect(last.highlights).toHaveLength(last.array.length);
  });
});
