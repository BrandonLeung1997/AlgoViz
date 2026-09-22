import { describe, expect, it } from "vitest";
import { generateLinearProbingSteps } from "@/lib/algorithms/linear-probing/generateSteps";
import { LINEAR_PROBING_CODE } from "@/lib/algorithms/linear-probing/code";

describe("generateLinearProbingSteps", () => {
  it("places 5 at slot 5 and 12 at slot 6 when m is 7", () => {
    const last = generateLinearProbingSteps([5, 12], 7, 12).at(-1)!;
    expect(last.hash!.layout).toBe("probe");
    expect(last.hash!.slots).toEqual([null, null, null, null, null, 5, 12]);
  });

  it("emits search found for 12 after those inserts", () => {
    const steps = generateLinearProbingSteps([5, 12], 7, 12);
    expect(
      steps.some((s) => s.codeLineId === "found" && s.hash?.op === "search"),
    ).toBe(true);
  });

  it("emits search miss for 4 after those inserts", () => {
    const steps = generateLinearProbingSteps([5, 12], 7, 4);
    expect(steps.some((s) => s.codeLineId === "miss")).toBe(true);
    const miss = steps.find((s) => s.codeLineId === "miss")!;
    expect(miss.hash?.probeIndex).toBe(4);
  });

  it("emits full for too many keys and still finishes with a search", () => {
    const steps = generateLinearProbingSteps([0, 1, 2, 99], 3, 0);
    expect(steps.some((s) => s.codeLineId === "full")).toBe(true);
    expect(steps.at(-1)).toBeDefined();
    expect(steps.at(-1)!.codeLineId).toBe("done");
    const fullAt = steps.findIndex((s) => s.codeLineId === "full");
    expect(
      steps.slice(fullAt).some((s) => s.hash?.op === "search"),
    ).toBe(true);
  });

  it("skips a duplicate insert", () => {
    const steps = generateLinearProbingSteps([5, 5], 7, 5);
    expect(steps.at(-1)!.hash!.slots![5]).toBe(5);
    expect(steps.at(-1)!.hash!.slots!.filter((x) => x !== null)).toEqual([5]);
    expect(
      steps.some((s) => s.codeLineId === "found" && s.hash?.op === "insert"),
    ).toBe(true);
  });

  it("empty keys search miss with no insert", () => {
    const steps = generateLinearProbingSteps([], 7, 1);
    expect(steps.some((s) => s.codeLineId === "insert")).toBe(false);
    expect(steps.some((s) => s.codeLineId === "miss")).toBe(true);
  });

  it("wrap search miss when the table is full of other keys", () => {
    const steps = generateLinearProbingSteps([0, 1, 2], 3, 99);
    expect(steps.some((s) => s.codeLineId === "miss")).toBe(true);
    expect(steps.some((s) => s.codeLineId === "full")).toBe(false);
  });

  it("does not mutate the input array", () => {
    const keys = [5, 12];
    generateLinearProbingSteps(keys, 7, 12);
    expect(keys).toEqual([5, 12]);
  });

  it("every step has probe hash, explanation, and a valid id", () => {
    const valid = new Set(LINEAR_PROBING_CODE.python.map((l) => l.id));
    const runs = [
      generateLinearProbingSteps([5, 12], 7, 12),
      generateLinearProbingSteps([5, 12], 7, 4),
      generateLinearProbingSteps([], 7, 1),
      generateLinearProbingSteps([5, 5], 7, 5),
      generateLinearProbingSteps([0, 1, 2, 99], 3, 0),
      generateLinearProbingSteps([0, 1, 2], 3, 99),
    ];
    for (const steps of runs) {
      expect(steps.length).toBeGreaterThan(0);
      for (const step of steps) {
        expect(step.hash).toBeDefined();
        expect(step.hash!.layout).toBe("probe");
        expect(step.hash!.slots!.length).toBe(step.hash!.bucketCount);
        expect(step.explanation.trim().length).toBeGreaterThan(0);
        expect(valid.has(step.codeLineId)).toBe(true);
      }
    }
  });
});
