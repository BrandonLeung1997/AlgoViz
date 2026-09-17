# Task: add Subsets (backtracking)

Implement **one** algorithm: **all subsets** (power set) via include/exclude backtracking. Do not add combination-sum or permutations changes.

**Prerequisite:** backtracking family. Reuse `ArrayCanvas` plus a simple “current subset” caption.

## Files to create

- `lib/algorithms/subsets/meta.ts` — `slug: "subsets"`, `title: "Subsets"`, `family: "backtracking"`, `status: "ready"`
- `lib/algorithms/subsets/code.ts` — Python / JS / C++, **same ids**
- `lib/algorithms/subsets/generateSteps.ts` — `generateSubsetsSteps(input: number[]): Step[]`
- `components/player/SubsetsStudio.tsx`
- `app/algorithms/subsets/page.tsx`
- `__tests__/generateSubsetsSteps.test.ts`

## Visualization

At index `i`: highlight `i` as `comparing`; elements already chosen as `sorted` (or `writing`).

Show the **current subset** as text under the canvas. Easiest: put it in `step.explanation` **and** in an optional `BoardFrame`/`dpTable.reconstructed` — prefer adding `subset?: number[]` on `Step` only if you also render it. Minimal path: `HeapFrame` is wrong; add:

```
subset?: number[]
```

to `Step` and a tiny line in the studio under `ArrayCanvas` (`Current: [1, 3]`). That studio-only read is enough; don’t force a new canvas.

## Algorithm

```
dfs(i, chosen):
  if i == n: record chosen; return
  dfs(i+1, chosen)           # skip
  dfs(i+1, chosen + [a[i]])  # take
```

Or take-then-skip; be consistent in code listings. Emit steps at skip, take, record, backtrack.

**Cap:** `MAX_SUBSET_N = 5` (32 subsets). Default `[1,2,3]`.

**Suggested ids:** `fn-def`, `skip`, `take`, `record`, `backtrack`, `done`.

**Complexity:** O(n·2^n) time, O(n) extra. Note: not DP subset-sum; this enumerates subsets.

## Studio

Array input, max 5, distinct preferred. Randomize 3–4 values. `usePlayback(generateSubsetsSteps)`.

## Tests

- `[1,2]` → 4 records: `[]`, `[1]`, `[2]`, `[1,2]` (order of discovery may match your DFS; compare as sets).
- Empty input → one empty subset.
- Take and skip both appear.
- Does not mutate input.
- Valid ids. Permutations / N-Queens tests still pass.

## Done when

`npm test` passes; Backtracking card; `/algorithms/subsets` shows include/exclude decisions and all subsets.
