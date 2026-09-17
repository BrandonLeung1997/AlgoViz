import { describe, expect, it } from "vitest";
import { generateEditDistanceSteps } from "@/lib/algorithms/edit-distance/generateSteps";
import { parseStringInput } from "@/lib/algorithms/parseInput";
import { randomLcsString } from "@/lib/algorithms/randomString";
import { MAX_STRING_LENGTH } from "@/lib/algorithms/types";

function trustedEditDistance(x: string, y: string): number {
  const m = x.length;
  const n = y.length;
  const dp: number[][] = Array.from({ length: m + 1 }, () =>
    Array.from({ length: n + 1 }, () => 0),
  );
  for (let j = 0; j <= n; j += 1) dp[0]![j] = j;
  for (let i = 1; i <= m; i += 1) dp[i]![0] = i;
  for (let i = 1; i <= m; i += 1) {
    for (let j = 1; j <= n; j += 1) {
      if (x[i - 1] === y[j - 1]) {
        dp[i]![j] = dp[i - 1]![j - 1]!;
      } else {
        dp[i]![j] =
          1 +
          Math.min(dp[i - 1]![j]!, dp[i]![j - 1]!, dp[i - 1]![j - 1]!);
      }
    }
  }
  return dp[m]![n]!;
}

function writeSteps(x: string, y: string) {
  return generateEditDistanceSteps(x, y).filter(
    (s) => s.codeLineId === "match" || s.codeLineId === "mismatch",
  );
}

describe("generateEditDistanceSteps", () => {
  it("empty vs empty has distance 0", () => {
    const steps = generateEditDistanceSteps("", "");
    expect(steps.length).toBeGreaterThan(0);
    const last = steps[steps.length - 1]!;
    expect(last.dpTable?.cells).toEqual([[0]]);
    expect(last.dpTable?.cells[0]![0]).toBe(0);
    expect(last.dpTable?.reconstructed).toBe("0");
  });

  it("ABC vs empty has distance 3", () => {
    const steps = generateEditDistanceSteps("ABC", "");
    const last = steps[steps.length - 1]!;
    expect(last.dpTable?.cells[3]![0]).toBe(3);
    expect(last.dpTable?.reconstructed).toBe("3");
    expect(writeSteps("ABC", "").length).toBe(0);
  });

  it("kitten vs sitting has distance 3", () => {
    const steps = generateEditDistanceSteps("kitten", "sitting");
    const last = steps[steps.length - 1]!;
    expect(last.dpTable?.cells[6]![7]).toBe(3);
    expect(last.dpTable?.reconstructed).toBe("3");
  });

  it("classic short pairs: cat/cut is 1 and cat/dogs is 4", () => {
    expect(
      generateEditDistanceSteps("cat", "cut").at(-1)?.dpTable?.cells[3]![3],
    ).toBe(1);
    expect(
      generateEditDistanceSteps("cat", "dogs").at(-1)?.dpTable?.cells[3]![4],
    ).toBe(4);
  });

  it("matches a trusted Levenshtein distance on several pairs", () => {
    const pairs: [string, string][] = [
      ["", ""],
      ["ABC", ""],
      ["", "XYZ"],
      ["cat", "cut"],
      ["cat", "dogs"],
      ["kitten", "sitting"],
      ["ABC", "ABC"],
      ["ABC", "DEF"],
      ["A1B2", "A12"],
    ];
    for (const [x, y] of pairs) {
      const last = generateEditDistanceSteps(x, y).at(-1)!;
      const distance = trustedEditDistance(x, y);
      expect(last.dpTable?.cells[x.length]![y.length]).toBe(distance);
      expect(last.dpTable?.reconstructed).toBe(String(distance));
    }
  });

  it("does not mutate the original input strings", () => {
    const x = "cat";
    const y = "cut";
    generateEditDistanceSteps(x, y);
    expect(x).toBe("cat");
    expect(y).toBe("cut");
  });

  it("emits both match and mismatch steps", () => {
    const steps = generateEditDistanceSteps("cat", "cut");
    expect(steps.some((s) => s.codeLineId === "match")).toBe(true);
    expect(steps.some((s) => s.codeLineId === "mismatch")).toBe(true);
  });

  it("fills inner cells in row-major order", () => {
    const x = "cat";
    const y = "cut";
    const writes = writeSteps(x, y);
    expect(writes).toHaveLength(x.length * y.length);
    let k = 0;
    for (let i = 1; i <= x.length; i += 1) {
      for (let j = 1; j <= y.length; j += 1) {
        const step = writes[k]!;
        expect(step.dpTable?.write).toEqual({ i, j });
        expect(
          step.codeLineId === "match" || step.codeLineId === "mismatch",
        ).toBe(true);
        k += 1;
      }
    }
  });

  it("match writes take the diagonal; mismatch writes read three neighbors", () => {
    const steps = generateEditDistanceSteps("cat", "cut");
    const match = steps.find((s) => s.codeLineId === "match")!;
    expect(match).toBeDefined();
    const w = match.dpTable!.write!;
    expect(match.dpTable!.reads).toEqual([{ i: w.i - 1, j: w.j - 1 }]);
    expect(match.explanation.toLowerCase()).toMatch(/match/);

    const mismatch = steps.find((s) => s.codeLineId === "mismatch")!;
    expect(mismatch).toBeDefined();
    const mw = mismatch.dpTable!.write!;
    expect(mismatch.dpTable!.reads).toEqual(
      expect.arrayContaining([
        { i: mw.i - 1, j: mw.j },
        { i: mw.i, j: mw.j - 1 },
        { i: mw.i - 1, j: mw.j - 1 },
      ]),
    );
    expect(mismatch.dpTable!.reads).toHaveLength(3);
    expect(mismatch.explanation.toLowerCase()).toMatch(
      /mismatch|insert|delete|replace/,
    );
  });

  it("every step has a codeLineId, explanation, and cloned table cells", () => {
    const steps = generateEditDistanceSteps("cat", "cut");
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
  });

  it("last cell equals the known distance and done uses teaching language", () => {
    const steps = generateEditDistanceSteps("kitten", "sitting");
    const last = steps[steps.length - 1]!;
    expect(last.codeLineId).toBe("done");
    expect(last.dpTable?.cells[6]![7]).toBe(3);
    expect(last.explanation).toMatch(/3/);
    const text = steps.map((s) => s.explanation).join("\n").toLowerCase();
    expect(text).toMatch(/insert|delete|replace|edit distance|distance/);
    expect(text).not.toMatch(/\bpivot\b/);
    expect(text).not.toMatch(/\benqueue/);
  });
});

describe("edit distance string randomize", () => {
  it("emits valid non-empty strings within the length cap", () => {
    for (let i = 0; i < 40; i += 1) {
      const s = randomLcsString();
      expect(s.length).toBeGreaterThan(0);
      expect(s.length).toBeLessThanOrEqual(MAX_STRING_LENGTH);
      const parsed = parseStringInput(s);
      expect(parsed).toEqual({ ok: true, value: s });
    }
  });
});
