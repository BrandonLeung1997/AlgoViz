import type { AlgorithmMeta } from "@/lib/algorithms/types";

export const cycleDetectionMeta: AlgorithmMeta = {
  slug: "cycle-detection",
  title: "Cycle Detection",
  summary:
    "Floyd’s tortoise and hare: slow walks one node, fast walks two, until they meet or fall off.",
  status: "ready",
  family: "linked-lists",
  complexity: [
    { label: "Best", time: "O(n)", space: "O(1)" },
    { label: "Average", time: "O(n)", space: "O(1)" },
    { label: "Worst", time: "O(n)", space: "O(1)" },
  ],
  complexityNote:
    "Two pointers share the list: slow advances one node per step, fast advances two. If there is a cycle they must meet; if the list is acyclic fast hits null. Time is O(n). Extra memory is O(1) — unlike a hash set of seen nodes, which would use O(n) space.",
};
