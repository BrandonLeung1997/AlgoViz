# Merge Two Sorted Lists Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add dummy-head merge of two sorted singly linked lists with a three-row `ListCanvas` (A, B, merged) without breaking reverse-list or cycle-detection.

**Architecture:** `generateMergeListsSteps(a, b)` emits an immutable `Step[]`. Studio holds two arrays and thunks `usePlayback`. `ListCanvas` switches to three walk-ordered rows when pointers include `p` and `q`. Dummy node is generator-local only; `head` is `dummy.next`.

**Tech Stack:** Next.js App Router, TypeScript, Tailwind, Framer Motion, Vitest + Testing Library. Clone Reverse List / Cycle Detection studio chrome.

**Spec:** `docs/superpowers/specs/2026-09-17-merge-lists-design.md`

## Global Constraints

- Family: `linked-lists`. Slug: `merge-lists`. Title: `Merge Two Sorted Lists`.
- Dummy-head iterative merge; stable (`p.val <= q.val` takes A). Dummy is not drawn.
- `ListFrame.head` = merged start; `head2` = remaining B (`q`). Pointers always include keys `p` and `q` (values may be `null`), plus `tail` and `head`.
- Node ids: A `0..n-1`, B `100, 101, …`.
- `MAX_LIST_LENGTH` stays **8**. Combined `a.length + b.length <= 8`.
- Sort on Apply. Empty/whitespace list input → `[]` via `parseMergeListInput` only (do not change `parseListInput`).
- Code ids: `fn-def`, `dummy`, `loop`, `compare`, `attach`, `append-rest`, `done`. Generated steps use `fn-def`, `compare`, `attach`, `append-rest`, `done`.
- Default code language: Python. Sky lab split studio.
- Commit only when the user explicitly asks (skip plan commit steps).
- TDD: failing test first, then minimal implementation.

---

## File structure

```
lib/algorithms/merge-lists/meta.ts          (create)
lib/algorithms/merge-lists/code.ts          (create)
lib/algorithms/merge-lists/generateSteps.ts (create)
lib/algorithms/parseInput.ts                (modify: parseMergeListInput)
lib/algorithms/randomArray.ts               (modify: randomSortedListPair)
lib/algorithms/registry.ts                  (modify)
components/player/ListCanvas.tsx            (modify: three-row merge mode)
components/player/MergeListsStudio.tsx      (create)
components/player/index.ts                  (modify)
app/algorithms/merge-lists/page.tsx         (create)
__tests__/parseInput.test.ts                (modify)
__tests__/generateMergeListsSteps.test.ts   (create)
__tests__/listCanvas.test.tsx               (modify)
__tests__/codeLineIds.test.ts               (modify)
```

---

### Task 1: parseMergeListInput

**Files:**
- Modify: `lib/algorithms/parseInput.ts` (after `parseListInput`)
- Modify: `__tests__/parseInput.test.ts`

**Interfaces:**
- Consumes: `parseListInput`
- Produces: `parseMergeListInput(raw: string): { ok: true; values: number[] } | { ok: false; error: string }`

- [ ] **Step 1: Write the failing tests**

Add to `__tests__/parseInput.test.ts` imports: `parseMergeListInput`.

```ts
describe("parseMergeListInput", () => {
  it("treats empty and whitespace as an empty list", () => {
    expect(parseMergeListInput("")).toEqual({ ok: true, values: [] });
    expect(parseMergeListInput("   ")).toEqual({ ok: true, values: [] });
  });

  it("parses a list-sized array", () => {
    expect(parseMergeListInput("1, 3, 5")).toEqual({
      ok: true,
      values: [1, 3, 5],
    });
  });

  it("still rejects a list longer than MAX_LIST_LENGTH", () => {
    const raw = Array.from({ length: MAX_LIST_LENGTH + 1 }, (_, i) => i + 1).join(
      ",",
    );
    const result = parseMergeListInput(raw);
    expect(result.ok).toBe(false);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run __tests__/parseInput.test.ts`

Expected: FAIL — `parseMergeListInput` is not exported.

- [ ] **Step 3: Implement**

In `lib/algorithms/parseInput.ts` immediately after `parseListInput`:

```ts
export function parseMergeListInput(
  raw: string,
): { ok: true; values: number[] } | { ok: false; error: string } {
  if (raw.trim() === "") return { ok: true, values: [] };
  return parseListInput(raw);
}
```

Do not change `parseListInput`.

- [ ] **Step 4: Run tests**

Run: `npx vitest run __tests__/parseInput.test.ts`

Expected: PASS.

---

### Task 2: generateMergeListsSteps (TDD)

**Files:**
- Create: `__tests__/generateMergeListsSteps.test.ts`
- Create: `lib/algorithms/merge-lists/code.ts`
- Create: `lib/algorithms/merge-lists/meta.ts`
- Create: `lib/algorithms/merge-lists/generateSteps.ts`

**Interfaces:**
- Consumes: `cloneListNodes` from `lib/algorithms/reverse-list/listFrame.ts`; `Step`, `ListNodeFrame` from types
- Produces: `generateMergeListsSteps(a: number[], b: number[]): Step[]`; `MERGE_LISTS_CODE`; `mergeListsMeta`

- [ ] **Step 1: Write code listings and meta (no generator yet)**

Create `lib/algorithms/merge-lists/code.ts`:

```ts
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
```

Create `lib/algorithms/merge-lists/meta.ts`:

```ts
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
```

- [ ] **Step 2: Write the failing generator tests**

Create `__tests__/generateMergeListsSteps.test.ts`:

```ts
import { describe, expect, it } from "vitest";
import { generateMergeListsSteps } from "@/lib/algorithms/merge-lists/generateSteps";
import { MERGE_LISTS_CODE } from "@/lib/algorithms/merge-lists/code";
import type { ListFrame } from "@/lib/algorithms/types";

function walkValues(list: ListFrame): number[] {
  const byId = new Map(list.nodes.map((node) => [node.id, node]));
  const values: number[] = [];
  const seen = new Set<number>();
  let id = list.head;
  while (id !== null) {
    expect(seen.has(id)).toBe(false);
    seen.add(id);
    const node = byId.get(id);
    expect(node).toBeDefined();
    values.push(node!.value);
    id = node!.next;
  }
  return values;
}

describe("generateMergeListsSteps", () => {
  it("merges [1,3,5] and [2,4] into 1,2,3,4,5", () => {
    const steps = generateMergeListsSteps([1, 3, 5], [2, 4]);
    const last = steps[steps.length - 1]!;
    expect(last.codeLineId).toBe("done");
    expect(walkValues(last.list!)).toEqual([1, 2, 3, 4, 5]);
  });

  it("returns the other list when one is empty", () => {
    expect(walkValues(generateMergeListsSteps([], [2, 4]).at(-1)!.list!)).toEqual(
      [2, 4],
    );
    expect(walkValues(generateMergeListsSteps([1, 3], []).at(-1)!.list!)).toEqual(
      [1, 3],
    );
  });

  it("handles both empty", () => {
    const last = generateMergeListsSteps([], []).at(-1)!;
    expect(last.codeLineId).toBe("done");
    expect(last.list!.nodes).toEqual([]);
    expect(last.list!.head).toBeNull();
  });

  it("keeps A ahead on ties", () => {
    const last = generateMergeListsSteps([1, 1], [1, 2]).at(-1)!;
    expect(walkValues(last.list!)).toEqual([1, 1, 1, 2]);
  });

  it("does not mutate the input arrays", () => {
    const a = [1, 3, 5];
    const b = [2, 4];
    generateMergeListsSteps(a, b);
    expect(a).toEqual([1, 3, 5]);
    expect(b).toEqual([2, 4]);
  });

  it("emits compare and attach when both lists are non-empty", () => {
    const ids = generateMergeListsSteps([1, 3, 5], [2, 4]).map((s) => s.codeLineId);
    expect(ids).toContain("compare");
    expect(ids).toContain("attach");
  });

  it("uses A ids 0..n-1 and B ids 100+", () => {
    const step = generateMergeListsSteps([1, 3], [2])[0]!;
    const ids = step.list!.nodes.map((n) => n.id).sort((x, y) => x - y);
    expect(ids).toEqual([0, 1, 100]);
  });

  it("every step has list, p/q keys, explanation, and a valid id", () => {
    const valid = new Set(MERGE_LISTS_CODE.python.map((l) => l.id));
    const runs = [
      generateMergeListsSteps([1, 3, 5], [2, 4]),
      generateMergeListsSteps([], [2]),
      generateMergeListsSteps([1], []),
      generateMergeListsSteps([], []),
      generateMergeListsSteps([1, 1], [1, 2]),
    ];
    for (const steps of runs) {
      expect(steps.length).toBeGreaterThan(0);
      for (const step of steps) {
        expect(step.explanation.trim().length).toBeGreaterThan(0);
        expect(step.list).toBeDefined();
        expect("p" in (step.list!.pointers ?? {})).toBe(true);
        expect("q" in (step.list!.pointers ?? {})).toBe(true);
        expect(valid.has(step.codeLineId)).toBe(true);
      }
    }
  });
});
```

- [ ] **Step 3: Run tests to verify they fail**

Run: `npx vitest run __tests__/generateMergeListsSteps.test.ts`

Expected: FAIL — `generateSteps` module missing.

- [ ] **Step 4: Implement the generator**

Create `lib/algorithms/merge-lists/generateSteps.ts`:

```ts
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
```

- [ ] **Step 5: Run generator tests**

Run: `npx vitest run __tests__/generateMergeListsSteps.test.ts`

Expected: PASS.

---

### Task 3: ListCanvas three-row merge mode

**Files:**
- Modify: `components/player/ListCanvas.tsx`
- Modify: `__tests__/listCanvas.test.tsx`

**Interfaces:**
- Consumes: `walkIds` from `lib/algorithms/reverse-list/listFrame.ts`; `generateMergeListsSteps`
- Produces: merge mode when `"p" in pointers && "q" in pointers`; reverse/cycle unchanged

- [ ] **Step 1: Write the failing canvas tests**

Add import of `generateMergeListsSteps`. Append:

```ts
  it("labels List A, List B, and Merged for a merge step", () => {
    const step = generateMergeListsSteps([1, 3, 5], [2, 4])[0];
    render(<ListCanvas step={step} />);
    expect(screen.getByText("List A")).toBeInTheDocument();
    expect(screen.getByText("List B")).toBeInTheDocument();
    expect(screen.getByText("Merged")).toBeInTheDocument();
  });

  it("does not show merge row labels for reverse-list", () => {
    const step = generateReverseListSteps([1, 2, 3, 4])[0];
    render(<ListCanvas step={step} />);
    expect(screen.queryByText("List A")).not.toBeInTheDocument();
    expect(screen.queryByText("Merged")).not.toBeInTheDocument();
  });

  it("does not show merge row labels for cycle detection", () => {
    const step = generateCycleDetectionSteps([1, 2, 3, 4], 1)[0];
    render(<ListCanvas step={step} />);
    expect(screen.queryByText("List A")).not.toBeInTheDocument();
    expect(screen.queryByText("Merged")).not.toBeInTheDocument();
  });
```

- [ ] **Step 2: Run canvas tests to verify new ones fail**

Run: `npx vitest run __tests__/listCanvas.test.tsx`

Expected: new tests FAIL (no “List A”); existing reverse/cycle tests still PASS.

- [ ] **Step 3: Implement three-row merge mode**

In `ListCanvas.tsx`:

1. Import `walkIds` from `@/lib/algorithms/reverse-list/listFrame`.
2. Extend `POINTER_ORDER` to `["head", "slow", "fast", "prev", "curr", "next", "p", "q", "tail"]`.
3. Add label colors: `p: "text-sky-600"`, `q: "text-amber-700"`, `tail: "text-green-700"`.
4. In `nodeFill`, after the slow+fast rose check: if roles include both `p` and `q` return `#f43f5e`; if `q` return amber (`#fbbf24`); if `p` return sky (`#38bdf8`); if `tail` return green (`#22c55e`). Keep existing curr/fast/slow/next/prev/reversed branches.
5. In `labelFill`, also dark text for `p` and `q`.
6. At the start of `ListCanvas`, if `"p" in pointers && "q" in pointers`, render three `ChainRow`s (List A from `pointers.p`, List B from `pointers.q`, Merged from `list.head`) plus merge legend (`p · q · tail · merged`). Do **not** use the global “Empty list” in this mode; empty walks get a short “empty” placeholder inside the row.
7. Extract `ChainRow` that takes `label`, `nodes` (walk order), `pointers`, `reversed`, and draws one labeled chain using the existing `NodeSlot` / `arrowPath` / `slotCenterX` helpers. Only draw edges whose `next` is also on that row. Empty `nodes` → label + “empty” text, no SVG nodes.
8. Leave the existing single-row path (including `n === 0` → “Empty list”) for non-merge.

`ChainRow` geometry can match the current single-row constants (`NODE_W`, `GAP`, `LABEL_H`, etc.). Put the row title (`List A`) above the pointer labels.

- [ ] **Step 4: Run canvas tests**

Run: `npx vitest run __tests__/listCanvas.test.tsx`

Expected: PASS (merge labels present; reverse/cycle unchanged).

---

### Task 4: Studio, route, registry, randomize, codeLineIds

**Files:**
- Modify: `lib/algorithms/randomArray.ts` — add `randomSortedListPair`
- Create: `components/player/MergeListsStudio.tsx`
- Create: `app/algorithms/merge-lists/page.tsx`
- Modify: `components/player/index.ts`
- Modify: `lib/algorithms/registry.ts`
- Modify: `__tests__/codeLineIds.test.ts`

**Interfaces:**
- Consumes: `generateMergeListsSteps`, `parseMergeListInput`, `MERGE_LISTS_CODE`, `mergeListsMeta`, `usePlayback` thunk pattern from Cycle Detection / LCS
- Produces: `/algorithms/merge-lists` studio; catalog card

- [ ] **Step 1: randomSortedListPair**

In `lib/algorithms/randomArray.ts`:

```ts
export function randomSortedListPair(): [number[], number[]] {
  const nA = 2 + Math.floor(Math.random() * 3);
  const nB = Math.min(2 + Math.floor(Math.random() * 3), MAX_LIST_LENGTH - nA);
  const pool = shuffledPool(nA + nB);
  const sortN = (xs: number[]) => [...xs].sort((x, y) => x - y);
  return [sortN(pool.slice(0, nA)), sortN(pool.slice(nA))];
}
```

Lengths 2–4 each, sum ≤ 8, already sorted.

- [ ] **Step 2: Studio**

Create `components/player/MergeListsStudio.tsx` cloning Reverse List chrome with two inputs, Cycle/LCS thunk playback:

```tsx
"use client";

import { useCallback, useState } from "react";
import { usePlayback } from "@/lib/playback/usePlayback";
import { generateMergeListsSteps } from "@/lib/algorithms/merge-lists/generateSteps";
import { MERGE_LISTS_CODE } from "@/lib/algorithms/merge-lists/code";
import { mergeListsMeta } from "@/lib/algorithms/merge-lists/meta";
import { parseMergeListInput } from "@/lib/algorithms/parseInput";
import { randomSortedListPair } from "@/lib/algorithms/randomArray";
import { MAX_LIST_LENGTH } from "@/lib/algorithms/types";
import { ListCanvas } from "@/components/player/ListCanvas";
import { ControlPanel } from "@/components/player/ControlPanel";
import { ArrayInput } from "@/components/player/ArrayInput";
import { CodePanel } from "@/components/player/CodePanel";
import { ExplanationPanel } from "@/components/player/ExplanationPanel";
import { ComplexityPanel } from "@/components/player/ComplexityPanel";

const DEFAULT_A = [1, 3, 5];
const DEFAULT_B = [2, 4];

export function MergeListsStudio() {
  const [a, setA] = useState(DEFAULT_A);
  const [b, setB] = useState(DEFAULT_B);
  const [aText, setAText] = useState(DEFAULT_A.join(", "));
  const [bText, setBText] = useState(DEFAULT_B.join(", "));
  const [aError, setAError] = useState<string | null>(null);
  const [bError, setBError] = useState<string | null>(null);

  const generateSteps = useCallback(
    () => generateMergeListsSteps(a, b),
    [a, b],
  );
  const playback = usePlayback(generateSteps, [0]);
  const [language, setLanguage] = useState<"python" | "javascript" | "cpp">(
    "python",
  );

  const applyA = (raw: string) => {
    setAText(raw);
    const parsed = parseMergeListInput(raw);
    if (!parsed.ok) {
      setAError(parsed.error);
      return;
    }
    if (parsed.values.length + b.length > MAX_LIST_LENGTH) {
      setAError(`Combined length at most ${MAX_LIST_LENGTH} nodes.`);
      return;
    }
    const sorted = [...parsed.values].sort((x, y) => x - y);
    setAError(null);
    setA(sorted);
    setAText(sorted.join(", "));
  };

  const applyB = (raw: string) => {
    setBText(raw);
    const parsed = parseMergeListInput(raw);
    if (!parsed.ok) {
      setBError(parsed.error);
      return;
    }
    if (a.length + parsed.values.length > MAX_LIST_LENGTH) {
      setBError(`Combined length at most ${MAX_LIST_LENGTH} nodes.`);
      return;
    }
    const sorted = [...parsed.values].sort((x, y) => x - y);
    setBError(null);
    setB(sorted);
    setBText(sorted.join(", "));
  };

  const randomize = () => {
    const [nextA, nextB] = randomSortedListPair();
    setA(nextA);
    setB(nextB);
    setAText(nextA.join(", "));
    setBText(nextB.join(", "));
    setAError(null);
    setBError(null);
  };

  return (
    <div className="mx-auto grid max-w-6xl gap-6 px-4 py-6 lg:grid-cols-[1.4fr_1fr]">
      <section className="space-y-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
            {mergeListsMeta.title}
          </h1>
          <p className="mt-1 text-slate-600">{mergeListsMeta.summary}</p>
        </div>
        <div className="rounded-lg border border-slate-200 bg-white p-4">
          <ListCanvas step={playback.step} />);
        </div>
        <ControlPanel
          playing={playback.playing}
          speed={playback.speed}
          onPlay={playback.play}
          onPause={playback.pause}
          onStepForward={playback.stepForward}
          onStepBackward={playback.stepBackward}
          onReset={playback.reset}
          onRandomize={randomize}
          onSpeedChange={playback.setSpeed}
          disableBack={playback.index === 0}
          disableForward={playback.index >= playback.steps.length - 1}
        />
        <ArrayInput
          value={aText}
          error={aError}
          onChange={setAText}
          onApply={applyA}
          label="List A"
          placeholder="e.g. 1, 3, 5"
        />
        <ArrayInput
          value={bText}
          error={bError}
          onChange={setBText}
          onApply={applyB}
          label="List B"
          placeholder="e.g. 2, 4"
        />
        <p className="-mt-2 text-xs text-slate-500">
          Each list is sorted on Apply. Combined length at most {MAX_LIST_LENGTH}.
          Leave a field empty for an empty list.
        </p>
      </section>
      <aside className="space-y-4">
        <CodePanel
          lines={MERGE_LISTS_CODE[language]}
          activeLineId={playback.step?.codeLineId ?? "fn-def"}
          language={language}
          onLanguageChange={setLanguage}
        />
        <ExplanationPanel text={playback.step?.explanation ?? ""} />
        <ComplexityPanel meta={mergeListsMeta} />
      </aside>
    </div>
  );
}
```

Fix the stray `);` in the ListCanvas wrapper — it must be `</div>` exactly like Reverse List:

```tsx
        <div className="rounded-lg border border-slate-200 bg-white p-4">
          <ListCanvas step={playback.step} />
        </div>
```

- [ ] **Step 3: Page, export, registry**

`app/algorithms/merge-lists/page.tsx`:

```tsx
import { MergeListsStudio } from "@/components/player/MergeListsStudio";

export default function MergeListsPage() {
  return (
    <main className="min-h-screen bg-slate-100">
      <MergeListsStudio />
    </main>
  );
}
```

Export `MergeListsStudio` from `components/player/index.ts`.

In `registry.ts`: import `mergeListsMeta` and append it after `cycleDetectionMeta`.

- [ ] **Step 4: codeLineIds tests**

Append to `__tests__/codeLineIds.test.ts`:

```ts
describe("merge lists code line ids", () => {
  it("python, javascript, and cpp share the same id set", () => {
    const ids = (lang: keyof typeof MERGE_LISTS_CODE) =>
      new Set(MERGE_LISTS_CODE[lang].map((l) => l.id));
    expect(ids("javascript")).toEqual(ids("python"));
    expect(ids("cpp")).toEqual(ids("python"));
  });

  it("every generated step codeLineId exists in the listings", () => {
    const valid = new Set(MERGE_LISTS_CODE.python.map((l) => l.id));
    const runs = [
      generateMergeListsSteps([1, 3, 5], [2, 4]),
      generateMergeListsSteps([], [2, 4]),
      generateMergeListsSteps([1, 3], []),
      generateMergeListsSteps([], []),
      generateMergeListsSteps([1, 1], [1, 2]),
    ];
    for (const steps of runs) {
      for (const step of steps) {
        expect(valid.has(step.codeLineId)).toBe(true);
      }
    }
  });
});
```

Add the corresponding imports.

- [ ] **Step 5: Run targeted tests then full suite**

```bash
npx vitest run __tests__/parseInput.test.ts __tests__/generateMergeListsSteps.test.ts __tests__/generateReverseListSteps.test.ts __tests__/generateCycleDetectionSteps.test.ts __tests__/listCanvas.test.tsx __tests__/codeLineIds.test.ts
npm test
```

Expected: all PASS.

---

### Task 5: Browser verification

**Files:** none (manual via browser tools)

- [ ] Open `/algorithms/merge-lists`. Confirm three rows, defaults `[1,3,5]` / `[2,4]`, step through compare/attach until merged is `1,2,3,4,5`.
- [ ] Apply unsorted List A (e.g. `5, 1, 3`) — it sorts. Clear List B — empty B still merges A.
- [ ] Randomize. Combined length stays ≤ 8.
- [ ] `/algorithms/reverse-list` still one row with prev/curr/next. `/algorithms/cycle-detection` still shows slow/fast and a back-edge.
- [ ] Home Linked Lists section shows the third card.

---

## Self-review (plan vs spec)

| Spec item | Task |
|-----------|------|
| Dummy-head merge, stable `<=` | Task 2 |
| Dummy not drawn; head = dummy.next | Task 2 |
| head + head2; pointers p, q, tail | Task 2 |
| Ids 0..n-1 and 100+ | Task 2 |
| Display snapshot nulls dangling tail.next | Task 2 snapshot() |
| Three rows when p and q keys exist | Task 3 |
| Reverse/cycle one row | Task 3 tests |
| Sort on Apply; empty → [] | Tasks 1, 4 |
| Combined length ≤ 8; MAX stays 8 | Task 4 |
| Catalog + route | Task 4 |
| Tests listed in spec §7 | Task 2 |
| npm test + browser | Tasks 4–5 |
