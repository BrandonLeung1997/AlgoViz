"use client";

import { useCallback, useState } from "react";
import { usePlayback } from "@/lib/playback/usePlayback";
import { generateCycleDetectionSteps } from "@/lib/algorithms/cycle-detection/generateSteps";
import { CYCLE_DETECTION_CODE } from "@/lib/algorithms/cycle-detection/code";
import { cycleDetectionMeta } from "@/lib/algorithms/cycle-detection/meta";
import {
  parseCycleIndex,
  parseListInput,
} from "@/lib/algorithms/parseInput";
import { randomListArray } from "@/lib/algorithms/randomArray";
import { MAX_LIST_LENGTH } from "@/lib/algorithms/types";
import { ListCanvas } from "@/components/player/ListCanvas";
import { ControlPanel } from "@/components/player/ControlPanel";
import { ArrayInput } from "@/components/player/ArrayInput";
import { CodePanel } from "@/components/player/CodePanel";
import { ExplanationPanel } from "@/components/player/ExplanationPanel";
import { ComplexityPanel } from "@/components/player/ComplexityPanel";

const DEFAULT_LIST = [1, 2, 3, 4];
const DEFAULT_CYCLE = 1;

export function CycleDetectionStudio() {
  const [values, setValues] = useState(DEFAULT_LIST);
  const [valuesText, setValuesText] = useState(DEFAULT_LIST.join(", "));
  const [listError, setListError] = useState<string | null>(null);
  const [cycleIndex, setCycleIndex] = useState<number | null>(DEFAULT_CYCLE);
  const [cycleText, setCycleText] = useState(String(DEFAULT_CYCLE));
  const [cycleError, setCycleError] = useState<string | null>(null);

  const generateSteps = useCallback(
    () => generateCycleDetectionSteps(values, cycleIndex),
    [values, cycleIndex],
  );
  const playback = usePlayback(generateSteps, [0]);
  const [language, setLanguage] = useState<"python" | "javascript" | "cpp">(
    "python",
  );

  const applyList = (raw: string) => {
    setValuesText(raw);
    const parsed = parseListInput(raw);
    if (!parsed.ok) {
      setListError(parsed.error);
      return;
    }
    setListError(null);
    setValues(parsed.values);
    setValuesText(parsed.values.join(", "));
    if (cycleIndex !== null && cycleIndex >= parsed.values.length) {
      setCycleIndex(null);
      setCycleText("");
      setCycleError(null);
    }
  };

  const applyCycle = (raw: string) => {
    setCycleText(raw);
    const parsed = parseCycleIndex(raw, values.length);
    if (!parsed.ok) {
      setCycleError(parsed.error);
      return;
    }
    setCycleError(null);
    setCycleIndex(parsed.value);
    setCycleText(parsed.value === null ? "" : String(parsed.value));
  };

  const randomize = () => {
    const next = randomListArray();
    const cyclic = Math.random() < 0.5 && next.length > 0;
    const nextCycle = cyclic ? Math.floor(next.length / 2) : null;
    setValues(next);
    setValuesText(next.join(", "));
    setListError(null);
    setCycleIndex(nextCycle);
    setCycleText(nextCycle === null ? "" : String(nextCycle));
    setCycleError(null);
  };

  return (
    <div className="mx-auto grid max-w-6xl gap-6 px-4 py-6 lg:grid-cols-[1.4fr_1fr]">
      <section className="space-y-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
            {cycleDetectionMeta.title}
          </h1>
          <p className="mt-1 text-slate-600">{cycleDetectionMeta.summary}</p>
        </div>
        <div className="rounded-lg border border-slate-200 bg-white p-4">
          <ListCanvas step={playback.step} />
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
          value={valuesText}
          error={listError}
          onChange={setValuesText}
          onApply={applyList}
          label="List values"
          placeholder="e.g. 1, 2, 3, 4"
        />
        <ArrayInput
          value={cycleText}
          error={cycleError}
          onChange={setCycleText}
          onApply={applyCycle}
          label="Tail links to index"
          placeholder="e.g. 1 — empty or none for acyclic"
        />
        <p className="-mt-2 text-xs text-slate-500">
          Comma-separated integers, max {MAX_LIST_LENGTH} nodes. Cycle index is
          0-based; leave it empty (or type none) for an acyclic list.
        </p>
      </section>
      <aside className="space-y-4">
        <CodePanel
          lines={CYCLE_DETECTION_CODE[language]}
          activeLineId={playback.step?.codeLineId ?? "fn-def"}
          language={language}
          onLanguageChange={setLanguage}
        />
        <ExplanationPanel text={playback.step?.explanation ?? ""} />
        <ComplexityPanel meta={cycleDetectionMeta} />
      </aside>
    </div>
  );
}
