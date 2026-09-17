# Task: add Linear Search (searching family only)

Implement **one** algorithm: **Linear Search**. Do not add other algorithms or new families.

Clone **Binary Search** (array + target input), **not** Quick Sort.

## Clone

- `lib/algorithms/binary-search/{meta,code,generateSteps}.ts`
- `components/player/BinarySearchStudio.tsx`
- `app/algorithms/binary-search/page.tsx`
- `__tests__/generateBinarySearchSteps.test.ts`

## Files to create

- `lib/algorithms/linear-search/meta.ts` — `slug: "linear-search"`, `family: "searching"`, `status: "ready"`
- `lib/algorithms/linear-search/code.ts` — Python / JS / C++ , **same ids**
- `lib/algorithms/linear-search/generateSteps.ts` — `generateLinearSearchSteps(input: number[], target: number): Step[]`
- `components/player/LinearSearchStudio.tsx`
- `app/algorithms/linear-search/page.tsx`
- `__tests__/generateLinearSearchSteps.test.ts`

Wire registry (searching group), player index, `codeLineIds.test.ts`.

## Algorithm behavior

Scan left to right. Stop on first match. If the array is empty or the target is missing, end in a not-found step.

**Important studio difference vs binary search:** **do not sort** the array on Apply or Randomize. Linear search works on unsorted input. Randomize with `randomArray` as-is.

**Highlights:** `comparing` on the current index; on hit use `sorted` or `writing` on the found index (pick one and explain in the legend/explanation). `ArrayCanvas` `showPointers` is optional; you can skip L/M/H.

**Suggested ids:** `fn-def`, `compare`, `found`, `not-found` (and maybe `advance`).

**Complexity:** Best O(1), average/worst O(n), extra space O(1). Contrast with binary search in `complexityNote`: no sorted precondition.

`generateLinearSearchSteps` signature matches binary search `(input, target)`. Studio: `usePlayback(generateSteps, defaultArray)` with target state like BinarySearchStudio.

## Tests

Finds the first match index; missing target; empty array; does not mutate input; does **not** require sorted input (e.g. find `3` in `[9,3,1]`); every step explanation + valid id. `codeLineIds` runs should include hit, miss, and empty.

## Done when

`npm test` passes; Searching card next to Binary Search; `/algorithms/linear-search` accepts unsorted arrays.
