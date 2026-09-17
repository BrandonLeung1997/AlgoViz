import type { KnapsackItem } from "@/lib/algorithms/knapsack/parseItems";
import type { DpCell, DpTableFrame, Step } from "@/lib/algorithms/types";

function cloneCells(dp: number[][]): number[][] {
  return dp.map((row) => [...row]);
}

function reconstructChosen(
  items: KnapsackItem[],
  dp: number[][],
  capacity: number,
): number[] {
  const chosen: number[] = [];
  let w = capacity;
  for (let i = items.length; i >= 1; i -= 1) {
    if (dp[i]![w] !== dp[i - 1]![w]) {
      chosen.unshift(i);
      w -= items[i - 1]!.weight;
    }
  }
  return chosen;
}

function formatReconstructed(chosen: number[], value: number): string {
  if (chosen.length === 0) return `none value=${value}`;
  return `items ${chosen.join(",")} value=${value}`;
}

export function generateKnapsackSteps(
  items: KnapsackItem[],
  capacity: number,
): Step[] {
  const steps: Step[] = [];
  const list = items.map((it) => ({ weight: it.weight, value: it.value }));
  const n = list.length;
  const W = capacity;
  const dp: number[][] = Array.from({ length: n + 1 }, () =>
    Array.from({ length: W + 1 }, () => 0),
  );
  const rowLabels = [
    "ε",
    ...list.map((it) => `w=${it.weight} v=${it.value}`),
  ];
  const colLabels = Array.from({ length: W + 1 }, (_, w) => String(w));

  const frame = (
    opts: {
      write?: DpCell;
      reads?: DpCell[];
      reconstructed?: string;
    } = {},
  ): DpTableFrame => ({
    x: "",
    y: "",
    cells: cloneCells(dp),
    write: opts.write ? { ...opts.write } : undefined,
    reads: opts.reads?.map((c) => ({ ...c })),
    reconstructed: opts.reconstructed,
    resultLabel: "Value",
    rowLabels: [...rowLabels],
    colLabels: [...colLabels],
  });

  const push = (
    codeLineId: string,
    explanation: string,
    opts: {
      write?: DpCell;
      reads?: DpCell[];
      reconstructed?: string;
    } = {},
  ) => {
    steps.push({
      array: [],
      highlights: [],
      dpTable: frame(opts),
      codeLineId,
      explanation,
    });
  };

  const itemBrief =
    n === 0
      ? "no items"
      : list.map((it, i) => `#${i + 1} (w=${it.weight}, v=${it.value})`).join(", ");
  push(
    "fn-def",
    `Start 0/1 knapsack with ${itemBrief} and capacity W = ${W}. dp[i][w] is the best value using the first i items with capacity w — each item at most once.`,
  );

  for (let i = 1; i <= n; i += 1) {
    const { weight, value } = list[i - 1]!;
    for (let w = 0; w <= W; w += 1) {
      const skipVal = dp[i - 1]![w]!;
      const skipRead: DpCell = { i: i - 1, j: w };
      if (weight > w) {
        dp[i]![w] = skipVal;
        push(
          "skip",
          `Item ${i} (w=${weight}) is heavier than capacity ${w} — skip, copy dp[${i - 1}][${w}] → dp[${i}][${w}] = ${skipVal}.`,
          { write: { i, j: w }, reads: [skipRead] },
        );
        continue;
      }
      const takeVal = value + dp[i - 1]![w - weight]!;
      const takeRead: DpCell = { i: i - 1, j: w - weight };
      if (takeVal > skipVal) {
        dp[i]![w] = takeVal;
        push(
          "take",
          `Take item ${i} (w=${weight}, v=${value}): ${value} + dp[${i - 1}][${w - weight}] = ${takeVal} beats skip ${skipVal} → dp[${i}][${w}] = ${takeVal}.`,
          { write: { i, j: w }, reads: [skipRead, takeRead] },
        );
      } else {
        dp[i]![w] = skipVal;
        push(
          "choose",
          `Item ${i} fits at capacity ${w}, but skip ${skipVal} ≥ take ${takeVal} — choose skip → dp[${i}][${w}] = ${skipVal}.`,
          { write: { i, j: w }, reads: [skipRead, takeRead] },
        );
      }
    }
  }

  const best = dp[n]![W]!;
  const chosen = reconstructChosen(list, dp, W);
  const reconstructed = formatReconstructed(chosen, best);
  push(
    "reconstruct",
    chosen.length === 0
      ? `Reconstruct from dp[${n}][${W}] = ${best}: no items are taken.`
      : `Reconstruct from dp[${n}][${W}] = ${best}: take item${chosen.length === 1 ? "" : "s"} ${chosen.join(", ")} (walk back while the value differs from the skip cell above).`,
    { write: { i: n, j: W }, reconstructed },
  );
  push(
    "done",
    `Done. Best 0/1 knapsack value is ${best}. ${reconstructed}.`,
    { write: { i: n, j: W }, reconstructed },
  );
  return steps;
}
