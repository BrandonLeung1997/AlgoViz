"use client";

import { motion } from "framer-motion";
import type { Highlight, HighlightKind, Step } from "@/lib/algorithms/types";
import { cn } from "@/lib/utils";

const VIEW = { w: 480, h: 260 };
const NODE_R = 18;

const KIND_FILL: Partial<Record<HighlightKind, string>> = {
  writing: "#0ea5e9",
  comparing: "#fbbf24",
  current: "#fbbf24",
};

const KIND_CLASS: Partial<Record<HighlightKind, string>> = {
  writing: "bg-sky-500 text-white",
  comparing: "bg-amber-400 text-slate-900",
  current: "bg-amber-400 text-slate-900",
};

const KIND_PRIORITY: HighlightKind[] = ["writing", "comparing", "current"];

function kindAt(index: number, highlights: Highlight[]): HighlightKind | null {
  const atIndex = highlights.filter((h) => h.index === index);
  if (atIndex.length === 0) return null;
  for (const kind of KIND_PRIORITY) {
    if (atIndex.some((h) => h.kind === kind)) return kind;
  }
  return atIndex[0]!.kind;
}

function layout(n: number) {
  if (n === 0) return [];
  const levels = Math.floor(Math.log2(n)) + 1;
  const padX = 28;
  const padY = 28;
  const usableW = VIEW.w - padX * 2;
  const usableH = VIEW.h - padY * 2;
  return Array.from({ length: n }, (_, i) => {
    const level = Math.floor(Math.log2(i + 1));
    const levelCount = 2 ** level;
    const indexInLevel = i - (levelCount - 1);
    const x = padX + ((indexInLevel + 0.5) / levelCount) * usableW;
    const y =
      levels === 1 ? padY + usableH / 2 : padY + (level / (levels - 1)) * usableH;
    return { i, x, y };
  });
}

export type HeapCanvasProps = {
  step: Step | undefined;
};

export function HeapCanvas({ step }: HeapCanvasProps) {
  const heap = step?.heap;
  const values = heap?.values ?? [];
  const heapSize = heap?.heapSize ?? values.length;
  const highlights = heap?.highlights ?? [];
  const positions = layout(values.length);
  const pos = new Map(positions.map((p) => [p.i, p]));

  return (
    <div>
      <div
        className="rounded-lg border border-slate-200 bg-white p-3"
        aria-label="Heap visualization"
      >
        {values.length === 0 ? (
          <p className="py-16 text-center text-sm text-slate-500">
            No heap to display
          </p>
        ) : (
          <svg
            viewBox={`0 0 ${VIEW.w} ${VIEW.h}`}
            className="mx-auto h-[260px] w-full max-w-[520px]"
            role="img"
          >
            {positions.flatMap(({ i, x, y }) => {
              const children = [2 * i + 1, 2 * i + 2].filter(
                (c) => c < values.length,
              );
              return children.map((c) => {
                const child = pos.get(c)!;
                const inHeap = i < heapSize && c < heapSize;
                return (
                  <line
                    key={`${i}-${c}`}
                    x1={x}
                    y1={y + NODE_R}
                    x2={child.x}
                    y2={child.y - NODE_R}
                    stroke={inHeap ? "#cbd5e1" : "#e2e8f0"}
                    strokeWidth={2}
                    opacity={inHeap ? 1 : 0.45}
                  />
                );
              });
            })}
            {positions.map(({ i, x, y }) => {
              const kind = kindAt(i, highlights);
              const inHeap = i < heapSize;
              const fill = kind ? (KIND_FILL[kind] ?? "#334155") : "#334155";
              const labelFill =
                kind === "comparing" || kind === "current" ? "#0f172a" : "#ffffff";
              return (
                <g key={i} opacity={inHeap ? 1 : 0.4}>
                  <motion.circle
                    cx={x}
                    cy={y}
                    r={NODE_R}
                    initial={false}
                    fill={fill}
                    animate={{ fill }}
                    transition={{ duration: 0.2 }}
                    stroke={kind === "current" ? "#b45309" : "#e2e8f0"}
                    strokeWidth={kind === "current" ? 3 : 2}
                  />
                  <text
                    x={x}
                    y={y}
                    textAnchor="middle"
                    dominantBaseline="central"
                    fontSize={14}
                    fontWeight={600}
                    fill={labelFill}
                  >
                    {values[i]}
                  </text>
                </g>
              );
            })}
          </svg>
        )}
        {values.length > 0 ? (
          <div
            className="mt-3 flex flex-wrap items-end justify-center gap-1.5"
            aria-label="Heap array"
          >
            {values.map((value, index) => {
              const kind = kindAt(index, highlights);
              const inHeap = index < heapSize;
              return (
                <div
                  key={index}
                  className={cn(
                    "flex min-w-[2.25rem] flex-col items-center rounded-md px-2 py-1",
                    kind
                      ? KIND_CLASS[kind]
                      : "bg-slate-700 text-white",
                    !inHeap && "opacity-40",
                  )}
                >
                  <span className="text-[10px] tabular-nums opacity-80">
                    {index}
                  </span>
                  <span className="text-sm font-semibold tabular-nums">
                    {value}
                  </span>
                </div>
              );
            })}
          </div>
        ) : null}
      </div>
      <p className="mt-2 text-center text-xs text-slate-500">
        <span className="font-semibold text-amber-600">comparing</span>
        {" · "}
        <span className="font-semibold text-sky-600">swapping</span>
        {" · "}
        <span className="font-semibold text-amber-700">current node</span>
      </p>
    </div>
  );
}
