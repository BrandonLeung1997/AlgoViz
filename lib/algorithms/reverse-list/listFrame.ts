import type { ListFrame, ListNodeFrame } from "@/lib/algorithms/types";

export function buildListNodes(values: number[]): ListNodeFrame[] {
  return values.map((value, id) => ({
    id,
    value,
    next: id < values.length - 1 ? id + 1 : null,
  }));
}

export function buildListFrame(values: number[]): ListFrame {
  const nodes = buildListNodes(values);
  return {
    nodes,
    head: nodes.length === 0 ? null : 0,
  };
}

export function cloneListNodes(nodes: ListNodeFrame[]): ListNodeFrame[] {
  return nodes.map((node) => ({ ...node }));
}

export function walkIds(
  nodes: ListNodeFrame[],
  start: number | null,
): number[] {
  const byId = new Map(nodes.map((node) => [node.id, node]));
  const ids: number[] = [];
  const seen = new Set<number>();
  let id = start;
  while (id !== null && !seen.has(id)) {
    seen.add(id);
    ids.push(id);
    id = byId.get(id)?.next ?? null;
  }
  return ids;
}
