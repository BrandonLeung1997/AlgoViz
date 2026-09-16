"use client";

import { useState } from "react";
import { usePlayback } from "@/lib/playback/usePlayback";
import { generateMergeSortSteps } from "@/lib/algorithms/merge-sort/generateSteps";
import { MERGE_SORT_CODE } from "@/lib/algorithms/merge-sort/code";
import { mergeSortMeta } from "@/lib/algorithms/merge-sort/meta";
import { ArrayCanvas } from "@/components/player/ArrayCanvas";
import { ControlPanel } from "@/components/player/ControlPanel";
import { ArrayInput } from "@/components/player/ArrayInput";
import { CodePanel } from "@/components/player/CodePanel";
import { ExplanationPanel } from "@/components/player/ExplanationPanel";
import { ComplexityPanel } from "@/components/player/ComplexityPanel";

export function MergeSortStudio() {
  const playback = usePlayback(generateMergeSortSteps);
  const [language, setLanguage] = useState<"python" | "javascript" | "cpp">(
    "python",
  );

  return (
    <div className="mx-auto grid max-w-6xl gap-6 px-4 py-6 lg:grid-cols-[1.4fr_1fr]">
      <section className="space-y-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
            {mergeSortMeta.title}
          </h1>
          <p className="mt-1 text-slate-600">{mergeSortMeta.summary}</p>
        </div>
        <div className="rounded-lg border border-slate-200 bg-white p-4">
          <ArrayCanvas step={playback.step} />
        </div>
        <ControlPanel
          playing={playback.playing}
          speed={playback.speed}
          onPlay={playback.play}
          onPause={playback.pause}
          onStepForward={playback.stepForward}
          onStepBackward={playback.stepBackward}
          onReset={playback.reset}
          onRandomize={playback.randomize}
          onSpeedChange={playback.setSpeed}
          disableBack={playback.index === 0}
          disableForward={playback.index >= playback.steps.length - 1}
        />
        <ArrayInput
          value={playback.inputText}
          error={playback.inputError}
          onChange={playback.setInputText}
          onApply={playback.applyInputText}
        />
      </section>
      <aside className="space-y-4">
        <CodePanel
          lines={MERGE_SORT_CODE[language]}
          activeLineId={playback.step?.codeLineId ?? "fn-def"}
          language={language}
          onLanguageChange={setLanguage}
        />
        <ExplanationPanel text={playback.step?.explanation ?? ""} />
        <ComplexityPanel meta={mergeSortMeta} />
      </aside>
    </div>
  );
}
