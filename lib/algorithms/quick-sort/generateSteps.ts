import type { Highlight, Step } from "@/lib/algorithms/types";

export function generateQuickSortSteps(input: number[]): Step[] {
  const steps: Step[] = [];
  const arr = [...input];
  const finalized = new Set<number>();

  const push = (
    codeLineId: string,
    explanation: string,
    highlights: Highlight[] = [],
    range?: Step["range"],
  ) => {
    steps.push({
      array: [...arr],
      highlights,
      range,
      codeLineId,
      explanation,
    });
  };

  const sortedHighlights = (): Highlight[] =>
    [...finalized].map((index) => ({ index, kind: "sorted" as const }));

  const rangeHighlights = (
    low: number,
    high: number,
    extra: Highlight[] = [],
  ): Highlight[] => {
    const highlights: Highlight[] = [];
    for (let i = low; i <= high; i += 1) {
      if (!finalized.has(i)) {
        highlights.push({ index: i, kind: "activeRange" });
      }
    }
    highlights.push(...sortedHighlights());
    highlights.push(...extra);
    return highlights;
  };

  function partition(low: number, high: number): number {
    const pivot = arr[high]!;
    push(
      "partition-init",
      `Scan [${low}, ${high - 1}] and keep values ≤ ${pivot} on the left of the pivot.`,
      rangeHighlights(low, high, [{ index: high, kind: "pivot" }]),
      { low, high },
    );

    let i = low - 1;
    for (let j = low; j < high; j += 1) {
      push(
        "compare",
        `Compare ${arr[j]} with pivot ${pivot}.`,
        rangeHighlights(low, high, [
          { index: j, kind: "comparing" },
          { index: high, kind: "pivot" },
        ]),
        { low, high },
      );

      if (arr[j]! <= pivot) {
        i += 1;
        const leftVal = arr[i]!;
        const rightVal = arr[j]!;
        if (i !== j) {
          arr[i] = rightVal;
          arr[j] = leftVal;
        }
        push(
          "swap",
          i === j
            ? `${arr[i]} is already on the ≤-pivot side at index ${i}.`
            : `Swap ${arr[i]} into the ≤-pivot side at index ${i}.`,
          rangeHighlights(low, high, [
            { index: i, kind: "writing" },
            { index: j, kind: "writing" },
            { index: high, kind: "pivot" },
          ]),
          { low, high },
        );
      }
    }

    const pivotIndex = i + 1;
    const parked = arr[pivotIndex]!;
    arr[pivotIndex] = arr[high]!;
    arr[high] = parked;
    finalized.add(pivotIndex);
    push(
      "pivot-place",
      `Place pivot ${arr[pivotIndex]} at index ${pivotIndex} — its final sorted position.`,
      rangeHighlights(low, high, [
        { index: pivotIndex, kind: "pivot" },
        { index: pivotIndex, kind: "sorted" },
      ]),
      { low, high },
    );
    return pivotIndex;
  }

  function quickSort(low: number, high: number) {
    if (low > high) {
      return;
    }
    if (low === high) {
      finalized.add(low);
      push(
        "base-case",
        "Base case: a single element is already in its final position.",
        rangeHighlights(low, high, [{ index: low, kind: "sorted" }]),
        { low, high },
      );
      return;
    }

    push(
      "choose-pivot",
      `Choose last-element pivot ${arr[high]} at index ${high}.`,
      rangeHighlights(low, high, [{ index: high, kind: "pivot" }]),
      { low, high },
    );

    const p = partition(low, high);

    push(
      "recurse-left",
      p - 1 < low
        ? `Left of pivot is empty — nothing to sort before index ${p}.`
        : `Sort the left partition [${low}, ${p - 1}].`,
      rangeHighlights(low, high),
      { low, high },
    );
    quickSort(low, p - 1);

    push(
      "recurse-right",
      p + 1 > high
        ? `Right of pivot is empty — nothing to sort after index ${p}.`
        : `Sort the right partition [${p + 1}, ${high}].`,
      rangeHighlights(low, high),
      { low, high },
    );
    quickSort(p + 1, high);
  }

  if (arr.length === 0) {
    push("done", "Empty array — nothing to sort.");
    return steps;
  }

  push("fn-def", "Start quick sort on the full array.", [], {
    low: 0,
    high: arr.length - 1,
  });
  quickSort(0, arr.length - 1);
  push(
    "done",
    "Array is fully sorted.",
    arr.map((_, index) => ({ index, kind: "sorted" as const })),
  );
  return steps;
}
