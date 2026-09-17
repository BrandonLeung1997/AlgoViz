import { describe, expect, it } from "vitest";
import { generateKnapsackSteps } from "@/lib/algorithms/knapsack/generateSteps";
import {
  formatKnapsackItems,
  parseCapacityInput,
  parseKnapsackItems,
  randomKnapsack,
  type KnapsackItem,
} from "@/lib/algorithms/knapsack/parseItems";
import {
  MAX_KNAPSACK_CAPACITY,
  MAX_KNAPSACK_ITEMS,
} from "@/lib/algorithms/types";

/** Classic 3-item instance: take 1 and 2 for value 7 (capacity 5). */
const CLASSIC: KnapsackItem[] = [
  { weight: 2, value: 3 },
  { weight: 3, value: 4 },
  { weight: 4, value: 5 },
];

function trustedKnapsack(
  items: KnapsackItem[],
  capacity: number,
): { value: number; chosen: number[] } {
  const n = items.length;
  const dp: number[][] = Array.from({ length: n + 1 }, () =>
    Array.from({ length: capacity + 1 }, () => 0),
  );
  for (let i = 1; i <= n; i += 1) {
    const { weight, value } = items[i - 1]!;
    for (let w = 0; w <= capacity; w += 1) {
      const skip = dp[i - 1]![w]!;
      dp[i]![w] =
        weight <= w ? Math.max(skip, value + dp[i - 1]![w - weight]!) : skip;
    }
  }
  const chosen: number[] = [];
  let w = capacity;
  for (let i = n; i >= 1; i -= 1) {
    if (dp[i]![w] !== dp[i - 1]![w]) {
      chosen.unshift(i);
      w -= items[i - 1]!.weight;
    }
  }
  return { value: dp[n]![capacity]!, chosen };
}

function parseReconstructed(text: string): { indices: number[]; value: number } {
  const none = text.match(/^none value=(\d+)$/);
  if (none) return { indices: [], value: Number(none[1]) };
  const match = text.match(/^items ([\d,]+) value=(\d+)$/);
  if (!match) {
    throw new Error(`unexpected reconstructed: ${text}`);
  }
  const indices = match[1]!.split(",").map((s) => Number(s.trim()));
  return { indices, value: Number(match[2]) };
}

function fillSteps(items: KnapsackItem[], capacity: number) {
  return generateKnapsackSteps(items, capacity).filter(
    (s) =>
      s.codeLineId === "skip" ||
      s.codeLineId === "take" ||
      s.codeLineId === "choose",
  );
}

describe("generateKnapsackSteps", () => {
  it("solves the classic 2:3, 3:4, 4:5 capacity-5 instance (optimum 7)", () => {
    const steps = generateKnapsackSteps(CLASSIC, 5);
    const last = steps[steps.length - 1]!;
    expect(last.dpTable?.cells[3]![5]).toBe(7);
    expect(last.dpTable?.reconstructed).toBe("items 1,2 value=7");
    const parsed = parseReconstructed(last.dpTable!.reconstructed!);
    expect(parsed.value).toBe(7);
    expect(parsed.indices).toEqual([1, 2]);
  });

  it("capacity 0 always yields value 0", () => {
    const last = generateKnapsackSteps(CLASSIC, 0).at(-1)!;
    expect(last.dpTable?.cells.map((row) => row[0])).toEqual([0, 0, 0, 0]);
    expect(last.dpTable?.cells[3]![0]).toBe(0);
    expect(last.dpTable?.reconstructed).toBe("none value=0");
  });

  it("never takes an item heavier than W", () => {
    const items: KnapsackItem[] = [
      { weight: 9, value: 100 },
      { weight: 2, value: 3 },
    ];
    const last = generateKnapsackSteps(items, 5).at(-1)!;
    expect(last.dpTable?.cells[2]![5]).toBe(3);
    const parsed = parseReconstructed(last.dpTable!.reconstructed!);
    expect(parsed.indices).toEqual([2]);
    expect(parsed.indices).not.toContain(1);
    expect(parsed.value).toBe(3);
  });

  it("reconstruction value matches dp[n][W] and a trusted DP", () => {
    const cases: { items: KnapsackItem[]; capacity: number }[] = [
      { items: CLASSIC, capacity: 5 },
      { items: CLASSIC, capacity: 0 },
      { items: CLASSIC, capacity: 8 },
      { items: [], capacity: 5 },
      { items: [{ weight: 4, value: 7 }], capacity: 3 },
      {
        items: [
          { weight: 1, value: 6 },
          { weight: 2, value: 10 },
          { weight: 3, value: 12 },
        ],
        capacity: 5,
      },
    ];
    for (const { items, capacity } of cases) {
      const last = generateKnapsackSteps(items, capacity).at(-1)!;
      const trusted = trustedKnapsack(items, capacity);
      expect(last.dpTable?.cells[items.length]![capacity]).toBe(trusted.value);
      const parsed = parseReconstructed(last.dpTable!.reconstructed!);
      expect(parsed.value).toBe(trusted.value);
      expect(parsed.value).toBe(last.dpTable!.cells[items.length]![capacity]);
      const weight = parsed.indices.reduce(
        (sum, idx) => sum + items[idx - 1]!.weight,
        0,
      );
      const value = parsed.indices.reduce(
        (sum, idx) => sum + items[idx - 1]!.value,
        0,
      );
      expect(weight).toBeLessThanOrEqual(capacity);
      expect(value).toBe(trusted.value);
      expect(parsed.indices).toEqual(trusted.chosen);
    }
  });

  it("does not mutate the original items array", () => {
    const items = CLASSIC.map((it) => ({ ...it }));
    const snapshot = JSON.stringify(items);
    generateKnapsackSteps(items, 5);
    expect(JSON.stringify(items)).toBe(snapshot);
  });

  it("fills cells row-major and writes skip/take/choose with reads", () => {
    const writes = fillSteps(CLASSIC, 5);
    expect(writes).toHaveLength(CLASSIC.length * (5 + 1));
    let k = 0;
    for (let i = 1; i <= CLASSIC.length; i += 1) {
      for (let w = 0; w <= 5; w += 1) {
        const step = writes[k]!;
        expect(step.dpTable?.write).toEqual({ i, j: w });
        expect(["skip", "take", "choose"]).toContain(step.codeLineId);
        expect(step.dpTable?.reads?.length).toBeGreaterThan(0);
        k += 1;
      }
    }
    expect(writes.some((s) => s.codeLineId === "skip")).toBe(true);
    expect(writes.some((s) => s.codeLineId === "take")).toBe(true);
  });

  it("skip reads the previous row; take also reads leftover capacity", () => {
    const steps = generateKnapsackSteps(CLASSIC, 5);
    const skip = steps.find((s) => s.codeLineId === "skip")!;
    const sw = skip.dpTable!.write!;
    expect(skip.dpTable!.reads).toEqual(
      expect.arrayContaining([{ i: sw.i - 1, j: sw.j }]),
    );

    const take = steps.find((s) => s.codeLineId === "take")!;
    const tw = take.dpTable!.write!;
    const item = CLASSIC[tw.i - 1]!;
    expect(take.dpTable!.reads).toEqual(
      expect.arrayContaining([
        { i: tw.i - 1, j: tw.j },
        { i: tw.i - 1, j: tw.j - item.weight },
      ]),
    );
  });

  it("labels axes as items × capacity and uses the Value result label", () => {
    const last = generateKnapsackSteps(CLASSIC, 5).at(-1)!;
    expect(last.dpTable?.rowLabels).toEqual([
      "ε",
      "w=2 v=3",
      "w=3 v=4",
      "w=4 v=5",
    ]);
    expect(last.dpTable?.colLabels).toEqual(["0", "1", "2", "3", "4", "5"]);
    expect(last.dpTable?.resultLabel).toBe("Value");
  });

  it("every step has a codeLineId, explanation, and cloned table cells", () => {
    const steps = generateKnapsackSteps(CLASSIC, 5);
    expect(steps.length).toBeGreaterThan(1);
    for (const step of steps) {
      expect(step.explanation.trim().length).toBeGreaterThan(0);
      expect(step.codeLineId.trim().length).toBeGreaterThan(0);
      expect(step.dpTable).toBeDefined();
      expect(step.array).toEqual([]);
    }
    const firstCells = steps[0]!.dpTable!.cells;
    firstCells[0]![0] = 99;
    expect(steps[1]!.dpTable!.cells[0]![0]).not.toBe(99);
    const last = steps[steps.length - 1]!;
    expect(last.codeLineId).toBe("done");
    const text = steps.map((s) => s.explanation).join("\n").toLowerCase();
    expect(text).toMatch(/knapsack|value|capacity|item/);
    expect(text).not.toMatch(/\bpivot\b/);
    expect(text).not.toMatch(/\benqueue/);
  });
});

describe("parseKnapsackItems", () => {
  it("parses weight:value pairs", () => {
    expect(parseKnapsackItems("2:3, 3:4, 4:5")).toEqual({
      ok: true,
      items: CLASSIC,
    });
    expect(formatKnapsackItems(CLASSIC)).toBe("2:3, 3:4, 4:5");
  });

  it("rejects empty input, junk, non-positive numbers, and too many items", () => {
    expect(parseKnapsackItems("  ").ok).toBe(false);
    expect(parseKnapsackItems("2-3").ok).toBe(false);
    expect(parseKnapsackItems("2:3:4").ok).toBe(false);
    expect(parseKnapsackItems("0:3").ok).toBe(false);
    expect(parseKnapsackItems("2:0").ok).toBe(false);
    expect(parseKnapsackItems("-2:3").ok).toBe(false);
    const tooMany = Array.from(
      { length: MAX_KNAPSACK_ITEMS + 1 },
      (_, i) => `${i + 1}:1`,
    ).join(", ");
    expect(parseKnapsackItems(tooMany).ok).toBe(false);
  });

  it("accepts a list at the item cap", () => {
    const raw = Array.from(
      { length: MAX_KNAPSACK_ITEMS },
      (_, i) => `${i + 1}:1`,
    ).join(", ");
    const parsed = parseKnapsackItems(raw);
    expect(parsed.ok).toBe(true);
    if (!parsed.ok) return;
    expect(parsed.items).toHaveLength(MAX_KNAPSACK_ITEMS);
  });
});

describe("parseCapacityInput", () => {
  it("parses a non-negative capacity within the cap", () => {
    expect(parseCapacityInput("8")).toEqual({ ok: true, value: 8 });
    expect(parseCapacityInput(" 0 ")).toEqual({ ok: true, value: 0 });
    expect(parseCapacityInput(String(MAX_KNAPSACK_CAPACITY))).toEqual({
      ok: true,
      value: MAX_KNAPSACK_CAPACITY,
    });
  });

  it("rejects empty, negative, non-integer, and oversized capacity", () => {
    expect(parseCapacityInput("  ").ok).toBe(false);
    expect(parseCapacityInput("-1").ok).toBe(false);
    expect(parseCapacityInput("7.5").ok).toBe(false);
    expect(parseCapacityInput(String(MAX_KNAPSACK_CAPACITY + 1)).ok).toBe(
      false,
    );
  });
});

describe("randomKnapsack", () => {
  it("emits a small non-trivial instance within the caps", () => {
    for (let i = 0; i < 40; i += 1) {
      const { items, capacity } = randomKnapsack();
      expect(items.length).toBeGreaterThan(0);
      expect(items.length).toBeLessThanOrEqual(MAX_KNAPSACK_ITEMS);
      expect(capacity).toBeGreaterThan(0);
      expect(capacity).toBeLessThanOrEqual(MAX_KNAPSACK_CAPACITY);
      const parsed = parseKnapsackItems(formatKnapsackItems(items));
      expect(parsed).toEqual({ ok: true, items });
      const sum = items.reduce((s, it) => s + it.weight, 0);
      expect(capacity).not.toBe(sum);
    }
  });
});
