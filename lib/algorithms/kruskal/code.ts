import type { CodeLine } from "@/lib/algorithms/types";

export const KRUSKAL_CODE: Record<"python" | "javascript" | "cpp", CodeLine[]> = {
  python: [
    { id: "fn-def", text: "def kruskal(graph):" },
    { id: "find", text: "    def find(x):" },
    { id: "find-body", text: "        if parent[x] != x: parent[x] = find(parent[x])  # path compression" },
    { id: "find-ret", text: "        return parent[x]" },
    { id: "sort-edges", text: "    edges = sorted(all_edges(graph), key=lambda e: e.w)" },
    { id: "consider", text: "    for u, v, w in edges:" },
    { id: "skip-cycle", text: "        if find(u) == find(v): continue  # already connected" },
    { id: "union", text: "        union(u, v); mst.append((u, v, w))  # union-by-rank" },
    { id: "done", text: "    return mst" },
  ],
  javascript: [
    { id: "fn-def", text: "function kruskal(graph) {" },
    { id: "find", text: "  function find(x) {" },
    { id: "find-body", text: "    if (parent[x] !== x) parent[x] = find(parent[x]); // path compression" },
    { id: "find-ret", text: "    return parent[x];" },
    { id: "sort-edges", text: "  const edges = [...allEdges(graph)].sort((a, b) => a.w - b.w);" },
    { id: "consider", text: "  for (const [u, v, w] of edges) {" },
    { id: "skip-cycle", text: "    if (find(u) === find(v)) continue; // already connected" },
    { id: "union", text: "    union(u, v); mst.push([u, v, w]); // union-by-rank" },
    { id: "done", text: "  return mst;" },
  ],
  cpp: [
    { id: "fn-def", text: "vector<tuple<int,int,int>> kruskal(vector<vector<pair<int,int>>>& graph) {" },
    { id: "find", text: "  function<int(int)> find = [&](int x) -> int {" },
    { id: "find-body", text: "    if (parent[x] != x) parent[x] = find(parent[x]); // path compression" },
    { id: "find-ret", text: "    return parent[x];" },
    { id: "sort-edges", text: "  sort(edges.begin(), edges.end(), [](auto& a, auto& b) { return get<2>(a) < get<2>(b); });" },
    { id: "consider", text: "  for (auto [u, v, w] : edges) {" },
    { id: "skip-cycle", text: "    if (find(u) == find(v)) continue; // already connected" },
    { id: "union", text: "    unite(u, v); mst.push_back({u, v, w}); // union-by-rank" },
    { id: "done", text: "  return mst;" },
  ],
};
