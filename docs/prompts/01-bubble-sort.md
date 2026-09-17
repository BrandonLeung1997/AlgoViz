# Task: add Bubble Sort (sorting family only)

Implement **one** algorithm: **Bubble Sort**. Do not add other algorithms, new families, or refactors unrelated to this feature.

This is AlgoViz, a Next.js educational visualizer. Architecture: a pure `generateXSteps(...)` function emits an immutable `Step[]` timeline. `usePlayback` walks that timeline. Canvas, code highlight, and explanation all read the current step.

## Clone this pattern

Copy **Quick Sort** (simplest array studio):

- `lib/algorithms/quick-sort/{meta,code,generateSteps}.ts`
- `components/player/QuickSortStudio.tsx`
- `app/algorithms/quick-sort/page.tsx`
- `__tests__/generateQuickSortSteps.test.ts`
- registry + `components/player/index.ts` + `__tests__/codeLineIds.test.ts`

## Files to create

- `lib/algorithms/bubble-sort/meta.ts` — `slug: "bubble-sort"`, `family: "sorting"`, `status: "ready"`
- `lib/algorithms/bubble-sort/code.ts` — Python / JavaScript / C++ with **identical line ids**
- `lib/algorithms/bubble-sort/generateSteps.ts` — `generateBubbleSortSteps(input: number[]): Step[]`
- `components/player/BubbleSortStudio.tsx`
- `app/algorithms/bubble-sort/page.tsx`
- `__tests__/generateBubbleSortSteps.test.ts`

## Files to modify

- `lib/algorithms/registry.ts` — append `bubbleSortMeta` in the sorting group (with merge/quick)
- `components/player/index.ts` — export the studio
- `__tests__/codeLineIds.test.ts` — same two tests as quick sort (shared ids; every step id exists)

Do **not** change `FAMILY_ORDER`. Do **not** add coming-soon cards.

## Algorithm behavior

Adjacent-swap bubble sort:

1. Outer pass `i` from `0` to `n-2`.
2. Inner scan `j` from `0` to `n-2-i`; compare `arr[j]` and `arr[j+1]`; swap if out of order.
3. After each pass, index `n-1-i` is finalized (`sorted` highlight).
4. Optional: if a pass does no swaps, stop early and mark the rest sorted (emit a step explaining the early exit). Empty and single-element arrays still emit a `done` step.

**Highlights:** `comparing` on the pair; `writing` on a swap; `sorted` on the suffix that has bubbled into place. Reuse existing `HighlightKind` values. Do not add new kinds.

**Code lines (ids must match across languages):** e.g. `fn-def`, `pass`, `compare`, `swap`, `pass-end`, `done`. Keep listings short (teaching sketch, not a full program), same style as `QUICK_SORT_CODE`.

**Complexity:** Best O(n) with early exit, average/worst O(n²), extra space O(1). Note that this viz is the adjacent-swap version.

## Constraints (match the repo)

- Do not mutate the input array.
- Every step: non-empty `explanation`, `codeLineId` that exists in the code listings, `array` a copy of current values.
- Last step: fully sorted, all bars `sorted`, `codeLineId: "done"`.
- Default playback via `usePlayback(generateBubbleSortSteps)` like Quick Sort (array input + randomize).
- Visual: Sky lab split studio — viz+controls left, code/explain/complexity right. Reuse `ArrayCanvas`, `ControlPanel`, `ArrayInput`, `CodePanel`, `ExplanationPanel`, `ComplexityPanel`.
- `MAX_ARRAY_LENGTH` is already 16; do not raise it.
- No new dependencies. No backend. Do not commit unless I ask.
- If you touch Next.js APIs, read `node_modules/next/dist/docs/` first.

## Tests

Cover: sorts like `[...input].sort((a,b)=>a-b)`; no input mutation; empty / one element / already sorted; every step has explanation + codeLineId; compares and swaps appear; early-exit on sorted input if you implemented it; suffix marked `sorted` after a pass.

## Done when

`npm test` passes, `/` shows a ready Bubble Sort card under Sorting, `/algorithms/bubble-sort` plays end-to-end.
