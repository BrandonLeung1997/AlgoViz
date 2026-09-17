# Task: add Sliding Window (fixed size max sum)

Implement **one** algorithm: **maximum sum of any subarray of length k**. Do not add variable-window string problems.

**Prerequisite:** `family: "pointers"` exists (Two Sum). Reuse `ArrayCanvas`.

## Files to create

- `lib/algorithms/sliding-window/meta.ts` — `slug: "sliding-window"`, `title: "Sliding Window"` (summary: fixed window max sum)
- `family: "pointers"`
- `lib/algorithms/sliding-window/code.ts` — Python / JS / C++, **same ids**
- `lib/algorithms/sliding-window/generateSteps.ts` — `generateSlidingWindowSteps(input: number[], k: number): Step[]`
- `components/player/SlidingWindowStudio.tsx`
- `app/algorithms/sliding-window/page.tsx`
- `__tests__/generateSlidingWindowSteps.test.ts`

Wire registry, index, `codeLineIds.test.ts`.

## Visualization

- `highlights` kind `activeRange` on indices `[L, R]` of the current window.
- `range: { low: L, high: R }` with `showPointers`.
- Optional: `writing` on the index entering, `comparing` on the index leaving.
- Track best window; on `done`, highlight the best window as `sorted` (or keep `activeRange` and say “best” in explanation). Pick one and test it.

Do not add a new canvas.

## Algorithm

If `k > n` or `k < 1`, one error/done step explaining invalid k (studio should also validate).

1. Sum first `k` elements (emit a couple of steps while forming it).
2. For each i from k..n-1: subtract `arr[i-k]`, add `arr[i]`, maybe update best.
3. `done` with best sum in the explanation.

**Suggested ids:** `fn-def`, `build`, `slide`, `update-best`, `done`.

**Complexity:** O(n) time, O(1) extra. Contrast with recomputing each window in O(k).

## Studio

Array + k (integer). Default array length 8–10, k=3. Randomize. Thunk playback like Binary Search (array from `usePlayback`, k in React state) **or** both in a thunk; either is fine if changing k regenerates steps.

## Tests

- `[2,1,5,1,3,2]`, k=3 → max 9 (5+1+3).
- k === n → whole array.
- k === 1 → max element.
- Invalid k.
- Does not mutate input.
- Window length is k on slide steps.
- Valid ids.

## Done when

`npm test` passes; pointers-family card; `/algorithms/sliding-window` slides a k-length highlight.
