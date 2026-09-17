import type { ListNodeFrame, Step } from "@/lib/algorithms/types";
import {
  buildListNodes,
  cloneListNodes,
} from "@/lib/algorithms/reverse-list/listFrame";

function nodeValue(nodes: ListNodeFrame[], id: number | null): string {
  if (id === null) return "null";
  const node = nodes.find((n) => n.id === id);
  return node ? String(node.value) : "null";
}

function nextOf(nodes: ListNodeFrame[], id: number | null): number | null {
  if (id === null) return null;
  return nodes.find((n) => n.id === id)?.next ?? null;
}

function linkCycle(
  nodes: ListNodeFrame[],
  cycleIndex: number | null,
): ListNodeFrame[] {
  if (nodes.length === 0 || cycleIndex === null) return nodes;
  if (cycleIndex < 0 || cycleIndex >= nodes.length) return nodes;
  const last = nodes[nodes.length - 1]!;
  last.next = cycleIndex;
  return nodes;
}

export function generateCycleDetectionSteps(
  values: number[],
  cycleIndex: number | null,
): Step[] {
  const steps: Step[] = [];
  const nodes = linkCycle(buildListNodes(values), cycleIndex);
  const head = nodes.length === 0 ? null : 0;
  const n = values.length;
  const moveCap = n + 2;

  const push = (
    codeLineId: string,
    explanation: string,
    slow: number | null,
    fast: number | null,
  ) => {
    const snapshot = cloneListNodes(nodes);
    const highlightIds = [slow, fast].filter((id): id is number => id !== null);
    steps.push({
      array: [...values],
      highlights: [],
      list: {
        nodes: snapshot,
        head,
        pointers: { head, slow, fast },
        highlightIds: [...new Set(highlightIds)],
      },
      codeLineId,
      explanation,
    });
  };

  push(
    "fn-def",
    n === 0
      ? "Floyd’s tortoise and hare on an empty list — there is no cycle."
      : cycleIndex === null || cycleIndex < 0 || cycleIndex >= n
        ? "Floyd’s tortoise and hare: slow walks one node, fast walks two, looking for a meeting."
        : "Floyd’s tortoise and hare on a list whose tail links back — a cycle is present.",
    head,
    head,
  );

  let slow = head;
  let fast = head;

  push(
    "init",
    "Set slow and fast to head. They start on the same node, then leave together.",
    slow,
    fast,
  );

  if (n === 0) {
    push("no-cycle", "Head is null, so there is no cycle.", null, null);
    return steps;
  }

  let moves = 0;
  while (fast !== null && nextOf(nodes, fast) !== null) {
    if (moves >= moveCap) break;
    moves += 1;

    slow = nextOf(nodes, slow);
    fast = nextOf(nodes, nextOf(nodes, fast));

    push(
      "move",
      `Move: slow is now ${nodeValue(nodes, slow)}, fast is now ${nodeValue(nodes, fast)}.`,
      slow,
      fast,
    );

    if (slow !== null && slow === fast) {
      push(
        "meet",
        `slow and fast met at ${nodeValue(nodes, slow)} — the list has a cycle.`,
        slow,
        fast,
      );
      push(
        "done",
        `Done. The pointers collided, so a cycle exists. Time O(n), extra space O(1).`,
        slow,
        fast,
      );
      return steps;
    }

    push(
      "meet",
      `Compare: slow is ${nodeValue(nodes, slow)}, fast is ${nodeValue(nodes, fast)} — not the same node yet.`,
      slow,
      fast,
    );
  }

  push(
    "no-cycle",
    "fast (or fast.next) is null — the list is acyclic.",
    slow,
    fast,
  );
  return steps;
}
