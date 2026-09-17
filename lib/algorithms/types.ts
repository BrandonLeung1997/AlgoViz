export type HighlightKind =
  | "comparing"
  | "writing"
  | "sorted"
  | "activeRange"
  | "copy"
  | "low"
  | "mid"
  | "high"
  | "pivot"
  | "current"
  | "frontier"
  | "visited"
  | "treeEdge"
  | "relaxed"
  | "source";

export type Highlight = { index: number; kind: HighlightKind };

export type GraphEdge = { from: number; to: number; weight?: number };

export type Graph = {
  nodes: number[];
  adj: Record<number, number[]>;
  /** Undirected key `${min}-${max}` → weight. Missing means 1. */
  weights?: Record<string, number>;
  /** Directed key `${from}>${to}` → weight. Missing means 1. */
  directedWeights?: Record<string, number>;
};

export type GraphFrame = {
  nodes: number[];
  edges: GraphEdge[];
  source: number;
  current: number | null;
  frontier: number[];
  visited: number[];
  parent: Record<number, number | null>;
  path: number[];
  treeEdges: GraphEdge[];
  relaxedEdges: GraphEdge[];
  dist?: Record<number, number>;
};

export function undirectedEdgeKey(a: number, b: number): string {
  return a < b ? `${a}-${b}` : `${b}-${a}`;
}

export function directedEdgeKey(from: number, to: number): string {
  return `${from}>${to}`;
}

export function getEdgeWeight(graph: Graph, u: number, v: number): number {
  return graph.weights?.[undirectedEdgeKey(u, v)] ?? 1;
}

export function getDirectedEdgeWeight(graph: Graph, u: number, v: number): number {
  return graph.directedWeights?.[directedEdgeKey(u, v)] ?? 1;
}

export type DpCell = { i: number; j: number };

export type DpTableFrame = {
  x: string;
  y: string;
  cells: number[][];
  write?: DpCell;
  reads?: DpCell[];
  reconstructed?: string;
};

export type Step = {
  array: number[];
  highlights: Highlight[];
  range?: { low: number; mid?: number; high: number };
  graph?: GraphFrame;
  dpTable?: DpTableFrame;
  codeLineId: string;
  explanation: string;
};

export type CodeLine = { id: string; text: string };

export type ComplexityCase = {
  label: "Best" | "Average" | "Worst";
  time: string;
  space: string;
};

export type AlgorithmFamily = "sorting" | "searching" | "graphs" | "dp";

export type AlgorithmMeta = {
  slug: string;
  title: string;
  summary: string;
  status: "ready" | "coming-soon";
  family: AlgorithmFamily;
  complexity: ComplexityCase[];
  complexityNote: string;
};

export type PlaybackSpeed = 0.5 | 1 | 1.5 | 2 | 3 | 4;

export const BASE_STEP_MS = 700;
export const MAX_ARRAY_LENGTH = 16;
export const MAX_GRAPH_NODES = 12;
export const MAX_STRING_LENGTH = 10;
