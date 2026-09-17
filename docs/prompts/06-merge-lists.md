# Task: add Merge Two Sorted Lists

Implement **one** algorithm: **merge two sorted singly linked lists**. Do not add other list algorithms.

**Prerequisite:** `ListCanvas` / `ListFrame`. Clone Reverse List studio chrome.

## Canvas / frame

Need **two input lists plus an output**.

Extend `ListFrame` (keep reverse-list working):

- `head` = current output/dummy head (or the merged list).
- `head2` optional second source, **or** `heads: { a, b, out }`.
- `pointers` include `p`, `q`, `tail`.

`ListCanvas`: if two source lists exist, render list A on one row, list B on the next, merged result on a third — simplest teaching layout. Nodes may be the same id space (`0..n-1` list A, `100+` list B) so ids stay unique.

Alternatively one row of all nodes with two heads — two rows is clearer. Do not break single-list reverse/cycle views: when `head2` is absent, keep one row.

## Files to create

- `lib/algorithms/merge-lists/meta.ts` — `slug: "merge-lists"`, `title: "Merge Two Sorted Lists"`, `family: "linked-lists"`, `status: "ready"`
- `lib/algorithms/merge-lists/code.ts` — Python / JS / C++, **same ids** (dummy-head iterative)
- `lib/algorithms/merge-lists/generateSteps.ts` — `generateMergeListsSteps(a: number[], b: number[]): Step[]`
- `components/player/MergeListsStudio.tsx`
- `app/algorithms/merge-lists/page.tsx`
- `__tests__/generateMergeListsSteps.test.ts`

## Algorithm

Dummy-head merge: compare `p.val` vs `q.val`, attach the smaller, advance. Append leftovers. Steps for each compare + attach.

Assume inputs are **sorted non-decreasing**. Studio: on Apply, sort each list (like Binary Search sorts) **or** error if unsorted — pick sort-on-apply and mention it in the hint.

**Suggested ids:** `fn-def`, `compare`, `attach`, `append-rest`, `done`.

**Complexity:** O(n+m) time, O(1) extra (dummy node). Not a new array.

## Studio

Two `ArrayInput`s (List A, List B). Randomize two short sorted arrays. Cap `a.length + b.length <= MAX_LIST_LENGTH` (raise max to 10 if 8 is too tight, still ≤ 12).

## Tests

- `[1,3,5]` + `[2,4]` → `1,2,3,4,5`.
- One list empty.
- Both empty.
- Duplicates.
- Does not mutate input arrays.
- Compare/attach steps exist.
- Reverse-list and cycle tests still pass.

## Done when

`npm test` passes; Linked Lists card; `/algorithms/merge-lists` shows two chains merging into one.
