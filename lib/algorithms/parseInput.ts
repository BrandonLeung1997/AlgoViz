import {
  MAX_ARRAY_LENGTH,
  MAX_GRAPH_NODES,
  MAX_STRING_LENGTH,
  getEdgeWeight,
  undirectedEdgeKey,
  type Graph,
} from "@/lib/algorithms/types";

const NEGATIVE_WEIGHT_ERROR =
  "Negative edge weights are not allowed (Dijkstra needs non-negative weights).";

export { MAX_ARRAY_LENGTH, MAX_GRAPH_NODES, MAX_STRING_LENGTH };

export function parseStringInput(
  raw: string,
): { ok: true; value: string } | { ok: false; error: string } {
  if (raw.length > 0 && raw.trim().length === 0) {
    return { ok: false, error: "Use letters and digits only (no spaces)." };
  }
  const value = raw.trim();
  if (value.length > MAX_STRING_LENGTH) {
    return {
      ok: false,
      error: `Use at most ${MAX_STRING_LENGTH} characters.`,
    };
  }
  if (!/^[A-Za-z0-9]*$/.test(value)) {
    return {
      ok: false,
      error: "Use letters and digits only (A–Z, a–z, 0–9).",
    };
  }
  return { ok: true, value };
}

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

function parseWeight(
  raw: string,
): { ok: true; value: number } | { ok: false; error: string } {
  if (!/^-?\d+$/.test(raw)) {
    return { ok: false, error: `“${raw}” is not an integer weight.` };
  }
  const value = Number(raw);
  if (value < 0) {
    return { ok: false, error: NEGATIVE_WEIGHT_ERROR };
  }
  return { ok: true, value };
}

function finishGraph(
  adj: Record<number, number[]>,
  extraNodes: number[] = [],
  weights?: Record<string, number>,
  keepWeights = false,
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
  const hasNonDefault =
    keepWeights && weights && Object.values(weights).some((w) => w !== 1);
  return {
    ok: true,
    graph: hasNonDefault ? { nodes, adj, weights } : { nodes, adj },
  };
}

function setUndirectedWeight(
  weights: Record<string, number>,
  a: number,
  b: number,
  weight: number,
): { ok: false; error: string } | null {
  const key = undirectedEdgeKey(a, b);
  if (weights[key] !== undefined && weights[key] !== weight) {
    return { ok: false, error: `Conflicting weights for edge ${key}.` };
  }
  weights[key] = weight;
  return null;
}

function addUndirected(
  adj: Record<number, number[]>,
  a: number,
  b: number,
  weights: Record<string, number>,
  weight: number,
): { ok: false; error: string } | null {
  const aN = (adj[a] ??= []);
  const bN = (adj[b] ??= []);
  if (!aN.includes(b)) aN.push(b);
  if (!bN.includes(a)) bN.push(a);
  return setUndirectedWeight(weights, a, b, weight);
}

function parseNeighborToken(
  token: string,
):
  | { ok: true; id: number; weight: number; explicit: boolean }
  | { ok: false; error: string } {
  const simple = parseNodeId(token);
  if (simple.ok) {
    return { ok: true, id: simple.id, weight: 1, explicit: false };
  }
  const match = token.match(/^(\d+):(-?\d+)$/);
  if (!match) {
    return { ok: false, error: `“${token}” is not a neighbor like 1 or 1:4.` };
  }
  const weight = parseWeight(match[2]!);
  if (!weight.ok) return weight;
  return { ok: true, id: Number(match[1]), weight: weight.value, explicit: true };
}

const DIRECTED_EDGE_ERROR =
  "Use 0>1 or 0->1 for directed edges. 0-1 is undirected (both directions) and would break Kahn’s algorithm.";

function addDirected(
  adj: Record<number, number[]>,
  a: number,
  b: number,
): void {
  const aN = (adj[a] ??= []);
  adj[b] ??= [];
  if (!aN.includes(b)) aN.push(b);
}

function parseDirectedEdgeList(
  trimmed: string,
): { ok: true; graph: Graph } | { ok: false; error: string } {
  const edgeRe = /(\d+)\s*(?:->|>)\s*(\d+)/g;
  const matches = [...trimmed.matchAll(edgeRe)];
  if (matches.length === 0) {
    return {
      ok: false,
      error: `“${trimmed}” is not a directed edge like 0>1 or 0->1.`,
    };
  }
  edgeRe.lastIndex = 0;
  const leftover = trimmed.replace(edgeRe, " ").replace(/[\s,;]+/g, "");
  if (leftover) {
    return {
      ok: false,
      error: `“${leftover}” is not a directed edge like 0>1 or 0->1.`,
    };
  }

  const adj: Record<number, number[]> = {};
  for (const match of matches) {
    addDirected(adj, Number(match[1]), Number(match[2]));
  }
  return finishGraph(adj);
}

function parseEdgeList(
  trimmed: string,
): { ok: true; graph: Graph } | { ok: false; error: string } {
  const edgeRe = /(\d+)-(\d+)(?:\s*(?::(-?\d+)|\((-?\d+)\)))?/g;
  const matches = [...trimmed.matchAll(edgeRe)];
  if (matches.length === 0) {
    return { ok: false, error: `“${trimmed}” is not an edge like 0-1.` };
  }
  edgeRe.lastIndex = 0;
  const leftover = trimmed.replace(edgeRe, " ").replace(/[\s,;]+/g, "");
  if (leftover) {
    return { ok: false, error: `“${leftover}” is not an edge like 0-1.` };
  }

  const adj: Record<number, number[]> = {};
  const weights: Record<string, number> = {};
  let keepWeights = false;
  for (const match of matches) {
    const a = Number(match[1]);
    const b = Number(match[2]);
    const wRaw = match[3] ?? match[4];
    let weight = 1;
    if (wRaw !== undefined) {
      const parsed = parseWeight(wRaw);
      if (!parsed.ok) return parsed;
      weight = parsed.value;
      keepWeights = true;
    }
    if (a === b) continue;
    const conflict = addUndirected(adj, a, b, weights, weight);
    if (conflict) return conflict;
  }
  return finishGraph(adj, [], weights, keepWeights);
}

function parseAdjacencyList(
  trimmed: string,
): { ok: true; graph: Graph } | { ok: false; error: string } {
  const adj: Record<number, number[]> = {};
  const weights: Record<string, number> = {};
  let keepWeights = false;
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
        const n = parseNeighborToken(token);
        if (!n.ok) return n;
        if (n.explicit) keepWeights = true;
        if (!neighbors.includes(n.id)) neighbors.push(n.id);
        const conflict = setUndirectedWeight(weights, node.id, n.id, n.weight);
        if (conflict) return conflict;
      }
    }
    adj[node.id] = neighbors;
  }
  return finishGraph(adj, [], weights, keepWeights);
}

export type ParseGraphOptions = { directed?: boolean };

export function parseGraphInput(
  raw: string,
  options: ParseGraphOptions = {},
): { ok: true; graph: Graph } | { ok: false; error: string } {
  const trimmed = raw.trim();
  if (!trimmed) {
    return { ok: false, error: "Enter an edge list or adjacency list." };
  }

  if (options.directed) {
    if (/\d+-\d+/.test(trimmed)) {
      return { ok: false, error: DIRECTED_EDGE_ERROR };
    }
    if (/^\d+$/.test(trimmed)) {
      const id = Number(trimmed);
      return { ok: true, graph: { nodes: [id], adj: { [id]: [] } } };
    }
    if (/\d+\s*(?:->|>)\s*\d+/.test(trimmed)) {
      return parseDirectedEdgeList(trimmed);
    }
    if (trimmed.includes(":")) {
      return parseAdjacencyList(trimmed);
    }
    return parseDirectedEdgeList(trimmed);
  }

  if (/^\d+$/.test(trimmed)) {
    const id = Number(trimmed);
    return { ok: true, graph: { nodes: [id], adj: { [id]: [] } } };
  }

  if (/\d+-\d+/.test(trimmed)) {
    return parseEdgeList(trimmed);
  }

  if (trimmed.includes(":")) {
    return parseAdjacencyList(trimmed);
  }

  return parseEdgeList(trimmed);
}

export type FormatGraphOptions = { directed?: boolean };

export function formatGraphInput(
  graph: Graph,
  options: FormatGraphOptions = {},
): string {
  if (options.directed) {
    const parts: string[] = [];
    const seen = new Set<number>();
    for (const u of graph.nodes) {
      for (const v of graph.adj[u] ?? []) {
        parts.push(`${u}>${v}`);
        seen.add(u);
        seen.add(v);
      }
    }
    const isolated = graph.nodes.filter((n) => !seen.has(n));
    if (parts.length === 0 && graph.nodes.length === 1) {
      return String(graph.nodes[0]);
    }
    if (isolated.length > 0) {
      return graph.nodes
        .map((u) => `${u}:${(graph.adj[u] ?? []).join(",")}`)
        .join("; ");
    }
    return parts.join(", ");
  }

  const parts: string[] = [];
  const seen = new Set<string>();
  for (const u of graph.nodes) {
    for (const v of graph.adj[u] ?? []) {
      if (u >= v) continue;
      const key = `${u}-${v}`;
      if (seen.has(key)) continue;
      seen.add(key);
      const weight = getEdgeWeight(graph, u, v);
      parts.push(weight !== 1 ? `${key}:${weight}` : key);
    }
  }
  if (parts.length === 0 && graph.nodes.length === 1) {
    return String(graph.nodes[0]);
  }
  return parts.join(", ");
}
