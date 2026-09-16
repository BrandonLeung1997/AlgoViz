import Link from "next/link";
import type { AlgorithmMeta } from "@/lib/algorithms/types";

export function AlgorithmCard({ algo }: { algo: AlgorithmMeta }) {
  const inner = (
    <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm transition hover:border-sky-300">
      <div className="flex items-center justify-between gap-2">
        <h2 className="text-lg font-semibold text-slate-900">{algo.title}</h2>
        {algo.status === "coming-soon" && (
          <span className="text-xs font-medium uppercase tracking-wide text-slate-500">
            Coming soon
          </span>
        )}
      </div>
      <p className="mt-2 text-sm text-slate-600">{algo.summary}</p>
    </div>
  );

  if (algo.status !== "ready") {
    return <div className="opacity-70">{inner}</div>;
  }

  return <Link href={`/algorithms/${algo.slug}`}>{inner}</Link>;
}
