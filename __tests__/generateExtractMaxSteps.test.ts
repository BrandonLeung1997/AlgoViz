import { describe, expect, it } from "vitest";
import { generateExtractMaxSteps } from "@/lib/algorithms/extract-max/generateSteps";
import { EXTRACT_MAX_CODE } from "@/lib/algorithms/extract-max/code";

function isMaxHeap(values: number[], heapSize = values.length): boolean {
  for (let i = 0; i < heapSize; i += 1) {
    const left = 2 * i + 1;
    const right = 2 * i + 2;
    if (left < heapSize && values[i]! < values[left]!) return false;
    if (right < heapSize && values[i]! < values[right]!) return false;
  }
  return true;
}

describe("generateExtractMaxSteps", () => {
  it("extracts 9 from [9, 5, 6, 1] and leaves a max-heap of size 3", () => {
    const heap = [9, 5, 6, 1];
    const steps = generateExtractMaxSteps(heap);
    expect(steps.length).toBeGreaterThan(0);
    const last = steps[steps.length - 1]!;
    expect(last.codeLineId).toBe("done");
    expect(last.heap).toBeDefined();
    expect(last.heap!.heapSize).toBe(3);
    expect(last.heap!.values.slice(0, last.heap!.heapSize)).toHaveLength(3);
    expect(last.heap!.values.slice(0, last.heap!.heapSize)).not.toContain(9);
    expect(last.heap!.values).not.toContain(9);
    expect(isMaxHeap(last.heap!.values, last.heap!.heapSize)).toBe(true);
    expect(
      [...last.heap!.values.slice(0, last.heap!.heapSize)].sort((a, b) => a - b),
    ).toEqual([1, 5, 6]);
  });

  it("handles an empty heap with a single done step and does not crash", () => {
    const steps = generateExtractMaxSteps([]);
    expect(steps).toHaveLength(1);
    expect(steps[0]!.codeLineId).toBe("done");
    expect(steps[0]!.heap).toEqual({
      values: [],
      heapSize: 0,
      highlights: [],
    });
  });

  it("extracts the only element and ends with an empty heap, naming it in the explanation", () => {
    const steps = generateExtractMaxSteps([4]);
    const last = steps[steps.length - 1]!;
    expect(last.codeLineId).toBe("done");
    expect(last.heap!.values).toEqual([]);
    expect(last.heap!.heapSize).toBe(0);
    expect(steps.some((s) => s.explanation.includes("4"))).toBe(true);
    expect(last.explanation).toMatch(/4/);
  });

  it("does not mutate the original heap array", () => {
    const heap = [9, 5, 6, 1];
    const copy = [...heap];
    generateExtractMaxSteps(heap);
    expect(heap).toEqual(copy);
  });

  it("decreases heapSize so the extracted slot is not part of the remaining heap", () => {
    const heap = [9, 5, 6, 1];
    const steps = generateExtractMaxSteps(heap);
    expect(steps[0]!.heap!.heapSize).toBe(4);
    const last = steps[steps.length - 1]!;
    expect(last.heap!.heapSize).toBe(3);
    expect(last.heap!.heapSize).toBeLessThan(heap.length);
    expect(last.heap!.heapSize).toBeLessThanOrEqual(last.heap!.values.length);
  });

  it("emits sift-down compare and swap when the new root is small", () => {
    const ids = generateExtractMaxSteps([9, 5, 6, 1]).map((s) => s.codeLineId);
    expect(ids[0]).toBe("fn-def");
    expect(ids).toContain("swap-last");
    expect(ids).toContain("pop");
    expect(ids).toContain("sift");
    expect(ids).toContain("compare");
    expect(ids).toContain("swap");
    expect(ids[ids.length - 1]).toBe("done");
    expect(ids.indexOf("swap-last")).toBeLessThan(ids.indexOf("pop"));
    expect(ids.indexOf("pop")).toBeLessThan(ids.indexOf("sift"));
    expect(ids.indexOf("sift")).toBeLessThan(ids.indexOf("compare"));
    expect(ids.indexOf("compare")).toBeLessThan(ids.indexOf("swap"));
  });

  it("every step has explanation, heap frame, and a valid codeLineId", () => {
    const valid = new Set(EXTRACT_MAX_CODE.python.map((l) => l.id));
    const runs = [
      generateExtractMaxSteps([9, 5, 6, 1]),
      generateExtractMaxSteps([]),
      generateExtractMaxSteps([4]),
      generateExtractMaxSteps([9, 5, 6]),
    ];
    for (const steps of runs) {
      for (const step of steps) {
        expect(step.explanation.trim().length).toBeGreaterThan(0);
        expect(step.heap).toBeDefined();
        expect(step.heap!.values).toEqual(step.array);
        expect(step.heap!.heapSize).toBeGreaterThanOrEqual(0);
        expect(step.heap!.heapSize).toBeLessThanOrEqual(step.heap!.values.length);
        expect(valid.has(step.codeLineId)).toBe(true);
      }
    }
  });
});
