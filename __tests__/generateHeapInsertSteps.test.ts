import { describe, expect, it } from "vitest";
import { generateHeapInsertSteps } from "@/lib/algorithms/heap-insert/generateSteps";
import { HEAP_INSERT_CODE } from "@/lib/algorithms/heap-insert/code";

function isMaxHeap(values: number[], heapSize = values.length): boolean {
  for (let i = 0; i < heapSize; i += 1) {
    const left = 2 * i + 1;
    const right = 2 * i + 2;
    if (left < heapSize && values[i]! < values[left]!) return false;
    if (right < heapSize && values[i]! < values[right]!) return false;
  }
  return true;
}

describe("generateHeapInsertSteps", () => {
  it("inserts 8 into [9, 5, 6, 1] and sifts it up so the heap property holds", () => {
    const heap = [9, 5, 6, 1];
    const steps = generateHeapInsertSteps(heap, 8);
    expect(steps.length).toBeGreaterThan(0);
    const last = steps[steps.length - 1]!;
    expect(last.codeLineId).toBe("done");
    expect(last.heap).toBeDefined();
    expect(last.heap!.values).toHaveLength(5);
    expect(last.heap!.heapSize).toBe(5);
    expect(isMaxHeap(last.heap!.values, last.heap!.heapSize)).toBe(true);
    expect([...last.heap!.values].sort((a, b) => a - b)).toEqual([1, 5, 6, 8, 9]);
    expect(last.heap!.values[last.heap!.values.length - 1]).not.toBe(8);
  });

  it("inserts into an empty heap as a single-element heap", () => {
    const steps = generateHeapInsertSteps([], 7);
    const last = steps[steps.length - 1]!;
    expect(last.codeLineId).toBe("done");
    expect(last.heap!.values).toEqual([7]);
    expect(last.heap!.heapSize).toBe(1);
    expect(isMaxHeap(last.heap!.values)).toBe(true);
  });

  it("inserts a larger value into [4] and sifts it to the root", () => {
    const last = generateHeapInsertSteps([4], 9).at(-1)!;
    expect(last.codeLineId).toBe("done");
    expect(last.heap!.values).toEqual([9, 4]);
    expect(isMaxHeap(last.heap!.values)).toBe(true);
  });

  it("inserts a smaller value into [4] without bubbling it up", () => {
    const last = generateHeapInsertSteps([4], 2).at(-1)!;
    expect(last.codeLineId).toBe("done");
    expect(last.heap!.values).toEqual([4, 2]);
    expect(isMaxHeap(last.heap!.values)).toBe(true);
  });

  it("does not mutate the original heap array", () => {
    const heap = [9, 5, 6, 1];
    const copy = [...heap];
    generateHeapInsertSteps(heap, 8);
    expect(heap).toEqual(copy);
  });

  it("emits append then compare and swap when the new value must rise", () => {
    const ids = generateHeapInsertSteps([9, 5, 6, 1], 8).map((s) => s.codeLineId);
    expect(ids[0]).toBe("fn-def");
    expect(ids).toContain("append");
    expect(ids).toContain("compare");
    expect(ids).toContain("swap");
    expect(ids[ids.length - 1]).toBe("done");
    expect(ids.indexOf("append")).toBeLessThan(ids.indexOf("compare"));
    expect(ids.indexOf("compare")).toBeLessThan(ids.indexOf("swap"));
  });

  it("every step has explanation, heap frame, and a valid codeLineId", () => {
    const valid = new Set(HEAP_INSERT_CODE.python.map((l) => l.id));
    const runs = [
      generateHeapInsertSteps([9, 5, 6, 1], 8),
      generateHeapInsertSteps([], 7),
      generateHeapInsertSteps([4], 9),
      generateHeapInsertSteps([4], 2),
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
