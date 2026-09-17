"use client";

import { useCallback, useState } from "react";
import { usePlayback } from "@/lib/playback/usePlayback";
import { generateBellmanFordSteps } from "@/lib/algorithms/bellman-ford/generateSteps";
import { BELLMAN_FORD_CODE } from "@/lib/algorithms/bellman-ford/code";
import { bellmanFordMeta } from "@/lib/algorithms/bellman-ford/meta";
import {
  formatGraphInput,
  parseGraphInput,
  parseTargetInput,
} from "@/lib/algorithms/parseInput";
import {
  DEFAULT_BELLMAN_FORD_GRAPH,
  randomDirectedWeightedGraph,
} from "@/lib/algorithms/randomGraph";
import { GraphCanvas } from "@/components/player/GraphCanvas";
import { ControlPanel } from "@/components/player/ControlPanel";
import { ArrayInput } from "@/components/player/ArrayInput";
import { CodePanel } from "@/components/player/CodePanel";
import { ExplanationPanel } from "@/components/player/ExplanationPanel";
import { ComplexityPanel } from "@/components/player/ComplexityPanel";

const DEFAULT_SOURCE = 0;
const PARSE_OPTIONS = { directed: true, allowNegative: true } as const;
const FORMAT_OPTIONS = { directed: true } as const;

export function BellmanFordStudio() {
  const [graph, setGraph] = useState(DEFAULT_BELLMAN_FORD_GRAPH);
  const [graphText, setGraphText] = useState(
    formatGraphInput(DEFAULT_BELLMAN_FORD_GRAPH, FORMAT_OPTIONS),
  );
  const [graphError, setGraphError] = useState<string | null>(null);
  const [source, setSource] = useState(DEFAULT_SOURCE);
  const [sourceText, setSourceText] = useState(String(DEFAULT_SOURCE));
  const [sourceError, setSourceError] = useState<string | null>(null);

  const generateSteps = useCallback(
    () => generateBellmanFordSteps(graph, source),
    [graph, source],
  );
  const playback = usePlayback(generateSteps, [0]);
  const [language, setLanguage] = useState<"python" | "javascript" | "cpp">(
    "python",
  );

  const applyGraph = (raw: string) => {
    const parsed = parseGraphInput(raw, PARSE_OPTIONS);
    if (!parsed.ok) {
      setGraphText(raw);
      setGraphError(parsed.error);
      return;
    }
    setGraph(parsed.graph);
    setGraphText(formatGraphInput(parsed.graph, FORMAT_OPTIONS));
    setGraphError(null);
    if (!parsed.graph.nodes.includes(source)) {
      const next = parsed.graph.nodes[0]!;
      setSource(next);
      setSourceText(String(next));
      setSourceError(null);
    }
  };

  const applySource = (raw: string) => {
    setSourceText(raw);
    const parsed = parseTargetInput(raw);
    if (!parsed.ok) {
      setSourceError(parsed.error);
      return;
    }
    if (!graph.nodes.includes(parsed.value)) {
      setSourceError(`Source ${parsed.value} is not a node in the graph.`);
      return;
    }
    setSourceError(null);
    setSource(parsed.value);
    setSourceText(String(parsed.value));
  };

  const randomize = () => {
    const next = randomDirectedWeightedGraph();
    const nextSource =
      next.nodes.find((n) => (next.adj[n] ?? []).length > 0) ?? next.nodes[0]!;
    setGraph(next);
    setGraphText(formatGraphInput(next, FORMAT_OPTIONS));
    setGraphError(null);
    setSource(nextSource);
    setSourceText(String(nextSource));
    setSourceError(null);
  };

  return (
    <div className="mx-auto grid max-w-6xl gap-6 px-4 py-6 lg:grid-cols-[1.4fr_1fr]">
      <section className="space-y-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
            {bellmanFordMeta.title}
          </h1>
          <p className="mt-1 text-slate-600">{bellmanFordMeta.summary}</p>
        </div>
        <div className="rounded-lg border border-slate-200 bg-white p-4">
          <GraphCanvas
            step={playback.step}
            frontierLabel="Frontier"
            showWeights
            directed
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
          placeholder="e.g. 0>1:4, 0>2:5, 1>2:-3"
        />
        <p className="-mt-2 text-xs text-slate-500">
          Directed weighted edge list (0&gt;1:4 or 0-&gt;2:-2) or adjacency list
          (0:1:4,2:-2). Max 12 nodes. Negative weights are allowed. Undirected
          0-1 is rejected here — use 0&gt;1 for one-way edges.
        </p>
        <ArrayInput
          label="Source"
          value={sourceText}
          error={sourceError}
          onChange={setSourceText}
          onApply={applySource}
          placeholder="e.g. 0"
        />
      </section>
      <aside className="space-y-4">
        <CodePanel
          lines={BELLMAN_FORD_CODE[language]}
          activeLineId={playback.step?.codeLineId ?? "fn-def"}
          language={language}
          onLanguageChange={setLanguage}
        />
        <ExplanationPanel text={playback.step?.explanation ?? ""} />
        <ComplexityPanel meta={bellmanFordMeta} />
      </aside>
    </div>
  );
}
