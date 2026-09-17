import type { CodeLine } from "@/lib/algorithms/types";

export const REVERSE_LIST_CODE: Record<
  "python" | "javascript" | "cpp",
  CodeLine[]
> = {
  python: [
    { id: "fn-def", text: "def reverse_list(head):" },
    { id: "init", text: "    prev, curr = None, head" },
    { id: "loop", text: "    while curr:" },
    { id: "save-next", text: "        nxt = curr.next" },
    { id: "relink", text: "        curr.next = prev" },
    { id: "advance", text: "        prev, curr = curr, nxt" },
    { id: "done", text: "    return prev" },
  ],
  javascript: [
    { id: "fn-def", text: "function reverseList(head) {" },
    { id: "init", text: "  let prev = null, curr = head;" },
    { id: "loop", text: "  while (curr) {" },
    { id: "save-next", text: "    const nxt = curr.next;" },
    { id: "relink", text: "    curr.next = prev;" },
    { id: "advance", text: "    prev = curr; curr = nxt;" },
    { id: "done", text: "  return prev;" },
  ],
  cpp: [
    { id: "fn-def", text: "ListNode* reverseList(ListNode* head) {" },
    { id: "init", text: "  ListNode *prev = nullptr, *curr = head;" },
    { id: "loop", text: "  while (curr) {" },
    { id: "save-next", text: "    ListNode* nxt = curr->next;" },
    { id: "relink", text: "    curr->next = prev;" },
    { id: "advance", text: "    prev = curr; curr = nxt;" },
    { id: "done", text: "  return prev;" },
  ],
};
