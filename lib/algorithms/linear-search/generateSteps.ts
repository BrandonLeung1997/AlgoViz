import type { Highlight, Step } from "@/lib/algorithms/types";

export function generateLinearSearchSteps(
  input: number[],
  target: number,
): Step[] {
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

  if (arr.length === 0) {
    push("fn-def", `Start linear search for ${target} in an empty array.`);
    push("not-found", `${target} cannot be found — the array is empty.`);
    return steps;
  }

  push(
    "fn-def",
    `Start linear search for ${target} in an unsorted array of ${arr.length} elements.`,
  );

  for (let i = 0; i < arr.length; i += 1) {
    push(
      "advance",
      `Move to index ${i}.`,
      [{ index: i, kind: "comparing" }],
    );
    push(
      "compare",
      `Compare arr[${i}] = ${arr[i]} with target ${target}.`,
      [{ index: i, kind: "comparing" }],
    );

    if (arr[i] === target) {
      push(
        "found",
        `Found ${target} at index ${i} (green). Linear search stops on the first match.`,
        [{ index: i, kind: "sorted" }],
      );
      return steps;
    }
  }

  push(
    "not-found",
    `${target} is not in the array after scanning all ${arr.length} elements.`,
  );
  return steps;
}
