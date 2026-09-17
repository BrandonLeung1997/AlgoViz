"use client";

import { useCallback, useState } from "react";
import { usePlayback } from "@/lib/playback/usePlayback";
import { generateKruskalSteps } from "@/lib/algorithms/kruskal/generateSteps";
import { KRUSKAL_CODE } from "@/lib/algorithms/kruskal/code";
import { kruskalMeta } from "@/lib/algorithms/kruskal/meta";
import {
  formatGraphInput,
  parseGraphInput,
} from "@/lib/algorithms/parseInput";
import {
  DEFAULT_MST_GRAPH,
  randomWeightedGraph,
} from "@/lib/algorithms/randomGraph";
import { GraphCanvas } from "@/components/player/GraphCanvas";
import { ControlPanel } from "@/components/player/ControlPanel";
import { ArrayInput } from "@/components/player/ArrayInput";
import { CodePanel } from "@/components/player/CodePanel";
import { ExplanationPanel } from "@/components/player/ExplanationPanel";
import { ComplexityPanel } from "@/components/player/ComplexityPanel";

export function KruskalStudio() {
  const [graph, setGraph] = useState(DEFAULT_MST_GRAPH);
  const [graphText, setGraphText] = useState(
    formatGraphInput(DEFAULT_MST_GRAPH),
  );
  const [graphError, setGraphError] = useState<string | null>(null);

  const generateSteps = useCallback(
    () => generateKruskalSteps(graph),
    [graph],
  );
  const playback = usePlayback(generateSteps, [0]);
  const [language, setLanguage] = useState<"python" | "javascript" | "cpp">(
    "python",
  );

  const applyGraph = (raw: string) => {
    const parsed = parseGraphInput(raw);
    if (!parsed.ok) {
      setGraphText(raw);
      setGraphError(parsed.error);
      return;
    }
    setGraph(parsed.graph);
    setGraphText(formatGraphInput(parsed.graph));
    setGraphError(null);
  };

  const randomize = () => {
    const next = randomWeightedGraph();
    setGraph(next);
    setGraphText(formatGraphInput(next));
    setGraphError(null);
  };

  return (
    <div className="mx-auto grid max-w-6xl gap-6 px-4 py-6 lg:grid-cols-[1.4fr_1fr]">
      <section className="space-y-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
            {kruskalMeta.title}
          </h1>
          <p className="mt-1 text-slate-600">{kruskalMeta.summary}</p>
        </div>
        <div className="rounded-lg border border-slate-200 bg-white p-4">
          <GraphCanvas
            step={playback.step}
            frontierLabel="Frontier"
            showWeights
            pathLabel="MST"
            treeLegend="accepted"
            relaxedLegend="considering"
            showSourceLegend={false}
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
          label="Graph"
          value={graphText}
          error={graphError}
          onChange={setGraphText}
          onApply={applyGraph}
          placeholder="e.g. 0-1:1, 1-2:1, 0-2:10"
        />
        <p className="-mt-2 text-xs text-slate-500">
          Weighted edge list (0-1:4 or 0-1 (4)) or adjacency list (0:1:4,2:1).
          Max 12 nodes. Non-negative integer weights. Edge lists are undirected.
          No source — Kruskal scans globally from lightest edge.
        </p>
      </section>
      <aside className="space-y-4">
        <CodePanel
          lines={KRUSKAL_CODE[language]}
          activeLineId={playback.step?.codeLineId ?? "fn-def"}
          language={language}
          onLanguageChange={setLanguage}
        />
        <ExplanationPanel text={playback.step?.explanation ?? ""} />
        <ComplexityPanel meta={kruskalMeta} />
      </aside>
    </div>
  );
}
