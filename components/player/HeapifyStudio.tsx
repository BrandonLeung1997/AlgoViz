"use client";

import { useState } from "react";
import { usePlayback } from "@/lib/playback/usePlayback";
import { generateHeapifySteps } from "@/lib/algorithms/heapify/generateSteps";
import { HEAPIFY_CODE } from "@/lib/algorithms/heapify/code";
import { heapifyMeta } from "@/lib/algorithms/heapify/meta";
import { parseHeapInput } from "@/lib/algorithms/parseInput";
import { randomHeapArray } from "@/lib/algorithms/randomArray";
import { MAX_HEAP_SIZE } from "@/lib/algorithms/types";
import { HeapCanvas } from "@/components/player/HeapCanvas";
import { ControlPanel } from "@/components/player/ControlPanel";
import { ArrayInput } from "@/components/player/ArrayInput";
import { CodePanel } from "@/components/player/CodePanel";
import { ExplanationPanel } from "@/components/player/ExplanationPanel";
import { ComplexityPanel } from "@/components/player/ComplexityPanel";

const DEFAULT_HEAP = [8, 3, 5, 1, 9, 2, 7, 4];

export function HeapifyStudio() {
  const playback = usePlayback(generateHeapifySteps, DEFAULT_HEAP);
  const [language, setLanguage] = useState<"python" | "javascript" | "cpp">(
    "python",
  );
  const [heapError, setHeapError] = useState<string | null>(null);

  const applyInput = (raw: string) => {
    playback.setInputText(raw);
    const parsed = parseHeapInput(raw);
    if (!parsed.ok) {
      setHeapError(parsed.error);
      return;
    }
    setHeapError(null);
    playback.applyInputText(raw);
  };

  const randomize = () => {
    setHeapError(null);
    playback.applyInputText(randomHeapArray().join(", "));
  };

  return (
    <div className="mx-auto grid max-w-6xl gap-6 px-4 py-6 lg:grid-cols-[1.4fr_1fr]">
      <section className="space-y-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
            {heapifyMeta.title}
          </h1>
          <p className="mt-1 text-slate-600">{heapifyMeta.summary}</p>
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
          value={playback.inputText}
          error={heapError}
          onChange={playback.setInputText}
          onApply={applyInput}
        />
        <p className="-mt-2 text-xs text-slate-500">
          Comma-separated integers. Max {MAX_HEAP_SIZE} values so the tree stays
          readable.
        </p>
      </section>
      <aside className="space-y-4">
        <CodePanel
          lines={HEAPIFY_CODE[language]}
          activeLineId={playback.step?.codeLineId ?? "fn-def"}
          language={language}
          onLanguageChange={setLanguage}
        />
        <ExplanationPanel text={playback.step?.explanation ?? ""} />
        <ComplexityPanel meta={heapifyMeta} />
      </aside>
    </div>
  );
}
