"use client";

import { useCallback, useState } from "react";
import { usePlayback } from "@/lib/playback/usePlayback";
import { generateExtractMaxSteps } from "@/lib/algorithms/extract-max/generateSteps";
import { EXTRACT_MAX_CODE } from "@/lib/algorithms/extract-max/code";
import { extractMaxMeta } from "@/lib/algorithms/extract-max/meta";
import { generateHeapifySteps } from "@/lib/algorithms/heapify/generateSteps";
import { parseHeapInput } from "@/lib/algorithms/parseInput";
import { randomHeapArray } from "@/lib/algorithms/randomArray";
import { MAX_HEAP_SIZE } from "@/lib/algorithms/types";
import { HeapCanvas } from "@/components/player/HeapCanvas";
import { ControlPanel } from "@/components/player/ControlPanel";
import { ArrayInput } from "@/components/player/ArrayInput";
import { CodePanel } from "@/components/player/CodePanel";
import { ExplanationPanel } from "@/components/player/ExplanationPanel";
import { ComplexityPanel } from "@/components/player/ComplexityPanel";

const DEFAULT_HEAP = [9, 5, 6, 1];

function isMaxHeap(values: number[]): boolean {
  for (let i = 0; i < values.length; i += 1) {
    const left = 2 * i + 1;
    const right = 2 * i + 2;
    if (left < values.length && values[i]! < values[left]!) return false;
    if (right < values.length && values[i]! < values[right]!) return false;
  }
  return true;
}

export function ExtractMaxStudio() {
  const [heap, setHeap] = useState<number[]>(DEFAULT_HEAP);
  const [heapText, setHeapText] = useState(DEFAULT_HEAP.join(", "));
  const [heapError, setHeapError] = useState<string | null>(null);

  const generateSteps = useCallback(
    () => generateExtractMaxSteps(heap),
    [heap],
  );
  const playback = usePlayback(generateSteps, [0]);
  const [language, setLanguage] = useState<"python" | "javascript" | "cpp">(
    "python",
  );

  const applyHeap = (raw: string) => {
    setHeapText(raw);
    const trimmed = raw.trim();
    if (!trimmed) {
      setHeapError(null);
      setHeap([]);
      setHeapText("");
      return;
    }
    const parsed = parseHeapInput(raw);
    if (!parsed.ok) {
      setHeapError(parsed.error);
      return;
    }
    if (!isMaxHeap(parsed.values)) {
      setHeapError("Array is not a max-heap");
      return;
    }
    setHeapError(null);
    setHeap(parsed.values);
    setHeapText(parsed.values.join(", "));
  };

  const randomize = () => {
    const raw = randomHeapArray();
    const built = generateHeapifySteps(raw);
    const nextHeap = built[built.length - 1]?.heap?.values ?? raw;
    setHeap(nextHeap);
    setHeapText(nextHeap.join(", "));
    setHeapError(null);
  };

  return (
    <div className="mx-auto grid max-w-6xl gap-6 px-4 py-6 lg:grid-cols-[1.4fr_1fr]">
      <section className="space-y-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
            {extractMaxMeta.title}
          </h1>
          <p className="mt-1 text-slate-600">{extractMaxMeta.summary}</p>
        </div>
        <div className="rounded-lg border border-slate-200 bg-white p-4">
          <HeapCanvas step={playback.step} />
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
          label="Max-heap"
          value={heapText}
          error={heapError}
          onChange={setHeapText}
          onApply={applyHeap}
          placeholder="e.g. 9, 5, 6, 1"
        />
        <p className="-mt-2 text-xs text-slate-500">
          Comma-separated integers that already form a max-heap. Max{" "}
          {MAX_HEAP_SIZE} values. Empty heap is allowed.
        </p>
      </section>
      <aside className="space-y-4">
        <CodePanel
          lines={EXTRACT_MAX_CODE[language]}
          activeLineId={playback.step?.codeLineId ?? "fn-def"}
          language={language}
          onLanguageChange={setLanguage}
        />
        <ExplanationPanel text={playback.step?.explanation ?? ""} />
        <ComplexityPanel meta={extractMaxMeta} />
      </aside>
    </div>
  );
}
