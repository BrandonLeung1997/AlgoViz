import { describe, expect, it } from "vitest";
import { generateHashChainingSteps } from "@/lib/algorithms/hash-chaining/generateSteps";
import { HASH_CHAINING_CODE } from "@/lib/algorithms/hash-chaining/code";

describe("generateHashChainingSteps", () => {
  it("inserts [10, 15, 20] into bucket 0 when m is 5", () => {
    const last = generateHashChainingSteps([10, 15, 20], 5, 15).at(-1)!;
    expect(last.hash!.buckets![0]).toEqual([10, 15, 20]);
    expect(last.hash!.buckets!.slice(1)).toEqual([[], [], [], []]);
  });

  it("emits search found for 15 after those inserts", () => {
    const steps = generateHashChainingSteps([10, 15, 20], 5, 15);
    expect(
      steps.some((s) => s.codeLineId === "found" && s.hash?.op === "search"),
    ).toBe(true);
  });

  it("emits search miss for 1 after those inserts", () => {
    const steps = generateHashChainingSteps([10, 15, 20], 5, 1);
    expect(steps.some((s) => s.codeLineId === "miss")).toBe(true);
  });

  it("empty keys search miss with no insert", () => {
    const steps = generateHashChainingSteps([], 5, 1);
    expect(steps.some((s) => s.codeLineId === "insert")).toBe(false);
    expect(steps.some((s) => s.codeLineId === "miss")).toBe(true);
  });

  it("skips a duplicate insert", () => {
    const steps = generateHashChainingSteps([10, 10], 5, 10);
    expect(steps.at(-1)!.hash!.buckets![0]).toEqual([10]);
    expect(
      steps.some((s) => s.codeLineId === "found" && s.hash?.op === "insert"),
    ).toBe(true);
  });

  it("does not mutate the input array", () => {
    const keys = [10, 15, 20];
    generateHashChainingSteps(keys, 5, 15);
    expect(keys).toEqual([10, 15, 20]);
  });

  it("every step has hash, explanation, and a valid id", () => {
    const valid = new Set(HASH_CHAINING_CODE.python.map((l) => l.id));
    const runs = [
      generateHashChainingSteps([10, 15, 20], 5, 15),
      generateHashChainingSteps([10, 15, 20], 5, 1),
      generateHashChainingSteps([], 5, 1),
      generateHashChainingSteps([10, 10], 5, 10),
    ];
    for (const steps of runs) {
      expect(steps.length).toBeGreaterThan(0);
      for (const step of steps) {
        expect(step.hash).toBeDefined();
        expect(step.hash!.buckets!.length).toBe(step.hash!.bucketCount);
        expect(step.explanation.trim().length).toBeGreaterThan(0);
        expect(valid.has(step.codeLineId)).toBe(true);
      }
    }
  });
});
