import type { Highlight, Step } from "@/lib/algorithms/types";

/**
 * Assumes `heap` is already a valid max-heap. The studio rejects non-heaps;
 * this generator does not re-check the heap property.
 */
export function generateHeapInsertSteps(heap: number[], value: number): Step[] {
  const steps: Step[] = [];
  const arr = [...heap];

  const push = (
    codeLineId: string,
    explanation: string,
    highlights: Highlight[] = [],
  ) => {
    const values = [...arr];
    steps.push({
      array: values,
      highlights,
      heap: {
        values,
        heapSize: values.length,
        highlights,
      },
      codeLineId,
      explanation,
    });
  };

  push(
    "fn-def",
    arr.length === 0
      ? `Insert ${value} into an empty max-heap.`
      : `Insert ${value} into a max-heap of size ${arr.length}.`,
  );

  arr.push(value);
  const last = arr.length - 1;
  push(
    "append",
    `Append ${value} at index ${last} — the next leaf of the complete tree.`,
    [{ index: last, kind: "writing" }],
  );

  let i = last;
  while (i > 0) {
    const parent = Math.floor((i - 1) / 2);
    push(
      "compare",
      `Compare ${arr[i]} at index ${i} with parent ${arr[parent]} at index ${parent}.`,
      [
        { index: i, kind: "current" },
        { index: parent, kind: "comparing" },
      ],
    );
    if (arr[parent]! >= arr[i]!) {
      break;
    }
    const childVal = arr[i]!;
    const parentVal = arr[parent]!;
    arr[i] = parentVal;
    arr[parent] = childVal;
    push(
      "swap",
      `Swap ${arr[parent]} into index ${parent} — the larger child belongs above.`,
      [
        { index: parent, kind: "writing" },
        { index: i, kind: "writing" },
      ],
    );
    i = parent;
  }

  push(
    "done",
    "Array is a valid max-heap: every parent is ≥ its children.",
  );
  return steps;
}
