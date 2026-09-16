import type { Highlight, Step } from "@/lib/algorithms/types";

export function generateMergeSortSteps(input: number[]): Step[] {
  const steps: Step[] = [];
  const arr = [...input];

  const push = (
    codeLineId: string,
    explanation: string,
    highlights: Highlight[] = [],
    range?: Step["range"],
    arraySnapshot?: number[],
  ) => {
    steps.push({
      array: [...(arraySnapshot ?? arr)],
      highlights,
      range,
      codeLineId,
      explanation,
    });
  };

  function mergeSort(low: number, high: number) {
    if (low >= high) {
      push(
        "base-case",
        "Base case: a single element is already sorted.",
        [{ index: low, kind: "sorted" }],
        { low, high },
      );
      return;
    }
    const mid = Math.floor((low + high) / 2);
    push(
      "split",
      `Split range [${low}, ${high}] at mid=${mid}.`,
      Array.from({ length: high - low + 1 }, (_, i) => ({
        index: low + i,
        kind: "activeRange" as const,
      })),
      { low, mid, high },
    );
    push("recurse-left", `Sort left half [${low}, ${mid}].`, [], { low, mid, high });
    mergeSort(low, mid);
    push("recurse-right", `Sort right half [${mid + 1}, ${high}].`, [], {
      low,
      mid,
      high,
    });
    mergeSort(mid + 1, high);
    merge(low, mid, high);
  }

  function merge(low: number, mid: number, high: number) {
    const left = arr.slice(low, mid + 1);
    const right = arr.slice(mid + 1, high + 1);
    push(
      "merge-init",
      `Merge sorted halves [${low}, ${mid}] and [${mid + 1}, ${high}].`,
      [],
      { low, mid, high },
    );
    let i = 0;
    let j = 0;
    let k = low;

    while (i < left.length && j < right.length) {
      const leftIndex = low + i;
      const rightIndex = mid + 1 + j;
      const compareSnapshot = [...arr];
      compareSnapshot[leftIndex] = left[i]!;
      compareSnapshot[rightIndex] = right[j]!;
      push(
        "merge-compare",
        `Compare ${left[i]} and ${right[j]}.`,
        [
          { index: leftIndex, kind: "comparing" },
          { index: rightIndex, kind: "comparing" },
        ],
        { low, mid, high },
        compareSnapshot,
      );
      if (left[i]! <= right[j]!) {
        arr[k] = left[i]!;
        push(
          "merge-take-left",
          `Take ${left[i]} from the left half → index ${k}.`,
          [{ index: k, kind: "writing" }],
          { low, mid, high },
        );
        i += 1;
      } else {
        arr[k] = right[j]!;
        push(
          "merge-take-right",
          `Take ${right[j]} from the right half → index ${k}.`,
          [{ index: k, kind: "writing" }],
          { low, mid, high },
        );
        j += 1;
      }
      k += 1;
    }
    while (i < left.length) {
      arr[k] = left[i]!;
      push(
        "merge-exhaust-left",
        `Copy remaining left value ${left[i]} → index ${k}.`,
        [{ index: k, kind: "copy" }],
        { low, mid, high },
      );
      i += 1;
      k += 1;
    }
    while (j < right.length) {
      arr[k] = right[j]!;
      push(
        "merge-exhaust-right",
        `Copy remaining right value ${right[j]} → index ${k}.`,
        [{ index: k, kind: "copy" }],
        { low, mid, high },
      );
      j += 1;
      k += 1;
    }
    push(
      "write-back",
      `Merged subarray [${low}, ${high}] is now sorted.`,
      Array.from({ length: high - low + 1 }, (_, i) => ({
        index: low + i,
        kind: "sorted" as const,
      })),
      { low, mid, high },
    );
  }

  if (arr.length === 0) {
    push("done", "Empty array — nothing to sort.");
    return steps;
  }

  push("fn-def", "Start merge sort on the full array.", [], {
    low: 0,
    high: arr.length - 1,
  });
  mergeSort(0, arr.length - 1);
  push(
    "done",
    "Array is fully sorted.",
    arr.map((_, index) => ({ index, kind: "sorted" as const })),
  );
  return steps;
}
