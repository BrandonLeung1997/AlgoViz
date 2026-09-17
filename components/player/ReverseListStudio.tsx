"use client";

import { useState } from "react";
import { usePlayback } from "@/lib/playback/usePlayback";
import { generateReverseListSteps } from "@/lib/algorithms/reverse-list/generateSteps";
import { REVERSE_LIST_CODE } from "@/lib/algorithms/reverse-list/code";
import { reverseListMeta } from "@/lib/algorithms/reverse-list/meta";
import { parseListInput } from "@/lib/algorithms/parseInput";
import { randomListArray } from "@/lib/algorithms/randomArray";
import { MAX_LIST_LENGTH } from "@/lib/algorithms/types";
import { ListCanvas } from "@/components/player/ListCanvas";
import { ControlPanel } from "@/components/player/ControlPanel";
import { ArrayInput } from "@/components/player/ArrayInput";
import { CodePanel } from "@/components/player/CodePanel";
import { ExplanationPanel } from "@/components/player/ExplanationPanel";
import { ComplexityPanel } from "@/components/player/ComplexityPanel";

const DEFAULT_LIST = [1, 2, 3, 4];

export function ReverseListStudio() {
  const playback = usePlayback(generateReverseListSteps, DEFAULT_LIST);
  const [language, setLanguage] = useState<"python" | "javascript" | "cpp">(
    "python",
  );
  const [listError, setListError] = useState<string | null>(null);

  const applyInput = (raw: string) => {
    playback.setInputText(raw);
    const parsed = parseListInput(raw);
    if (!parsed.ok) {
      setListError(parsed.error);
      return;
    }
    setListError(null);
    playback.applyInputText(raw);
  };

  const randomize = () => {
    setListError(null);
    playback.applyInputText(randomListArray().join(", "));
  };

  return (
    <div className="mx-auto grid max-w-6xl gap-6 px-4 py-6 lg:grid-cols-[1.4fr_1fr]">
      <section className="space-y-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
            {reverseListMeta.title}
          </h1>
          <p className="mt-1 text-slate-600">{reverseListMeta.summary}</p>
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
          value={playback.inputText}
          error={listError}
          onChange={playback.setInputText}
          onApply={applyInput}
          label="List values"
          placeholder="e.g. 1, 2, 3, 4"
        />
        <p className="-mt-2 text-xs text-slate-500">
          Comma-separated integers. Max {MAX_LIST_LENGTH} nodes so the chain
          stays readable.
        </p>
      </section>
      <aside className="space-y-4">
        <CodePanel
          lines={REVERSE_LIST_CODE[language]}
          activeLineId={playback.step?.codeLineId ?? "fn-def"}
          language={language}
          onLanguageChange={setLanguage}
        />
        <ExplanationPanel text={playback.step?.explanation ?? ""} />
        <ComplexityPanel meta={reverseListMeta} />
      </aside>
    </div>
  );
}
