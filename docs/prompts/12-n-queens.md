# Task: add N-Queens (first backtracking family)

Implement **one** algorithm: **N-Queens** (place n queens, no two attack). First **backtracking** feature: add family, `BoardFrame`, `BoardCanvas`. Default **n = 4**. Do not add permutations/subsets.

## Platform changes

1. `types.ts`
   - `AlgorithmFamily` += `"backtracking"`.
   - `BoardFrame`:
     - `n: number`
     - `queens: (number | null)[]` length n, `queens[row] = col` or `null`
     - `tryRow?: number`
     - `tryCol?: number`
     - `attacks?: { row: number; col: number }[]` optional
     - `status?: "trying" | "placed" | "backtrack" | "solution"`
     - `solutionCount?: number`
   - `board?: BoardFrame` on `Step`.
   - `MAX_QUEENS` = 5 (4 default; 6+ explodes step count — cap at 5).

2. `registry.ts` — `"backtracking"`, title `Backtracking`.

3. `components/player/BoardCanvas.tsx`
   - n×n grid, checker optional (keep it quiet: white/slate cells).
   - Queen glyph or “Q”.
   - Trying cell amber, placed sky, attacked optional rose/10% overlay.
   - Caption: solutions found so far.
   - Export from `index.ts`.

## Files to create

- `lib/algorithms/n-queens/meta.ts` — `slug: "n-queens"`, `title: "N-Queens"`, `family: "backtracking"`, `status: "ready"`
- `lib/algorithms/n-queens/code.ts` — Python / JS / C++, **same ids**
- `lib/algorithms/n-queens/generateSteps.ts` — `generateNQueensSteps(n: number): Step[]`
- `components/player/NQueensStudio.tsx`
- `app/algorithms/n-queens/page.tsx`
- `__tests__/generateNQueensSteps.test.ts`

## Algorithm

Standard row-by-row backtracking. Emit steps:

- try a column
- reject if attack
- place
- recurse
- backtrack (remove queen)
- when `row === n`, record a solution (do not stop at the first — **find all**, but n≤5)

Cap generated steps if needed (n=5 is hundreds of steps, acceptable). n=4 is ~18 solutions? Wait, 4-queens has **2** solutions. 5-queens has 10. Good.

**Suggested ids:** `fn-def`, `try`, `reject`, `place`, `backtrack`, `solution`, `done`.

**Complexity:** roughly O(n!) time, O(n) extra for the row array. Note this lists all solutions.

## Studio

Single integer n (4–5). Randomize unused or just reset to 4. Thunk playback `usePlayback(() => generateNQueensSteps(n), [0])`. No array randomize — hide Randomize or make it “n=4 vs n=5”.

## Tests

- n=1 → 1 solution.
- n=2 → 0 solutions (still `done`).
- n=4 → 2 solutions (step with `solution` appears twice).
- Backtrack steps exist.
- Does not infinite-loop.
- Valid ids.

## Out of scope

N-Queens-II count-only without board, Sudoku, dancing links.

## Done when

`npm test` passes; **Backtracking** section; `/algorithms/n-queens` places/removes queens on a board.
