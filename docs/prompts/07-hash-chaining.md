# Task: add Hash Table (chaining) — first hashing family

Implement **one** algorithm/viz: **hash table insert + search with separate chaining**. This is the **first hashing** feature: add family, types, `HashCanvas`. Do not add open addressing.

## Platform changes

1. `types.ts`
   - `AlgorithmFamily` += `"hashing"`.
   - `HashFrame`:
     - `bucketCount: number`
     - `buckets: number[][]` (chains, insertion order)
     - `op?: "insert" | "search"`
     - `key?: number`
     - `hashIndex?: number`
     - `current?: { bucket: number; offset: number } | null`
     - `found?: boolean`
     - `status?: string`
   - `hash?: HashFrame` on `Step`.
   - `MAX_HASH_KEYS` = 10, `MAX_HASH_BUCKETS` = 8.

2. `registry.ts` — family `"hashing"`, title `Hashing`.

3. `components/player/HashCanvas.tsx`
   - Vertical (or horizontal) bucket slots `0..m-1`.
   - Each bucket’s chain as boxes to the side.
   - Highlight hashed bucket and node being walked/appended.
   - Caption: `hash(k) = k % m` (integer keys only).
   - Export from `index.ts`.

## Files to create

- `lib/algorithms/hash-chaining/meta.ts` — `slug: "hash-chaining"`, `title: "Hash Table (Chaining)"`, `family: "hashing"`, `status: "ready"`
- `lib/algorithms/hash-chaining/code.ts` — Python / JS / C++, **same ids** for insert **and** search (one listing with both functions is OK if ids stay unique)
- `lib/algorithms/hash-chaining/generateSteps.ts` — `generateHashChainingSteps(keys: number[], bucketCount: number, searchKey: number): Step[]`
  - First insert all `keys` in order (step through each insert), then search `searchKey`.
- `components/player/HashChainingStudio.tsx`
- `app/algorithms/hash-chaining/page.tsx`
- `__tests__/generateHashChainingSteps.test.ts`

## Algorithm

`index = key % m` (non-negative: for negative keys use `((key % m) + m) % m` or reject negatives — reject in parse is simpler).

Insert: walk chain; if key exists, stop (no dup); else append. Search: walk chain until found or end.

Emit steps: compute hash, walk, insert/found/miss.

**Suggested ids:** `fn-def`, `hash`, `walk`, `insert`, `found`, `miss`, `done`.

**Complexity:** Average O(1) insert/search, worst O(n) if everything collides. Note load factor `n/m`; this viz does not resize.

## Studio

- Keys to insert (array).
- Bucket count `m` (integer 3–8).
- Search key (integer).
- Randomize: ~6 keys, m=5, search sometimes present.
- Thunk `usePlayback` like Knapsack.

Keep `m` small so chains are visible. Duplicate keys: skip second insert with an explanation.

## Tests

- Insert `[10, 15, 20]`, m=5 → buckets 0:`[10,15,20]` (all hash 0).
- Search hit and miss after those inserts.
- Empty keys, search miss.
- Does not mutate input array.
- Every step has `hash` + valid id.

## Out of scope

Deletion, resizing, universal hashing, probing.

## Done when

`npm test` passes; **Hashing** section; `/algorithms/hash-chaining` fills chains then searches.
