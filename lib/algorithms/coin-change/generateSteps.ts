import type { DpCell, DpTableFrame, Step } from "@/lib/algorithms/types";

const INF = Number.POSITIVE_INFINITY;

function cloneCells(dp: number[][]): number[][] {
  return dp.map((row) => [...row]);
}

function fmt(value: number): string {
  return Number.isFinite(value) ? String(value) : "∞";
}

function reconstructCoins(
  coins: number[],
  dp: number[][],
  amount: number,
): number[] {
  const used: number[] = [];
  let i = coins.length;
  let a = amount;
  while (a > 0 && i >= 1) {
    const c = coins[i - 1]!;
    if (
      c <= a &&
      Number.isFinite(dp[i]![a]!) &&
      dp[i]![a] === 1 + dp[i]![a - c]!
    ) {
      used.push(c);
      a -= c;
    } else {
      i -= 1;
    }
  }
  return used;
}

function formatReconstructed(used: number[], count: number): string {
  if (!Number.isFinite(count)) return "impossible";
  if (count === 0) return "none";
  return used.join("+");
}

export function generateCoinChangeSteps(
  coins: number[],
  amount: number,
): Step[] {
  const steps: Step[] = [];
  const list = [...coins];
  const n = list.length;
  const A = amount;
  const dp: number[][] = Array.from({ length: n + 1 }, () =>
    Array.from({ length: A + 1 }, () => INF),
  );
  for (let i = 0; i <= n; i += 1) dp[i]![0] = 0;

  const rowLabels = ["ε", ...list.map((c) => `c=${c}`)];
  const colLabels = Array.from({ length: A + 1 }, (_, a) => String(a));

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
    resultLabel: "Coins",
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

  const coinBrief =
    n === 0 ? "no coin types" : list.map((c) => `${c}`).join(", ");
  push(
    "fn-def",
    `Start unbounded coin change with coins [${coinBrief}] and amount ${A}. dp[i][a] is the fewest coins using the first i denominations to make a — a coin may be reused (take reads the same row). Unreachable cells stay ∞.`,
  );

  for (let i = 1; i <= n; i += 1) {
    const c = list[i - 1]!;
    for (let a = 0; a <= A; a += 1) {
      const skipVal = dp[i - 1]![a]!;
      const skipRead: DpCell = { i: i - 1, j: a };
      if (c > a) {
        dp[i]![a] = skipVal;
        push(
          "skip",
          `Coin ${c} is larger than amount ${a} — skip, copy dp[${i - 1}][${a}] → dp[${i}][${a}] = ${fmt(skipVal)}.`,
          { write: { i, j: a }, reads: [skipRead] },
        );
        continue;
      }
      const takeVal = 1 + dp[i]![a - c]!;
      const takeRead: DpCell = { i, j: a - c };
      if (takeVal < skipVal) {
        dp[i]![a] = takeVal;
        push(
          "take",
          `Take coin ${c} again (unbounded): 1 + dp[${i}][${a - c}] = ${fmt(takeVal)} beats skip ${fmt(skipVal)} → dp[${i}][${a}] = ${fmt(takeVal)}.`,
          { write: { i, j: a }, reads: [skipRead, takeRead] },
        );
      } else {
        dp[i]![a] = skipVal;
        push(
          "choose",
          `Coin ${c} fits at amount ${a}, but skip ${fmt(skipVal)} ≤ take ${fmt(takeVal)} — choose skip → dp[${i}][${a}] = ${fmt(skipVal)}.`,
          { write: { i, j: a }, reads: [skipRead, takeRead] },
        );
      }
    }
  }

  const best = dp[n]![A]!;
  const used = Number.isFinite(best) ? reconstructCoins(list, dp, A) : [];
  const reconstructed = formatReconstructed(used, best);

  if (!Number.isFinite(best)) {
    push(
      "impossible",
      `Amount ${A} cannot be made with [${coinBrief}] — dp[${n}][${A}] stays ∞ (impossible).`,
      { write: { i: n, j: A }, reconstructed },
    );
  }

  push(
    "done",
    Number.isFinite(best)
      ? `Done. Fewest coins is ${best}${reconstructed === "none" ? " (amount 0 needs none)" : `: ${reconstructed}`}.`
      : `Done. Amount ${A} is impossible with these coins.`,
    { write: { i: n, j: A }, reconstructed },
  );
  return steps;
}
