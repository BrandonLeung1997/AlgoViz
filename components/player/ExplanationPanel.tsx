export type ExplanationPanelProps = {
  text: string;
};

export function ExplanationPanel({ text }: ExplanationPanelProps) {
  return (
    <section className="rounded-lg border border-slate-200 bg-white p-4">
      <h2 className="mb-2 text-sm font-semibold text-slate-800">
        Step explanation
      </h2>
      <p className="text-sm leading-relaxed text-slate-700">{text}</p>
    </section>
  );
}
