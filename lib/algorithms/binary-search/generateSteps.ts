import type { Highlight, Step } from "@/lib/algorithms/types";

export function generateBinarySearchSteps(
  input: number[],
  target: number,
): Step[] {
  const steps: Step[] = [];
  const arr = [...input].sort((a, b) => a - b);

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

  const windowHighlights = (
    low: number,
    mid: number | undefined,
    high: number,
  ): Highlight[] => {
    const highlights: Highlight[] = [];
    if (arr.length === 0) return highlights;
    for (let i = low; i <= high; i += 1) {
      highlights.push({ index: i, kind: "activeRange" });
    }
    if (low >= 0 && low < arr.length) {
      highlights.push({ index: low, kind: "low" });
    }
    if (high >= 0 && high < arr.length) {
      highlights.push({ index: high, kind: "high" });
    }
    if (mid !== undefined && mid >= 0 && mid < arr.length) {
      highlights.push({ index: mid, kind: "mid" });
    }
    return highlights;
  };

  if (arr.length === 0) {
    push("fn-def", `Start binary search for ${target} in an empty array.`);
    push(
      "not-found",
      `${target} cannot be found — the array is empty.`,
    );
    return steps;
  }

  push(
    "fn-def",
    `Start binary search for ${target} in a sorted array of ${arr.length} elements.`,
    [],
    { low: 0, high: arr.length - 1 },
  );

  let low = 0;
  let high = arr.length - 1;
  push(
    "init-bounds",
    `Set low = ${low} and high = ${high} to cover the whole array.`,
    windowHighlights(low, undefined, high),
    { low, high },
  );

  while (low <= high) {
    push(
      "loop",
      `Search window is still valid: low (${low}) ≤ high (${high}).`,
      windowHighlights(low, undefined, high),
      { low, high },
    );

    const mid = Math.floor((low + high) / 2);
    push(
      "mid",
      `Probe the midpoint: mid = ${mid}, value ${arr[mid]}.`,
      windowHighlights(low, mid, high),
      { low, mid, high },
    );
    push(
      "compare",
      `Compare arr[mid] = ${arr[mid]} with target ${target}.`,
      [
        ...windowHighlights(low, mid, high),
        { index: mid, kind: "comparing" },
      ],
      { low, mid, high },
    );

    if (arr[mid] === target) {
      push(
        "found",
        `Found ${target} at index ${mid}.`,
        [
          ...windowHighlights(low, mid, high),
          { index: mid, kind: "sorted" },
        ],
        { low, mid, high },
      );
      return steps;
    }

    if (arr[mid]! < target) {
      const nextLow = mid + 1;
      push(
        "go-right",
        `${arr[mid]} < ${target}, so discard the left half and set low = ${nextLow}.`,
        windowHighlights(low, mid, high),
        { low, mid, high },
      );
      low = nextLow;
    } else {
      const nextHigh = mid - 1;
      push(
        "go-left",
        `${arr[mid]} > ${target}, so discard the right half and set high = ${nextHigh}.`,
        windowHighlights(low, mid, high),
        { low, mid, high },
      );
      high = nextHigh;
    }
  }

  push(
    "not-found",
    `${target} is not in the array — the search window is empty.`,
    [],
  );
  return steps;
}
