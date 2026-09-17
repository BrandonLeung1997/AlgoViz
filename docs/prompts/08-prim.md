# Task: add Prim MST (graphs family only)

Implement **one** algorithm: **Prim’s MST**. Do not add Kruskal (unless it is already in the repo — then do not rewrite it).

Clone **DijkstraStudio** (weighted undirected graph + **source** node). Prim grows a tree from a start vertex, like Dijkstra, but it tracks MST cost, not path-from-source.

## Files to create

- `lib/algorithms/prim/meta.ts` — `slug: "prim"`, `family: "graphs"`, `status: "ready"`
- `lib/algorithms/prim/code.ts` — Python / JS / C++ , **same ids**
- `lib/algorithms/prim/generateSteps.ts` — `generatePrimSteps(graph: Graph, source: number): Step[]`
- `components/player/PrimStudio.tsx`
- `app/algorithms/prim/page.tsx`
- `__tests__/generatePrimSteps.test.ts`

Wire registry, player index, `codeLineIds.test.ts`.

## Algorithm behavior

Start from `source`. Repeatedly add the cheapest edge that connects a tree node to a non-tree node (binary heap / “scan remaining” is fine; this viz may scan — say so in `complexityNote`).

- `visited` = nodes in the MST so far; `treeEdges` = accepted MST edges; `relaxedEdges` = candidate edge being considered; `current` = node just added.
- `dist` optional: best known edge weight into each node (Prim key). If you set it, GraphCanvas already prints `dist`.
- Disconnected: only the component of `source` is spanned; other nodes stay unvisited; still `done`.
- Reuse `DEFAULT_DIJKSTRA_GRAPH` / `randomWeightedGraph` and Dijkstra’s parse (non-negative is OK).

**Suggested ids:** `fn-def`, `init`, `pick`, `consider`, `add-edge`, `done`.

**Complexity:** O(E log V) with a heap, or O(V²) scan. Pick the implementation you coded and document it. Contrast with Kruskal (global edge sort vs grow-from-source).

## Tests

- Same triangle as Kruskal teaching case: from source 0, MST weight 2.
- Different source still produces some spanning tree of that component with equal total weight on a connected graph.
- Disconnected node not added.
- No graph mutation.
- `codeLineIds` on default, single node, disconnected.

## Done when

`npm test` passes; Graphs card; `/algorithms/prim` has graph + source like Dijkstra and paints a growing tree.
