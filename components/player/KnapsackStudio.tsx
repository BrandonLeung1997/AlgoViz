"use client";

import { useCallback, useState } from "react";
import { usePlayback } from "@/lib/playback/usePlayback";
import { generateKnapsackSteps } from "@/lib/algorithms/knapsack/generateSteps";
import { KNAPSACK_CODE } from "@/lib/algorithms/knapsack/code";
import { knapsackMeta } from "@/lib/algorithms/knapsack/meta";
import {
  formatKnapsackItems,
  parseCapacityInput,
  parseKnapsackItems,
  randomKnapsack,
  type KnapsackItem,
} from "@/lib/algorithms/knapsack/parseItems";
import { TableCanvas } from "@/components/player/TableCanvas";
import { ControlPanel } from "@/components/player/ControlPanel";
import { ArrayInput } from "@/components/player/ArrayInput";
import { CodePanel } from "@/components/player/CodePanel";
import { ExplanationPanel } from "@/components/player/ExplanationPanel";
import { ComplexityPanel } from "@/components/player/ComplexityPanel";

const DEFAULT_ITEMS: KnapsackItem[] = [
  { weight: 2, value: 3 },
  { weight: 3, value: 4 },
  { weight: 4, value: 5 },
];
const DEFAULT_CAPACITY = 8;

export function KnapsackStudio() {
  const [items, setItems] = useState<KnapsackItem[]>(DEFAULT_ITEMS);
  const [capacity, setCapacity] = useState(DEFAULT_CAPACITY);
  const [itemsText, setItemsText] = useState(formatKnapsackItems(DEFAULT_ITEMS));
  const [capacityText, setCapacityText] = useState(String(DEFAULT_CAPACITY));
  const [itemsError, setItemsError] = useState<string | null>(null);
  const [capacityError, setCapacityError] = useState<string | null>(null);

  const generateSteps = useCallback(
    () => generateKnapsackSteps(items, capacity),
    [items, capacity],
  );
  const playback = usePlayback(generateSteps, [0]);
  const [language, setLanguage] = useState<"python" | "javascript" | "cpp">(
    "python",
  );

  const applyItems = (raw: string) => {
    setItemsText(raw);
    const parsed = parseKnapsackItems(raw);
    if (!parsed.ok) {
      setItemsError(parsed.error);
      return;
    }
    setItemsError(null);
    setItems(parsed.items);
    setItemsText(formatKnapsackItems(parsed.items));
  };

  const applyCapacity = (raw: string) => {
    setCapacityText(raw);
    const parsed = parseCapacityInput(raw);
    if (!parsed.ok) {
      setCapacityError(parsed.error);
      return;
    }
    setCapacityError(null);
    setCapacity(parsed.value);
    setCapacityText(String(parsed.value));
  };

  const randomize = () => {
    const next = randomKnapsack();
    setItems(next.items);
    setCapacity(next.capacity);
    setItemsText(formatKnapsackItems(next.items));
    setCapacityText(String(next.capacity));
    setItemsError(null);
    setCapacityError(null);
  };

  return (
    <div className="mx-auto grid max-w-6xl gap-6 px-4 py-6 lg:grid-cols-[1.4fr_1fr]">
      <section className="space-y-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
            {knapsackMeta.title}
          </h1>
          <p className="mt-1 text-slate-600">{knapsackMeta.summary}</p>
        </div>
        <div className="rounded-lg border border-slate-200 bg-white p-4">
          <TableCanvas
            step={playback.step}
            resultLabel="Value"
            hint="dp[i][w] = best value using first i items with capacity w"
          />
        </div>
        <ControlPanel
          playing={playback.playing}
          speed={playback.speed}
          onPlay={playback.play}
          onPause={playback.pause}
          onStepForward={playback.stepForward}
          onStepBackward={playback.stepBackward}
          onReset={playback.reset}
          onRandomize={randomize}
          onSpeedChange={playback.setSpeed}
          disableBack={playback.index === 0}
          disableForward={playback.index >= playback.steps.length - 1}
        />
        <ArrayInput
          label="Items (weight:value)"
          value={itemsText}
          error={itemsError}
          onChange={setItemsText}
          onApply={applyItems}
          placeholder="e.g. 2:3, 3:4, 4:5"
        />
        <ArrayInput
          label="Capacity"
          value={capacityText}
          error={capacityError}
          onChange={setCapacityText}
          onApply={applyCapacity}
          placeholder="e.g. 8"
        />
        <p className="-mt-2 text-xs text-slate-500">
          Positive integers. Max 6 items and capacity 12. Each item is taken at
          most once (0/1).
        </p>
      </section>
      <aside className="space-y-4">
        <CodePanel
          lines={KNAPSACK_CODE[language]}
          activeLineId={playback.step?.codeLineId ?? "fn-def"}
          language={language}
          onLanguageChange={setLanguage}
        />
        <ExplanationPanel text={playback.step?.explanation ?? ""} />
        <ComplexityPanel meta={knapsackMeta} />
      </aside>
    </div>
  );
}
