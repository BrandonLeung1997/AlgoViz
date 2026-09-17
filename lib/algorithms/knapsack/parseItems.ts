import {
  MAX_KNAPSACK_CAPACITY,
  MAX_KNAPSACK_ITEMS,
} from "@/lib/algorithms/types";

export type KnapsackItem = { weight: number; value: number };

export function parseKnapsackItems(
  raw: string,
): { ok: true; items: KnapsackItem[] } | { ok: false; error: string } {
  const trimmed = raw.trim();
  if (!trimmed) {
    return { ok: false, error: "Enter at least one item as weight:value." };
  }
  const parts = trimmed.split(",").map((p) => p.trim()).filter(Boolean);
  if (parts.length > MAX_KNAPSACK_ITEMS) {
    return {
      ok: false,
      error: `Use at most ${MAX_KNAPSACK_ITEMS} items.`,
    };
  }
  const items: KnapsackItem[] = [];
  for (const part of parts) {
    const match = part.match(/^(\d+)\s*:\s*(\d+)$/);
    if (!match) {
      return {
        ok: false,
        error: `“${part}” is not an item like 2:3 (weight:value).`,
      };
    }
    const weight = Number(match[1]);
    const value = Number(match[2]);
    if (weight < 1 || value < 1) {
      return {
        ok: false,
        error: "Each item needs a positive weight and value.",
      };
    }
    items.push({ weight, value });
  }
  if (items.length === 0) {
    return { ok: false, error: "Enter at least one item as weight:value." };
  }
  return { ok: true, items };
}

export function parseCapacityInput(
  raw: string,
): { ok: true; value: number } | { ok: false; error: string } {
  const trimmed = raw.trim();
  if (!trimmed) {
    return { ok: false, error: "Enter a capacity integer." };
  }
  if (!/^\d+$/.test(trimmed)) {
    return { ok: false, error: `“${trimmed}” is not a non-negative integer.` };
  }
  const value = Number(trimmed);
  if (value > MAX_KNAPSACK_CAPACITY) {
    return {
      ok: false,
      error: `Use a capacity of at most ${MAX_KNAPSACK_CAPACITY}.`,
    };
  }
  return { ok: true, value };
}

export function formatKnapsackItems(items: KnapsackItem[]): string {
  return items.map((it) => `${it.weight}:${it.value}`).join(", ");
}

export function randomKnapsack(): { items: KnapsackItem[]; capacity: number } {
  const n = 3 + Math.floor(Math.random() * 2);
  const items: KnapsackItem[] = Array.from({ length: n }, () => ({
    weight: 1 + Math.floor(Math.random() * 5),
    value: 1 + Math.floor(Math.random() * 9),
  }));
  const sum = items.reduce((s, it) => s + it.weight, 0);
  const maxCap = Math.min(MAX_KNAPSACK_CAPACITY, Math.max(1, sum - 1));
  const capacity = 1 + Math.floor(Math.random() * maxCap);
  return { items, capacity };
}
