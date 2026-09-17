"use client";

import { useCallback, useState } from "react";
import { usePlayback } from "@/lib/playback/usePlayback";
import { generateMergeListsSteps } from "@/lib/algorithms/merge-lists/generateSteps";
import { MERGE_LISTS_CODE } from "@/lib/algorithms/merge-lists/code";
import { mergeListsMeta } from "@/lib/algorithms/merge-lists/meta";
import { parseMergeListInput } from "@/lib/algorithms/parseInput";
import { randomSortedListPair } from "@/lib/algorithms/randomArray";
import { MAX_LIST_LENGTH } from "@/lib/algorithms/types";
import { ListCanvas } from "@/components/player/ListCanvas";
import { ControlPanel } from "@/components/player/ControlPanel";
import { ArrayInput } from "@/components/player/ArrayInput";
import { CodePanel } from "@/components/player/CodePanel";
import { ExplanationPanel } from "@/components/player/ExplanationPanel";
import { ComplexityPanel } from "@/components/player/ComplexityPanel";

const DEFAULT_A = [1, 3, 5];
const DEFAULT_B = [2, 4];

export function MergeListsStudio() {
  const [a, setA] = useState(DEFAULT_A);
  const [b, setB] = useState(DEFAULT_B);
  const [aText, setAText] = useState(DEFAULT_A.join(", "));
  const [bText, setBText] = useState(DEFAULT_B.join(", "));
  const [aError, setAError] = useState<string | null>(null);
  const [bError, setBError] = useState<string | null>(null);

  const generateSteps = useCallback(
    () => generateMergeListsSteps(a, b),
    [a, b],
  );
  const playback = usePlayback(generateSteps, [0]);
  const [language, setLanguage] = useState<"python" | "javascript" | "cpp">(
    "python",
  );

  const applyA = (raw: string) => {
    setAText(raw);
    const parsed = parseMergeListInput(raw);
    if (!parsed.ok) {
      setAError(parsed.error);
      return;
    }
    if (parsed.values.length + b.length > MAX_LIST_LENGTH) {
      setAError(`Combined length at most ${MAX_LIST_LENGTH} nodes.`);
      return;
    }
    const sorted = [...parsed.values].sort((x, y) => x - y);
    setAError(null);
    setA(sorted);
    setAText(sorted.join(", "));
  };

  const applyB = (raw: string) => {
    setBText(raw);
    const parsed = parseMergeListInput(raw);
    if (!parsed.ok) {
      setBError(parsed.error);
      return;
    }
    if (a.length + parsed.values.length > MAX_LIST_LENGTH) {
      setBError(`Combined length at most ${MAX_LIST_LENGTH} nodes.`);
      return;
    }
    const sorted = [...parsed.values].sort((x, y) => x - y);
    setBError(null);
    setB(sorted);
    setBText(sorted.join(", "));
  };

  const randomize = () => {
    const [nextA, nextB] = randomSortedListPair();
    setA(nextA);
    setB(nextB);
    setAText(nextA.join(", "));
    setBText(nextB.join(", "));
    setAError(null);
    setBError(null);
  };

  return (
    <div className="mx-auto grid max-w-6xl gap-6 px-4 py-6 lg:grid-cols-[1.4fr_1fr]">
      <section className="space-y-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
            {mergeListsMeta.title}
          </h1>
          <p className="mt-1 text-slate-600">{mergeListsMeta.summary}</p>
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
          value={aText}
          error={aError}
          onChange={setAText}
          onApply={applyA}
          label="List A"
          placeholder="e.g. 1, 3, 5"
        />
        <ArrayInput
          value={bText}
          error={bError}
          onChange={setBText}
          onApply={applyB}
          label="List B"
          placeholder="e.g. 2, 4"
        />
        <p className="-mt-2 text-xs text-slate-500">
          Each list is sorted on Apply. Combined length at most {MAX_LIST_LENGTH}.
          Leave a field empty for an empty list.
        </p>
      </section>
      <aside className="space-y-4">
        <CodePanel
          lines={MERGE_LISTS_CODE[language]}
          activeLineId={playback.step?.codeLineId ?? "fn-def"}
          language={language}
          onLanguageChange={setLanguage}
        />
        <ExplanationPanel text={playback.step?.explanation ?? ""} />
        <ComplexityPanel meta={mergeListsMeta} />
      </aside>
    </div>
  );
}
