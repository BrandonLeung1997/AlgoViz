"use client";

import { useCallback, useState } from "react";
import { usePlayback } from "@/lib/playback/usePlayback";
import { generateEditDistanceSteps } from "@/lib/algorithms/edit-distance/generateSteps";
import { EDIT_DISTANCE_CODE } from "@/lib/algorithms/edit-distance/code";
import { editDistanceMeta } from "@/lib/algorithms/edit-distance/meta";
import { parseStringInput } from "@/lib/algorithms/parseInput";
import { randomLcsString } from "@/lib/algorithms/randomString";
import { TableCanvas } from "@/components/player/TableCanvas";
import { ControlPanel } from "@/components/player/ControlPanel";
import { ArrayInput } from "@/components/player/ArrayInput";
import { CodePanel } from "@/components/player/CodePanel";
import { ExplanationPanel } from "@/components/player/ExplanationPanel";
import { ComplexityPanel } from "@/components/player/ComplexityPanel";

const DEFAULT_X = "cat";
const DEFAULT_Y = "cut";

export function EditDistanceStudio() {
  const [x, setX] = useState(DEFAULT_X);
  const [y, setY] = useState(DEFAULT_Y);
  const [xText, setXText] = useState(DEFAULT_X);
  const [yText, setYText] = useState(DEFAULT_Y);
  const [xError, setXError] = useState<string | null>(null);
  const [yError, setYError] = useState<string | null>(null);

  const generateSteps = useCallback(
    () => generateEditDistanceSteps(x, y),
    [x, y],
  );
  const playback = usePlayback(generateSteps, [0]);
  const [language, setLanguage] = useState<"python" | "javascript" | "cpp">(
    "python",
  );

  const applyX = (raw: string) => {
    setXText(raw);
    const parsed = parseStringInput(raw);
    if (!parsed.ok) {
      setXError(parsed.error);
      return;
    }
    setXError(null);
    setX(parsed.value);
    setXText(parsed.value);
  };

  const applyY = (raw: string) => {
    setYText(raw);
    const parsed = parseStringInput(raw);
    if (!parsed.ok) {
      setYError(parsed.error);
      return;
    }
    setYError(null);
    setY(parsed.value);
    setYText(parsed.value);
  };

  const randomize = () => {
    const nextX = randomLcsString(4 + Math.floor(Math.random() * 3));
    const nextY = randomLcsString(4 + Math.floor(Math.random() * 3));
    setX(nextX);
    setY(nextY);
    setXText(nextX);
    setYText(nextY);
    setXError(null);
    setYError(null);
  };

  return (
    <div className="mx-auto grid max-w-6xl gap-6 px-4 py-6 lg:grid-cols-[1.4fr_1fr]">
      <section className="space-y-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
            {editDistanceMeta.title}
          </h1>
          <p className="mt-1 text-slate-600">{editDistanceMeta.summary}</p>
        </div>
        <div className="rounded-lg border border-slate-200 bg-white p-4">
          <TableCanvas
            step={playback.step}
            resultLabel="Distance"
            hint="dp[i][j] = edit distance of X[:i] and Y[:j] (row-major fill)"
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
          label="Sequence X"
          value={xText}
          error={xError}
          onChange={setXText}
          onApply={applyX}
          placeholder="e.g. cat"
        />
        <ArrayInput
          label="Sequence Y"
          value={yText}
          error={yError}
          onChange={setYText}
          onApply={applyY}
          placeholder="e.g. cut"
        />
        <p className="-mt-2 text-xs text-slate-500">
          Letters and digits only. Max 10 characters each. Empty strings are
          allowed.
        </p>
      </section>
      <aside className="space-y-4">
        <CodePanel
          lines={EDIT_DISTANCE_CODE[language]}
          activeLineId={playback.step?.codeLineId ?? "fn-def"}
          language={language}
          onLanguageChange={setLanguage}
        />
        <ExplanationPanel text={playback.step?.explanation ?? ""} />
        <ComplexityPanel meta={editDistanceMeta} />
      </aside>
    </div>
  );
}
