import { describe, expect, it } from "vitest";
import {
  parseArrayInput,
  parseTargetInput,
  MAX_ARRAY_LENGTH,
} from "@/lib/algorithms/parseInput";

describe("parseArrayInput", () => {
  it("parses comma-separated integers", () => {
    expect(parseArrayInput("8, 3, 5, 1")).toEqual({
      ok: true,
      values: [8, 3, 5, 1],
    });
  });

  it("rejects empty input", () => {
    const result = parseArrayInput("  ");
    expect(result.ok).toBe(false);
  });

  it("rejects non-integers", () => {
    const result = parseArrayInput("1, a, 3");
    expect(result.ok).toBe(false);
  });

  it("rejects arrays longer than MAX_ARRAY_LENGTH", () => {
    const raw = Array.from({ length: MAX_ARRAY_LENGTH + 1 }, (_, i) => i + 1).join(",");
    const result = parseArrayInput(raw);
    expect(result.ok).toBe(false);
  });
});

describe("parseTargetInput", () => {
  it("parses a single integer", () => {
    expect(parseTargetInput("7")).toEqual({ ok: true, value: 7 });
    expect(parseTargetInput(" -12 ")).toEqual({ ok: true, value: -12 });
  });

  it("rejects empty input", () => {
    const result = parseTargetInput("  ");
    expect(result.ok).toBe(false);
  });

  it("rejects non-integers", () => {
    const result = parseTargetInput("7.5");
    expect(result.ok).toBe(false);
  });
});
