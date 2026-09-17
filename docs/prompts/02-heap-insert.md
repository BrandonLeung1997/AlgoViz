# Task: add Heap Insert (heaps family)

Implement **one** algorithm: **Heap Insert** (append + sift-up on a max-heap). Do not add extract-max or other families.

**Prerequisite:** Heapify (`HeapCanvas`, `HeapFrame`, `family: "heaps"`) is already in the repo. Clone it. If Heapify is missing, stop and say so.

## Clone

- `lib/algorithms/heapify/{meta,code,generateSteps}.ts`
- `components/player/HeapifyStudio.tsx`
- `app/algorithms/heapify/page.tsx`
- `__tests__/generateHeapifySteps.test.ts`

## Files to create

- `lib/algorithms/heap-insert/meta.ts` — `slug: "heap-insert"`, `title: "Heap Insert"`, `family: "heaps"`, `status: "ready"`
- `lib/algorithms/heap-insert/code.ts` — Python / JS / C++, **same ids**
- `lib/algorithms/heap-insert/generateSteps.ts` — `generateHeapInsertSteps(heap: number[], value: number): Step[]`
- `components/player/HeapInsertStudio.tsx`
- `app/algorithms/heap-insert/page.tsx`
- `__tests__/generateHeapInsertSteps.test.ts`

Wire registry, player index, `codeLineIds.test.ts`. Do not change `FAMILY_ORDER` except to register the meta.

## Algorithm

Input is an **existing max-heap** plus a value to insert:

1. Emit a start step showing the heap.
2. Append `value` (`writing` on the new last index).
3. Sift up: while parent exists and parent < node, swap (`compare` then `swap`).
4. `done` — result is a max-heap of size `n+1`.

**Suggested ids:** `fn-def`, `append`, `compare`, `swap`, `done`.

**Complexity:** O(log n) time, O(1) extra. Note: insert is sift-up; heapify/extract use sift-down.

## Studio

Like Binary Search / Knapsack: two fields.

- Heap array (comma-separated). On Apply, **do not silently heapify** — if the array is not a max-heap, show an input error (“Array is not a max-heap”).
- Value to insert (integer).
- Randomize: generate a small random array, heapify it in the randomizer (not as visible steps), pick an insert value.

Cap `n+1 <= MAX_HEAP_SIZE`. Reuse `HeapCanvas`. Playback thunk: `usePlayback(() => generateHeapInsertSteps(heap, value), [0])` like LCS.

## Tests

- Insert into `[9, 5, 6, 1]` value `8` → heap property holds; 8 is not stuck at the end if it should rise.
- Insert into empty heap → `[value]`.
- Insert into `[4]` a larger and a smaller value.
- Does not mutate the input array.
- Every step has `heap` + explanation + valid id.
- Rejecting a non-heap in the studio is UX; generator may assume a valid heap (document that).

## Done when

`npm test` passes; Heaps card; `/algorithms/heap-insert` sifts the new node up in the tree.
