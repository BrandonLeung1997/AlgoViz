import type { AlgorithmMeta } from "@/lib/algorithms/types";

export const reverseListMeta: AlgorithmMeta = {
  slug: "reverse-list",
  title: "Reverse Linked List",
  summary:
    "Reverse a singly linked list in place by walking prev, curr, and next.",
  status: "ready",
  family: "linked-lists",
  complexity: [
    { label: "Best", time: "O(n)", space: "O(1)" },
    { label: "Average", time: "O(n)", space: "O(1)" },
    { label: "Worst", time: "O(n)", space: "O(1)" },
  ],
  complexityNote:
    "Iterative reverse walks each node once, flipping next pointers with three references (prev, curr, next). Time is O(n). Extra memory is O(1) — no new list. Recursion would use O(n) stack space and is out of scope here.",
};
