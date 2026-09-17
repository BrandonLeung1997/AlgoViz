# Task: add Hash Table (linear probing)

Implement **one** algorithm: **open addressing with linear probing** (insert + search). Do not add quadratic probing, double hashing, or deletion-with-tombstones unless you need a single deleted slot for a miss demo — prefer **no deletes**.

**Prerequisite:** `HashCanvas` + hashing family. Extend the canvas; do not rewrite chaining.

## Canvas

Add a probing mode to `HashCanvas` (prop `mode: "chain" | "probe"` or a `HashFrame.layout: "chain" | "probe"`):

- Probe: one row of `m` slots, each `number | null`.
- Highlight current probe index, home slot `hash(k)`, filled vs empty.
- Chaining layout must keep working.

`HashFrame` needs `slots?: (number | null)[]` for this mode. Keep `buckets` optional.

## Files to create

- `lib/algorithms/linear-probing/meta.ts` — `slug: "linear-probing"`, `title: "Linear Probing"`, `family: "hashing"`, `status: "ready"`
- `lib/algorithms/linear-probing/code.ts` — Python / JS / C++, **same ids**
- `lib/algorithms/linear-probing/generateSteps.ts` — `generateLinearProbingSteps(keys: number[], tableSize: number, searchKey: number): Step[]`
- `components/player/LinearProbingStudio.tsx`
- `app/algorithms/linear-probing/page.tsx`
- `__tests__/generateLinearProbingSteps.test.ts`

## Algorithm

`h(k, i) = (k % m + i) % m` for i = 0,1,2,...

Insert: probe until empty slot; if key already present, stop. If table is full, emit `full` and stop further inserts (do not infinite-loop).

Search: probe until key found or empty slot (classic, no tombstones) or wrapped back to start.

Generate: insert all keys then search, same as chaining prompt.

**Suggested ids:** `fn-def`, `hash`, `probe`, `insert`, `found`, `miss`, `full`, `done`.

**Complexity:** Average O(1) for low load; degrades as n→m. Worst O(n). Note clustering. Require `n < m` in the studio (error if too many keys), e.g. keys length ≤ m-1.

## Studio

Keys, table size m (default 7), search key. Randomize with n ≤ m-2. Thunk playback.

## Tests

- Keys `[5, 12]`, m=7 → slot 5 then slot 6 (12 % 7 = 5, collision).
- Search hit / miss (miss hits an empty slot).
- Full table / too many keys does not loop forever.
- Chaining tests still pass.
- Valid `codeLineId`s.

## Done when

`npm test` passes; Hashing card; `/algorithms/linear-probing` shows collisions walking to the next empty slot.
