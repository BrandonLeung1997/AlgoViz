"use client";

import { motion } from "framer-motion";
import type { HighlightKind, Step } from "@/lib/algorithms/types";
import { cn } from "@/lib/utils";

const KIND_CLASS: Record<HighlightKind, string> = {
  comparing: "bg-amber-400",
  writing: "bg-sky-500",
  copy: "bg-sky-500",
  sorted: "bg-green-600",
  activeRange: "bg-sky-300",
  low: "bg-sky-600",
  mid: "bg-amber-400",
  high: "bg-sky-800",
};

const KIND_PRIORITY: HighlightKind[] = [
  "writing",
  "copy",
  "sorted",
  "comparing",
  "mid",
  "low",
  "high",
  "activeRange",
];

function barClass(index: number, highlights: Step["highlights"]): string {
  const atIndex = highlights.filter((h) => h.index === index);
  if (atIndex.length === 0) return "bg-slate-700";
  let best: HighlightKind = atIndex[0]!.kind;
  for (const kind of KIND_PRIORITY) {
    if (atIndex.some((h) => h.kind === kind)) {
      best = kind;
      break;
    }
  }
  return KIND_CLASS[best];
}

export type ArrayCanvasProps = {
  step: Step | undefined;
  showPointers?: boolean;
};

function pointerTags(index: number, range: Step["range"]): string | null {
  if (!range) return null;
  const tags: string[] = [];
  if (index === range.low) tags.push("L");
  if (range.mid !== undefined && index === range.mid) tags.push("M");
  if (index === range.high) tags.push("H");
  return tags.length > 0 ? tags.join("/") : null;
}

export function ArrayCanvas({ step, showPointers = false }: ArrayCanvasProps) {
  const array = step?.array ?? [];
  const highlights = step?.highlights ?? [];
  const maxVal = Math.max(...array, 1);

  return (
    <div>
      <div
        className="flex min-h-[220px] items-end justify-center gap-1.5 rounded-lg border border-slate-200 bg-white p-4"
        aria-label="Array visualization"
      >
        {array.length === 0 ? (
          <p className="text-sm text-slate-500">No array to display</p>
        ) : (
          array.map((value, index) => (
            <div
              key={index}
              className="flex flex-col items-center gap-1"
              style={{ width: `${100 / array.length}%`, maxWidth: 48 }}
            >
              <motion.div
                layout
                transition={{ type: "spring", stiffness: 400, damping: 30 }}
                className={cn(
                  "w-full min-w-[12px] rounded-t-md",
                  barClass(index, highlights),
                )}
                style={{ height: `${(value / maxVal) * 160}px` }}
                title={`Index ${index}: ${value}`}
              />
              <span className="text-xs tabular-nums text-slate-600">{value}</span>
              {showPointers ? (
                <span className="h-4 text-[10px] font-semibold text-sky-700">
                  {pointerTags(index, step?.range) ?? "\u00a0"}
                </span>
              ) : null}
            </div>
          ))
        )}
      </div>
      {showPointers ? (
        <p className="mt-2 text-center text-xs text-slate-500">
          <span className="font-semibold text-sky-700">L</span> low
          {" · "}
          <span className="font-semibold text-amber-600">M</span> mid
          {" · "}
          <span className="font-semibold text-sky-800">H</span> high
        </p>
      ) : null}
    </div>
  );
}
