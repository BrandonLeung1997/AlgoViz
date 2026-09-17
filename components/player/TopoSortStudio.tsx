"use client";

import { useCallback, useState } from "react";
import { usePlayback } from "@/lib/playback/usePlayback";
import { generateTopoSortSteps } from "@/lib/algorithms/topological-sort/generateSteps";
import { TOPO_SORT_CODE } from "@/lib/algorithms/topological-sort/code";
import { topologicalSortMeta } from "@/lib/algorithms/topological-sort/meta";
import {
  formatGraphInput,
  parseGraphInput,
} from "@/lib/algorithms/parseInput";
import {
  DEFAULT_TOPO_GRAPH,
  randomDag,
} from "@/lib/algorithms/randomGraph";
import { GraphCanvas } from "@/components/player/GraphCanvas";
import { ControlPanel } from "@/components/player/ControlPanel";
import { ArrayInput } from "@/components/player/ArrayInput";
import { CodePanel } from "@/components/player/CodePanel";
import { ExplanationPanel } from "@/components/player/ExplanationPanel";
import { ComplexityPanel } from "@/components/player/ComplexityPanel";

export function TopoSortStudio() {
  const [graph, setGraph] = useState(DEFAULT_TOPO_GRAPH);
  const [graphText, setGraphText] = useState(
    formatGraphInput(DEFAULT_TOPO_GRAPH, { directed: true }),
  );
  const [graphError, setGraphError] = useState<string | null>(null);

  const generateSteps = useCallback(
    () => generateTopoSortSteps(graph),
    [graph],
  );
  const playback = usePlayback(generateSteps, [0]);
  const [language, setLanguage] = useState<"python" | "javascript" | "cpp">(
    "python",
  );

  const applyGraph = (raw: string) => {
    const parsed = parseGraphInput(raw, { directed: true });
    if (!parsed.ok) {
      setGraphText(raw);
      setGraphError(parsed.error);
      return;
    }
    setGraph(parsed.graph);
    setGraphText(formatGraphInput(parsed.graph, { directed: true }));
    setGraphError(null);
  };

  const randomize = () => {
    const next = randomDag();
    setGraph(next);
    setGraphText(formatGraphInput(next, { directed: true }));
    setGraphError(null);
  };

  return (
    <div className="mx-auto grid max-w-6xl gap-6 px-4 py-6 lg:grid-cols-[1.4fr_1fr]">
      <section className="space-y-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
            {topologicalSortMeta.title}
          </h1>
          <p className="mt-1 text-slate-600">{topologicalSortMeta.summary}</p>
        </div>
        <div className="rounded-lg border border-slate-200 bg-white p-4">
          <GraphCanvas
            step={playback.step}
            frontierLabel="Queue"
            directed
            pathLabel="Order"
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
          placeholder="e.g. 0>1, 0>2, 1>3, 2>3"
        />
        <p className="-mt-2 text-xs text-slate-500">
          Directed edge list (0&gt;1 or 0-&gt;1) or adjacency list (0:1,2). Max
          12 nodes. Undirected 0-1 is rejected here — it would add both
          directions and create a cycle for Kahn’s algorithm.
        </p>
      </section>
      <aside className="space-y-4">
        <CodePanel
          lines={TOPO_SORT_CODE[language]}
          activeLineId={playback.step?.codeLineId ?? "fn-def"}
          language={language}
          onLanguageChange={setLanguage}
        />
        <ExplanationPanel text={playback.step?.explanation ?? ""} />
        <ComplexityPanel meta={topologicalSortMeta} />
      </aside>
    </div>
  );
}
