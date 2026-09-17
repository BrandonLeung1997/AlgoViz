import { describe, expect, it } from "vitest";
import { generateCycleDetectionSteps } from "@/lib/algorithms/cycle-detection/generateSteps";
import { CYCLE_DETECTION_CODE } from "@/lib/algorithms/cycle-detection/code";
import type { ListFrame } from "@/lib/algorithms/types";

function byId(list: ListFrame) {
  return new Map(list.nodes.map((node) => [node.id, node]));
}

function tailNext(list: ListFrame): number | null {
  if (list.nodes.length === 0) return null;
  const last = list.nodes.find((n) => n.id === list.nodes.length - 1);
  return last?.next ?? null;
}

describe("generateCycleDetectionSteps", () => {
  it("reports no-cycle for acyclic [1,2,3]", () => {
    const steps = generateCycleDetectionSteps([1, 2, 3], null);
    const ids = steps.map((s) => s.codeLineId);
    expect(ids).toContain("no-cycle");
    expect(ids).not.toContain("done");
    const last = steps[steps.length - 1]!;
    expect(last.codeLineId).toBe("no-cycle");
    expect(last.list).toBeDefined();
    expect(tailNext(last.list!)).toBeNull();
    expect(steps.length).toBeLessThanOrEqual(2 * 3 + 5);
  });

  it("reports meet for [1,2,3,4] with cycleIndex 1", () => {
    const steps = generateCycleDetectionSteps([1, 2, 3, 4], 1);
    const ids = steps.map((s) => s.codeLineId);
    expect(ids).toContain("meet");
    expect(ids).toContain("move");
    const last = steps[steps.length - 1]!;
    expect(last.codeLineId).toBe("done");
    expect(last.list).toBeDefined();
    expect(tailNext(last.list!)).toBe(1);
    const meet = steps.find(
      (s) =>
        s.codeLineId === "meet" &&
        s.list?.pointers?.slow != null &&
        s.list.pointers.slow === s.list.pointers.fast,
    );
    expect(meet).toBeDefined();
    expect(steps.length).toBeLessThanOrEqual(2 * 4 + 5);
  });

  it("detects a single-node self-cycle", () => {
    const steps = generateCycleDetectionSteps([7], 0);
    expect(steps.map((s) => s.codeLineId)).toContain("meet");
    const last = steps[steps.length - 1]!;
    expect(last.codeLineId).toBe("done");
    expect(last.list?.nodes).toEqual([{ id: 0, value: 7, next: 0 }]);
    expect(steps.length).toBeLessThanOrEqual(2 * 1 + 5);
  });

  it("reports no-cycle for a single node without a cycle", () => {
    const steps = generateCycleDetectionSteps([7], null);
    expect(steps.map((s) => s.codeLineId)).toContain("no-cycle");
    expect(steps.map((s) => s.codeLineId)).not.toContain("meet");
    const last = steps[steps.length - 1]!;
    expect(last.list?.nodes).toEqual([{ id: 0, value: 7, next: null }]);
  });

  it("does not mutate the original input array", () => {
    const input = [1, 2, 3, 4];
    const copy = [...input];
    generateCycleDetectionSteps(input, 1);
    expect(input).toEqual(copy);
  });

  it("every step has list, explanation, and a valid codeLineId", () => {
    const valid = new Set(CYCLE_DETECTION_CODE.python.map((l) => l.id));
    const runs = [
      generateCycleDetectionSteps([1, 2, 3], null),
      generateCycleDetectionSteps([1, 2, 3, 4], 1),
      generateCycleDetectionSteps([7], 0),
      generateCycleDetectionSteps([7], null),
      generateCycleDetectionSteps([], null),
    ];
    for (const steps of runs) {
      expect(steps.length).toBeGreaterThan(0);
      for (const step of steps) {
        expect(step.explanation.trim().length).toBeGreaterThan(0);
        expect(step.list).toBeDefined();
        expect(valid.has(step.codeLineId)).toBe(true);
        const nodes = byId(step.list!);
        for (const node of step.list!.nodes) {
          expect(nodes.has(node.id)).toBe(true);
          if (node.next !== null) expect(nodes.has(node.next)).toBe(true);
        }
      }
    }
  });

  it("caps steps even on a full-list cycle", () => {
    const values = [1, 2, 3, 4, 5, 6, 7, 8];
    const steps = generateCycleDetectionSteps(values, 0);
    expect(steps.map((s) => s.codeLineId)).toContain("meet");
    expect(steps.length).toBeLessThanOrEqual(2 * values.length + 5);
  });
});
