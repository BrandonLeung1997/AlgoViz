import type { AlgorithmMeta } from "@/lib/algorithms/types";

export const mergeListsMeta: AlgorithmMeta = {
  slug: "merge-lists",
  title: "Merge Two Sorted Lists",
  summary:
    "Merge two sorted singly linked lists with a dummy head: compare p and q, attach the smaller, splice the rest.",
  status: "ready",
  family: "linked-lists",
  complexity: [
    { label: "Best", time: "O(n+m)", space: "O(1)" },
    { label: "Average", time: "O(n+m)", space: "O(1)" },
    { label: "Worst", time: "O(n+m)", space: "O(1)" },
  ],
  complexityNote:
    "One pass over both lists: each node is compared and attached once. Time is O(n+m). Extra memory is O(1) for the dummy node — the merge rewires existing next pointers rather than allocating a new array of nodes.",
};
