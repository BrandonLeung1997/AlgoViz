import type { CodeLine } from "@/lib/algorithms/types";

export const BELLMAN_FORD_CODE: Record<
  "python" | "javascript" | "cpp",
  CodeLine[]
> = {
  python: [
    { id: "fn-def", text: "def bellman_ford(graph, source):" },
    { id: "init", text: "    dist = {u: inf for u in graph}; dist[source] = 0; parent = {source: None}" },
    { id: "pass-loop", text: "    for _ in range(len(graph) - 1):" },
    { id: "edge-loop", text: "        for u, v, w in edges:" },
    { id: "relax", text: "            if dist[u] + w < dist[v]:  # relax" },
    { id: "update", text: "                dist[v] = dist[u] + w; parent[v] = u" },
    { id: "pass-end", text: "        # end of pass" },
    { id: "cycle-loop", text: "    for u, v, w in edges:" },
    { id: "neg-cycle", text: "        if dist[u] + w < dist[v]: raise ValueError('negative cycle')" },
    { id: "done", text: "    return dist, parent" },
  ],
  javascript: [
    { id: "fn-def", text: "function bellmanFord(graph, source) {" },
    { id: "init", text: "  const dist = Object.fromEntries([...Object.keys(graph)].map((u) => [u, Infinity])); dist[source] = 0; const parent = { [source]: null };" },
    { id: "pass-loop", text: "  for (let i = 0; i < Object.keys(graph).length - 1; i++) {" },
    { id: "edge-loop", text: "    for (const [u, v, w] of edges) {" },
    { id: "relax", text: "      if (dist[u] + w < dist[v]) { // relax" },
    { id: "update", text: "        dist[v] = dist[u] + w; parent[v] = u;" },
    { id: "pass-end", text: "    // end of pass" },
    { id: "cycle-loop", text: "  for (const [u, v, w] of edges) {" },
    { id: "neg-cycle", text: "    if (dist[u] + w < dist[v]) throw new Error('negative cycle');" },
    { id: "done", text: "  return { dist, parent };" },
  ],
  cpp: [
    { id: "fn-def", text: "void bellmanFord(vector<vector<pair<int,int>>>& graph, int source) {" },
    { id: "init", text: "  vector<long long> dist(graph.size(), LLONG_MAX); dist[source] = 0; unordered_map<int, int> parent; parent[source] = -1;" },
    { id: "pass-loop", text: "  for (int i = 0; i < (int)graph.size() - 1; i++) {" },
    { id: "edge-loop", text: "    for (auto [u, v, w] : edges) {" },
    { id: "relax", text: "      if (dist[u] != LLONG_MAX && dist[u] + w < dist[v]) { // relax" },
    { id: "update", text: "        dist[v] = dist[u] + w; parent[v] = u;" },
    { id: "pass-end", text: "    // end of pass" },
    { id: "cycle-loop", text: "  for (auto [u, v, w] : edges) {" },
    { id: "neg-cycle", text: "    if (dist[u] != LLONG_MAX && dist[u] + w < dist[v]) throw runtime_error(\"negative cycle\");" },
    { id: "done", text: "  // return dist, parent" },
  ],
};
