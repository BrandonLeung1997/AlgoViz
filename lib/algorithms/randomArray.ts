import { MAX_ARRAY_LENGTH } from "@/lib/algorithms/types";

export function randomArray(length = 10): number[] {
  const n = Math.min(Math.max(length, 1), MAX_ARRAY_LENGTH);
  return Array.from({ length: n }, () => Math.floor(Math.random() * 50) + 1);
}
