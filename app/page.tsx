import { AlgorithmCard } from "@/components/catalog/AlgorithmCard";
import {
  algorithms,
  FAMILY_ORDER,
  FAMILY_TITLES,
} from "@/lib/algorithms/registry";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-slate-100">
      <div className="mx-auto max-w-6xl px-4 py-10">
        <h1 className="text-3xl font-semibold tracking-tight text-slate-900">
          Learn algorithms by seeing them
        </h1>
        <p className="mt-2 max-w-2xl text-slate-600">
          Interactive visualizations with step-synced code and explanations.
        </p>
        <div className="mt-10 space-y-10">
          {FAMILY_ORDER.map((family) => {
            const items = algorithms.filter((algo) => algo.family === family);
            if (items.length === 0) return null;
            return (
              <section key={family}>
                <h2 className="mb-4 text-lg font-semibold text-slate-800">
                  {FAMILY_TITLES[family]}
                </h2>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {items.map((algo) => (
                    <AlgorithmCard key={algo.slug} algo={algo} />
                  ))}
                </div>
              </section>
            );
          })}
        </div>
      </div>
    </main>
  );
}
