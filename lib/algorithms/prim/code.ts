import type { CodeLine } from "@/lib/algorithms/types";

export const PRIM_CODE: Record<"python" | "javascript" | "cpp", CodeLine[]> = {
  python: [
    { id: "fn-def", text: "def prim(graph, source):" },
    { id: "init", text: "    dist = {u: inf for u in graph}; dist[source] = 0; visited = set()" },
    { id: "pick", text: "    u = min(remaining, key=dist.get)  # O(V) scan of remaining" },
    { id: "add-edge", text: "    visited.add(u); mst.append((parent[u], u))" },
    { id: "consider", text: "    for v, w in graph[u]:  # cut edges; dist[v] = w if lighter" },
    { id: "done", text: "    return mst  # source component only — not Kruskal's global sort" },
  ],
  javascript: [
    { id: "fn-def", text: "function prim(graph, source) {" },
    { id: "init", text: "  const dist = Object.fromEntries([...Object.keys(graph)].map((u) => [u, Infinity])); dist[source] = 0; const visited = new Set();" },
    { id: "pick", text: "  const u = remaining.reduce((best, x) => dist[x] < dist[best] ? x : best); // O(V) scan of remaining" },
    { id: "add-edge", text: "  visited.add(u); mst.push([parent[u], u]);" },
    { id: "consider", text: "  for (const [v, w] of graph[u]) { // cut edges; dist[v] = w if lighter" },
    { id: "done", text: "  return mst; // source component only — not Kruskal's global sort" },
  ],
  cpp: [
    { id: "fn-def", text: "vector<tuple<int,int,int>> prim(vector<vector<pair<int,int>>>& graph, int source) {" },
    { id: "init", text: "  vector<long long> dist(graph.size(), LLONG_MAX); dist[source] = 0; unordered_set<int> visited;" },
    { id: "pick", text: "  int u = argmin remaining dist; // O(V) scan of remaining" },
    { id: "add-edge", text: "  visited.insert(u); mst.push_back({parent[u], u, dist[u]});" },
    { id: "consider", text: "  for (auto [v, w] : graph[u]) { // cut edges; dist[v] = w if lighter" },
    { id: "done", text: "  return mst; // source component only — not Kruskal's global sort" },
  ],
};
