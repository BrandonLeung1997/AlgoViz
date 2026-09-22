"use client";

import { useCallback, useState } from "react";
import { usePlayback } from "@/lib/playback/usePlayback";
import { generateLinearProbingSteps } from "@/lib/algorithms/linear-probing/generateSteps";
import { LINEAR_PROBING_CODE } from "@/lib/algorithms/linear-probing/code";
import { linearProbingMeta } from "@/lib/algorithms/linear-probing/meta";
import {
  parseBucketCount,
  parseHashKeyInput,
  parseHashKeysInput,
} from "@/lib/algorithms/parseInput";
import { randomLinearProbing } from "@/lib/algorithms/randomArray";
import { HashCanvas } from "@/components/player/HashCanvas";
import { ControlPanel } from "@/components/player/ControlPanel";
import { ArrayInput } from "@/components/player/ArrayInput";
import { CodePanel } from "@/components/player/CodePanel";
import { ExplanationPanel } from "@/components/player/ExplanationPanel";
import { ComplexityPanel } from "@/components/player/ComplexityPanel";

const DEFAULT_KEYS = [5, 12];
const DEFAULT_M = 7;
const DEFAULT_SEARCH = 12;
const N_LT_M = "Need fewer keys than table size m (n < m).";

export function LinearProbingStudio() {
  const [keys, setKeys] = useState(DEFAULT_KEYS);
  const [tableSize, setTableSize] = useState(DEFAULT_M);
  const [searchKey, setSearchKey] = useState(DEFAULT_SEARCH);
  const [keysText, setKeysText] = useState(DEFAULT_KEYS.join(", "));
  const [mText, setMText] = useState(String(DEFAULT_M));
  const [searchText, setSearchText] = useState(String(DEFAULT_SEARCH));
  const [keysError, setKeysError] = useState<string | null>(null);
  const [mError, setMError] = useState<string | null>(null);
  const [searchError, setSearchError] = useState<string | null>(null);

  const generateSteps = useCallback(
    () => generateLinearProbingSteps(keys, tableSize, searchKey),
    [keys, tableSize, searchKey],
  );
  const playback = usePlayback(generateSteps, [0]);
  const [language, setLanguage] = useState<"python" | "javascript" | "cpp">(
    "python",
  );

  const applyKeys = (raw: string) => {
    setKeysText(raw);
    const parsed = parseHashKeysInput(raw);
    if (!parsed.ok) {
      setKeysError(parsed.error);
      return;
    }
    if (parsed.values.length >= tableSize) {
      setKeysError(N_LT_M);
      return;
    }
    setKeysError(null);
    setKeys(parsed.values);
    setKeysText(parsed.values.join(", "));
  };

  const applyM = (raw: string) => {
    setMText(raw);
    const parsed = parseBucketCount(raw);
    if (!parsed.ok) {
      setMError(parsed.error);
      return;
    }
    if (keys.length >= parsed.value) {
      setMError(N_LT_M);
      return;
    }
    setMError(null);
    setTableSize(parsed.value);
    setMText(String(parsed.value));
  };

  const applySearch = (raw: string) => {
    setSearchText(raw);
    const parsed = parseHashKeyInput(raw);
    if (!parsed.ok) {
      setSearchError(parsed.error);
      return;
    }
    setSearchError(null);
    setSearchKey(parsed.value);
    setSearchText(String(parsed.value));
  };

  const randomize = () => {
    const next = randomLinearProbing();
    setKeys(next.keys);
    setTableSize(next.tableSize);
    setSearchKey(next.searchKey);
    setKeysText(next.keys.join(", "));
    setMText(String(next.tableSize));
    setSearchText(String(next.searchKey));
    setKeysError(null);
    setMError(null);
    setSearchError(null);
  };

  return (
    <div className="mx-auto grid max-w-6xl gap-6 px-4 py-6 lg:grid-cols-[1.4fr_1fr]">
      <section className="space-y-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
            {linearProbingMeta.title}
          </h1>
          <p className="mt-1 text-slate-600">{linearProbingMeta.summary}</p>
        </div>
        <div className="rounded-lg border border-slate-200 bg-white p-4">
          <HashCanvas step={playback.step} />
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
          value={keysText}
          error={keysError}
          onChange={setKeysText}
          onApply={applyKeys}
          label="Keys"
          placeholder="e.g. 5, 12"
        />
        <ArrayInput
          value={mText}
          error={mError}
          onChange={setMText}
          onApply={applyM}
          label="Table size (m)"
          placeholder="e.g. 7"
        />
        <ArrayInput
          value={searchText}
          error={searchError}
          onChange={setSearchText}
          onApply={applySearch}
          label="Search key"
          placeholder="e.g. 12"
        />
        <p className="-mt-2 text-xs text-slate-500">
          Non-negative integers. Fewer keys than m (n &lt; m). m is 3–8.
          Duplicate keys are not inserted.
        </p>
      </section>
      <aside className="space-y-4">
        <CodePanel
          lines={LINEAR_PROBING_CODE[language]}
          activeLineId={playback.step?.codeLineId ?? "fn-def"}
          language={language}
          onLanguageChange={setLanguage}
        />
        <ExplanationPanel text={playback.step?.explanation ?? ""} />
        <ComplexityPanel meta={linearProbingMeta} />
      </aside>
    </div>
  );
}
