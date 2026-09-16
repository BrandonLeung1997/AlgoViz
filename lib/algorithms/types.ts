export type HighlightKind =
  | "comparing"
  | "writing"
  | "sorted"
  | "activeRange"
  | "copy"
  | "low"
  | "mid"
  | "high";

export type Highlight = { index: number; kind: HighlightKind };

export type Step = {
  array: number[];
  highlights: Highlight[];
  range?: { low: number; mid?: number; high: number };
  codeLineId: string;
  explanation: string;
};

export type CodeLine = { id: string; text: string };

export type ComplexityCase = {
  label: "Best" | "Average" | "Worst";
  time: string;
  space: string;
};

export type AlgorithmMeta = {
  slug: string;
  title: string;
  summary: string;
  status: "ready" | "coming-soon";
  complexity: ComplexityCase[];
  complexityNote: string;
};

export type PlaybackSpeed = 0.5 | 1 | 1.5 | 2 | 3 | 4;

export const BASE_STEP_MS = 700;
export const MAX_ARRAY_LENGTH = 16;
