# AlgoViz Merge Sort POC Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Ship AlgoViz — a Next.js educational DSA platform shell with a fully interactive Merge Sort studio (step-synced visualization, code, explanation, and controls).

**Architecture:** Pure `generateMergeSortSteps(input)` emits an immutable `Step[]` timeline. `usePlayback` advances an index into that timeline; canvas, code highlight, and explanation all read the current step. Platform catalog routes to `/algorithms/merge-sort`; other algorithms are placeholders.

**Tech Stack:** Next.js 15 (App Router) + TypeScript, Tailwind CSS v4 or v3 (match `create-next-app` default), Shadcn UI, Lucide React, Framer Motion, Vitest + Testing Library.

**Spec:** `docs/superpowers/specs/2026-09-16-algoviz-merge-sort-design.md`

## Global Constraints

- Brand name in UI: **AlgoViz**
- Layout: **Split studio** (viz+controls left; code/explain/complexity right); stack on mobile
- Visual: **Sky lab** — slate wash background, white panels, cyan brand; yellow=compare; green=sorted
- Max array length: **16**; default length 8–12; values 1–50
- Base step duration at 1x: **700ms**; speed ∈ {0.5, 1, 1.5, 2, 3, 4}
- Default code language tab: **Python**
- No auth, no backend, no Canvas/D3 in v1
- Add `.superpowers/` to `.gitignore`
- Commit only when the user explicitly asks during execution (skip plan commit steps unless requested)

---

## File structure (create map)

```
app/
  layout.tsx
  page.tsx
  globals.css
  algorithms/merge-sort/page.tsx
components/
  layout/SiteHeader.tsx
  catalog/AlgorithmCard.tsx
  player/
    ArrayCanvas.tsx
    ControlPanel.tsx
    ArrayInput.tsx
    CodePanel.tsx
    ExplanationPanel.tsx
    ComplexityPanel.tsx
    MergeSortStudio.tsx
lib/
  algorithms/
    types.ts
    registry.ts
    parseInput.ts
    randomArray.ts
    merge-sort/
      generateSteps.ts
      code.ts
      meta.ts
  playback/
    usePlayback.ts
components/ui/          # shadcn: button, slider, tabs
__tests__/
  generateMergeSortSteps.test.ts
  codeLineIds.test.ts
  parseInput.test.ts
  usePlayback.test.ts
vitest.config.ts
```

---

### Task 1: Scaffold Next.js app and test tooling

**Files:**
- Create: entire Next.js project at repo root `C:\Users\BMCLEUNG_A01N\project\algorithm`
- Create: `vitest.config.ts`, `vitest.setup.ts`
- Modify: `package.json` (scripts), `.gitignore`

**Interfaces:**
- Consumes: none (greenfield)
- Produces: runnable `npm run dev`, `npm test`; TypeScript path alias `@/*`

- [ ] **Step 1: Scaffold the app**

From repo root (empty except `docs/` and `.superpowers/`):

```bash
npx create-next-app@latest . --typescript --tailwind --eslint --app --src-dir=false --import-alias "@/*" --turbopack --yes
```

If create-next-app refuses non-empty directory, scaffold into a temp folder and move files up, preserving `docs/` and `.superpowers/`.

- [ ] **Step 2: Install runtime + test dependencies**

```bash
npm install framer-motion lucide-react class-variance-authority clsx tailwind-merge
npm install -D vitest @vitejs/plugin-react jsdom @testing-library/react @testing-library/jest-dom @testing-library/user-event
```

- [ ] **Step 3: Add Vitest config**

Create `vitest.config.ts`:

```ts
import path from "path";
import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  test: {
    environment: "jsdom",
    setupFiles: ["./vitest.setup.ts"],
    include: ["__tests__/**/*.test.ts", "__tests__/**/*.test.tsx"],
  },
  resolve: {
    alias: { "@": path.resolve(__dirname, ".") },
  },
});
```

Create `vitest.setup.ts`:

```ts
import "@testing-library/jest-dom/vitest";
```

Add to `package.json` scripts:

```json
"test": "vitest run",
"test:watch": "vitest"
```

- [ ] **Step 4: Gitignore brainstorm artifacts**

Ensure `.gitignore` contains:

```
.superpowers/
```

- [ ] **Step 5: Verify scaffold**

```bash
npm test
npm run build
```

Expected: Vitest exits 0 with 0 tests (or pass); `next build` succeeds.

- [ ] **Step 6: Commit only if user asked**

```bash
git init
git add -A
git commit -m "chore: scaffold Next.js AlgoViz app with Vitest"
```

---

### Task 2: Core types and input helpers

**Files:**
- Create: `lib/algorithms/types.ts`
- Create: `lib/algorithms/parseInput.ts`
- Create: `lib/algorithms/randomArray.ts`
- Test: `__tests__/parseInput.test.ts`

**Interfaces:**
- Consumes: none
- Produces:
  - `HighlightKind`, `Highlight`, `Step`, `CodeLine`, `ComplexityCase`, `AlgorithmMeta`, `PlaybackSpeed`
  - `parseArrayInput(raw: string): { ok: true; values: number[] } | { ok: false; error: string }`
  - `randomArray(length?: number): number[]`
  - constants: `MAX_ARRAY_LENGTH = 16`, `BASE_STEP_MS = 700`

- [ ] **Step 1: Write failing parseInput tests**

Create `__tests__/parseInput.test.ts`:

```ts
import { describe, expect, it } from "vitest";
import { parseArrayInput, MAX_ARRAY_LENGTH } from "@/lib/algorithms/parseInput";

describe("parseArrayInput", () => {
  it("parses comma-separated integers", () => {
    expect(parseArrayInput("8, 3, 5, 1")).toEqual({
      ok: true,
      values: [8, 3, 5, 1],
    });
  });

  it("rejects empty input", () => {
    const result = parseArrayInput("  ");
    expect(result.ok).toBe(false);
  });

  it("rejects non-integers", () => {
    const result = parseArrayInput("1, a, 3");
    expect(result.ok).toBe(false);
  });

  it("rejects arrays longer than MAX_ARRAY_LENGTH", () => {
    const raw = Array.from({ length: MAX_ARRAY_LENGTH + 1 }, (_, i) => i + 1).join(",");
    const result = parseArrayInput(raw);
    expect(result.ok).toBe(false);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

```bash
npm test -- __tests__/parseInput.test.ts
```

Expected: FAIL — module not found / export missing.

- [ ] **Step 3: Implement types + parseInput + randomArray**

Create `lib/algorithms/types.ts`:

```ts
export type HighlightKind =
  | "comparing"
  | "writing"
  | "sorted"
  | "activeRange"
  | "copy";

export type Highlight = { index: number; kind: HighlightKind };

export type Step = {
  array: number[];
  highlights: Highlight[];
  range?: { low: number; mid?: number; high: number };
  codeLineId: string;
  explanation: string;
};

export type CodeLine = { id: string; text: string };

export type ComplexityCase = {
  label: "Best" | "Average" | "Worst";
  time: string;
  space: string;
};

export type AlgorithmMeta = {
  slug: string;
  title: string;
  summary: string;
  status: "ready" | "coming-soon";
  complexity: ComplexityCase[];
  complexityNote: string;
};

export type PlaybackSpeed = 0.5 | 1 | 1.5 | 2 | 3 | 4;

export const BASE_STEP_MS = 700;
export const MAX_ARRAY_LENGTH = 16;
```

Create `lib/algorithms/parseInput.ts`:

```ts
import { MAX_ARRAY_LENGTH } from "@/lib/algorithms/types";

export { MAX_ARRAY_LENGTH };

export function parseArrayInput(
  raw: string,
): { ok: true; values: number[] } | { ok: false; error: string } {
  const trimmed = raw.trim();
  if (!trimmed) {
    return { ok: false, error: "Enter at least one integer." };
  }
  const parts = trimmed.split(/[\s,]+/).filter(Boolean);
  if (parts.length > MAX_ARRAY_LENGTH) {
    return {
      ok: false,
      error: `Use at most ${MAX_ARRAY_LENGTH} numbers.`,
    };
  }
  const values: number[] = [];
  for (const part of parts) {
    if (!/^-?\d+$/.test(part)) {
      return { ok: false, error: `“${part}” is not an integer.` };
    }
    values.push(Number(part));
  }
  return { ok: true, values };
}
```

Create `lib/algorithms/randomArray.ts`:

```ts
import { MAX_ARRAY_LENGTH } from "@/lib/algorithms/types";

export function randomArray(length = 10): number[] {
  const n = Math.min(Math.max(length, 1), MAX_ARRAY_LENGTH);
  return Array.from({ length: n }, () => Math.floor(Math.random() * 50) + 1);
}
```

Re-export `MAX_ARRAY_LENGTH` from types in parseInput (already done) — update test import to `@/lib/algorithms/types` if preferred; keep test compiling.

- [ ] **Step 4: Run tests to verify they pass**

```bash
npm test -- __tests__/parseInput.test.ts
```

Expected: PASS (4 tests).

---

### Task 3: Merge Sort step generator

**Files:**
- Create: `lib/algorithms/merge-sort/generateSteps.ts`
- Test: `__tests__/generateMergeSortSteps.test.ts`

**Interfaces:**
- Consumes: `Step` from `lib/algorithms/types.ts`
- Produces: `generateMergeSortSteps(input: number[]): Step[]`
- Every step’s `codeLineId` must be one of:  
  `fn-def` | `base-case` | `split` | `recurse-left` | `recurse-right` | `merge-init` | `merge-compare` | `merge-take-left` | `merge-take-right` | `merge-exhaust-left` | `merge-exhaust-right` | `write-back` | `done`

- [ ] **Step 1: Write failing generator tests**

Create `__tests__/generateMergeSortSteps.test.ts`:

```ts
import { describe, expect, it } from "vitest";
import { generateMergeSortSteps } from "@/lib/algorithms/merge-sort/generateSteps";

describe("generateMergeSortSteps", () => {
  it("ends with a fully sorted array matching [...input].sort", () => {
    const input = [8, 3, 5, 1, 9, 2];
    const steps = generateMergeSortSteps(input);
    expect(steps.length).toBeGreaterThan(0);
    const last = steps[steps.length - 1]!;
    expect(last.array).toEqual([...input].sort((a, b) => a - b));
    expect(last.codeLineId).toBe("done");
  });

  it("does not mutate the original input array", () => {
    const input = [4, 2, 3];
    const copy = [...input];
    generateMergeSortSteps(input);
    expect(input).toEqual(copy);
  });

  it("handles a single-element array", () => {
    const steps = generateMergeSortSteps([7]);
    expect(steps[steps.length - 1]!.array).toEqual([7]);
  });

  it("handles an already-sorted array", () => {
    const input = [1, 2, 3, 4];
    const steps = generateMergeSortSteps(input);
    expect(steps[steps.length - 1]!.array).toEqual(input);
  });

  it("every step has a non-empty explanation and codeLineId", () => {
    for (const step of generateMergeSortSteps([5, 1, 4, 2])) {
      expect(step.explanation.trim().length).toBeGreaterThan(0);
      expect(step.codeLineId.trim().length).toBeGreaterThan(0);
      expect(step.array).toHaveLength(4);
    }
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

```bash
npm test -- __tests__/generateMergeSortSteps.test.ts
```

Expected: FAIL — module not found.

- [ ] **Step 3: Implement generateMergeSortSteps**

Create `lib/algorithms/merge-sort/generateSteps.ts` that:

1. Clones input into a working `arr`.
2. Recursively merge-sorts in place (or with temp buffer), pushing a `Step` on: enter range/split, base case, each compare, each write into merge buffer / write-back, and final `done`.
3. Uses the `codeLineId` set listed in Interfaces.
4. Sets highlights: `activeRange` for current `[low, high]`, `comparing` for two merge heads, `writing`/`copy` for destination index, `sorted` for completed ranges when useful.
5. Returns at least one step even for length 0 or 1.

Minimal structural sketch (expand fully in implementation — must pass tests):

```ts
import type { Highlight, Step } from "@/lib/algorithms/types";

export function generateMergeSortSteps(input: number[]): Step[] {
  const steps: Step[] = [];
  const arr = [...input];

  const push = (
    codeLineId: string,
    explanation: string,
    highlights: Highlight[] = [],
    range?: Step["range"],
  ) => {
    steps.push({
      array: [...arr],
      highlights,
      range,
      codeLineId,
      explanation,
    });
  };

  function mergeSort(low: number, high: number) {
    if (low >= high) {
      push(
        "base-case",
        "Base case: a single element is already sorted.",
        [{ index: low, kind: "sorted" }],
        { low, high },
      );
      return;
    }
    const mid = Math.floor((low + high) / 2);
    push(
      "split",
      `Split range [${low}, ${high}] at mid=${mid}.`,
      Array.from({ length: high - low + 1 }, (_, i) => ({
        index: low + i,
        kind: "activeRange" as const,
      })),
      { low, mid, high },
    );
    push("recurse-left", `Sort left half [${low}, ${mid}].`, [], { low, mid, high });
    mergeSort(low, mid);
    push("recurse-right", `Sort right half [${mid + 1}, ${high}].`, [], {
      low,
      mid,
      high,
    });
    mergeSort(mid + 1, high);
    merge(low, mid, high);
  }

  function merge(low: number, mid: number, high: number) {
    const left = arr.slice(low, mid + 1);
    const right = arr.slice(mid + 1, high + 1);
    push(
      "merge-init",
      `Merge sorted halves [${low}, ${mid}] and [${mid + 1}, ${high}].`,
      [],
      { low, mid, high },
    );
    let i = 0;
    let j = 0;
    let k = low;
    while (i < left.length && j < right.length) {
      push(
        "merge-compare",
        `Compare ${left[i]} and ${right[j]}.`,
        [
          { index: low + i, kind: "comparing" },
          { index: mid + 1 + j, kind: "comparing" },
        ],
        { low, mid, high },
      );
      if (left[i]! <= right[j]!) {
        arr[k] = left[i]!;
        push(
          "merge-take-left",
          `Take ${left[i]} from the left half → index ${k}.`,
          [{ index: k, kind: "writing" }],
          { low, mid, high },
        );
        i += 1;
      } else {
        arr[k] = right[j]!;
        push(
          "merge-take-right",
          `Take ${right[j]} from the right half → index ${k}.`,
          [{ index: k, kind: "writing" }],
          { low, mid, high },
        );
        j += 1;
      }
      k += 1;
    }
    while (i < left.length) {
      arr[k] = left[i]!;
      push(
        "merge-exhaust-left",
        `Copy remaining left value ${left[i]} → index ${k}.`,
        [{ index: k, kind: "copy" }],
        { low, mid, high },
      );
      i += 1;
      k += 1;
    }
    while (j < right.length) {
      arr[k] = right[j]!;
      push(
        "merge-exhaust-right",
        `Copy remaining right value ${right[j]} → index ${k}.`,
        [{ index: k, kind: "copy" }],
        { low, mid, high },
      );
      j += 1;
      k += 1;
    }
    push(
      "write-back",
      `Merged subarray [${low}, ${high}] is now sorted.`,
      Array.from({ length: high - low + 1 }, (_, i) => ({
        index: low + i,
        kind: "sorted" as const,
      })),
      { low, mid, high },
    );
  }

  if (arr.length === 0) {
    push("done", "Empty array — nothing to sort.");
    return steps;
  }

  push("fn-def", "Start merge sort on the full array.", [], {
    low: 0,
    high: arr.length - 1,
  });
  mergeSort(0, arr.length - 1);
  push(
    "done",
    "Array is fully sorted.",
    arr.map((_, index) => ({ index, kind: "sorted" as const })),
  );
  return steps;
}
```

Note: during merge, “comparing” indices on the live `arr` may not match untouched left/right contents if writes already happened; prefer highlighting `k` as writing and describe values from `left[i]`/`right[j]` in explanation (as above). Adjust highlights if a clearer viz is needed — tests do not assert highlight positions.

- [ ] **Step 4: Run tests to verify they pass**

```bash
npm test -- __tests__/generateMergeSortSteps.test.ts
```

Expected: PASS.

---

### Task 4: Code listings + algorithm meta + line-id consistency

**Files:**
- Create: `lib/algorithms/merge-sort/code.ts`
- Create: `lib/algorithms/merge-sort/meta.ts`
- Create: `lib/algorithms/registry.ts`
- Test: `__tests__/codeLineIds.test.ts`

**Interfaces:**
- Consumes: `CodeLine`, `AlgorithmMeta`, `generateMergeSortSteps`
- Produces:
  - `MERGE_SORT_CODE: Record<"python" | "javascript" | "cpp", CodeLine[]>`
  - `mergeSortMeta: AlgorithmMeta`
  - `algorithms: AlgorithmMeta[]` from registry

- [ ] **Step 1: Write failing line-id consistency test**

Create `__tests__/codeLineIds.test.ts`:

```ts
import { describe, expect, it } from "vitest";
import { MERGE_SORT_CODE } from "@/lib/algorithms/merge-sort/code";
import { generateMergeSortSteps } from "@/lib/algorithms/merge-sort/generateSteps";

describe("merge sort code line ids", () => {
  it("python, javascript, and cpp share the same id set", () => {
    const ids = (lang: keyof typeof MERGE_SORT_CODE) =>
      new Set(MERGE_SORT_CODE[lang].map((l) => l.id));
    expect(ids("javascript")).toEqual(ids("python"));
    expect(ids("cpp")).toEqual(ids("python"));
  });

  it("every generated step codeLineId exists in the listings", () => {
    const valid = new Set(MERGE_SORT_CODE.python.map((l) => l.id));
    for (const step of generateMergeSortSteps([9, 4, 1, 7, 3])) {
      expect(valid.has(step.codeLineId)).toBe(true);
    }
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

```bash
npm test -- __tests__/codeLineIds.test.ts
```

Expected: FAIL — `code` module missing.

- [ ] **Step 3: Implement code.ts, meta.ts, registry.ts**

`lib/algorithms/merge-sort/code.ts` — include **every** id the generator emits (`fn-def`, `base-case`, `split`, `recurse-left`, `recurse-right`, `merge-init`, `merge-compare`, `merge-take-left`, `merge-take-right`, `merge-exhaust-left`, `merge-exhaust-right`, `write-back`, `done`). Example Python fragment:

```ts
import type { CodeLine } from "@/lib/algorithms/types";

export const MERGE_SORT_CODE: Record<
  "python" | "javascript" | "cpp",
  CodeLine[]
> = {
  python: [
    { id: "fn-def", text: "def merge_sort(arr, low, high):" },
    { id: "base-case", text: "    if low >= high: return" },
    { id: "split", text: "    mid = (low + high) // 2" },
    { id: "recurse-left", text: "    merge_sort(arr, low, mid)" },
    { id: "recurse-right", text: "    merge_sort(arr, mid + 1, high)" },
    { id: "merge-init", text: "    merge(arr, low, mid, high)" },
    { id: "merge-compare", text: "    # compare left[i] vs right[j]" },
    { id: "merge-take-left", text: "    # take from left half" },
    { id: "merge-take-right", text: "    # take from right half" },
    { id: "merge-exhaust-left", text: "    # copy remaining left" },
    { id: "merge-exhaust-right", text: "    # copy remaining right" },
    { id: "write-back", text: "    # subarray [low, high] merged" },
    { id: "done", text: "# done: arr is sorted" },
  ],
  javascript: [
    /* same ids, JS syntax */
  ],
  cpp: [
    /* same ids, C++ syntax */
  ],
};
```

Fill `javascript` and `cpp` with idiomatic equivalents sharing **identical** `id` values.

`lib/algorithms/merge-sort/meta.ts`:

```ts
import type { AlgorithmMeta } from "@/lib/algorithms/types";

export const mergeSortMeta: AlgorithmMeta = {
  slug: "merge-sort",
  title: "Merge Sort",
  summary:
    "Divide the array, sort each half, then merge — stable O(n log n) sorting.",
  status: "ready",
  complexity: [
    { label: "Best", time: "O(n log n)", space: "O(n)" },
    { label: "Average", time: "O(n log n)", space: "O(n)" },
    { label: "Worst", time: "O(n log n)", space: "O(n)" },
  ],
  complexityNote:
    "Divide depth is log n; each level does O(n) merge work; merging needs an auxiliary array.",
};
```

`lib/algorithms/registry.ts`:

```ts
import type { AlgorithmMeta } from "@/lib/algorithms/types";
import { mergeSortMeta } from "@/lib/algorithms/merge-sort/meta";

export const algorithms: AlgorithmMeta[] = [
  mergeSortMeta,
  {
    slug: "binary-search",
    title: "Binary Search",
    summary: "Find a target in a sorted array by halving the search space.",
    status: "coming-soon",
    complexity: [
      { label: "Best", time: "O(1)", space: "O(1)" },
      { label: "Average", time: "O(log n)", space: "O(1)" },
      { label: "Worst", time: "O(log n)", space: "O(1)" },
    ],
    complexityNote: "Coming soon.",
  },
  {
    slug: "quick-sort",
    title: "Quick Sort",
    summary: "Partition around a pivot and recurse on both sides.",
    status: "coming-soon",
    complexity: [
      { label: "Best", time: "O(n log n)", space: "O(log n)" },
      { label: "Average", time: "O(n log n)", space: "O(log n)" },
      { label: "Worst", time: "O(n²)", space: "O(log n)" },
    ],
    complexityNote: "Coming soon.",
  },
];

export function getAlgorithm(slug: string): AlgorithmMeta | undefined {
  return algorithms.find((a) => a.slug === slug);
}
```

- [ ] **Step 4: Run tests**

```bash
npm test -- __tests__/codeLineIds.test.ts
```

Expected: PASS. If FAIL on missing ids, add the missing `CodeLine` entries — do not remove generator ids.

---

### Task 5: usePlayback hook

**Files:**
- Create: `lib/playback/usePlayback.ts`
- Test: `__tests__/usePlayback.test.ts`

**Interfaces:**
- Consumes: `generateMergeSortSteps`, `parseArrayInput`, `randomArray`, `BASE_STEP_MS`, `PlaybackSpeed`, `Step`
- Produces:

```ts
function usePlayback(generateSteps: (input: number[]) => Step[]): {
  input: number[];
  inputText: string;
  inputError: string | null;
  steps: Step[];
  step: Step | undefined;
  index: number;
  playing: boolean;
  speed: PlaybackSpeed;
  setSpeed: (s: PlaybackSpeed) => void;
  play: () => void;
  pause: () => void;
  stepForward: () => void;
  stepBackward: () => void;
  reset: () => void;
  randomize: () => void;
  applyInputText: (raw: string) => void;
  setInputText: (raw: string) => void;
}
```

- [ ] **Step 1: Write failing hook tests**

Create `__tests__/usePlayback.test.ts`:

```ts
import { describe, expect, it, vi, beforeEach, afterEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { usePlayback } from "@/lib/playback/usePlayback";
import { generateMergeSortSteps } from "@/lib/algorithms/merge-sort/generateSteps";

describe("usePlayback", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });
  afterEach(() => {
    vi.useRealTimers();
  });

  it("starts at index 0 with steps for the initial array", () => {
    const { result } = renderHook(() =>
      usePlayback(generateMergeSortSteps, [3, 1, 2]),
    );
    expect(result.current.index).toBe(0);
    expect(result.current.steps.length).toBeGreaterThan(0);
    expect(result.current.playing).toBe(false);
  });

  it("stepForward and stepBackward move the index", () => {
    const { result } = renderHook(() =>
      usePlayback(generateMergeSortSteps, [3, 1, 2]),
    );
    act(() => result.current.stepForward());
    expect(result.current.index).toBe(1);
    act(() => result.current.stepBackward());
    expect(result.current.index).toBe(0);
  });

  it("play advances over time and pause stops", () => {
    const { result } = renderHook(() =>
      usePlayback(generateMergeSortSteps, [3, 1, 2]),
    );
    act(() => result.current.play());
    expect(result.current.playing).toBe(true);
    act(() => {
      vi.advanceTimersByTime(700);
    });
    expect(result.current.index).toBeGreaterThan(0);
    const at = result.current.index;
    act(() => result.current.pause());
    act(() => {
      vi.advanceTimersByTime(5000);
    });
    expect(result.current.index).toBe(at);
  });

  it("applyInputText regenerates steps on valid input", () => {
    const { result } = renderHook(() =>
      usePlayback(generateMergeSortSteps, [3, 1, 2]),
    );
    act(() => result.current.applyInputText("9, 8, 7"));
    expect(result.current.inputError).toBeNull();
    expect(result.current.input).toEqual([9, 8, 7]);
    expect(result.current.index).toBe(0);
  });

  it("keeps previous steps on invalid input", () => {
    const { result } = renderHook(() =>
      usePlayback(generateMergeSortSteps, [3, 1, 2]),
    );
    const prevLen = result.current.steps.length;
    act(() => result.current.applyInputText("1, nope"));
    expect(result.current.inputError).toBeTruthy();
    expect(result.current.steps.length).toBe(prevLen);
    expect(result.current.input).toEqual([3, 1, 2]);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

```bash
npm test -- __tests__/usePlayback.test.ts
```

Expected: FAIL — hook missing.

- [ ] **Step 3: Implement usePlayback**

Create `lib/playback/usePlayback.ts`:

```ts
"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import type { PlaybackSpeed, Step } from "@/lib/algorithms/types";
import { BASE_STEP_MS } from "@/lib/algorithms/types";
import { parseArrayInput } from "@/lib/algorithms/parseInput";
import { randomArray } from "@/lib/algorithms/randomArray";

export function usePlayback(
  generateSteps: (input: number[]) => Step[],
  initialInput: number[] = [8, 3, 5, 1, 9, 2, 7, 4],
) {
  const [input, setInput] = useState<number[]>(initialInput);
  const [inputText, setInputText] = useState(initialInput.join(", "));
  const [inputError, setInputError] = useState<string | null>(null);
  const [steps, setSteps] = useState<Step[]>(() => generateSteps(initialInput));
  const [index, setIndex] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState<PlaybackSpeed>(1);

  const step = steps[index];

  const regenerate = useCallback(
    (next: number[]) => {
      setInput(next);
      setInputText(next.join(", "));
      setInputError(null);
      setSteps(generateSteps(next));
      setIndex(0);
      setPlaying(false);
    },
    [generateSteps],
  );

  const play = () => setPlaying(true);
  const pause = () => setPlaying(false);

  const stepForward = () => {
    setPlaying(false);
    setIndex((i) => Math.min(i + 1, Math.max(steps.length - 1, 0)));
  };

  const stepBackward = () => {
    setPlaying(false);
    setIndex((i) => Math.max(i - 1, 0));
  };

  const reset = () => {
    setPlaying(false);
    setIndex(0);
  };

  const randomize = () => regenerate(randomArray(10));

  const applyInputText = (raw: string) => {
    setInputText(raw);
    const parsed = parseArrayInput(raw);
    if (!parsed.ok) {
      setInputError(parsed.error);
      return;
    }
    regenerate(parsed.values);
  };

  useEffect(() => {
    if (!playing) return;
    if (index >= steps.length - 1) {
      setPlaying(false);
      return;
    }
    const delay = BASE_STEP_MS / speed;
    const id = window.setTimeout(() => {
      setIndex((i) => Math.min(i + 1, steps.length - 1));
    }, delay);
    return () => window.clearTimeout(id);
  }, [playing, index, speed, steps.length]);

  return {
    input,
    inputText,
    inputError,
    steps,
    step,
    index,
    playing,
    speed,
    setSpeed,
    play,
    pause,
    stepForward,
    stepBackward,
    reset,
    randomize,
    applyInputText,
    setInputText,
  };
}
```

Remove unused `useMemo` import if not used.

- [ ] **Step 4: Run tests**

```bash
npm test -- __tests__/usePlayback.test.ts
```

Expected: PASS. Fix timing assertions if fake timers need `vi.runOnlyPendingTimers()` — keep delay based on `BASE_STEP_MS / speed`.

---

### Task 6: Shadcn UI primitives + Sky lab global styles

**Files:**
- Create: `lib/utils.ts` (`cn` helper)
- Create: `components/ui/button.tsx`, `slider.tsx`, `tabs.tsx`
- Modify: `app/globals.css`, `app/layout.tsx`
- Create: `components/layout/SiteHeader.tsx`

**Interfaces:**
- Consumes: Tailwind theme
- Produces: Shadcn `Button`, `Slider`, `Tabs`; site header with AlgoViz brand link to `/`

- [ ] **Step 1: Init Shadcn (non-interactive)**

```bash
npx shadcn@latest init -y -d
npx shadcn@latest add button slider tabs -y
```

If CLI prompts, choose defaults compatible with existing Tailwind setup. Ensure `lib/utils.ts` exports `cn`.

- [ ] **Step 2: Apply Sky lab tokens in globals.css**

Set CSS variables / utility classes:

- Page background: slate-100
- Brand: sky-600
- Panels: white + border slate-200
- Import a distinctive Google font in `layout.tsx` (e.g. **DM Sans** via `next/font/google`) — not Inter/Roboto/Arial alone

Update `app/layout.tsx` metadata title to `AlgoViz` and wrap children with `SiteHeader`.

`components/layout/SiteHeader.tsx`:

```tsx
import Link from "next/link";

export function SiteHeader() {
  return (
    <header className="border-b border-slate-200 bg-white">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4">
        <Link href="/" className="text-lg font-semibold tracking-tight text-sky-700">
          AlgoViz
        </Link>
        <nav className="text-sm text-slate-600">
          <Link href="/" className="hover:text-sky-700">
            Algorithms
          </Link>
        </nav>
      </div>
    </header>
  );
}
```

- [ ] **Step 3: Verify build**

```bash
npm run build
```

Expected: success.

---

### Task 7: Player presentational components

**Files:**
- Create: `components/player/ArrayCanvas.tsx`
- Create: `components/player/ControlPanel.tsx`
- Create: `components/player/ArrayInput.tsx`
- Create: `components/player/CodePanel.tsx`
- Create: `components/player/ExplanationPanel.tsx`
- Create: `components/player/ComplexityPanel.tsx`

**Interfaces:**
- Consumes: `Step`, `CodeLine`, `AlgorithmMeta`, `PlaybackSpeed`, Lucide icons, Framer Motion, Shadcn controls
- Produces: dumb/controlled components used by `MergeSortStudio`

- [ ] **Step 1: ArrayCanvas**

Props: `{ step: Step | undefined }`.

Render a horizontal row of bars (`motion.div`) with height proportional to value. Color map:

- `comparing` → amber-400
- `writing` | `copy` → sky-500
- `sorted` → green-600
- `activeRange` → sky-300
- default → slate-700

Use `layout` prop from Framer Motion for position changes. Show value labels under bars.

- [ ] **Step 2: ControlPanel**

Props: playing, speed, onPlay, onPause, onStepForward, onStepBackward, onReset, onRandomize, onSpeedChange, disableBack, disableForward.

Buttons with Lucide: `Play`, `Pause`, `SkipForward`, `SkipBack`, `RotateCcw`, `Shuffle`. Shadcn `Slider` mapped to speeds `[0.5, 1, 1.5, 2, 3, 4]` with label `{speed}x`.

- [ ] **Step 3: ArrayInput**

Props: `value`, `error`, `onChange`, `onApply` (Apply button or blur/Enter). Show error text in red when present.

- [ ] **Step 4: CodePanel**

Props: `lines` for current language, `activeLineId`, `language`, `onLanguageChange`.

Shadcn `Tabs` for Python / JavaScript / C++. Render lines in monospace; active line gets `bg-amber-100` + left border amber.

- [ ] **Step 5: ExplanationPanel**

Props: `text: string`. White panel with heading “Step explanation” and body text.

- [ ] **Step 6: ComplexityPanel**

Props: `meta: AlgorithmMeta`. Table/list of Best/Average/Worst time & space + `complexityNote`.

- [ ] **Step 7: Build check**

```bash
npm run build
```

Expected: success (components may be unused until Task 8 — if ESLint fails on unused, wire a temporary export or proceed to Task 8 immediately).

---

### Task 8: MergeSortStudio + route

**Files:**
- Create: `components/player/MergeSortStudio.tsx`
- Create: `app/algorithms/merge-sort/page.tsx`

**Interfaces:**
- Consumes: `usePlayback`, `generateMergeSortSteps`, `MERGE_SORT_CODE`, `mergeSortMeta`, all player components
- Produces: working `/algorithms/merge-sort` page

- [ ] **Step 1: Implement MergeSortStudio client component**

```tsx
"use client";

import { useState } from "react";
import { usePlayback } from "@/lib/playback/usePlayback";
import { generateMergeSortSteps } from "@/lib/algorithms/merge-sort/generateSteps";
import { MERGE_SORT_CODE } from "@/lib/algorithms/merge-sort/code";
import { mergeSortMeta } from "@/lib/algorithms/merge-sort/meta";
import { ArrayCanvas } from "@/components/player/ArrayCanvas";
import { ControlPanel } from "@/components/player/ControlPanel";
import { ArrayInput } from "@/components/player/ArrayInput";
import { CodePanel } from "@/components/player/CodePanel";
import { ExplanationPanel } from "@/components/player/ExplanationPanel";
import { ComplexityPanel } from "@/components/player/ComplexityPanel";

export function MergeSortStudio() {
  const playback = usePlayback(generateMergeSortSteps);
  const [language, setLanguage] = useState<"python" | "javascript" | "cpp">(
    "python",
  );

  return (
    <div className="mx-auto grid max-w-6xl gap-6 px-4 py-6 lg:grid-cols-[1.4fr_1fr]">
      <section className="space-y-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
            {mergeSortMeta.title}
          </h1>
          <p className="mt-1 text-slate-600">{mergeSortMeta.summary}</p>
        </div>
        <div className="rounded-lg border border-slate-200 bg-white p-4">
          <ArrayCanvas step={playback.step} />
        </div>
        <ControlPanel
          playing={playback.playing}
          speed={playback.speed}
          onPlay={playback.play}
          onPause={playback.pause}
          onStepForward={playback.stepForward}
          onStepBackward={playback.stepBackward}
          onReset={playback.reset}
          onRandomize={playback.randomize}
          onSpeedChange={playback.setSpeed}
          disableBack={playback.index === 0}
          disableForward={playback.index >= playback.steps.length - 1}
        />
        <ArrayInput
          value={playback.inputText}
          error={playback.inputError}
          onChange={playback.setInputText}
          onApply={() => playback.applyInputText(playback.inputText)}
        />
      </section>
      <aside className="space-y-4">
        <CodePanel
          lines={MERGE_SORT_CODE[language]}
          activeLineId={playback.step?.codeLineId ?? "fn-def"}
          language={language}
          onLanguageChange={setLanguage}
        />
        <ExplanationPanel text={playback.step?.explanation ?? ""} />
        <ComplexityPanel meta={mergeSortMeta} />
      </aside>
    </div>
  );
}
```

Wire props exactly to whatever ControlPanel/ArrayInput signatures you implemented in Task 7.

- [ ] **Step 2: Create the page**

`app/algorithms/merge-sort/page.tsx`:

```tsx
import { MergeSortStudio } from "@/components/player/MergeSortStudio";

export default function MergeSortPage() {
  return (
    <main className="min-h-screen bg-slate-100">
      <MergeSortStudio />
    </main>
  );
}
```

- [ ] **Step 3: Manual verification**

```bash
npm run dev
```

Open `http://localhost:3000/algorithms/merge-sort`. Confirm: play/pause/step/reset/speed/randomize/edit input; code highlight moves with steps; language tabs keep sync via shared ids; explanation updates.

---

### Task 9: Catalog home page

**Files:**
- Create: `components/catalog/AlgorithmCard.tsx`
- Modify: `app/page.tsx`

**Interfaces:**
- Consumes: `algorithms` from registry
- Produces: `/` listing with Merge Sort linkable; coming-soon cards disabled

- [ ] **Step 1: AlgorithmCard**

```tsx
import Link from "next/link";
import type { AlgorithmMeta } from "@/lib/algorithms/types";

export function AlgorithmCard({ algo }: { algo: AlgorithmMeta }) {
  const inner = (
    <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm transition hover:border-sky-300">
      <div className="flex items-center justify-between gap-2">
        <h2 className="text-lg font-semibold text-slate-900">{algo.title}</h2>
        {algo.status === "coming-soon" && (
          <span className="text-xs font-medium uppercase tracking-wide text-slate-500">
            Coming soon
          </span>
        )}
      </div>
      <p className="mt-2 text-sm text-slate-600">{algo.summary}</p>
    </div>
  );

  if (algo.status !== "ready") {
    return <div className="opacity-70">{inner}</div>;
  }

  return <Link href={`/algorithms/${algo.slug}`}>{inner}</Link>;
}
```

- [ ] **Step 2: Replace app/page.tsx**

```tsx
import { AlgorithmCard } from "@/components/catalog/AlgorithmCard";
import { algorithms } from "@/lib/algorithms/registry";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-slate-100">
      <div className="mx-auto max-w-6xl px-4 py-10">
        <h1 className="text-3xl font-semibold tracking-tight text-slate-900">
          Learn algorithms by seeing them
        </h1>
        <p className="mt-2 max-w-2xl text-slate-600">
          Interactive visualizations with step-synced code and explanations.
        </p>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {algorithms.map((algo) => (
            <AlgorithmCard key={algo.slug} algo={algo} />
          ))}
        </div>
      </div>
    </main>
  );
}
```

- [ ] **Step 3: Verify navigation**

```bash
npm run dev
```

From `/`, open Merge Sort; Coming soon cards are not links.

---

### Task 10: Final verification & polish

**Files:**
- Modify: responsive tweaks in `MergeSortStudio` / player components as needed
- Modify: any bugfixes discovered

- [ ] **Step 1: Run full unit suite**

```bash
npm test
```

Expected: all tests PASS.

- [ ] **Step 2: Production build**

```bash
npm run build
```

Expected: success.

- [ ] **Step 3: Manual checklist (from spec)**

- [ ] Play / Pause / Step ± / Reset / Randomize / Speed 0.5x–4x
- [ ] Custom array apply + validation error path
- [ ] Code line highlight sync; toggle Py/JS/C++ mid-run
- [ ] Explanation matches current step
- [ ] Complexity shows O(n log n) / O(n) cases
- [ ] Mobile: single-column stack usable at ~375px width
- [ ] Catalog placeholders visible

- [ ] **Step 4: Commit only if user asked**

```bash
git add -A
git commit -m "feat: AlgoViz platform shell with interactive Merge Sort studio"
```

---

## Spec coverage checklist

| Spec requirement | Task |
|------------------|------|
| Precomputed step timeline | 3, 5 |
| Play/pause/step/reset/speed | 5, 7, 8 |
| Randomize + editable input | 2, 5, 7, 8 |
| Code sync Py/JS/C++ | 4, 7, 8 |
| Explanation panel | 7, 8 |
| Complexity panel | 4, 7, 8 |
| Split studio layout | 8 |
| Sky lab visual | 6 |
| Catalog + placeholders | 4, 9 |
| Framer Motion bars | 7 |
| Shadcn + Lucide | 6, 7 |
| Unit tests for generator + line ids | 3, 4 |
| Max length 16 / 700ms / default Python | 2, 5, 8 |

## Self-review notes

- No TBD placeholders in task steps.
- `usePlayback` signature includes `initialInput` as second arg to match tests.
- Generator `codeLineId` set must match `MERGE_SORT_CODE` exactly — Task 4 test enforces this.
- Commits gated on user request per project rules.
