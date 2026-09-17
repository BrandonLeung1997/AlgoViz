import type { ListNodeFrame, Step } from "@/lib/algorithms/types";
import {
  buildListNodes,
  cloneListNodes,
  walkIds,
} from "@/lib/algorithms/reverse-list/listFrame";

function nodeValue(nodes: ListNodeFrame[], id: number | null): string {
  if (id === null) return "null";
  const node = nodes.find((n) => n.id === id);
  return node ? String(node.value) : "null";
}

export function generateReverseListSteps(values: number[]): Step[] {
  const steps: Step[] = [];
  const nodes = buildListNodes(values);
  const originalHead = nodes.length === 0 ? null : 0;

  const push = (
    codeLineId: string,
    explanation: string,
    head: number | null,
    pointers: Record<string, number | null>,
  ) => {
    const snapshot = cloneListNodes(nodes);
    steps.push({
      array: [...values],
      highlights: [],
      list: {
        nodes: snapshot,
        head,
        pointers: { ...pointers },
        highlightIds: walkIds(snapshot, pointers.prev ?? null),
      },
      codeLineId,
      explanation,
    });
  };

  push(
    "fn-def",
    nodes.length === 0
      ? "Reverse an empty list — there is nothing to flip."
      : "Reverse the list in place by flipping each node's next pointer.",
    originalHead,
    { prev: null, curr: originalHead, next: null, head: originalHead },
  );

  let prev: number | null = null;
  let curr: number | null = originalHead;

  push(
    "init",
    "Set prev to null and curr to head. The reversed prefix starts empty.",
    originalHead,
    { prev, curr, next: null, head: originalHead },
  );

  while (curr !== null) {
    const currNode = nodes.find((n) => n.id === curr)!;
    const nxt = currNode.next;

    push(
      "save-next",
      `Save next: ${nodeValue(nodes, curr)}'s successor is ${nodeValue(nodes, nxt)}.`,
      originalHead,
      { prev, curr, next: nxt, head: originalHead },
    );

    currNode.next = prev;

    push(
      "relink",
      `Relink: ${nodeValue(nodes, curr)}.next now points to ${nodeValue(nodes, prev)}.`,
      originalHead,
      { prev, curr, next: nxt, head: originalHead },
    );

    prev = curr;
    curr = nxt;

    push(
      "advance",
      `Advance: prev is ${nodeValue(nodes, prev)}, curr is ${nodeValue(nodes, curr)}.`,
      originalHead,
      { prev, curr, next: null, head: originalHead },
    );
  }

  push(
    "done",
    nodes.length === 0
      ? "Empty list stays empty. head is still null."
      : "Done. head is the old tail — the list is reversed.",
    prev,
    { prev, curr: null, next: null, head: prev },
  );

  return steps;
}
