"use client";

import { useCallback, useState } from "react";
import { usePlayback } from "@/lib/playback/usePlayback";
import { generateLinearSearchSteps } from "@/lib/algorithms/linear-search/generateSteps";
import { LINEAR_SEARCH_CODE } from "@/lib/algorithms/linear-search/code";
import { linearSearchMeta } from "@/lib/algorithms/linear-search/meta";
import { parseTargetInput } from "@/lib/algorithms/parseInput";
import { randomArray } from "@/lib/algorithms/randomArray";
import { ArrayCanvas } from "@/components/player/ArrayCanvas";
import { ControlPanel } from "@/components/player/ControlPanel";
import { ArrayInput } from "@/components/player/ArrayInput";
import { CodePanel } from "@/components/player/CodePanel";
import { ExplanationPanel } from "@/components/player/ExplanationPanel";
import { ComplexityPanel } from "@/components/player/ComplexityPanel";

const DEFAULT_ARRAY = [9, 3, 1, 7, 5, 11, 4];
const DEFAULT_TARGET = 3;

export function LinearSearchStudio() {
  const [target, setTarget] = useState(DEFAULT_TARGET);
  const [targetText, setTargetText] = useState(String(DEFAULT_TARGET));
  const [targetError, setTargetError] = useState<string | null>(null);
  const generateSteps = useCallback(
    (input: number[]) => generateLinearSearchSteps(input, target),
    [target],
  );
  const playback = usePlayback(generateSteps, DEFAULT_ARRAY);
  const [language, setLanguage] = useState<"python" | "javascript" | "cpp">(
    "python",
  );

  const applyTarget = (raw: string) => {
    setTargetText(raw);
    const parsed = parseTargetInput(raw);
    if (!parsed.ok) {
      setTargetError(parsed.error);
      return;
    }
    setTargetError(null);
    setTarget(parsed.value);
    setTargetText(String(parsed.value));
  };

  const randomize = () => {
    const next = randomArray(10);
    const nextTarget = next[Math.floor(Math.random() * next.length)]!;
    setTarget(nextTarget);
    setTargetText(String(nextTarget));
    setTargetError(null);
    playback.applyInputText(next.join(", "));
  };

  return (
    <div className="mx-auto grid max-w-6xl gap-6 px-4 py-6 lg:grid-cols-[1.4fr_1fr]">
      <section className="space-y-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
            {linearSearchMeta.title}
          </h1>
          <p className="mt-1 text-slate-600">{linearSearchMeta.summary}</p>
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
          onRandomize={randomize}
          onSpeedChange={playback.setSpeed}
          disableBack={playback.index === 0}
          disableForward={playback.index >= playback.steps.length - 1}
        />
        <ArrayInput
          value={playback.inputText}
          error={playback.inputError}
          onChange={playback.setInputText}
          onApply={playback.applyInputText}
          placeholder="e.g. 9, 3, 1, 7, 5"
        />
        <p className="-mt-2 text-xs text-slate-500">
          Array is kept as entered — linear search does not sort. Amber is the
          index being compared; green is the first match.
        </p>
        <ArrayInput
          label="Target"
          value={targetText}
          error={targetError}
          onChange={setTargetText}
          onApply={applyTarget}
          placeholder="e.g. 3"
        />
      </section>
      <aside className="space-y-4">
        <CodePanel
          lines={LINEAR_SEARCH_CODE[language]}
          activeLineId={playback.step?.codeLineId ?? "fn-def"}
          language={language}
          onLanguageChange={setLanguage}
        />
        <ExplanationPanel text={playback.step?.explanation ?? ""} />
        <ComplexityPanel meta={linearSearchMeta} />
      </aside>
    </div>
  );
}
