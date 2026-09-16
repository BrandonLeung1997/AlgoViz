"use client";

import { Button } from "@/components/ui/button";

export type ArrayInputProps = {
  value: string;
  error: string | null;
  onChange: (value: string) => void;
  onApply: (value: string) => void;
};

export function ArrayInput({ value, error, onChange, onApply }: ArrayInputProps) {
  const apply = () => onApply(value);

  return (
    <div className="rounded-lg border border-slate-200 bg-white p-3">
      <label className="mb-1.5 block text-sm font-medium text-slate-800">
        Array input
      </label>
      <div className="flex flex-wrap gap-2">
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onBlur={apply}
          onKeyDown={(e) => {
            if (e.key === "Enter") apply();
          }}
          placeholder="e.g. 8, 3, 5, 1, 9"
          className="min-w-[200px] flex-1 rounded-md border border-slate-200 px-3 py-2 text-sm text-slate-900 outline-none focus-visible:border-sky-500 focus-visible:ring-2 focus-visible:ring-sky-500/30"
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? "array-input-error" : undefined}
        />
        <Button type="button" variant="secondary" onClick={apply}>
          Apply
        </Button>
      </div>
      {error ? (
        <p id="array-input-error" className="mt-2 text-sm text-red-600">
          {error}
        </p>
      ) : null}
    </div>
  );
}
