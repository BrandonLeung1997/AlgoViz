# Task: add Two Sum (sorted two-pointer) — first pointers family

Implement **one** algorithm: **two-sum on a sorted array** (left/right pointers). First **pointers** family page. Do **not** add sliding window yet. Prefer **reusing `ArrayCanvas`** with `showPointers`; only add a family enum, not a new canvas unless pointers cannot be labeled.

## Platform changes

1. `types.ts` — `AlgorithmFamily` += `"pointers"`.
2. `registry.ts` — `FAMILY_ORDER` += `"pointers"`, title `Two Pointers & Sliding Window`.
3. `ArrayCanvas` already supports L/M/H via `step.range` and `showPointers`. Use `range.low` / `range.high` as the two pointers (ignore mid). Pass `showPointers`. If the legend always says “mid”, hide mid when `range.mid === undefined` (small ArrayCanvas tweak is in scope).

No `HeapCanvas`/`ListCanvas` work.

## Files to create

- `lib/algorithms/two-sum/meta.ts` — `slug: "two-sum"`, `title: "Two Sum"` (subtitle/summary: sorted array, two pointers — **not** the hash-map O(n) version)
- `family: "pointers"`, `status: "ready"`
- `lib/algorithms/two-sum/code.ts` — Python / JS / C++, **same ids**
- `lib/algorithms/two-sum/generateSteps.ts` — `generateTwoSumSteps(input: number[], target: number): Step[]`
- `components/player/TwoSumStudio.tsx`
- `app/algorithms/two-sum/page.tsx`
- `__tests__/generateTwoSumSteps.test.ts`

## Algorithm

Assume sorted ascending. `i=0`, `j=n-1`:

- sum == target → found, highlight both, `done`
- sum < target → i++
- sum > target → j--
- i >= j → not found

One step per compare / move.

**Suggested ids:** `fn-def`, `compare`, `move-left`, `move-right`, `found`, `not-found`.

**Complexity:** O(n) time after sort, O(1) extra. Note: this viz **does not sort inside the loop**. Studio sorts on Apply (like Binary Search). Hash-map two-sum is a different algorithm — mention in `complexityNote` as not shown. Hashing family already has tables; do not duplicate.

## Studio

Clone BinarySearchStudio: array + target. Sort on apply. Randomize a sorted array and a target that is often (not always) a real pair.

## Tests

- `[1,2,4,6,8,11]`, target `10` → 2+8 or 4+6; pointers meet on a valid pair.
- Target too small / too large → `not-found`.
- Empty / one element.
- Does not mutate original input (copy then assume sorted).
- `range.low` / `range.high` present on compare steps.
- Valid ids.

## Done when

`npm test` passes; new **Two Pointers & Sliding Window** section; `/algorithms/two-sum` moves L/H on bars.
