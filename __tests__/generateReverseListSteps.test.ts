import { describe, expect, it } from "vitest";
import { generateReverseListSteps } from "@/lib/algorithms/reverse-list/generateSteps";
import { REVERSE_LIST_CODE } from "@/lib/algorithms/reverse-list/code";
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

function nextSignature(list: ListFrame): string {
  return list.nodes
    .map((node) => `${node.id}:${node.next}`)
    .sort()
    .join("|");
}

describe("generateReverseListSteps", () => {
  it("walks [1,2,3,4] to [4,3,2,1] from the final head", () => {
    const steps = generateReverseListSteps([1, 2, 3, 4]);
    expect(steps.length).toBeGreaterThan(0);
    const last = steps[steps.length - 1]!;
    expect(last.codeLineId).toBe("done");
    expect(last.list).toBeDefined();
    expect(walkValues(last.list!)).toEqual([4, 3, 2, 1]);
    expect(last.list!.nodes.map((n) => n.id).sort((a, b) => a - b)).toEqual([
      0, 1, 2, 3,
    ]);
  });

  it("does not mutate the original input array", () => {
    const input = [1, 2, 3, 4];
    const copy = [...input];
    generateReverseListSteps(input);
    expect(input).toEqual(copy);
  });

  it("handles an empty list with a done step", () => {
    const steps = generateReverseListSteps([]);
    expect(steps.length).toBeGreaterThan(0);
    const last = steps[steps.length - 1]!;
    expect(last.codeLineId).toBe("done");
    expect(last.list).toBeDefined();
    expect(last.list!.nodes).toEqual([]);
    expect(last.list!.head).toBeNull();
    expect(walkValues(last.list!)).toEqual([]);
  });

  it("handles a single node", () => {
    const steps = generateReverseListSteps([7]);
    const last = steps[steps.length - 1]!;
    expect(last.codeLineId).toBe("done");
    expect(walkValues(last.list!)).toEqual([7]);
    expect(last.list!.head).toBe(0);
    expect(last.list!.nodes).toEqual([{ id: 0, value: 7, next: null }]);
  });

  it("emits intermediate steps that change a next pointer", () => {
    const steps = generateReverseListSteps([1, 2, 3, 4]);
    const ids = steps.map((s) => s.codeLineId);
    expect(ids).toContain("save-next");
    expect(ids).toContain("relink");
    expect(ids).toContain("advance");
    const signatures = steps.map((s) => nextSignature(s.list!));
    expect(new Set(signatures).size).toBeGreaterThan(1);
    expect(signatures[0]).not.toBe(signatures[signatures.length - 1]);
  });

  it("every step has list, explanation, and a valid codeLineId", () => {
    const valid = new Set(REVERSE_LIST_CODE.python.map((l) => l.id));
    const runs = [
      generateReverseListSteps([1, 2, 3, 4]),
      generateReverseListSteps([7]),
      generateReverseListSteps([]),
    ];
    for (const steps of runs) {
      for (const step of steps) {
        expect(step.explanation.trim().length).toBeGreaterThan(0);
        expect(step.list).toBeDefined();
        expect(step.list!.nodes).toEqual(
          step.list!.nodes.map((n) => ({ ...n })),
        );
        expect(valid.has(step.codeLineId)).toBe(true);
      }
    }
  });
});
