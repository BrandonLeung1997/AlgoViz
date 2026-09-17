# Task: add Extract-Max (heaps family)

Implement **one** algorithm: **Extract Max** from a max-heap (swap root with last, pop, sift-down). Do not add other algorithms.

**Prerequisite:** `HeapCanvas` + Heapify exist. Clone Heap Insert / Heapify studios.

## Files to create

- `lib/algorithms/extract-max/meta.ts` — `slug: "extract-max"`, `title: "Extract Max"`, `family: "heaps"`, `status: "ready"`
- `lib/algorithms/extract-max/code.ts` — Python / JS / C++, **same ids**
- `lib/algorithms/extract-max/generateSteps.ts` — `generateExtractMaxSteps(heap: number[]): Step[]`
- `components/player/ExtractMaxStudio.tsx`
- `app/algorithms/extract-max/page.tsx`
- `__tests__/generateExtractMaxSteps.test.ts`

Wire registry, player index, `codeLineIds.test.ts`.

## Algorithm

1. Empty heap: one `empty`/`done` step, no crash.
2. Single element: highlight root, remove it, `done` with empty heap. Show extracted value in the explanation (and optionally `dpTable.reconstructed`-style is wrong here — put it in the explanation or a small caption on `HeapCanvas` via optional `caption?: string` on `HeapFrame`; prefer explanation-only if you can).
3. Otherwise: note max at index 0; swap with last; shrink `heapSize`; sift-down the new root until heap property holds.

`HeapFrame.heapSize` must drop so the canvas hides the extracted slot (or greys it as removed). Do not leave the max sitting at the end as if this were heap sort.

**Suggested ids:** `fn-def`, `swap-last`, `pop`, `sift`, `compare`, `swap`, `done`.

**Complexity:** O(log n), O(1) extra. Contrast with Heap Sort (n extracts, leftover suffix is sorted). This page extracts **once**.

## Studio

One array input. On Apply, error if not a max-heap (same as Heap Insert). Randomize: random array then heapify off-stage. Reuse `HeapCanvas`. `usePlayback` thunk like LCS.

## Tests

- `[9, 5, 6, 1]` → remaining heap is a max-heap of 3; 9 is gone.
- Empty and one-element.
- Does not mutate input.
- `heapSize` decreases.
- Sift-down compare/swap appear when the new root is small.
- Valid `codeLineId`s.

## Done when

`npm test` passes; Heaps card; `/algorithms/extract-max` removes the root and repairs the tree.
