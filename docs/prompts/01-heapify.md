# Task: add Heapify / Build-Heap (first heaps-family algorithm)

Implement **one** algorithm: **Heapify** (build a max-heap from an unordered array). This is the **first heaps-family** feature: you must add the family, types, and `HeapCanvas`. Do not add insert, extract-max, or other algorithms.

Heap Sort already lives under **sorting** and uses bars only. **Do not change Heap Sort.** This page is the tree+array view of *building* a heap.

## Clone for studio chrome

LcsStudio / QuickSortStudio layout: split Sky lab, `usePlayback` thunk or array generator, `ControlPanel`, `CodePanel`, `ExplanationPanel`, `ComplexityPanel`. Viz is the new canvas, not `ArrayCanvas` alone.

## Platform changes (required)

1. `lib/algorithms/types.ts`
   - Extend `AlgorithmFamily` with `"heaps"`.
   - Add `HeapFrame`:
     - `values: number[]` (heap array)
     - `heapSize: number`
     - `highlights: Highlight[]` (indices into `values`)
   - Add `heap?: HeapFrame` to `Step`.
   - Add `MAX_HEAP_SIZE` (8 is enough for a readable tree; do not exceed 12).

2. `lib/algorithms/registry.ts`
   - Append `"heaps"` to `FAMILY_ORDER` and `FAMILY_TITLES` (`Heaps`).
   - Register the new meta. Leave existing families untouched.

3. `components/player/HeapCanvas.tsx`
   - Complete binary tree laid out from array indices (`parent i`, children `2i+1` / `2i+2`).
   - Compact array strip **under** the tree (index + value), same highlight colors as `ArrayCanvas` (`comparing` amber, `writing` sky, `current` amber, `sorted` unused here).
   - Legend: comparing / swapping / current node.
   - Export from `components/player/index.ts`.

Do not invent a general BST canvas. This is a **complete binary heap** only.

## Files to create

- `lib/algorithms/heapify/meta.ts` — `slug: "heapify"`, `title: "Heapify"`, `family: "heaps"`, `status: "ready"`
- `lib/algorithms/heapify/code.ts` — Python / JS / C++, **identical ids**
- `lib/algorithms/heapify/generateSteps.ts` — `generateHeapifySteps(input: number[]): Step[]`
- `components/player/HeapifyStudio.tsx`
- `app/algorithms/heapify/page.tsx`
- `__tests__/generateHeapifySteps.test.ts`

Wire `codeLineIds.test.ts` like other algorithms.

## Algorithm

Bottom-up `siftDown` from last parent `(n/2 - 1)` to `0`. 0-based **max-heap**.

Every sift compare/swap is a step with `heap` frame + `codeLineId` + explanation. Last step: valid max-heap, `done`. `Step.array` may duplicate `values` for convenience; `heap` is the source of truth for the canvas.

**Suggested ids:** `fn-def`, `build`, `sift`, `compare`, `swap`, `done`.

**Complexity:** O(n) time, O(1) extra space. Note this is Floyd’s build-heap, **not** n inserts (that would be O(n log n)). Contrast with Heap Sort in the note (sort extracts n times; this page only builds).

## Studio

`usePlayback(generateHeapifySteps)` like Quick Sort (comma-separated ints). Cap length with `MAX_HEAP_SIZE` — if `parseArrayInput` still allows 16, validate in the studio or add a heap-specific parse that rejects longer arrays. Randomize 6–8 distinct-ish values.

## Tests

- Final `heap.values` is a max-heap (`values[i] >= values[2i+1]` / `2i+2` when those indices exist).
- Does not mutate input.
- Empty / one element / already a heap still `done`.
- Compare and swap steps exist on an unsorted input.
- Every step has explanation + `heap` + valid `codeLineId`.
- Heap Sort tests still pass.

## Out of scope

Insert, extract-max, min-heap, heap sort changes, tree-BST family.

## Done when

`npm test` passes; home page has a **Heaps** section; `/algorithms/heapify` shows tree + array and plays.
