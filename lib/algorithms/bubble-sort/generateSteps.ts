import type { Highlight, Step } from "@/lib/algorithms/types";

export function generateBubbleSortSteps(input: number[]): Step[] {
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

  const sortedHighlights = (): Highlight[] =>
    [...finalized].map((index) => ({ index, kind: "sorted" as const }));

  const withSorted = (extra: Highlight[] = []): Highlight[] => [
    ...sortedHighlights(),
    ...extra,
  ];

  if (arr.length === 0) {
    push("done", "Empty array — nothing to sort.");
    return steps;
  }

  push("fn-def", "Start bubble sort on the full array.");

  const n = arr.length;
  for (let i = 0; i <= n - 2; i += 1) {
    push(
      "pass",
      `Pass ${i + 1}: bubble the next largest value into place.`,
      withSorted(),
    );

    let swapped = false;
    for (let j = 0; j <= n - 2 - i; j += 1) {
      push(
        "compare",
        `Compare ${arr[j]} and ${arr[j + 1]}.`,
        withSorted([
          { index: j, kind: "comparing" },
          { index: j + 1, kind: "comparing" },
        ]),
      );

      if (arr[j]! > arr[j + 1]!) {
        const left = arr[j]!;
        const right = arr[j + 1]!;
        arr[j] = right;
        arr[j + 1] = left;
        swapped = true;
        push(
          "swap",
          `Swap ${arr[j]} and ${arr[j + 1]} — they were out of order.`,
          withSorted([
            { index: j, kind: "writing" },
            { index: j + 1, kind: "writing" },
          ]),
        );
      }
    }

    finalized.add(n - 1 - i);
    push(
      "pass-end",
      `Index ${n - 1 - i} is now in its final sorted position.`,
      withSorted(),
    );

    if (!swapped) {
      for (let k = 0; k < n - 1 - i; k += 1) {
        finalized.add(k);
      }
      push(
        "early-exit",
        "No swaps this pass — the remaining prefix is already sorted.",
        withSorted(),
      );
      break;
    }
  }

  push(
    "done",
    "Array is fully sorted.",
    arr.map((_, index) => ({ index, kind: "sorted" as const })),
  );
  return steps;
}
