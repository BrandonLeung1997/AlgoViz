"use client";

import type { Step } from "@/lib/algorithms/types";
import { cn } from "@/lib/utils";

export type HashCanvasProps = {
  step: Step | undefined;
};

export function HashCanvas({ step }: HashCanvasProps) {
  const hash = step?.hash;
  if (!hash || hash.bucketCount === 0) {
    return (
      <p className="py-16 text-center text-sm text-slate-500">
        No table to display
      </p>
    );
  }

  const {
    bucketCount,
    hashIndex,
    current,
    found,
    key,
    status,
  } = hash;
  const buckets = hash.buckets ?? [];

  return (
    <div>
      <p className="text-center text-sm text-slate-600">
        hash(k) = k % m
        {key !== undefined && hashIndex !== undefined
          ? `  ·  k = ${key} → bucket ${hashIndex}`
          : null}
      </p>
      {status ? (
        <p className="mt-1 text-center text-xs text-slate-500">{status}</p>
      ) : null}
      <div className="mt-3 space-y-2" aria-label="Hash table">
        {Array.from({ length: bucketCount }, (_, i) => {
          const chain = buckets[i] ?? [];
          const rowActive = hashIndex === i;
          return (
            <div
              key={i}
              aria-label={`bucket ${i}`}
              className={cn(
                "flex items-center gap-2 rounded-md px-2 py-1",
                rowActive && "bg-sky-50",
              )}
            >
              <span
                className={cn(
                  "w-6 shrink-0 text-right font-mono text-sm",
                  rowActive ? "font-semibold text-sky-700" : "text-slate-500",
                )}
              >
                {i}
              </span>
              {chain.length === 0 ? (
                <span className="rounded border border-dashed border-slate-300 px-2 py-1 text-xs text-slate-400">
                  ∅
                </span>
              ) : (
                chain.map((value, offset) => {
                  const isCurrent =
                    current?.bucket === i && current.offset === offset;
                  const isFound = isCurrent && found === true;
                  return (
                    <div
                      key={`${i}-${offset}`}
                      className="flex items-center gap-2"
                    >
                      {offset > 0 ? (
                        <span className="text-slate-400" aria-hidden>
                          →
                        </span>
                      ) : null}
                      <span
                        className={cn(
                          "flex h-10 w-10 items-center justify-center rounded-md font-mono text-sm text-white",
                          isFound
                            ? "bg-green-500"
                            : isCurrent
                              ? "bg-amber-400 text-slate-900"
                              : "bg-slate-700",
                        )}
                      >
                        {value}
                      </span>
                    </div>
                  );
                })
              )}
            </div>
          );
        })}
      </div>
      <p className="mt-3 text-center text-xs text-slate-500">
        hash bucket · current · found
      </p>
    </div>
  );
}
