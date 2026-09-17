# Task: add Heap Sort (sorting family only — array visualization)

Implement **one** algorithm: **Heap Sort**. Do not add a heaps family, tree canvas, or other algorithms.

Visualize **in-place array heapify** (same `ArrayCanvas` as Quick Sort). A binary-heap tree view is explicitly out of scope (future heaps family).

Clone **Quick Sort**.

## Files to create

- `lib/algorithms/heap-sort/meta.ts` — `slug: "heap-sort"`, `family: "sorting"`, `status: "ready"`
- `lib/algorithms/heap-sort/code.ts` — Python / JS / C++ , **same ids**
- `lib/algorithms/heap-sort/generateSteps.ts` — `generateHeapSortSteps(input: number[]): Step[]`
- `components/player/HeapSortStudio.tsx`
- `app/algorithms/heap-sort/page.tsx`
- `__tests__/generateHeapSortSteps.test.ts`

Wire registry, player index, `codeLineIds.test.ts`.

## Algorithm behavior

Standard in-place **max-heap** heap sort:

1. Build-heap: `siftDown` from last parent `(n//2 - 1)` down to `0`.
2. Repeatedly swap heap root with the last unsorted index, mark that index `sorted`, sift down the new root in the remaining heap `[0, heapSize)`.

**Highlights:** `activeRange` on the current heap region; `comparing` while sifting; `writing` on swaps; `sorted` on the extracted suffix. Optional pointer tags are not required. Do not use `pivot`.

**Suggested ids:** `fn-def`, `build`, `sift`, `compare`, `swap`, `extract`, `done`.

**Complexity:** Best/average/worst O(n log n), extra space O(1). Note build-heap is O(n) but the n extracts dominate; this viz is 0-based max-heap.

## Constraints

- Do not mutate input. Empty / one-element still `done`.
- Do **not** introduce a tree layout or new canvas.
- Reuse `usePlayback(generateHeapSortSteps)` and Quick Sort studio chrome.
- No new deps. Do not commit unless asked.

## Tests

Correct sort; no mutation; build then extract phases both appear (`build`/`sift` and `extract`); suffix grows `sorted`; last step all `sorted`; every step explanation + valid `codeLineId`.

## Done when

`npm test` passes; Sorting card; `/algorithms/heap-sort` plays with bars only (no tree).
