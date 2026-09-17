# Task: add Permutations (backtracking)

Implement **one** algorithm: **generate all permutations** via swap-based (or used-array) backtracking. Do not add subsets or N-Queens changes.

**Prerequisite:** backtracking family exists. **Reuse `ArrayCanvas`**, not the chess board.

## Files to create

- `lib/algorithms/permutations/meta.ts` — `slug: "permutations"`, `title: "Permutations"`, `family: "backtracking"`, `status: "ready"`
- `lib/algorithms/permutations/code.ts` — Python / JS / C++, **same ids**
- `lib/algorithms/permutations/generateSteps.ts` — `generatePermutationsSteps(input: number[]): Step[]`
- `components/player/PermutationsStudio.tsx`
- `app/algorithms/permutations/page.tsx`
- `__tests__/generatePermutationsSteps.test.ts`

## Algorithm

Swap-based DFS:

- At index `i`, swap `i` with each `j` in `i..n-1`, recurse `i+1`, swap back.
- When `i === n`, emit a `solution` step (current permutation). Collect all perms.

**Hard cap:** `MAX_PERM_N = 4` (24 perms). Studio rejects longer arrays. Prefer distinct values; if duplicates exist, either treat as distinct by index (easier) or unique-perms — **treat values as distinct by index** (input `[1,1]` still 2 perms if you swap indices). Simpler: randomize distinct ints.

**Highlights:** `activeRange` on the suffix being decided; `writing` on swapped pair; `sorted` on a completed permutation (optional).

Do **not** draw a full recursion tree (too wide). Array + explanations are enough. Optional caption listing solutions found so far: add `reconstructed`-like text on the studio under the canvas from the latest step explanation, or `sequence` caption field — keep it light (e.g. “Solutions: 3 / 6”).

**Suggested ids:** `fn-def`, `swap`, `recurse`, `solution`, `backtrack`, `done`.

**Complexity:** O(n·n!) time to write all perms, O(n) extra (ignoring output storage). This viz stores the timeline of steps, so n must stay tiny.

## Studio

Quick Sort–style array input with max length 4. Default `[1,2,3]`. Randomize 3 distinct values.

## Tests

- `[1,2,3]` → 6 `solution` steps; final set of permutations equals all orderings.
- `[1]` → one solution.
- `[]` → one empty solution or zero — pick one and document (prefer one empty perm).
- Backtrack/swap-back happens (array returns to previous order after a branch).
- Does not mutate input.
- n=4 is allowed; n=5 rejected in parse/studio.
- Valid ids. N-Queens tests still pass.

## Done when

`npm test` passes; Backtracking card; `/algorithms/permutations` swaps in place and lists all orderings.
