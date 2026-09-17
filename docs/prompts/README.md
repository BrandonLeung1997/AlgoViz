# AlgoViz — new families

Sorting, searching, graphs, and DP are done (19 algorithms). These prompts add **heaps, hashing, linked lists, two pointers / sliding window, and backtracking**.

Run **one prompt per new agent chat**. Paste the whole file. First prompt in each family builds the canvas; later ones clone it.

| # | Prompt | Family | New UI |
|---|---|---|---|
| 1 | `01-heapify.md` | heaps | `HeapCanvas` (tree + array) |
| 2 | `02-heap-insert.md` | heaps | reuse |
| 3 | `03-extract-max.md` | heaps | reuse |
| 4 | `04-reverse-list.md` | linked-lists | `ListCanvas` |
| 5 | `05-cycle-detection.md` | linked-lists | reuse (cycles) |
| 6 | `06-merge-lists.md` | linked-lists | reuse (two lists) |
| 7 | `07-hash-chaining.md` | hashing | `HashCanvas` |
| 8 | `08-linear-probing.md` | hashing | probing mode |
| 9 | `09-two-sum.md` | pointers | ArrayCanvas pointers |
| 10 | `10-sliding-window.md` | pointers | window range |
| 11 | `11-longest-substring.md` | pointers | char cells |
| 12 | `12-n-queens.md` | backtracking | `BoardCanvas` |
| 13 | `13-permutations.md` | backtracking | array swaps |
| 14 | `14-subsets.md` | backtracking | include/exclude |

Do **not** start prompt 2 of a family until prompt 1 of that family has landed (canvas + `AlgorithmFamily` union). You may run different families in parallel only after each family’s first prompt exists — safest is strict 1→14.

If a chat runs long, start a new one with the same prompt and say which files already exist.
