"use client";

import { Fragment } from "react";
import type { DpCell, Step } from "@/lib/algorithms/types";
import { cn } from "@/lib/utils";

export type TableCanvasProps = {
  step: Step | undefined;
};

function isCell(cell: DpCell | undefined, i: number, j: number): boolean {
  return cell?.i === i && cell?.j === j;
}

function cellClass(
  i: number,
  j: number,
  write: DpCell | undefined,
  reads: DpCell[] | undefined,
): string {
  if (isCell(write, i, j)) return "bg-sky-500 text-white";
  if (reads?.some((c) => isCell(c, i, j))) return "bg-amber-400 text-slate-900";
  if (i === 0 || j === 0) return "bg-slate-50 text-slate-500";
  return "bg-white text-slate-800";
}

export function TableCanvas({ step }: TableCanvasProps) {
  const table = step?.dpTable;
  const cells = table?.cells ?? [];
  const x = table?.x ?? "";
  const y = table?.y ?? "";
  const write = table?.write;
  const reads = table?.reads;
  const reconstructed = table?.reconstructed;
  const lcsLabel =
    reconstructed === undefined
      ? "—"
      : reconstructed.length === 0
        ? "(empty)"
        : reconstructed;
  const colCount = (cells[0]?.length ?? 0) + 1;

  return (
    <div>
      <div
        className="overflow-x-auto rounded-lg border border-slate-200 bg-white p-3"
        aria-label="DP table visualization"
      >
        {cells.length === 0 ? (
          <p className="py-16 text-center text-sm text-slate-500">
            No table to display
          </p>
        ) : (
          <div
            className="mx-auto grid w-fit gap-1"
            style={{
              gridTemplateColumns: `repeat(${colCount}, minmax(2.25rem, 2.25rem))`,
            }}
          >
            <div className="h-8" />
            <div className="flex h-8 items-center justify-center text-xs font-semibold text-slate-500">
              ε
            </div>
            {y.split("").map((ch, j) => (
              <div
                key={`y-${j}`}
                className="flex h-8 items-center justify-center text-xs font-semibold text-slate-700"
              >
                {ch}
              </div>
            ))}
            {cells.map((row, i) => (
              <Fragment key={`row-${i}`}>
                <div className="flex h-9 items-center justify-center text-xs font-semibold text-slate-700">
                  {i === 0 ? (
                    <span className="text-slate-500">ε</span>
                  ) : (
                    x[i - 1]
                  )}
                </div>
                {row.map((value, j) => (
                  <div
                    key={`c-${i}-${j}`}
                    className={cn(
                      "flex h-9 w-9 items-center justify-center rounded-md text-sm font-medium tabular-nums transition-colors duration-150",
                      cellClass(i, j, write, reads),
                    )}
                    title={`dp[${i}][${j}] = ${value}`}
                  >
                    {value}
                  </div>
                ))}
              </Fragment>
            ))}
          </div>
        )}
      </div>
      <div className="mt-3 text-center text-xs text-slate-600">
        LCS:{" "}
        <span className="font-mono font-medium text-slate-800">{lcsLabel}</span>
      </div>
      <p className="mt-2 text-center text-xs text-slate-500">
        <span className="font-semibold text-sky-600">write</span>
        {" · "}
        <span className="font-semibold text-amber-600">read</span>
        {" · "}
        dp[i][j] = LCS length of X[:i] and Y[:j] (row-major fill)
      </p>
    </div>
  );
}
