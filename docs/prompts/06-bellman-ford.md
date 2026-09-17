# Task: add Bellman–Ford (graphs family only)

Implement **one** algorithm: **Bellman–Ford**. Do not add MST, A*, or new families.

This is the directed, negative-weight counterpart to Dijkstra. Clone **Dijkstra’s studio + GraphCanvas**, but the graph model must be **directed and allow negative weights**.

## Clone

- `lib/algorithms/dijkstra/{meta,code,generateSteps}.ts`
- `components/player/DijkstraStudio.tsx`
- `app/algorithms/dijkstra/page.tsx`
- `__tests__/generateDijkstraSteps.test.ts`
- Directed input UX from `TopoSortStudio` (`parseGraphInput(..., { directed: true })`)

## Files to create

- `lib/algorithms/bellman-ford/meta.ts` — `slug: "bellman-ford"`, `family: "graphs"`, `status: "ready"`
- `lib/algorithms/bellman-ford/code.ts` — Python / JS / C++ , **same ids**
- `lib/algorithms/bellman-ford/generateSteps.ts` — `generateBellmanFordSteps(graph: Graph, source: number): Step[]`
- `components/player/BellmanFordStudio.tsx`
- `app/algorithms/bellman-ford/page.tsx`
- `__tests__/generateBellmanFordSteps.test.ts`

## Required platform change (keep Dijkstra working)

Today `parseInput.ts` **rejects negative weights** (`NEGATIVE_WEIGHT_ERROR`) and directed parse **drops weights**. `Graph.weights` is documented as undirected `${min}-${max}`.

You must:

1. Allow **negative** weights when parsing for Bellman–Ford (add an option e.g. `allowNegative?: boolean` on `parseGraphInput` / `parseWeight`). Dijkstra’s existing parse path must **still reject** negatives — do not regress Dijkstra tests.
2. Support **directed weighted** edges, e.g. `0>1:4`, `0->2:-2`. Extend `formatGraphInput` for directed weights.
3. Store directed weights without breaking undirected Dijkstra. Recommended: add optional `directedWeights?: Record<string, number>` keyed `from>to`, plus `getDirectedEdgeWeight(graph, u, v)`. Leave `weights` + `getEdgeWeight` as undirected. Update `Graph` comments in `types.ts`.
4. `GraphCanvas`: pass `directed` like topo sort, `showWeights` like Dijkstra, reuse `dist` on the frame. Source + current + relaxed edges should still work. Do not rewrite the canvas unless directed arrows + weights need a small fix.
5. Add `DEFAULT_BELLMAN_FORD_GRAPH` and `randomDirectedWeightedGraph` (negatives allowed, keep graphs small, preferably no negative cycle in the default teaching graph). Put helpers in `lib/algorithms/randomGraph.ts`.

## Algorithm behavior

Relax all edges `|V|-1` times, then one extra pass to detect a negative cycle reachable from the source.

- `GraphFrame.dist` like Dijkstra (`∞` for unreachable).
- `relaxedEdges` on a successful relax; `treeEdges` / `parent` for the current shortest-path tree.
- If a negative cycle is detected, emit a clear `neg-cycle` step (do not infinite-loop). Unreachable nodes stay `∞`.
- Studio: graph textarea + source input (like Dijkstra), directed hint text (like topo).

**Suggested ids:** `fn-def`, `init`, `relax`, `update`, `pass-end`, `neg-cycle`, `done`.

**Complexity:** O(VE) time, O(V) extra space. `complexityNote`: works with negative edges; Dijkstra does not. Negative cycle ⇒ no well-defined shortest paths.

## Tests

- No input graph mutation.
- Positive-weight graph agrees with a simple hand-computed dist.
- A negative edge that improves a path is used (dist smaller than Dijkstra-on-abs would be).
- Negative cycle reachable from source hits `neg-cycle`.
- Isolated source: dist[source]=0, others ∞.
- `codeLineIds` on default graph, tiny graph, and a cycle graph.
- Existing Dijkstra / parseInput tests still pass (negatives still illegal for undirected Dijkstra parse).

## Done when

`npm test` passes; Graphs card; `/algorithms/bellman-ford` accepts `0>1:-2` style input; Dijkstra still rejects negatives.
