# Task: add 0/1 Knapsack (DP family only)

Implement **one** algorithm: **0/1 Knapsack**. Do not add coin change or new families.

Clone **LCS / Edit Distance** table playback, but the axes are **items × capacity**, not two character strings.

If Edit Distance already generalized `TableCanvas`, extend that. If not, generalize now without breaking LCS.

## Files to create

- `lib/algorithms/knapsack/meta.ts` — `slug: "knapsack"`, `title: "0/1 Knapsack"`, `family: "dp"`, `status: "ready"`
- `lib/algorithms/knapsack/code.ts` — Python / JS / C++ , **same ids**
- `lib/algorithms/knapsack/generateSteps.ts` — `generateKnapsackSteps(items: { weight: number; value: number }[], capacity: number): Step[]`
- `components/player/KnapsackStudio.tsx`
- `app/algorithms/knapsack/page.tsx`
- `__tests__/generateKnapsackSteps.test.ts`

Wire registry, player index, `codeLineIds.test.ts`.

## Table model

`DpTableFrame` today is `{ x: string; y: string; cells; write; reads; reconstructed }`. Extend it so knapsack can label axes, e.g.:

- `rowLabels?: string[]` (item names / `ε`, then `w=2 v=3`, …)
- `colLabels?: string[]` (capacities `0..W`)
- `resultLabel?: string` (e.g. `Value`)

`TableCanvas` must render those labels when present; **LCS must keep character headers** when labels are omitted. Do not special-case “LCS” in a way that knapsack cannot reuse.

Keep tables small: default ~3–4 items, capacity ~8–10. Cap items (e.g. 6) and capacity (e.g. 12) so the grid stays readable.

## Studio input

Do **not** overload the LCS string parser. Add a small parser (in `parseInput.ts` or `lib/algorithms/knapsack/parseItems.ts`):

- Items: `weight:value` pairs, e.g. `2:3, 3:4, 4:5`
- Capacity: integer field (reuse `parseTargetInput` or a dedicated parse)

Randomize: few random positive weights/values and a capacity that is not trivial (not 0, not sum of all weights unless you want the “take all” case sometimes).

`usePlayback` is array-oriented. Follow **LcsStudio**: local state + `usePlayback(generateSteps, [0])` where `generateSteps` is a thunk that closes over items + capacity (same as LCS closing over two strings). Dummy `[0]` initial input is fine.

## Algorithm behavior

`dp[i][w]` = best value using the first `i` items with capacity `w`.

- Skip item: `dp[i-1][w]`
- Take item if `weight <= w`: `value + dp[i-1][w-weight]`
- `write`/`reads` on those cells
- Reconstruct one chosen subset into `reconstructed` (e.g. `items 1,3 value=90`)

**Suggested ids:** `fn-def`, `skip`, `take`, `choose`, `reconstruct`, `done`.

**Complexity:** O(nW) time and space. Note this is 0/1 (each item once), not unbounded knapsack.

## Tests

- Classic tiny instance with a known optimum (hand-computed).
- Capacity 0 → 0.
- Item heavier than W is never taken.
- Reconstruction value matches `dp[n][W]`.
- `codeLineIds` on default, empty items, capacity 0.
- LCS (and edit-distance if present) tests still pass.

## Done when

`npm test` passes; DP card; `/algorithms/knapsack` shows an items×capacity table; LCS still looks like LCS.
