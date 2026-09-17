import type { Highlight, Step } from "@/lib/algorithms/types";

export function generateHeapSortSteps(input: number[]): Step[] {
  const steps: Step[] = [];
  const arr = [...input];
  const finalized = new Set<number>();

  const push = (
    codeLineId: string,
    explanation: string,
    highlights: Highlight[] = [],
  ) => {
    steps.push({
      array: [...arr],
      highlights,
      codeLineId,
      explanation,
    });
  };

  const heapHighlights = (
    heapSize: number,
    extra: Highlight[] = [],
  ): Highlight[] => {
    const highlights: Highlight[] = [];
    for (let i = 0; i < heapSize; i += 1) {
      if (!finalized.has(i)) {
        highlights.push({ index: i, kind: "activeRange" });
      }
    }
    for (const index of finalized) {
      highlights.push({ index, kind: "sorted" });
    }
    highlights.push(...extra);
    return highlights;
  };

  const siftDown = (start: number, heapSize: number) => {
    push(
      "sift",
      `Sift down from index ${start} in the heap of size ${heapSize}.`,
      heapHighlights(heapSize, [{ index: start, kind: "comparing" }]),
    );

    let i = start;
    while (true) {
      const left = 2 * i + 1;
      const right = 2 * i + 2;
      if (left >= heapSize) {
        break;
      }

      const extras: Highlight[] = [{ index: i, kind: "comparing" }];
      extras.push({ index: left, kind: "comparing" });
      if (right < heapSize) {
        extras.push({ index: right, kind: "comparing" });
      }
      const childNote =
        right < heapSize
          ? `Compare ${arr[i]} at index ${i} with children ${arr[left]} and ${arr[right]}.`
          : `Compare ${arr[i]} at index ${i} with child ${arr[left]}.`;
      push("compare", childNote, heapHighlights(heapSize, extras));

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
        heapHighlights(heapSize, [
          { index: i, kind: "writing" },
          { index: largest, kind: "writing" },
        ]),
      );
      i = largest;
    }
  };

  if (arr.length === 0) {
    push("done", "Empty array — nothing to sort.");
    return steps;
  }

  push(
    "fn-def",
    "Start heap sort: build a max-heap, then extract the root into a growing sorted suffix.",
    arr.length === 1 ? [{ index: 0, kind: "sorted" }] : heapHighlights(arr.length),
  );

  const n = arr.length;
  if (n === 1) {
    push("done", "Array is fully sorted.", [
      { index: 0, kind: "sorted" },
    ]);
    return steps;
  }

  push(
    "build",
    `Build a max-heap by sifting down from the last parent (index ${Math.floor(n / 2) - 1}) to the root.`,
    heapHighlights(n),
  );

  for (let i = Math.floor(n / 2) - 1; i >= 0; i -= 1) {
    siftDown(i, n);
  }

  for (let end = n - 1; end >= 1; end -= 1) {
    const root = arr[0]!;
    const last = arr[end]!;
    arr[0] = last;
    arr[end] = root;
    finalized.add(end);
    push(
      "extract",
      `Extract max ${arr[end]} to index ${end} — it is now in its final sorted position.`,
      heapHighlights(end, [
        { index: 0, kind: "writing" },
        { index: end, kind: "writing" },
      ]),
    );
    siftDown(0, end);
  }

  push(
    "done",
    "Array is fully sorted.",
    arr.map((_, index) => ({ index, kind: "sorted" as const })),
  );
  return steps;
}
