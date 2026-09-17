# Task: add Insertion Sort (sorting family only)

Implement **one** algorithm: **Insertion Sort**. Do not add other algorithms or new families.

AlgoViz architecture: `generateXSteps` → immutable `Step[]` → `usePlayback`. Clone **Quick Sort**.

## Clone

- `lib/algorithms/quick-sort/{meta,code,generateSteps}.ts`
- `components/player/QuickSortStudio.tsx`
- `app/algorithms/quick-sort/page.tsx`
- `__tests__/generateQuickSortSteps.test.ts`
- `lib/algorithms/registry.ts`, `components/player/index.ts`, `__tests__/codeLineIds.test.ts`

If Bubble Sort already exists, match its file layout and registry placement.

## Files to create

- `lib/algorithms/insertion-sort/meta.ts` — `slug: "insertion-sort"`, `family: "sorting"`, `status: "ready"`
- `lib/algorithms/insertion-sort/code.ts` — Python / JS / C++ , **same ids**
- `lib/algorithms/insertion-sort/generateSteps.ts` — `generateInsertionSortSteps(input: number[]): Step[]`
- `components/player/InsertionSortStudio.tsx`
- `app/algorithms/insertion-sort/page.tsx`
- `__tests__/generateInsertionSortSteps.test.ts`

## Algorithm behavior

Standard in-place insertion sort:

1. Prefix `0..i-1` is sorted. Take `key = arr[i]`.
2. Shift larger prefix elements one slot right until the hole for `key` is found; write `key` there.
3. After inserting index `i`, mark `0..i` as `sorted`.

**Highlights:** `sorted` on the grown prefix; `comparing` while scanning left; `writing` / `copy` when shifting or placing the key; `activeRange` optional on the unsorted suffix. Reuse existing kinds only.

**Suggested ids:** `fn-def`, `pick-key`, `compare`, `shift`, `insert`, `done`.

**Complexity:** Best O(n) (already sorted), average/worst O(n²), extra space O(1). Note this viz shifts in place (not a separate list).

## Constraints

- Do not mutate input. Last step fully sorted, all `sorted`, `codeLineId: "done"`.
- Reuse Quick Sort studio chrome and `usePlayback(generateInsertionSortSteps)`.
- No new families, deps, or commits unless asked.
- Add matching `codeLineIds.test.ts` block.

## Tests

Sorts correctly; no mutation; empty / one / reverse-sorted / already-sorted; shifts appear on unsorted input; prefix marked `sorted` after each insert; every step has explanation + valid `codeLineId`.

## Done when

`npm test` passes; catalog card under Sorting; `/algorithms/insertion-sort` plays.
