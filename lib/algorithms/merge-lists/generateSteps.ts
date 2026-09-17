import type { ListNodeFrame, Step } from "@/lib/algorithms/types";
import { cloneListNodes } from "@/lib/algorithms/reverse-list/listFrame";

const B_OFFSET = 100;

function buildMergeNodes(a: number[], b: number[]): ListNodeFrame[] {
  const nodes: ListNodeFrame[] = [];
  for (let i = 0; i < a.length; i += 1) {
    nodes.push({
      id: i,
      value: a[i]!,
      next: i < a.length - 1 ? i + 1 : null,
    });
  }
  for (let j = 0; j < b.length; j += 1) {
    const id = B_OFFSET + j;
    nodes.push({
      id,
      value: b[j]!,
      next: j < b.length - 1 ? B_OFFSET + j + 1 : null,
    });
  }
  return nodes;
}

function nodeById(
  nodes: ListNodeFrame[],
  id: number | null,
): ListNodeFrame | undefined {
  if (id === null) return undefined;
  return nodes.find((n) => n.id === id);
}

function nodeValue(nodes: ListNodeFrame[], id: number | null): string {
  if (id === null) return "null";
  return String(nodeById(nodes, id)?.value ?? "null");
}

export function generateMergeListsSteps(a: number[], b: number[]): Step[] {
  const steps: Step[] = [];
  const nodes = buildMergeNodes(a, b);
  let dummyNext: number | null = null;
  let p: number | null = a.length === 0 ? null : 0;
  let q: number | null = b.length === 0 ? null : B_OFFSET;
  let tail: number | null = null;
  let appended = false;

  const snapshot = () => {
    const clone = cloneListNodes(nodes);
    if (!appended && tail !== null) {
      const t = clone.find((n) => n.id === tail);
      if (t && (t.next === p || t.next === q)) t.next = null;
    }
    return clone;
  };

  const push = (
    codeLineId: string,
    explanation: string,
    displayP: number | null,
    displayQ: number | null,
  ) => {
    const highlightIds = [displayP, displayQ, tail].filter(
      (id): id is number => id !== null,
    );
    steps.push({
      array: [...a, ...b],
      highlights: [],
      list: {
        nodes: snapshot(),
        head: dummyNext,
        head2: displayQ,
        pointers: { p: displayP, q: displayQ, tail, head: dummyNext },
        highlightIds: [...new Set(highlightIds)],
      },
      codeLineId,
      explanation,
    });
  };

  push(
    "fn-def",
    a.length === 0 && b.length === 0
      ? "Merge two empty lists — the result is empty."
      : "Merge two sorted lists with a dummy head. Compare p and q, attach the smaller, then splice the rest.",
    p,
    q,
  );

  while (p !== null && q !== null) {
    const pv = nodeById(nodes, p)!.value;
    const qv = nodeById(nodes, q)!.value;
    push(
      "compare",
      `Compare: p is ${nodeValue(nodes, p)}, q is ${nodeValue(nodes, q)}. Attach the smaller (${pv <= qv ? "A" : "B"}).`,
      p,
      q,
    );

    if (pv <= qv) {
      if (tail === null) dummyNext = p;
      else nodeById(nodes, tail)!.next = p;
      const chosen = p;
      p = nodeById(nodes, p)!.next;
      tail = chosen;
    } else {
      if (tail === null) dummyNext = q;
      else nodeById(nodes, tail)!.next = q;
      const chosen = q;
      q = nodeById(nodes, q)!.next;
      tail = chosen;
    }

    push(
      "attach",
      `Attach ${nodeValue(nodes, tail)} to the merged tail and advance that source pointer.`,
      p,
      q,
    );
  }

  appended = true;
  const rest = p ?? q;
  const restFromA = p !== null;
  if (tail === null) dummyNext = rest;
  else nodeById(nodes, tail)!.next = rest;

  push(
    "append-rest",
    rest === null
      ? "Both sources are exhausted. Nothing left to splice."
      : `Splice the remaining ${restFromA ? "A" : "B"} nodes onto the merged tail.`,
    null,
    null,
  );

  push(
    "done",
    dummyNext === null
      ? "Done. dummy.next is null — the merged list is empty. Time O(n+m), extra space O(1)."
      : "Done. dummy.next is the merged head. Time O(n+m), extra space O(1) for the dummy node.",
    null,
    null,
  );

  return steps;
}
