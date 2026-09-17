import { describe, expect, it } from "vitest";
import { generateHeapifySteps } from "@/lib/algorithms/heapify/generateSteps";
import { HEAPIFY_CODE } from "@/lib/algorithms/heapify/code";

function isMaxHeap(values: number[], heapSize = values.length): boolean {
  for (let i = 0; i < heapSize; i += 1) {
    const left = 2 * i + 1;
    const right = 2 * i + 2;
    if (left < heapSize && values[i]! < values[left]!) return false;
    if (right < heapSize && values[i]! < values[right]!) return false;
  }
  return true;
}

describe("generateHeapifySteps", () => {
  it("ends with a valid max-heap matching Floyd build-heap", () => {
    const input = [1, 5, 3, 8, 2, 9, 4];
    const steps = generateHeapifySteps(input);
    expect(steps.length).toBeGreaterThan(0);
    const last = steps[steps.length - 1]!;
    expect(last.codeLineId).toBe("done");
    expect(last.heap).toBeDefined();
    expect(last.heap!.values).toHaveLength(input.length);
    expect(last.heap!.heapSize).toBe(input.length);
    expect(isMaxHeap(last.heap!.values, last.heap!.heapSize)).toBe(true);
    expect([...last.heap!.values].sort((a, b) => a - b)).toEqual(
      [...input].sort((a, b) => a - b),
    );
  });

  it("does not mutate the original input array", () => {
    const input = [4, 2, 3];
    const copy = [...input];
    generateHeapifySteps(input);
    expect(input).toEqual(copy);
  });

  it("handles an empty array with a done step", () => {
    const steps = generateHeapifySteps([]);
    expect(steps.length).toBeGreaterThan(0);
    const last = steps[steps.length - 1]!;
    expect(last.codeLineId).toBe("done");
    expect(last.heap).toEqual({
      values: [],
      heapSize: 0,
      highlights: [],
    });
  });

  it("handles a single-element array with a done step", () => {
    const steps = generateHeapifySteps([7]);
    const last = steps[steps.length - 1]!;
    expect(last.codeLineId).toBe("done");
    expect(last.heap!.values).toEqual([7]);
    expect(last.heap!.heapSize).toBe(1);
    expect(isMaxHeap(last.heap!.values)).toBe(true);
  });

  it("still reaches done when the input is already a max-heap", () => {
    const input = [9, 8, 7, 4, 5, 6];
    expect(isMaxHeap(input)).toBe(true);
    const steps = generateHeapifySteps(input);
    const last = steps[steps.length - 1]!;
    expect(last.codeLineId).toBe("done");
    expect(last.heap!.values).toEqual(input);
    expect(isMaxHeap(last.heap!.values)).toBe(true);
  });

  it("emits compare and swap steps on an unsorted input", () => {
    const ids = generateHeapifySteps([1, 2, 3, 4, 5]).map((s) => s.codeLineId);
    expect(ids).toContain("compare");
    expect(ids).toContain("swap");
  });

  it("every step has explanation, heap frame, and a valid codeLineId", () => {
    const valid = new Set(HEAPIFY_CODE.python.map((l) => l.id));
    const runs = [
      generateHeapifySteps([5, 1, 4, 2]),
      generateHeapifySteps([7]),
      generateHeapifySteps([]),
      generateHeapifySteps([9, 8, 7, 4, 5, 6]),
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
