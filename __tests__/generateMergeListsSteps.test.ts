import { describe, expect, it } from "vitest";
import { generateMergeListsSteps } from "@/lib/algorithms/merge-lists/generateSteps";
import { MERGE_LISTS_CODE } from "@/lib/algorithms/merge-lists/code";
import type { ListFrame } from "@/lib/algorithms/types";

function walkValues(list: ListFrame): number[] {
  const byId = new Map(list.nodes.map((node) => [node.id, node]));
  const values: number[] = [];
  const seen = new Set<number>();
  let id = list.head;
  while (id !== null) {
    expect(seen.has(id)).toBe(false);
    seen.add(id);
    const node = byId.get(id);
    expect(node).toBeDefined();
    values.push(node!.value);
    id = node!.next;
  }
  return values;
}

describe("generateMergeListsSteps", () => {
  it("merges [1,3,5] and [2,4] into 1,2,3,4,5", () => {
    const steps = generateMergeListsSteps([1, 3, 5], [2, 4]);
    const last = steps[steps.length - 1]!;
    expect(last.codeLineId).toBe("done");
    expect(walkValues(last.list!)).toEqual([1, 2, 3, 4, 5]);
  });

  it("returns the other list when one is empty", () => {
    expect(walkValues(generateMergeListsSteps([], [2, 4]).at(-1)!.list!)).toEqual(
      [2, 4],
    );
    expect(walkValues(generateMergeListsSteps([1, 3], []).at(-1)!.list!)).toEqual(
      [1, 3],
    );
  });

  it("handles both empty", () => {
    const last = generateMergeListsSteps([], []).at(-1)!;
    expect(last.codeLineId).toBe("done");
    expect(last.list!.nodes).toEqual([]);
    expect(last.list!.head).toBeNull();
  });

  it("keeps A ahead on ties", () => {
    const last = generateMergeListsSteps([1, 1], [1, 2]).at(-1)!;
    expect(walkValues(last.list!)).toEqual([1, 1, 1, 2]);
  });

  it("does not mutate the input arrays", () => {
    const a = [1, 3, 5];
    const b = [2, 4];
    generateMergeListsSteps(a, b);
    expect(a).toEqual([1, 3, 5]);
    expect(b).toEqual([2, 4]);
  });

  it("emits compare and attach when both lists are non-empty", () => {
    const ids = generateMergeListsSteps([1, 3, 5], [2, 4]).map((s) => s.codeLineId);
    expect(ids).toContain("compare");
    expect(ids).toContain("attach");
  });

  it("uses A ids 0..n-1 and B ids 100+", () => {
    const step = generateMergeListsSteps([1, 3], [2])[0]!;
    const ids = step.list!.nodes.map((n) => n.id).sort((x, y) => x - y);
    expect(ids).toEqual([0, 1, 100]);
  });

  it("every step has list, p/q keys, explanation, and a valid id", () => {
    const valid = new Set(MERGE_LISTS_CODE.python.map((l) => l.id));
    const runs = [
      generateMergeListsSteps([1, 3, 5], [2, 4]),
      generateMergeListsSteps([], [2]),
      generateMergeListsSteps([1], []),
      generateMergeListsSteps([], []),
      generateMergeListsSteps([1, 1], [1, 2]),
    ];
    for (const steps of runs) {
      expect(steps.length).toBeGreaterThan(0);
      for (const step of steps) {
        expect(step.explanation.trim().length).toBeGreaterThan(0);
        expect(step.list).toBeDefined();
        expect("p" in (step.list!.pointers ?? {})).toBe(true);
        expect("q" in (step.list!.pointers ?? {})).toBe(true);
        expect(valid.has(step.codeLineId)).toBe(true);
      }
    }
  });
});
