import { describe, expect, it } from "vitest";
import { generateCoinChangeSteps } from "@/lib/algorithms/coin-change/generateSteps";
import {
  formatCoins,
  parseAmountInput,
  parseCoins,
  randomCoinChange,
} from "@/lib/algorithms/coin-change/parseCoins";
import { MAX_COIN_AMOUNT, MAX_COIN_TYPES } from "@/lib/algorithms/types";

/** Classic: [1,3,4] amount 6 → 2 coins (3+3). 1+1+4 is 3 and is not optimal. */
const CLASSIC = [1, 3, 4];

function trustedCoinChange(
  coins: number[],
  amount: number,
): { count: number; reconstructed: string } {
  const INF = Number.POSITIVE_INFINITY;
  const n = coins.length;
  const dp: number[][] = Array.from({ length: n + 1 }, () =>
    Array.from({ length: amount + 1 }, () => INF),
  );
  for (let i = 0; i <= n; i += 1) dp[i]![0] = 0;
  for (let i = 1; i <= n; i += 1) {
    const c = coins[i - 1]!;
    for (let a = 0; a <= amount; a += 1) {
      const skip = dp[i - 1]![a]!;
      const take = c <= a ? 1 + dp[i]![a - c]! : skip;
      dp[i]![a] = Math.min(skip, take);
    }
  }
  const best = dp[n]![amount]!;
  if (!Number.isFinite(best)) return { count: INF, reconstructed: "impossible" };
  if (best === 0) return { count: 0, reconstructed: "none" };
  const used: number[] = [];
  let i = n;
  let a = amount;
  while (a > 0 && i >= 1) {
    const c = coins[i - 1]!;
    if (c <= a && Number.isFinite(dp[i]![a]!) && dp[i]![a] === 1 + dp[i]![a - c]!) {
      used.push(c);
      a -= c;
    } else {
      i -= 1;
    }
  }
  return { count: best, reconstructed: used.join("+") };
}

function fillSteps(coins: number[], amount: number) {
  return generateCoinChangeSteps(coins, amount).filter(
    (s) =>
      s.codeLineId === "skip" ||
      s.codeLineId === "take" ||
      s.codeLineId === "choose",
  );
}

describe("generateCoinChangeSteps", () => {
  it("solves [1,3,4] amount 6 with 2 coins (3+3, not 1+1+4)", () => {
    const steps = generateCoinChangeSteps(CLASSIC, 6);
    const last = steps[steps.length - 1]!;
    expect(last.dpTable?.cells[3]![6]).toBe(2);
    expect(last.dpTable?.reconstructed).toBe("3+3");
    const text = last.dpTable!.reconstructed!;
    expect(text).not.toBe("1+1+4");
    const parts = text.split("+").map(Number);
    expect(parts.reduce((s, n) => s + n, 0)).toBe(6);
    expect(parts).toHaveLength(2);
  });

  it("amount 0 yields 0 coins", () => {
    const last = generateCoinChangeSteps(CLASSIC, 0).at(-1)!;
    expect(last.dpTable?.cells.map((row) => row[0])).toEqual([0, 0, 0, 0]);
    expect(last.dpTable?.cells[3]![0]).toBe(0);
    expect(last.dpTable?.reconstructed).toBe("none");
  });

  it("coins [2,4] amount 3 is impossible", () => {
    const last = generateCoinChangeSteps([2, 4], 3).at(-1)!;
    expect(last.dpTable?.cells[2]![3]).toBe(Number.POSITIVE_INFINITY);
    expect(last.dpTable?.reconstructed).toBe("impossible");
    expect(last.dpTable?.cells[2]![2]).toBe(1);
  });

  it("reconstruction matches dp[n][amount] and a trusted unbounded DP", () => {
    const cases: { coins: number[]; amount: number }[] = [
      { coins: CLASSIC, amount: 6 },
      { coins: CLASSIC, amount: 0 },
      { coins: CLASSIC, amount: 8 },
      { coins: [], amount: 5 },
      { coins: [], amount: 0 },
      { coins: [2, 4], amount: 3 },
      { coins: [2], amount: 4 },
      { coins: [1, 5, 10], amount: 12 },
    ];
    for (const { coins, amount } of cases) {
      const last = generateCoinChangeSteps(coins, amount).at(-1)!;
      const trusted = trustedCoinChange(coins, amount);
      expect(last.dpTable?.cells[coins.length]![amount]).toBe(trusted.count);
      expect(last.dpTable?.reconstructed).toBe(trusted.reconstructed);
      if (trusted.reconstructed === "impossible") {
        expect(last.dpTable!.cells[coins.length]![amount]).toBe(
          Number.POSITIVE_INFINITY,
        );
        continue;
      }
      if (trusted.reconstructed === "none") {
        expect(trusted.count).toBe(0);
        continue;
      }
      const parts = trusted.reconstructed.split("+").map(Number);
      expect(parts.reduce((s, n) => s + n, 0)).toBe(amount);
      expect(parts).toHaveLength(trusted.count);
    }
  });

  it("does not mutate the original coins array", () => {
    const coins = [...CLASSIC];
    const snapshot = JSON.stringify(coins);
    generateCoinChangeSteps(coins, 6);
    expect(JSON.stringify(coins)).toBe(snapshot);
    expect(coins).toEqual(CLASSIC);
  });

  it("fills cells row-major and writes skip/take/choose with reads", () => {
    const writes = fillSteps(CLASSIC, 6);
    expect(writes).toHaveLength(CLASSIC.length * (6 + 1));
    let k = 0;
    for (let i = 1; i <= CLASSIC.length; i += 1) {
      for (let a = 0; a <= 6; a += 1) {
        const step = writes[k]!;
        expect(step.dpTable?.write).toEqual({ i, j: a });
        expect(["skip", "take", "choose"]).toContain(step.codeLineId);
        expect(step.dpTable?.reads?.length).toBeGreaterThan(0);
        k += 1;
      }
    }
    expect(writes.some((s) => s.codeLineId === "skip")).toBe(true);
    expect(writes.some((s) => s.codeLineId === "take")).toBe(true);
  });

  it("skip reads the previous row; take reads leftover in the same row", () => {
    const steps = generateCoinChangeSteps(CLASSIC, 6);
    const skip = steps.find((s) => s.codeLineId === "skip")!;
    const sw = skip.dpTable!.write!;
    expect(skip.dpTable!.reads).toEqual(
      expect.arrayContaining([{ i: sw.i - 1, j: sw.j }]),
    );

    const take = steps.find((s) => s.codeLineId === "take")!;
    const tw = take.dpTable!.write!;
    const coin = CLASSIC[tw.i - 1]!;
    expect(take.dpTable!.reads).toEqual(
      expect.arrayContaining([
        { i: tw.i - 1, j: tw.j },
        { i: tw.i, j: tw.j - coin },
      ]),
    );
  });

  it("labels axes as coins × amount and uses the Coins result label", () => {
    const last = generateCoinChangeSteps(CLASSIC, 6).at(-1)!;
    expect(last.dpTable?.rowLabels).toEqual(["ε", "c=1", "c=3", "c=4"]);
    expect(last.dpTable?.colLabels).toEqual([
      "0",
      "1",
      "2",
      "3",
      "4",
      "5",
      "6",
    ]);
    expect(last.dpTable?.resultLabel).toBe("Coins");
  });

  it("emits impossible when the amount cannot be made", () => {
    const steps = generateCoinChangeSteps([2, 4], 3);
    expect(steps.some((s) => s.codeLineId === "impossible")).toBe(true);
    expect(steps.at(-1)!.codeLineId).toBe("done");
    expect(steps.at(-1)!.dpTable?.reconstructed).toBe("impossible");
  });

  it("every step has a codeLineId, explanation, and cloned table cells", () => {
    const steps = generateCoinChangeSteps(CLASSIC, 6);
    expect(steps.length).toBeGreaterThan(1);
    for (const step of steps) {
      expect(step.explanation.trim().length).toBeGreaterThan(0);
      expect(step.codeLineId.trim().length).toBeGreaterThan(0);
      expect(step.dpTable).toBeDefined();
      expect(step.array).toEqual([]);
    }
    const firstCells = steps[0]!.dpTable!.cells;
    firstCells[0]![1] = 99;
    expect(steps[1]!.dpTable!.cells[0]![1]).not.toBe(99);
    const last = steps[steps.length - 1]!;
    expect(last.codeLineId).toBe("done");
    const text = steps.map((s) => s.explanation).join("\n").toLowerCase();
    expect(text).toMatch(/coin|amount|unbounded|fewest/);
    expect(text).not.toMatch(/\bpivot\b/);
    expect(text).not.toMatch(/\bknapsack\b/);
  });
});

describe("parseCoins", () => {
  it("parses comma-separated positive ints", () => {
    expect(parseCoins("1, 3, 4")).toEqual({ ok: true, coins: CLASSIC });
    expect(formatCoins(CLASSIC)).toBe("1, 3, 4");
  });

  it("rejects empty input, junk, non-positive numbers, and too many coins", () => {
    expect(parseCoins("  ").ok).toBe(false);
    expect(parseCoins("1, a").ok).toBe(false);
    expect(parseCoins("0, 3").ok).toBe(false);
    expect(parseCoins("-1, 3").ok).toBe(false);
    const tooMany = Array.from(
      { length: MAX_COIN_TYPES + 1 },
      (_, i) => i + 1,
    ).join(", ");
    expect(parseCoins(tooMany).ok).toBe(false);
  });

  it("accepts a list at the coin-type cap", () => {
    const raw = Array.from({ length: MAX_COIN_TYPES }, (_, i) => i + 1).join(
      ", ",
    );
    const parsed = parseCoins(raw);
    expect(parsed.ok).toBe(true);
    if (!parsed.ok) return;
    expect(parsed.coins).toHaveLength(MAX_COIN_TYPES);
  });
});

describe("parseAmountInput", () => {
  it("parses a non-negative amount within the cap", () => {
    expect(parseAmountInput("8")).toEqual({ ok: true, value: 8 });
    expect(parseAmountInput(" 0 ")).toEqual({ ok: true, value: 0 });
    expect(parseAmountInput(String(MAX_COIN_AMOUNT))).toEqual({
      ok: true,
      value: MAX_COIN_AMOUNT,
    });
  });

  it("rejects empty, negative, non-integer, and oversized amount", () => {
    expect(parseAmountInput("  ").ok).toBe(false);
    expect(parseAmountInput("-1").ok).toBe(false);
    expect(parseAmountInput("7.5").ok).toBe(false);
    expect(parseAmountInput(String(MAX_COIN_AMOUNT + 1)).ok).toBe(false);
  });
});

describe("randomCoinChange", () => {
  it("emits canonical coins and a modest amount within the caps", () => {
    for (let i = 0; i < 40; i += 1) {
      const { coins, amount } = randomCoinChange();
      expect(coins.length).toBeGreaterThan(0);
      expect(coins.length).toBeLessThanOrEqual(MAX_COIN_TYPES);
      expect(coins.every((c) => c >= 1)).toBe(true);
      expect(amount).toBeGreaterThan(0);
      expect(amount).toBeLessThanOrEqual(MAX_COIN_AMOUNT);
      const parsed = parseCoins(formatCoins(coins));
      expect(parsed).toEqual({ ok: true, coins });
    }
  });
});
