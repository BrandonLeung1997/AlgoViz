import type { Highlight, Step } from "@/lib/algorithms/types";

export function generateSelectionSortSteps(input: number[]): Step[] {
  const steps: Step[] = [];
  const arr = [...input];

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

  const sortedPrefix = (endInclusive: number): Highlight[] => {
    const highlights: Highlight[] = [];
    for (let k = 0; k <= endInclusive; k += 1) {
      highlights.push({ index: k, kind: "sorted" });
    }
    return highlights;
  };

  if (arr.length === 0) {
    push("done", "Empty array — nothing to sort.");
    return steps;
  }

  push(
    "fn-def",
    "Start selection sort. Each pass finds the minimum of the unsorted suffix and swaps it into place.",
    arr.length === 1 ? [{ index: 0, kind: "sorted" }] : [],
  );

  const n = arr.length;
  for (let i = 0; i <= n - 2; i += 1) {
    let minIdx = i;
    const prefix = i > 0 ? sortedPrefix(i - 1) : [];

    for (let j = i + 1; j < n; j += 1) {
      push(
        "scan",
        `Compare ${arr[j]} at index ${j} with current min ${arr[minIdx]} at index ${minIdx}.`,
        [
          ...prefix,
          { index: minIdx, kind: "writing" },
          { index: j, kind: "comparing" },
        ],
      );

      if (arr[j]! < arr[minIdx]!) {
        minIdx = j;
        push(
          "new-min",
          `New minimum ${arr[minIdx]} at index ${minIdx}.`,
          [...prefix, { index: minIdx, kind: "writing" }],
        );
      }
    }

    if (minIdx !== i) {
      const left = arr[i]!;
      const right = arr[minIdx]!;
      arr[i] = right;
      arr[minIdx] = left;
      push(
        "swap",
        `Swap ${arr[i]} into index ${i}.`,
        [
          ...prefix,
          { index: i, kind: "writing" },
          { index: minIdx, kind: "writing" },
        ],
      );
    } else {
      push(
        "swap",
        `Index ${i} already holds the minimum ${arr[i]} — place it.`,
        [...prefix, { index: i, kind: "writing" }],
      );
    }

    push(
      "pass-end",
      `Index ${i} is now in its final sorted position.`,
      sortedPrefix(i),
    );
  }

  push(
    "done",
    "Array is fully sorted.",
    arr.map((_, index) => ({ index, kind: "sorted" as const })),
  );
  return steps;
}
