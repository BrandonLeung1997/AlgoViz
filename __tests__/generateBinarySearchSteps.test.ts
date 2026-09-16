import { describe, expect, it } from "vitest";
import { generateBinarySearchSteps } from "@/lib/algorithms/binary-search/generateSteps";

describe("generateBinarySearchSteps", () => {
  it("finds a present target and ends on found", () => {
    const input = [1, 3, 5, 7, 9];
    const steps = generateBinarySearchSteps(input, 7);
    expect(steps.length).toBeGreaterThan(0);
    const last = steps[steps.length - 1]!;
    expect(last.codeLineId).toBe("found");
    expect(last.array).toEqual(input);
    const found = last.highlights.find((h) => h.kind === "sorted");
    expect(found).toBeDefined();
    expect(last.array[found!.index]).toBe(7);
  });

  it("ends on not-found when the target is absent", () => {
    const steps = generateBinarySearchSteps([1, 3, 5, 7, 9], 4);
    expect(steps[steps.length - 1]!.codeLineId).toBe("not-found");
  });

  it("does not mutate the original input array", () => {
    const input = [4, 2, 3];
    const copy = [...input];
    generateBinarySearchSteps(input, 3);
    expect(input).toEqual(copy);
  });

  it("visualizes a sorted copy when the input is unsorted", () => {
    const steps = generateBinarySearchSteps([4, 2, 3], 3);
    expect(steps[0]!.array).toEqual([2, 3, 4]);
    expect(steps[steps.length - 1]!.codeLineId).toBe("found");
  });

  it("handles a single-element hit and miss", () => {
    const hit = generateBinarySearchSteps([7], 7);
    expect(hit[hit.length - 1]!.codeLineId).toBe("found");
    const miss = generateBinarySearchSteps([7], 1);
    expect(miss[miss.length - 1]!.codeLineId).toBe("not-found");
  });

  it("handles an empty array", () => {
    const steps = generateBinarySearchSteps([], 1);
    expect(steps.length).toBeGreaterThan(0);
    expect(steps[steps.length - 1]!.codeLineId).toBe("not-found");
  });

  it("every step has explanation, codeLineId, range pointers, and a cloned array", () => {
    const input = [1, 3, 5, 7, 9, 11];
    const steps = generateBinarySearchSteps(input, 9);
    expect(steps.length).toBeGreaterThan(1);
    for (const step of steps) {
      expect(step.explanation.trim().length).toBeGreaterThan(0);
      expect(step.codeLineId.trim().length).toBeGreaterThan(0);
      expect(step.array).toEqual(input);
      expect(step.array).not.toBe(input);
    }
    const probe = steps.find((s) => s.codeLineId === "mid");
    expect(probe?.range).toMatchObject({
      low: expect.any(Number),
      mid: expect.any(Number),
      high: expect.any(Number),
    });
  });

  it("highlights low, mid, and high on probe steps", () => {
    const steps = generateBinarySearchSteps([1, 3, 5, 7, 9], 1);
    const midStep = steps.find((s) => s.codeLineId === "mid");
    expect(midStep).toBeDefined();
    const kinds = new Set(midStep!.highlights.map((h) => h.kind));
    expect(kinds.has("low")).toBe(true);
    expect(kinds.has("mid")).toBe(true);
    expect(kinds.has("high")).toBe(true);
    const mid = midStep!.highlights.find((h) => h.kind === "mid")!;
    expect(mid.index).toBe(midStep!.range?.mid);
  });

  it("narrows right when mid is less than target", () => {
    const steps = generateBinarySearchSteps([1, 3, 5, 7, 9], 9);
    expect(steps.some((s) => s.codeLineId === "go-right")).toBe(true);
  });

  it("narrows left when mid is greater than target", () => {
    const steps = generateBinarySearchSteps([1, 3, 5, 7, 9], 1);
    expect(steps.some((s) => s.codeLineId === "go-left")).toBe(true);
  });
});
