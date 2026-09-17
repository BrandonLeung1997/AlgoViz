import type { CodeLine } from "@/lib/algorithms/types";

export const MERGE_LISTS_CODE: Record<
  "python" | "javascript" | "cpp",
  CodeLine[]
> = {
  python: [
    { id: "fn-def", text: "def merge_lists(p, q):" },
    { id: "dummy", text: "    dummy = ListNode(0); tail = dummy" },
    { id: "loop", text: "    while p and q:" },
    { id: "compare", text: "        if p.val <= q.val:" },
    { id: "attach", text: "            tail.next, p = p, p.next  # else q" },
    { id: "append-rest", text: "    tail.next = p or q" },
    { id: "done", text: "    return dummy.next" },
  ],
  javascript: [
    { id: "fn-def", text: "function mergeLists(p, q) {" },
    { id: "dummy", text: "  const dummy = { next: null }; let tail = dummy;" },
    { id: "loop", text: "  while (p && q) {" },
    { id: "compare", text: "    if (p.val <= q.val)" },
    { id: "attach", text: "      tail.next = p; p = p.next;  // else q" },
    { id: "append-rest", text: "  tail.next = p || q;" },
    { id: "done", text: "  return dummy.next;" },
  ],
  cpp: [
    { id: "fn-def", text: "ListNode* mergeLists(ListNode* p, ListNode* q) {" },
    { id: "dummy", text: "  ListNode dummy(0); ListNode* tail = &dummy;" },
    { id: "loop", text: "  while (p && q) {" },
    { id: "compare", text: "    if (p->val <= q->val)" },
    { id: "attach", text: "      tail->next = p; p = p->next;  // else q" },
    { id: "append-rest", text: "  tail->next = p ? p : q;" },
    { id: "done", text: "  return dummy.next;" },
  ],
};
