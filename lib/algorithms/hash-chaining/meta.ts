import type { AlgorithmMeta } from "@/lib/algorithms/types";

export const hashChainingMeta: AlgorithmMeta = {
  slug: "hash-chaining",
  title: "Hash Table (Chaining)",
  summary:
    "Insert keys into a hash table with separate chaining, then search: hash to a bucket and walk the chain.",
  status: "ready",
  family: "hashing",
  complexity: [
    { label: "Best", time: "O(1)", space: "O(n)" },
    { label: "Average", time: "O(1)", space: "O(n)" },
    { label: "Worst", time: "O(n)", space: "O(n)" },
  ],
  complexityNote:
    "Average insert and search are O(1) when chains stay short (load factor n/m). Worst case is O(n) if every key collides in one bucket. This visualization does not resize.",
};
