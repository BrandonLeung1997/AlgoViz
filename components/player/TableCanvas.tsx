"use client";

import { Fragment } from "react";
import type { DpCell, DpTableFrame, Step } from "@/lib/algorithms/types";
import { cn } from "@/lib/utils";

export type TableCanvasProps = {
  step: Step | undefined;
  resultLabel?: string;
  hint?: string;
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

function columnHeaders(table: DpTableFrame): string[] {
  if (table.colLabels && table.colLabels.length > 0) return table.colLabels;
  return ["ε", ...table.y.split("")];
}

function rowHeader(table: DpTableFrame, i: number): string {
  if (table.rowLabels && table.rowLabels[i] !== undefined) {
    return table.rowLabels[i]!;
  }
  return i === 0 ? "ε" : (table.x[i - 1] ?? "");
}

function formatCellValue(value: number): string {
  return Number.isFinite(value) ? String(value) : "∞";
}

export function TableCanvas({ step, resultLabel, hint }: TableCanvasProps) {
  const table = step?.dpTable;
  const cells = table?.cells ?? [];
  const x = table?.x ?? "";
  const y = table?.y ?? "";
  const write = table?.write;
  const reads = table?.reads;
  const reconstructed = table?.reconstructed;
  const footerLabel = resultLabel ?? table?.resultLabel ?? "LCS";
  const resultValue =
    reconstructed === undefined
      ? "—"
      : reconstructed.length === 0
        ? "(empty)"
        : reconstructed;
  const caption =
    hint ??
    "dp[i][j] = LCS length of X[:i] and Y[:j] (row-major fill)";
  const dataCols = cells[0]?.length ?? 0;
  const customRowLabels = Boolean(table?.rowLabels?.length);
  const headers = table ? columnHeaders(table) : ["ε", ...y.split("")];
  const firstCol = customRowLabels
    ? "minmax(4.75rem, max-content)"
    : "minmax(2.25rem, 2.25rem)";

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
              gridTemplateColumns: `${firstCol} repeat(${dataCols}, minmax(2.25rem, 2.25rem))`,
            }}
          >
            <div className="h-8" />
            {headers.map((label, j) => (
              <div
                key={`y-${j}`}
                className="flex h-8 items-center justify-center text-xs font-semibold text-slate-700"
              >
                {label === "ε" ? (
                  <span className="text-slate-500">ε</span>
                ) : (
                  label
                )}
              </div>
            ))}
            {cells.map((row, i) => {
              const label = table ? rowHeader(table, i) : i === 0 ? "ε" : x[i - 1];
              return (
                <Fragment key={`row-${i}`}>
                  <div
                    className={cn(
                      "flex h-9 items-center justify-center font-semibold text-slate-700",
                      customRowLabels
                        ? "px-0.5 text-center text-[11px] leading-tight"
                        : "text-xs",
                    )}
                  >
                    {i === 0 || label === "ε" ? (
                      <span className="text-slate-500">{label || "ε"}</span>
                    ) : (
                      label
                    )}
                  </div>
                  {row.map((value, j) => (
                    <div
                      key={`c-${i}-${j}`}
                      className={cn(
                        "flex h-9 w-9 items-center justify-center rounded-md text-sm font-medium tabular-nums transition-colors duration-150",
                        cellClass(i, j, write, reads),
                      )}
                      title={`dp[${i}][${j}] = ${formatCellValue(value)}`}
                    >
                      {formatCellValue(value)}
                    </div>
                  ))}
                </Fragment>
              );
            })}
          </div>
        )}
      </div>
      <div className="mt-3 text-center text-xs text-slate-600">
        {footerLabel}:{" "}
        <span className="font-mono font-medium text-slate-800">{resultValue}</span>
      </div>
      <p className="mt-2 text-center text-xs text-slate-500">
        <span className="font-semibold text-sky-600">write</span>
        {" · "}
        <span className="font-semibold text-amber-600">read</span>
        {" · "}
        {caption}
      </p>
    </div>
  );
}
