import type { AlgorithmMeta } from "@/lib/algorithms/types";

export type ComplexityPanelProps = {
  meta: AlgorithmMeta;
};

export function ComplexityPanel({ meta }: ComplexityPanelProps) {
  return (
    <section className="rounded-lg border border-slate-200 bg-white p-4">
      <h2 className="mb-3 text-sm font-semibold text-slate-800">Complexity</h2>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-slate-200 text-slate-600">
              <th className="py-2 pr-4 font-medium">Case</th>
              <th className="py-2 pr-4 font-medium">Time</th>
              <th className="py-2 font-medium">Space</th>
            </tr>
          </thead>
          <tbody>
            {meta.complexity.map((row) => (
              <tr key={row.label} className="border-b border-slate-100">
                <td className="py-2 pr-4 font-medium text-slate-800">
                  {row.label}
                </td>
                <td className="py-2 pr-4 font-mono text-slate-700">{row.time}</td>
                <td className="py-2 font-mono text-slate-700">{row.space}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {meta.complexityNote ? (
        <p className="mt-3 text-xs leading-relaxed text-slate-600">
          {meta.complexityNote}
        </p>
      ) : null}
    </section>
  );
}
