import type { Highlight, Step } from "@/lib/algorithms/types";

/**
 * Assumes `heap` is already a valid max-heap. The studio rejects non-heaps;
 * this generator does not re-check the heap property.
 */
export function generateExtractMaxSteps(heap: number[]): Step[] {
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

  if (arr.length === 0) {
    push("done", "Empty heap — nothing to extract.");
    return steps;
  }

  const maxVal = arr[0]!;
  push(
    "fn-def",
    arr.length === 1
      ? `Extract max ${maxVal} from a one-element max-heap.`
      : `Max is ${maxVal} at index 0. Swap it with the last leaf, pop it, then sift down.`,
    [{ index: 0, kind: "current" }],
  );

  if (arr.length === 1) {
    arr.pop();
    push("pop", `Remove ${maxVal} — the heap is now empty.`, []);
    push("done", `Extracted ${maxVal}. The heap is empty.`);
    return steps;
  }

  const last = arr.length - 1;
  const lastVal = arr[last]!;
  arr[0] = lastVal;
  arr[last] = maxVal;
  push(
    "swap-last",
    `Swap root ${maxVal} with last leaf ${lastVal} at index ${last}.`,
    [
      { index: 0, kind: "writing" },
      { index: last, kind: "writing" },
    ],
  );

  arr.pop();
  push(
    "pop",
    `Pop ${maxVal} — heap size is now ${arr.length}. The extracted slot is gone.`,
  );

  const heapSize = arr.length;
  push(
    "sift",
    `Sift down from the new root so the heap property is restored.`,
    [{ index: 0, kind: "current" }],
  );

  let i = 0;
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

  push(
    "done",
    `Extracted ${maxVal}. Remaining array is a max-heap of size ${heapSize}.`,
  );
  return steps;
}
