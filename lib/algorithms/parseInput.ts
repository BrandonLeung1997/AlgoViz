import { MAX_ARRAY_LENGTH } from "@/lib/algorithms/types";

export { MAX_ARRAY_LENGTH };

export function parseArrayInput(
  raw: string,
): { ok: true; values: number[] } | { ok: false; error: string } {
  const trimmed = raw.trim();
  if (!trimmed) {
    return { ok: false, error: "Enter at least one integer." };
  }
  const parts = trimmed.split(/[\s,]+/).filter(Boolean);
  if (parts.length > MAX_ARRAY_LENGTH) {
    return {
      ok: false,
      error: `Use at most ${MAX_ARRAY_LENGTH} numbers.`,
    };
  }
  const values: number[] = [];
  for (const part of parts) {
    if (!/^-?\d+$/.test(part)) {
      return { ok: false, error: `“${part}” is not an integer.` };
    }
    values.push(Number(part));
  }
  return { ok: true, values };
}
