"use client";

import { useCallback, useState } from "react";
import { usePlayback } from "@/lib/playback/usePlayback";
import { generateHashChainingSteps } from "@/lib/algorithms/hash-chaining/generateSteps";
import { HASH_CHAINING_CODE } from "@/lib/algorithms/hash-chaining/code";
import { hashChainingMeta } from "@/lib/algorithms/hash-chaining/meta";
import {
  parseBucketCount,
  parseHashKeyInput,
  parseHashKeysInput,
} from "@/lib/algorithms/parseInput";
import { randomHashChaining } from "@/lib/algorithms/randomArray";
import { HashCanvas } from "@/components/player/HashCanvas";
import { ControlPanel } from "@/components/player/ControlPanel";
import { ArrayInput } from "@/components/player/ArrayInput";
import { CodePanel } from "@/components/player/CodePanel";
import { ExplanationPanel } from "@/components/player/ExplanationPanel";
import { ComplexityPanel } from "@/components/player/ComplexityPanel";

const DEFAULT_KEYS = [10, 15, 20, 7, 3];
const DEFAULT_M = 5;
const DEFAULT_SEARCH = 15;

export function HashChainingStudio() {
  const [keys, setKeys] = useState(DEFAULT_KEYS);
  const [bucketCount, setBucketCount] = useState(DEFAULT_M);
  const [searchKey, setSearchKey] = useState(DEFAULT_SEARCH);
  const [keysText, setKeysText] = useState(DEFAULT_KEYS.join(", "));
  const [mText, setMText] = useState(String(DEFAULT_M));
  const [searchText, setSearchText] = useState(String(DEFAULT_SEARCH));
  const [keysError, setKeysError] = useState<string | null>(null);
  const [mError, setMError] = useState<string | null>(null);
  const [searchError, setSearchError] = useState<string | null>(null);

  const generateSteps = useCallback(
    () => generateHashChainingSteps(keys, bucketCount, searchKey),
    [keys, bucketCount, searchKey],
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
    setMError(null);
    setBucketCount(parsed.value);
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
    const next = randomHashChaining();
    setKeys(next.keys);
    setBucketCount(next.bucketCount);
    setSearchKey(next.searchKey);
    setKeysText(next.keys.join(", "));
    setMText(String(next.bucketCount));
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
            {hashChainingMeta.title}
          </h1>
          <p className="mt-1 text-slate-600">{hashChainingMeta.summary}</p>
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
          placeholder="e.g. 10, 15, 20, 7, 3"
        />
        <ArrayInput
          value={mText}
          error={mError}
          onChange={setMText}
          onApply={applyM}
          label="Buckets (m)"
          placeholder="e.g. 5"
        />
        <ArrayInput
          value={searchText}
          error={searchError}
          onChange={setSearchText}
          onApply={applySearch}
          label="Search key"
          placeholder="e.g. 15"
        />
        <p className="-mt-2 text-xs text-slate-500">
          Non-negative integers. At most 10 keys. m is 3–8. Duplicate keys are
          not inserted.
        </p>
      </section>
      <aside className="space-y-4">
        <CodePanel
          lines={HASH_CHAINING_CODE[language]}
          activeLineId={playback.step?.codeLineId ?? "fn-def"}
          language={language}
          onLanguageChange={setLanguage}
        />
        <ExplanationPanel text={playback.step?.explanation ?? ""} />
        <ComplexityPanel meta={hashChainingMeta} />
      </aside>
    </div>
  );
}
