import type { AlgorithmMeta } from "@/lib/algorithms/types";

export const linearProbingMeta: AlgorithmMeta = {
  slug: "linear-probing",
  title: "Linear Probing",
  summary:
    "Insert keys into a hash table with linear probing, then search: walk (h + i) % m until the key or an empty slot.",
  status: "ready",
  family: "hashing",
  complexity: [
    { label: "Best", time: "O(1)", space: "O(m)" },
    { label: "Average", time: "O(1)", space: "O(m)" },
    { label: "Worst", time: "O(n)", space: "O(m)" },
  ],
  complexityNote:
    "Average insert and search are O(1) at low load. Primary clustering makes probes longer as n approaches m. Worst case is O(n). This visualization does not resize or delete.",
};
