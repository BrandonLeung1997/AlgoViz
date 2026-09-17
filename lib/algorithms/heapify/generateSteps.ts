import type { Highlight, Step } from "@/lib/algorithms/types";

export function generateHeapifySteps(input: number[]): Step[] {
  const steps: Step[] = [];
  const arr = [...input];

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

  const siftDown = (start: number) => {
    const heapSize = arr.length;
    push(
      "sift",
      `Sift down from index ${start} so the subtree rooted here becomes a max-heap.`,
      [{ index: start, kind: "current" }],
    );

    let i = start;
    while (true) {
      const left = 2 * i + 1;
      const right = 2 * i + 2;
      if (left >= heapSize) {
        break;
      }

      const extras: Highlight[] = [{ index: i, kind: "current" }];
      extras.push({ index: left, kind: "comparing" });
      if (right < heapSize) {
        extras.push({ index: right, kind: "comparing" });
      }
      const childNote =
        right < heapSize
          ? `Compare ${arr[i]} at index ${i} with children ${arr[left]} and ${arr[right]}.`
          : `Compare ${arr[i]} at index ${i} with child ${arr[left]}.`;
      push("compare", childNote, extras);

      let largest = i;
      if (arr[left]! > arr[largest]!) {
        largest = left;
      }
      if (right < heapSize && arr[right]! > arr[largest]!) {
        largest = right;
      }
      if (largest === i) {
        break;
      }

      const parentVal = arr[i]!;
      const childVal = arr[largest]!;
      arr[i] = childVal;
      arr[largest] = parentVal;
      push(
        "swap",
        `Swap ${arr[i]} into index ${i} — the larger child belongs above.`,
        [
          { index: i, kind: "writing" },
          { index: largest, kind: "writing" },
        ],
      );
      i = largest;
    }
  };

  if (arr.length === 0) {
    push("done", "Empty array — already a valid max-heap.");
    return steps;
  }

  push(
    "fn-def",
    "Start heapify: build a max-heap in place with bottom-up sift-down (Floyd’s method).",
    arr.length === 1 ? [{ index: 0, kind: "current" }] : [],
  );

  if (arr.length === 1) {
    push("done", "A single element is already a valid max-heap.", [
      { index: 0, kind: "current" },
    ]);
    return steps;
  }

  const n = arr.length;
  const lastParent = Math.floor(n / 2) - 1;
  push(
    "build",
    `Build a max-heap by sifting down from the last parent (index ${lastParent}) to the root.`,
  );

  for (let i = lastParent; i >= 0; i -= 1) {
    siftDown(i);
  }

  push("done", "Array is a valid max-heap: every parent is ≥ its children.");
  return steps;
}
