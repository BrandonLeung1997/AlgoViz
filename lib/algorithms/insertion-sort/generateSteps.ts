import type { Highlight, Step } from "@/lib/algorithms/types";

export function generateInsertionSortSteps(input: number[]): Step[] {
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
    for (let i = 0; i <= endInclusive; i += 1) {
      highlights.push({ index: i, kind: "sorted" });
    }
    return highlights;
  };

  const unsortedSuffix = (from: number): Highlight[] => {
    const highlights: Highlight[] = [];
    for (let i = from; i < arr.length; i += 1) {
      highlights.push({ index: i, kind: "activeRange" });
    }
    return highlights;
  };

  if (arr.length === 0) {
    push("done", "Empty array — nothing to sort.");
    return steps;
  }

  push(
    "fn-def",
    "Start insertion sort. Index 0 is already a sorted prefix of length 1.",
    [
      { index: 0, kind: "sorted" },
      ...unsortedSuffix(1),
    ],
  );

  for (let i = 1; i < arr.length; i += 1) {
    const key = arr[i]!;
    push(
      "pick-key",
      `Pick key ${key} at index ${i}. Prefix 0..${i - 1} is sorted.`,
      [
        ...sortedPrefix(i - 1),
        { index: i, kind: "writing" },
        ...unsortedSuffix(i + 1),
      ],
    );

    let j = i - 1;
    while (j >= 0) {
      push(
        "compare",
        `Compare ${arr[j]} with key ${key}.`,
        [
          ...sortedPrefix(i - 1).filter((h) => h.index !== j),
          { index: j, kind: "comparing" },
          { index: i, kind: "writing" },
          ...unsortedSuffix(i + 1),
        ],
      );

      if (arr[j]! <= key) {
        break;
      }

      arr[j + 1] = arr[j]!;
      push(
        "shift",
        `Shift ${arr[j]} one slot right to make room for the key.`,
        [
          ...sortedPrefix(i - 1),
          { index: j, kind: "copy" },
          { index: j + 1, kind: "writing" },
          ...unsortedSuffix(i + 1),
        ],
      );
      j -= 1;
    }

    arr[j + 1] = key;
    push(
      "insert",
      `Insert key ${key} at index ${j + 1}. Prefix 0..${i} is now sorted.`,
      [
        ...sortedPrefix(i),
        { index: j + 1, kind: "writing" },
        ...unsortedSuffix(i + 1),
      ],
    );
  }

  push(
    "done",
    "Array is fully sorted.",
    arr.map((_, index) => ({ index, kind: "sorted" as const })),
  );
  return steps;
}
