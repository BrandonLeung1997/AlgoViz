import type { CodeLine } from "@/lib/algorithms/types";

export const CYCLE_DETECTION_CODE: Record<
  "python" | "javascript" | "cpp",
  CodeLine[]
> = {
  python: [
    { id: "fn-def", text: "def has_cycle(head):" },
    { id: "init", text: "    slow = fast = head" },
    { id: "loop", text: "    while fast and fast.next:" },
    { id: "move", text: "        slow, fast = slow.next, fast.next.next" },
    { id: "meet", text: "        if slow is fast:" },
    { id: "done", text: "            return True" },
    { id: "no-cycle", text: "    return False" },
  ],
  javascript: [
    { id: "fn-def", text: "function hasCycle(head) {" },
    { id: "init", text: "  let slow = head, fast = head;" },
    { id: "loop", text: "  while (fast && fast.next) {" },
    { id: "move", text: "    slow = slow.next; fast = fast.next.next;" },
    { id: "meet", text: "    if (slow === fast)" },
    { id: "done", text: "      return true;" },
    { id: "no-cycle", text: "  return false;" },
  ],
  cpp: [
    { id: "fn-def", text: "bool hasCycle(ListNode* head) {" },
    { id: "init", text: "  ListNode *slow = head, *fast = head;" },
    { id: "loop", text: "  while (fast && fast->next) {" },
    { id: "move", text: "    slow = slow->next; fast = fast->next->next;" },
    { id: "meet", text: "    if (slow == fast)" },
    { id: "done", text: "      return true;" },
    { id: "no-cycle", text: "  return false;" },
  ],
};
