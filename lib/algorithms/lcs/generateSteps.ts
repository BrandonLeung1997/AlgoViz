import type { DpCell, DpTableFrame, Step } from "@/lib/algorithms/types";

function cloneCells(dp: number[][]): number[][] {
  return dp.map((row) => [...row]);
}

export function generateLcsSteps(x: string, y: string): Step[] {
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
    `Start LCS for X = “${showX}” and Y = “${showY}”. dp[i][j] is the LCS length of prefixes X[:i] and Y[:j].`,
  );
  push(
    "init-table",
    "Initialize a (m+1)×(n+1) table of zeros — extra row and column for the empty prefixes.",
  );

  for (let i = 1; i <= m; i += 1) {
    for (let j = 1; j <= n; j += 1) {
      const xi = x[i - 1]!;
      const yj = y[j - 1]!;
      push(
        "compare",
        `Compare X[${i - 1}] = ‘${xi}’ with Y[${j - 1}] = ‘${yj}’.`,
        { write: { i, j } },
      );
      if (xi === yj) {
        dp[i]![j] = dp[i - 1]![j - 1]! + 1;
        push(
          "match",
          `Match ‘${xi}’ — take diagonal dp[${i - 1}][${j - 1}]+1 → dp[${i}][${j}] = ${dp[i]![j]}.`,
          { write: { i, j }, reads: [{ i: i - 1, j: j - 1 }] },
        );
      } else {
        const skipX = dp[i - 1]![j]!;
        const skipY = dp[i]![j - 1]!;
        dp[i]![j] = Math.max(skipX, skipY);
        push(
          "skip",
          `No match (‘${xi}’ vs ‘${yj}’) — max of skip-X (dp[${i - 1}][${j}] = ${skipX}) / skip-Y (dp[${i}][${j - 1}] = ${skipY}) → ${dp[i]![j]}.`,
          {
            write: { i, j },
            reads: [
              { i: i - 1, j },
              { i, j: j - 1 },
            ],
          },
        );
      }
    }
  }

  const length = dp[m]![n]!;
  push(
    "length-done",
    `Table is full. LCS length of X[:${m}] and Y[:${n}] is dp[${m}][${n}] = ${length}.`,
    { write: { i: m, j: n } },
  );

  push(
    "reconstruct-init",
    `Reconstruct: start at dp[${m}][${n}] and walk toward the empty prefixes.`,
    { write: { i: m, j: n }, reconstructed: "" },
  );

  if (length === 0) {
    push(
      "reconstruct-empty",
      "No common subsequence — LCS is empty.",
      { reconstructed: "" },
    );
    push("done", "Done. LCS is empty — no common subsequence.", {
      reconstructed: "",
    });
    return steps;
  }

  let i = m;
  let j = n;
  const chars: string[] = [];
  while (i > 0 && j > 0) {
    if (x[i - 1] === y[j - 1]) {
      const ch = x[i - 1]!;
      chars.unshift(ch);
      const soFar = chars.join("");
      push(
        "reconstruct-match",
        `Reconstruct match at (${i}, ${j}): prepend ‘${ch}’ and move diagonally to (${i - 1}, ${j - 1}). LCS so far: ${soFar}`,
        {
          write: { i, j },
          reads: [{ i: i - 1, j: j - 1 }],
          reconstructed: soFar,
        },
      );
      i -= 1;
      j -= 1;
    } else if (dp[i - 1]![j]! >= dp[i]![j - 1]!) {
      push(
        "reconstruct-skip",
        `Reconstruct: ‘${x[i - 1]}’ ≠ ‘${y[j - 1]}’ — move to the larger neighbor (skip-X, up).`,
        {
          write: { i, j },
          reads: [
            { i: i - 1, j },
            { i, j: j - 1 },
          ],
          reconstructed: chars.join(""),
        },
      );
      i -= 1;
    } else {
      push(
        "reconstruct-skip",
        `Reconstruct: ‘${x[i - 1]}’ ≠ ‘${y[j - 1]}’ — move to the larger neighbor (skip-Y, left).`,
        {
          write: { i, j },
          reads: [
            { i: i - 1, j },
            { i, j: j - 1 },
          ],
          reconstructed: chars.join(""),
        },
      );
      j -= 1;
    }
  }

  const reconstructed = chars.join("");
  push(
    "done",
    `Done. LCS is “${reconstructed}” (length ${reconstructed.length}).`,
    { reconstructed },
  );
  return steps;
}
