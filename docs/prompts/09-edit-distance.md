# Task: add Edit Distance / Levenshtein (DP family only)

Implement **one** algorithm: **Edit Distance** (Levenshtein: insert, delete, replace cost 1). Do not add knapsack or coin change in this chat.

Clone **LCS** almost 1:1 (`TableCanvas`, two string inputs, `usePlayback(generateSteps, [0])` pattern in `LcsStudio`).

## Files to create

- `lib/algorithms/edit-distance/meta.ts` — `slug: "edit-distance"`, `title: "Edit Distance"`, `family: "dp"`, `status: "ready"`
- `lib/algorithms/edit-distance/code.ts` — Python / JS / C++ , **same ids**
- `lib/algorithms/edit-distance/generateSteps.ts` — `generateEditDistanceSteps(x: string, y: string): Step[]`
- `components/player/EditDistanceStudio.tsx`
- `app/algorithms/edit-distance/page.tsx`
- `__tests__/generateEditDistanceSteps.test.ts`

Wire registry (dp group), player index, `codeLineIds.test.ts`. Reuse `parseStringInput`, `MAX_STRING_LENGTH`, `randomLcsString` (or a tiny wrapper).

## Small TableCanvas generalization (required)

`TableCanvas` currently hardcodes **“LCS:”** in the footer. Parameterize the result label so LCS still says `LCS` and Edit Distance says `Distance` (and show the numeric distance and/or reconstructed alignment if you store it in `dpTable.reconstructed`).

Keep LCS behavior unchanged. Prefer an optional prop on `TableCanvas` and/or optional fields on `DpTableFrame` (`resultLabel?: string`). Do not break LCS tests.

Axis labels can stay characters of `x` / `y` like LCS (`ε` on the 0 row/col).

## Algorithm behavior

Classic DP: `dp[i][j]` = edit distance of `X[:i]` and `Y[:j]`.

- `dp[0][j] = j`, `dp[i][0] = i`.
- If `X[i-1]==Y[j-1]`, `dp[i][j] = dp[i-1][j-1]`; else `1 + min(delete, insert, replace)`.
- Fill row-major. `write` / `reads` like LCS (`match` vs three neighbors).
- After the table is full, optional short reconstruction of one alignment into `reconstructed` (e.g. `kitten → sitting`); if reconstruction is heavy, at least set `reconstructed` to `String(dp[m][n])` so the footer has a result.

**Suggested ids:** `fn-def`, `init-row`, `init-col`, `match`, `mismatch`, `done`.

**Complexity:** O(mn) time and space. Note insert/delete/replace each cost 1; no transpose (Damerau) in this viz.

## Tests

- `""` vs `""` → 0
- `"ABC"` vs `""` → 3
- `"kitten"` vs `"sitting"` → 3 (if strings exceed `MAX_STRING_LENGTH`, use a shorter classic pair, e.g. `"cat"` / `"cut"` → 1, `"cat"` / `"dogs"` → 4)
- Match vs mismatch steps both occur
- Last cell equals the known distance
- No string mutation (inputs are primitives anyway)
- `codeLineIds` including empty and disjoint strings
- Existing LCS tests still pass

## Done when

`npm test` passes; DP card; `/algorithms/edit-distance` fills a table; LCS footer still says LCS.
