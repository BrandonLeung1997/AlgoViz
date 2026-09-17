import { parseArrayInput } from "@/lib/algorithms/parseInput";
import { MAX_COIN_AMOUNT, MAX_COIN_TYPES } from "@/lib/algorithms/types";

const CANONICAL_SETS = [
  [1, 3, 4],
  [1, 5, 10],
  [2, 5, 7],
  [1, 4, 6],
];

export function parseCoins(
  raw: string,
): { ok: true; coins: number[] } | { ok: false; error: string } {
  const parsed = parseArrayInput(raw);
  if (!parsed.ok) return parsed;
  if (parsed.values.length > MAX_COIN_TYPES) {
    return {
      ok: false,
      error: `Use at most ${MAX_COIN_TYPES} coin types.`,
    };
  }
  for (const value of parsed.values) {
    if (value < 1) {
      return { ok: false, error: "Each coin must be a positive integer." };
    }
  }
  return { ok: true, coins: parsed.values };
}

export function parseAmountInput(
  raw: string,
): { ok: true; value: number } | { ok: false; error: string } {
  const trimmed = raw.trim();
  if (!trimmed) {
    return { ok: false, error: "Enter an amount integer." };
  }
  if (!/^\d+$/.test(trimmed)) {
    return { ok: false, error: `“${trimmed}” is not a non-negative integer.` };
  }
  const value = Number(trimmed);
  if (value > MAX_COIN_AMOUNT) {
    return {
      ok: false,
      error: `Use an amount of at most ${MAX_COIN_AMOUNT}.`,
    };
  }
  return { ok: true, value };
}

export function formatCoins(coins: number[]): string {
  return coins.join(", ");
}

export function randomCoinChange(): { coins: number[]; amount: number } {
  const coins = CANONICAL_SETS[Math.floor(Math.random() * CANONICAL_SETS.length)]!;
  const amount = 6 + Math.floor(Math.random() * 7);
  return { coins: [...coins], amount: Math.min(amount, MAX_COIN_AMOUNT) };
}
