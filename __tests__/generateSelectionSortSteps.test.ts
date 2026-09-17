import { describe, expect, it } from "vitest";
import { generateSelectionSortSteps } from "@/lib/algorithms/selection-sort/generateSteps";

describe("generateSelectionSortSteps", () => {
  it("ends with a fully sorted array matching [...input].sort", () => {
    const input = [8, 3, 5, 1, 9, 2];
    const steps = generateSelectionSortSteps(input);
    expect(steps.length).toBeGreaterThan(0);
    const last = steps[steps.length - 1]!;
    expect(last.array).toEqual([...input].sort((a, b) => a - b));
    expect(last.codeLineId).toBe("done");
    expect(last.highlights.every((h) => h.kind === "sorted")).toBe(true);
    expect(last.highlights).toHaveLength(last.array.length);
  });

  it("does not mutate the original input array", () => {
    const input = [4, 2, 3];
    const copy = [...input];
    generateSelectionSortSteps(input);
    expect(input).toEqual(copy);
  });

  it("handles an empty array", () => {
    const steps = generateSelectionSortSteps([]);
    expect(steps.length).toBeGreaterThan(0);
    const last = steps[steps.length - 1]!;
    expect(last.array).toEqual([]);
    expect(last.codeLineId).toBe("done");
  });

  it("handles a single-element array", () => {
    const steps = generateSelectionSortSteps([7]);
    const last = steps[steps.length - 1]!;
    expect(last.array).toEqual([7]);
    expect(last.codeLineId).toBe("done");
    expect(last.highlights.every((h) => h.kind === "sorted")).toBe(true);
    expect(last.highlights).toHaveLength(1);
  });

  it("handles duplicates", () => {
    const input = [3, 1, 1, 2];
    const steps = generateSelectionSortSteps(input);
    expect(steps[steps.length - 1]!.array).toEqual([1, 1, 2, 3]);
  });

  it("every step has a non-empty explanation and codeLineId", () => {
    for (const step of generateSelectionSortSteps([5, 1, 4, 2])) {
      expect(step.explanation.trim().length).toBeGreaterThan(0);
      expect(step.codeLineId.trim().length).toBeGreaterThan(0);
      expect(step.array).toHaveLength(4);
    }
  });

  it("emits a swap or place step", () => {
    const ids = new Set(
      generateSelectionSortSteps([8, 3, 5, 1]).map((s) => s.codeLineId),
    );
    expect(ids.has("swap")).toBe(true);
  });

  it("still emits place steps on already-sorted input (no early exit)", () => {
    const steps = generateSelectionSortSteps([1, 2, 3, 4]);
    const ids = steps.map((s) => s.codeLineId);
    expect(ids.filter((id) => id === "swap")).toHaveLength(3);
    expect(ids.filter((id) => id === "scan")).toHaveLength(6);
    expect(steps[steps.length - 1]!.array).toEqual([1, 2, 3, 4]);
  });

  it("grows a sorted prefix after each pass", () => {
    const steps = generateSelectionSortSteps([4, 1, 3, 2]);
    const passEnds = steps.filter((s) => s.codeLineId === "pass-end");
    expect(passEnds.length).toBe(3);
    passEnds.forEach((step, i) => {
      for (let k = 0; k <= i; k += 1) {
        expect(
          step.highlights.some((h) => h.kind === "sorted" && h.index === k),
        ).toBe(true);
      }
    });
    const last = steps[steps.length - 1]!;
    expect(last.highlights.every((h) => h.kind === "sorted")).toBe(true);
    expect(last.highlights).toHaveLength(last.array.length);
  });
});
