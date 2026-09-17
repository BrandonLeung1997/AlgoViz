import { describe, expect, it } from "vitest";
import { generateLcsSteps } from "@/lib/algorithms/lcs/generateSteps";
import { parseStringInput } from "@/lib/algorithms/parseInput";
import { randomLcsString } from "@/lib/algorithms/randomString";
import { MAX_STRING_LENGTH } from "@/lib/algorithms/types";

function trustedLcsLength(x: string, y: string): number {
  const memo = new Map<string, number>();
  function rec(i: number, j: number): number {
    if (i === 0 || j === 0) return 0;
    const key = `${i},${j}`;
    const hit = memo.get(key);
    if (hit !== undefined) return hit;
    const val =
      x[i - 1] === y[j - 1]
        ? rec(i - 1, j - 1) + 1
        : Math.max(rec(i - 1, j), rec(i, j - 1));
    memo.set(key, val);
    return val;
  }
  return rec(x.length, y.length);
}

function isSubsequence(sub: string, s: string): boolean {
  let k = 0;
  for (const ch of s) {
    if (k < sub.length && ch === sub[k]) k += 1;
  }
  return k === sub.length;
}

function finalLcs(x: string, y: string): string {
  return generateLcsSteps(x, y).at(-1)?.dpTable?.reconstructed ?? "";
}

function writeSteps(x: string, y: string) {
  return generateLcsSteps(x, y).filter(
    (s) => s.codeLineId === "match" || s.codeLineId === "skip",
  );
}

describe("generateLcsSteps", () => {
  it("matches a trusted LCS length and reconstructs a common subsequence of that length", () => {
    const pairs: [string, string][] = [
      ["ABCD", "ACBD"],
      ["AGGTAB", "GXTXAYB"],
      ["ABC", "ABC"],
      ["ABC", "DEF"],
      ["", ""],
      ["ABC", ""],
      ["", "XYZ"],
      ["A1B2", "A12"],
    ];
    for (const [x, y] of pairs) {
      const steps = generateLcsSteps(x, y);
      const last = steps[steps.length - 1]!;
      const reconstructed = last.dpTable?.reconstructed ?? "";
      const length = trustedLcsLength(x, y);
      expect(last.dpTable?.cells[x.length]![y.length]).toBe(length);
      expect(reconstructed.length).toBe(length);
      expect(isSubsequence(reconstructed, x)).toBe(true);
      expect(isSubsequence(reconstructed, y)).toBe(true);
    }
  });

  it("does not mutate the original input strings", () => {
    const x = "ABCD";
    const y = "ACBD";
    generateLcsSteps(x, y);
    expect(x).toBe("ABCD");
    expect(y).toBe("ACBD");
  });

  it("handles empty vs empty: all-zero table and no invented characters", () => {
    const steps = generateLcsSteps("", "");
    expect(steps.length).toBeGreaterThan(0);
    const last = steps[steps.length - 1]!;
    expect(last.dpTable?.cells).toEqual([[0]]);
    expect(last.dpTable?.reconstructed).toBe("");
    expect(last.explanation.toLowerCase()).toMatch(/empty|no common/);
  });

  it("handles one empty string", () => {
    const steps = generateLcsSteps("ABC", "");
    const last = steps[steps.length - 1]!;
    expect(last.dpTable?.cells.every((row) => row.every((c) => c === 0))).toBe(
      true,
    );
    expect(last.dpTable?.reconstructed).toBe("");
    expect(writeSteps("ABC", "").length).toBe(0);
  });

  it("handles no letters in common: table is all zeros and LCS is empty", () => {
    const steps = generateLcsSteps("ABC", "XYZ");
    const last = steps[steps.length - 1]!;
    expect(last.dpTable?.cells.every((row) => row.every((c) => c === 0))).toBe(
      true,
    );
    expect(last.dpTable?.reconstructed).toBe("");
    const emptyStep = steps.find((s) => s.codeLineId === "reconstruct-empty");
    expect(emptyStep).toBeDefined();
    expect(emptyStep!.explanation.toLowerCase()).toMatch(
      /no common subsequence/,
    );
  });

  it("classic ABCD / ACBD has length 3 and a valid reconstruction", () => {
    const reconstructed = finalLcs("ABCD", "ACBD");
    expect(reconstructed.length).toBe(3);
    expect(["ABD", "ACD"]).toContain(reconstructed);
  });

  it("fills the table in row-major order", () => {
    const x = "ABCD";
    const y = "ACBD";
    const writes = writeSteps(x, y);
    expect(writes).toHaveLength(x.length * y.length);
    let k = 0;
    for (let i = 1; i <= x.length; i += 1) {
      for (let j = 1; j <= y.length; j += 1) {
        const step = writes[k]!;
        expect(step.dpTable?.write).toEqual({ i, j });
        expect(step.codeLineId === "match" || step.codeLineId === "skip").toBe(
          true,
        );
        k += 1;
      }
    }
  });

  it("every write step has a codeLineId and cloned table cells", () => {
    const x = "AB";
    const y = "AC";
    const steps = generateLcsSteps(x, y);
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

  it("match writes take the diagonal; skip writes read skip-X and skip-Y", () => {
    const steps = generateLcsSteps("ABCD", "ACBD");
    const match = steps.find((s) => s.codeLineId === "match")!;
    expect(match).toBeDefined();
    const w = match.dpTable!.write!;
    expect(match.dpTable!.reads).toEqual([{ i: w.i - 1, j: w.j - 1 }]);
    expect(match.explanation.toLowerCase()).toMatch(/match/);
    expect(match.explanation.toLowerCase()).toMatch(/diagonal/);

    const skip = steps.find((s) => s.codeLineId === "skip")!;
    expect(skip).toBeDefined();
    const sw = skip.dpTable!.write!;
    expect(skip.dpTable!.reads).toEqual(
      expect.arrayContaining([
        { i: sw.i - 1, j: sw.j },
        { i: sw.i, j: sw.j - 1 },
      ]),
    );
    expect(skip.explanation.toLowerCase()).toMatch(/skip-x|skip-y|skip/);
    expect(skip.explanation.toLowerCase()).toMatch(/max/);
  });

  it("reconstruction visits match cells and the final explanation shows the subsequence", () => {
    const x = "ABCD";
    const y = "ACBD";
    const steps = generateLcsSteps(x, y);
    const matches = steps.filter((s) => s.codeLineId === "reconstruct-match");
    expect(matches.length).toBe(3);
    for (const step of matches) {
      const cell = step.dpTable!.write!;
      expect(x[cell.i - 1]).toBe(y[cell.j - 1]);
      expect(step.explanation.toLowerCase()).toMatch(/reconstruct|prepend|match/);
    }
    const last = steps[steps.length - 1]!;
    expect(last.codeLineId).toBe("done");
    expect(last.explanation).toContain(last.dpTable!.reconstructed);
  });

  it("uses LCS teaching language, not sort / pivot / graph wording", () => {
    const text = generateLcsSteps("ABCD", "ACBD")
      .map((s) => s.explanation)
      .join("\n")
      .toLowerCase();
    expect(text).toMatch(/match/);
    expect(text).toMatch(/diagonal/);
    expect(text).toMatch(/skip/);
    expect(text).toMatch(/reconstruct/);
    expect(text).not.toMatch(/\bpivot\b/);
    expect(text).not.toMatch(/\brelax/);
    expect(text).not.toMatch(/\benqueue/);
    expect(text).not.toMatch(/\bsort the\b/);
  });

  it("reports length when the table is full", () => {
    const steps = generateLcsSteps("ABCD", "ACBD");
    const lengthDone = steps.find((s) => s.codeLineId === "length-done");
    expect(lengthDone).toBeDefined();
    expect(lengthDone!.dpTable?.cells[4]![4]).toBe(3);
    expect(lengthDone!.explanation).toMatch(/3/);
  });
});

describe("LCS string randomize", () => {
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
