# Task: add Linked-List Cycle Detection (Floyd)

Implement **one** algorithm: **Floyd’s tortoise and hare**. Do not add merge or reverse (reuse their canvas).

**Prerequisite:** `ListCanvas` + `ListFrame` exist. If missing, stop.

## Canvas upgrade (required)

`ListCanvas` today is a straight line. A cycle needs a **back-edge** (last node → some earlier node).

- Extend `ListFrame` with optional `cycleTo?: number` (id the tail points to) **or** just honor `nodes[].next` even when it points backward — prefer honoring `next` so the frame stays honest.
- Draw a curved SVG arrow for a next-pointer that goes to an earlier / non-rightward node.
- Pointer labels: `slow` and `fast` (and `head`).
- Do not break reverse-list rendering (acyclic lists stay a straight chain).

## Files to create

- `lib/algorithms/cycle-detection/meta.ts` — `slug: "cycle-detection"`, `title: "Cycle Detection"`, `family: "linked-lists"`, `status: "ready"`
- `lib/algorithms/cycle-detection/code.ts` — Python / JS / C++, **same ids**
- `lib/algorithms/cycle-detection/generateSteps.ts` — `generateCycleDetectionSteps(values: number[], cycleIndex: number | null): Step[]`
  - `cycleIndex` = index in `values` that the tail links to, or `null` for no cycle.
- `components/player/CycleDetectionStudio.tsx`
- `app/algorithms/cycle-detection/page.tsx`
- `__tests__/generateCycleDetectionSteps.test.ts`

Wire registry, index, `codeLineIds.test.ts`.

## Algorithm

Classic Floyd:

- `slow` += 1, `fast` += 2 per step (emit steps at each move and at the compare “same node?”).
- If `fast` or `fast.next` is null → no cycle, `done`.
- If `slow === fast` → cycle found, `done`.
- Do **not** implement phase-2 “find entrance” unless it fits easily; entrance is optional. Title/summary should match what you shipped.

**Suggested ids:** `fn-def`, `init`, `move`, `meet`, `no-cycle`, `done`.

**Complexity:** O(n) time, O(1) extra. Contrast with a hash set of nodes (not shown).

## Studio

- List values (array input).
- Cycle: optional integer “tail links to index” (empty / “none” = acyclic). Validate index in range.
- Randomize: sometimes acyclic, sometimes cycle to a middle index.
- Reuse `ListCanvas`. Thunk playback like LCS.

Guard against infinite step generation: Floyd terminates; still cap steps (e.g. 2n+5) as a safety assert in tests.

## Tests

- Acyclic `[1,2,3]` → `no-cycle`.
- Cycle: values `[1,2,3,4]`, `cycleIndex: 1` → `meet`.
- Single node with self-cycle vs without.
- Does not mutate input values.
- Reverse-list tests still pass; acyclic canvas still works.

## Done when

`npm test` passes; Linked Lists card; `/algorithms/cycle-detection` shows slow/fast and a visible back-edge when cyclic.
