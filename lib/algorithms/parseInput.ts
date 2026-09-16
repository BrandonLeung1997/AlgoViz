import { MAX_ARRAY_LENGTH, MAX_GRAPH_NODES, type Graph } from "@/lib/algorithms/types";

export { MAX_ARRAY_LENGTH, MAX_GRAPH_NODES };

export function parseArrayInput(
  raw: string,
): { ok: true; values: number[] } | { ok: false; error: string } {
  const trimmed = raw.trim();
  if (!trimmed) {
    return { ok: false, error: "Enter at least one integer." };
  }
  const parts = trimmed.split(/[\s,]+/).filter(Boolean);
  if (parts.length > MAX_ARRAY_LENGTH) {
    return {
      ok: false,
      error: `Use at most ${MAX_ARRAY_LENGTH} numbers.`,
    };
  }
  const values: number[] = [];
  for (const part of parts) {
    if (!/^-?\d+$/.test(part)) {
      return { ok: false, error: `“${part}” is not an integer.` };
    }
    values.push(Number(part));
  }
  return { ok: true, values };
}

export function parseTargetInput(
  raw: string,
): { ok: true; value: number } | { ok: false; error: string } {
  const trimmed = raw.trim();
  if (!trimmed) {
    return { ok: false, error: "Enter a target integer." };
  }
  if (!/^-?\d+$/.test(trimmed)) {
    return { ok: false, error: `“${trimmed}” is not an integer.` };
  }
  return { ok: true, value: Number(trimmed) };
}

function parseNodeId(
  raw: string,
): { ok: true; id: number } | { ok: false; error: string } {
  if (!/^\d+$/.test(raw)) {
    return { ok: false, error: `“${raw}” is not a node id.` };
  }
  return { ok: true, id: Number(raw) };
}

function finishGraph(
  adj: Record<number, number[]>,
  extraNodes: number[] = [],
): { ok: true; graph: Graph } | { ok: false; error: string } {
  const nodeSet = new Set<number>(extraNodes);
  for (const key of Object.keys(adj)) nodeSet.add(Number(key));
  for (const neighbors of Object.values(adj)) {
    for (const v of neighbors) nodeSet.add(v);
  }
  if (nodeSet.size === 0) {
    return { ok: false, error: "Enter at least one node or edge." };
  }
  if (nodeSet.size > MAX_GRAPH_NODES) {
    return {
      ok: false,
      error: `Use at most ${MAX_GRAPH_NODES} nodes.`,
    };
  }
  for (const n of nodeSet) adj[n] ??= [];
  const nodes = [...nodeSet].sort((a, b) => a - b);
  return { ok: true, graph: { nodes, adj } };
}

function addUndirected(adj: Record<number, number[]>, a: number, b: number) {
  const aN = (adj[a] ??= []);
  const bN = (adj[b] ??= []);
  if (!aN.includes(b)) aN.push(b);
  if (!bN.includes(a)) bN.push(a);
}

export function parseGraphInput(
  raw: string,
): { ok: true; graph: Graph } | { ok: false; error: string } {
  const trimmed = raw.trim();
  if (!trimmed) {
    return { ok: false, error: "Enter an edge list or adjacency list." };
  }

  if (/^\d+$/.test(trimmed)) {
    const id = Number(trimmed);
    return { ok: true, graph: { nodes: [id], adj: { [id]: [] } } };
  }

  if (trimmed.includes(":")) {
    const adj: Record<number, number[]> = {};
    const entries = trimmed.split(/[;\n]+/).map((e) => e.trim()).filter(Boolean);
    for (const entry of entries) {
      const colon = entry.indexOf(":");
      if (colon < 0) {
        return { ok: false, error: `“${entry}” is not an adjacency entry.` };
      }
      const left = entry.slice(0, colon).trim();
      const right = entry.slice(colon + 1).trim();
      const node = parseNodeId(left);
      if (!node.ok) return node;
      const neighbors: number[] = [];
      if (right) {
        for (const token of right.split(/[\s,]+/).filter(Boolean)) {
          const n = parseNodeId(token);
          if (!n.ok) return n;
          if (!neighbors.includes(n.id)) neighbors.push(n.id);
        }
      }
      adj[node.id] = neighbors;
    }
    return finishGraph(adj);
  }

  const adj: Record<number, number[]> = {};
  const tokens = trimmed.split(/[\s,]+/).filter(Boolean);
  for (const token of tokens) {
    const match = token.match(/^(\d+)-(\d+)$/);
    if (!match) {
      return { ok: false, error: `“${token}” is not an edge like 0-1.` };
    }
    const a = Number(match[1]);
    const b = Number(match[2]);
    if (a === b) continue;
    addUndirected(adj, a, b);
  }
  return finishGraph(adj);
}

export function formatGraphInput(graph: Graph): string {
  const parts: string[] = [];
  const seen = new Set<string>();
  for (const u of graph.nodes) {
    for (const v of graph.adj[u] ?? []) {
      if (u >= v) continue;
      const key = `${u}-${v}`;
      if (seen.has(key)) continue;
      seen.add(key);
      parts.push(key);
    }
  }
  if (parts.length === 0 && graph.nodes.length === 1) {
    return String(graph.nodes[0]);
  }
  return parts.join(", ");
}
