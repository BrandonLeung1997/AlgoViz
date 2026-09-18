import {
  MAX_ARRAY_LENGTH,
  MAX_HEAP_SIZE,
  MAX_LIST_LENGTH,
} from "@/lib/algorithms/types";

export function randomArray(length = 10): number[] {
  const n = Math.min(Math.max(length, 1), MAX_ARRAY_LENGTH);
  return Array.from({ length: n }, () => Math.floor(Math.random() * 50) + 1);
}

function shuffledPool(count: number): number[] {
  const pool = Array.from({ length: 50 }, (_, i) => i + 1);
  for (let i = pool.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    const tmp = pool[i]!;
    pool[i] = pool[j]!;
    pool[j] = tmp;
  }
  return pool.slice(0, count);
}

export function randomHeapArray(): number[] {
  const n = Math.min(6 + Math.floor(Math.random() * 3), MAX_HEAP_SIZE);
  return shuffledPool(n);
}

export function randomListArray(): number[] {
  const n = Math.min(4 + Math.floor(Math.random() * 4), MAX_LIST_LENGTH);
  return shuffledPool(n);
}

export function randomSortedListPair(): [number[], number[]] {
  const nA = 2 + Math.floor(Math.random() * 3);
  const nB = Math.min(2 + Math.floor(Math.random() * 3), MAX_LIST_LENGTH - nA);
  const pool = shuffledPool(nA + nB);
  const sortN = (xs: number[]) => [...xs].sort((x, y) => x - y);
  return [sortN(pool.slice(0, nA)), sortN(pool.slice(nA))];
}

export function randomHashChaining(): {
  keys: number[];
  bucketCount: number;
  searchKey: number;
} {
  const keys = shuffledPool(6);
  const set = new Set(keys);
  let miss = 0;
  while (set.has(miss)) miss += 1;
  const searchKey =
    Math.random() < 0.5
      ? keys[Math.floor(Math.random() * keys.length)]!
      : miss;
  return { keys, bucketCount: 5, searchKey };
}
