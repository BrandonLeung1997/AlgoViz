# Task: add Reverse Linked List (first linked-lists family)

Implement **one** algorithm: **Reverse Linked List** (iterative prev/curr/next). This is the **first linked-list** feature: add the family, list types, and `ListCanvas`. Do not add cycle detection or merge.

## Platform changes (required)

1. `types.ts`
   - `AlgorithmFamily` += `"linked-lists"`.
   - `ListNodeFrame`: `{ id: number; value: number; next: number | null }` (`next` is node id, not index in a JS sense — use stable ids 0..n-1).
   - `ListFrame`:
     - `nodes: ListNodeFrame[]`
     - `head: number | null`
     - `pointers?: Record<string, number | null>` (e.g. `{ prev, curr, next }`)
     - `highlightIds?: number[]`
     - optional `headB` / second list later — you may add `head2?: number | null` now as optional unused, or wait for merge.
   - `list?: ListFrame` on `Step`.
   - `MAX_LIST_LENGTH` = 8.

2. `registry.ts` — `FAMILY_ORDER` += `"linked-lists"`, title `Linked Lists`.

3. `components/player/ListCanvas.tsx`
   - Horizontal boxes with value, arrow to `next`, `null` terminator.
   - Label pointers (`prev` / `curr` / `next` / `head`) on nodes.
   - Sky lab colors: curr amber, prev slate/sky, next green or sky, reversed prefix optional.
   - Empty list: “Empty list”.
   - Export from `index.ts`.

Do not use `ArrayCanvas` as the main viz (a values row as a caption is OK, not sufficient).

## Files to create

- `lib/algorithms/reverse-list/meta.ts` — `slug: "reverse-list"`, `title: "Reverse Linked List"`, `family: "linked-lists"`, `status: "ready"`
- `lib/algorithms/reverse-list/code.ts` — Python / JS / C++, **same ids** (iterative)
- `lib/algorithms/reverse-list/generateSteps.ts` — `generateReverseListSteps(values: number[]): Step[]`
- `lib/algorithms/reverse-list/` helper to build a list frame from values if useful
- `components/player/ReverseListStudio.tsx`
- `app/algorithms/reverse-list/page.tsx`
- `__tests__/generateReverseListSteps.test.ts`

## Algorithm

Iterative reverse:

```
prev = null, curr = head
while curr:
  nxt = curr.next
  curr.next = prev
  prev = curr
  curr = nxt
head = prev
```

One step per pointer move / relink (not one giant step). Last step: reversed chain, `done`.

Input is an array of node values (unique recommended so tests are easy). Build nodes with ids `0..n-1` in that order; after reverse, follow `head` to read values `[...].reverse()`.

**Suggested ids:** `fn-def`, `init`, `save-next`, `relink`, `advance`, `done`.

**Complexity:** O(n) time, O(1) extra. Note: iterative; recursion is out of scope.

## Studio

`usePlayback(generateReverseListSteps)` with comma-separated ints like Quick Sort. Cap at `MAX_LIST_LENGTH`. Randomize length 4–7.

## Tests

- `[1,2,3,4]` walks to `[4,3,2,1]`.
- Empty and single node.
- Does not mutate the input array.
- Intermediate steps show a changing `next` pointer (not only start/end).
- Every step has `list` + explanation + valid id.

## Out of scope

Doubly linked lists, recursion, cycles, merge.

## Done when

`npm test` passes; **Linked Lists** section on home; `/algorithms/reverse-list` animates prev/curr/next.
