# Task: add Coin Change (DP family only)

Implement **one** algorithm: **Coin Change** — fewest coins to make `amount` (unbounded, each denomination reusable). Do not add other algorithms.

Clone **Knapsack** if it exists (table studio + custom parser). Else clone **LCS** and follow the knapsack prompt’s TableCanvas generalization.

## Files to create

- `lib/algorithms/coin-change/meta.ts` — `slug: "coin-change"`, `title: "Coin Change"`, `family: "dp"`, `status: "ready"`
- `lib/algorithms/coin-change/code.ts` — Python / JS / C++ , **same ids**
- `lib/algorithms/coin-change/generateSteps.ts` — `generateCoinChangeSteps(coins: number[], amount: number): Step[]`
- `components/player/CoinChangeStudio.tsx`
- `app/algorithms/coin-change/page.tsx`
- `__tests__/generateCoinChangeSteps.test.ts`

Wire registry, player index, `codeLineIds.test.ts`.

## Which DP table

Prefer a **2D** table so `TableCanvas` works: rows = first `i` coin types, cols = `0..amount`. `dp[i][a]` = fewest coins using `coins[0..i-1]` to make `a`, or `∞` / a large sentinel.

If you use 1D `dp[amount+1]`, you must still present a 2D `cells` snapshot each write (e.g. one row) **or** extend TableCanvas for a single row. Prefer 2D; keep `amount` small (default 8–12, cap ~15).

Display `∞` for unreachable cells (TableCanvas currently prints raw numbers — if you store `Infinity`, teach `TableCanvas` to show `∞` without breaking LCS integers).

## Studio input

- Coins: comma-separated positive ints (reuse `parseArrayInput` but reject non-positive and maybe cap length ~6).
- Amount: integer ≥ 0.
- Randomize: a few canonical coins (e.g. 1, 3, 4) and a modest amount.
- Playback thunk like LCS/Knapsack (`usePlayback(generateSteps, [0])`).

## Algorithm behavior

Unbounded: when taking coin `c`, read `dp[i][a-c]` (same row), not only `i-1`.

- Infeasible amount: finish with `∞` / “impossible” in `reconstructed`.
- Reconstruct one coin multiset when feasible (e.g. `4+4+3`).

**Suggested ids:** `fn-def`, `skip`, `take`, `choose`, `impossible`, `done`.

**Complexity:** O(n·amount) time/space. Contrast with 0/1 knapsack: coins may be reused. Greedy (US coins) is **not** this viz.

## Tests

- Coins `[1,3,4]`, amount `6` → 2 coins (`3+3` or `1+1+4` is 3 — optimum is 2).
- Amount 0 → 0 coins.
- Coins `[2,4]`, amount `3` → impossible.
- Does not mutate the coins array.
- `codeLineIds` on feasible, impossible, amount 0.
- Existing DP tests still pass.

## Done when

`npm test` passes; DP card; `/algorithms/coin-change` fills a coins×amount table and shows fewest coins or impossible.
