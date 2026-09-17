# Task: add Kruskal MST (graphs family only)

Implement **one** algorithm: **Kruskal’s MST**. Do not add Prim, Union-Find as a separate catalog entry, or new families.

Union-Find is **internal** to `generateKruskalSteps` (with code lines showing `find`/`union`). No new family.

Clone **Dijkstra** for weighted undirected graphs + **TopoSortStudio** for “no source node” playback.

## Files to create

- `lib/algorithms/kruskal/meta.ts` — `slug: "kruskal"`, `family: "graphs"`, `status: "ready"`
- `lib/algorithms/kruskal/code.ts` — Python / JS / C++ , **same ids** (include find/union in the sketch)
- `lib/algorithms/kruskal/generateSteps.ts` — `generateKruskalSteps(graph: Graph): Step[]`
- `components/player/KruskalStudio.tsx`
- `app/algorithms/kruskal/page.tsx`
- `__tests__/generateKruskalSteps.test.ts`

Wire registry, player index, `codeLineIds.test.ts`.

## Algorithm behavior

Undirected weighted graph (same `0-1:4` parse as Dijkstra). Sort edges by weight; skip an edge if both ends are already connected; else union and add to the MST.

- No source picker. Randomize with `randomWeightedGraph()` (already exists).
- Default graph: reuse `DEFAULT_DIJKSTRA_GRAPH` or add `DEFAULT_MST_GRAPH` if you want a clearer unique MST.
- `treeEdges` = MST edges accepted so far; `relaxedEdges` = edge currently considered; `visited` = nodes already in some MST component.
- `GraphFrame` still requires `source` / `frontier` / `path` etc. — set `source` to a dummy (e.g. first node) and keep `frontier`/`path` empty if unused. Prefer not to change `GraphFrame` unless a field is truly required.
- Disconnected graphs: forest of MSTs; still `done`. Do not invent edges.
- GraphCanvas: `showWeights`, undirected (not `directed`). Legend: considering vs accepted tree edges. You may pass `pathLabel="MST"` if that label is shown.

**Suggested ids:** `fn-def`, `sort-edges`, `consider`, `skip-cycle`, `union`, `done`.

**Complexity:** O(E log E) from sorting (Union-Find almost O(E)). Extra space O(V). Note: undirected, requires weights; this viz uses path-compression + union-by-rank or a simple parent array — pick one and document it in `complexityNote`.

## Constraints

- Do not mutate the input graph object (copy adj/weights).
- Negatives: Kruskal can accept negative undirected weights. If `parseWeight` still forbids negatives globally, **keep that restriction** unless Bellman–Ford already added `allowNegative` — do not casually loosen Dijkstra’s parser. Teaching MST with positive weights is enough.
- No new deps. Do not commit unless asked.

## Tests

- Known triangle: edges 0-1:1, 1-2:1, 0-2:10 → MST weight 2, does not include 0-2.
- Skip-cycle step exists on that graph.
- Disconnected two edges.
- Single node.
- Final `treeEdges` count is `n - c` (c = components).
- `codeLineIds` coverage.

## Done when

`npm test` passes; Graphs card; `/algorithms/kruskal` grows a green MST without a source input.
