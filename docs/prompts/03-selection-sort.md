# Task: add Selection Sort (sorting family only)

Implement **one** algorithm: **Selection Sort**. Do not add other algorithms or new families.

Clone **Quick Sort** (or Insertion Sort if it already exists — same array-studio pattern).

## Files to create

- `lib/algorithms/selection-sort/meta.ts` — `slug: "selection-sort"`, `family: "sorting"`, `status: "ready"`
- `lib/algorithms/selection-sort/code.ts` — Python / JS / C++ , **same ids**
- `lib/algorithms/selection-sort/generateSteps.ts` — `generateSelectionSortSteps(input: number[]): Step[]`
- `components/player/SelectionSortStudio.tsx`
- `app/algorithms/selection-sort/page.tsx`
- `__tests__/generateSelectionSortSteps.test.ts`

Wire `registry.ts`, `components/player/index.ts`, and `__tests__/codeLineIds.test.ts`. Do not change `FAMILY_ORDER`.

## Algorithm behavior

1. For `i` from `0` to `n-2`, scan `i+1..n-1` to find the minimum.
2. Swap min with index `i` (even if `i` is already min — you may skip a no-op swap but still emit a “place” step).
3. Index `i` is then `sorted`. After the last pass, mark the final index sorted too.

**Highlights:** `sorted` prefix; `comparing` on the scan index; a distinct “current min” — use `low` or `pivot` **only if** you also show a tiny legend, otherwise prefer `comparing` on candidate + `writing` on the swap pair. Do **not** add a new `HighlightKind` unless ArrayCanvas cannot express “current min”; if you must, add one kind (`min`) and wire `KIND_CLASS` + `KIND_PRIORITY` in `ArrayCanvas.tsx` with a one-line legend. Prefer no canvas change.

**Suggested ids:** `fn-def`, `scan`, `new-min`, `swap`, `pass-end`, `done`.

**Complexity:** Best/average/worst O(n²), extra space O(1). Note that it always scans the suffix (no early exit like bubble).

## Constraints

- Do not mutate input. Reuse array studio + `usePlayback`.
- Last step: sorted array, all `sorted`, `done`.
- No new deps. Do not commit unless asked.

## Tests

Correct sort; no mutation; empty / one / duplicates; a swap (or place) step exists; growing `sorted` prefix; every step has explanation + valid id.

## Done when

`npm test` passes; Sorting card; `/algorithms/selection-sort` plays.
