import type { DpCell, DpTableFrame, Step } from "@/lib/algorithms/types";

function cloneCells(dp: number[][]): number[][] {
  return dp.map((row) => [...row]);
}

function reconstructAlignment(x: string, y: string, dp: number[][]): string {
  let i = x.length;
  let j = y.length;
  let left = "";
  let right = "";
  while (i > 0 || j > 0) {
    if (i > 0 && j > 0 && x[i - 1] === y[j - 1]) {
      left = x[i - 1] + left;
      right = y[j - 1] + right;
      i -= 1;
      j -= 1;
    } else if (i > 0 && j > 0 && dp[i]![j] === dp[i - 1]![j - 1]! + 1) {
      left = x[i - 1] + left;
      right = y[j - 1] + right;
      i -= 1;
      j -= 1;
    } else if (i > 0 && dp[i]![j] === dp[i - 1]![j]! + 1) {
      left = x[i - 1] + left;
      right = `-${right}`;
      i -= 1;
    } else {
      left = `-${left}`;
      right = y[j - 1] + right;
      j -= 1;
    }
  }
  if (left.length === 0 && right.length === 0) return "ε → ε";
  return `${left} → ${right}`;
}

export function generateEditDistanceSteps(x: string, y: string): Step[] {
  const steps: Step[] = [];
  const m = x.length;
  const n = y.length;
  const dp: number[][] = Array.from({ length: m + 1 }, () =>
    Array.from({ length: n + 1 }, () => 0),
  );

  const frame = (opts: {
    write?: DpCell;
    reads?: DpCell[];
    reconstructed?: string;
  } = {}): DpTableFrame => ({
    x,
    y,
    cells: cloneCells(dp),
    write: opts.write ? { ...opts.write } : undefined,
    reads: opts.reads?.map((c) => ({ ...c })),
    reconstructed: opts.reconstructed,
    resultLabel: "Distance",
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

  const showX = x.length === 0 ? "ε" : x;
  const showY = y.length === 0 ? "ε" : y;
  push(
    "fn-def",
    `Start edit distance for X = “${showX}” and Y = “${showY}”. dp[i][j] is the Levenshtein distance of prefixes X[:i] and Y[:j] (insert, delete, replace each cost 1).`,
  );

  for (let j = 0; j <= n; j += 1) {
    dp[0]![j] = j;
    push(
      "init-row",
      j === 0
        ? "dp[0][0] = 0 — two empty prefixes need no edits."
        : `Initialize first row: Y[:${j}] from empty X takes ${j} insert${j === 1 ? "" : "s"} → dp[0][${j}] = ${j}.`,
      { write: { i: 0, j } },
    );
  }

  for (let i = 1; i <= m; i += 1) {
    dp[i]![0] = i;
    push(
      "init-col",
      `Initialize first column: X[:${i}] to empty Y takes ${i} delete${i === 1 ? "" : "s"} → dp[${i}][0] = ${i}.`,
      { write: { i, j: 0 } },
    );
  }

  for (let i = 1; i <= m; i += 1) {
    for (let j = 1; j <= n; j += 1) {
      const xi = x[i - 1]!;
      const yj = y[j - 1]!;
      if (xi === yj) {
        dp[i]![j] = dp[i - 1]![j - 1]!;
        push(
          "match",
          `Match ‘${xi}’ — copy diagonal dp[${i - 1}][${j - 1}] → dp[${i}][${j}] = ${dp[i]![j]}.`,
          { write: { i, j }, reads: [{ i: i - 1, j: j - 1 }] },
        );
      } else {
        const del = dp[i - 1]![j]!;
        const ins = dp[i]![j - 1]!;
        const sub = dp[i - 1]![j - 1]!;
        dp[i]![j] = 1 + Math.min(del, ins, sub);
        push(
          "mismatch",
          `Mismatch ‘${xi}’ vs ‘${yj}’ — 1 + min(delete dp[${i - 1}][${j}]=${del}, insert dp[${i}][${j - 1}]=${ins}, replace dp[${i - 1}][${j - 1}]=${sub}) → dp[${i}][${j}] = ${dp[i]![j]}.`,
          {
            write: { i, j },
            reads: [
              { i: i - 1, j },
              { i, j: j - 1 },
              { i: i - 1, j: j - 1 },
            ],
          },
        );
      }
    }
  }

  const distance = dp[m]![n]!;
  const alignment = reconstructAlignment(x, y, dp);
  push(
    "done",
    `Done. Edit distance of “${showX}” and “${showY}” is ${distance}. One alignment: ${alignment}.`,
    { write: { i: m, j: n }, reconstructed: String(distance) },
  );
  return steps;
}
