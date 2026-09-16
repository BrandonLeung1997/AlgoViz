"use client";

import { motion } from "framer-motion";
import type { GraphEdge, GraphFrame, Step } from "@/lib/algorithms/types";

const VIEW = { w: 420, h: 300 };
const NODE_R = 18;

function layout(nodes: number[]) {
  const cx = VIEW.w / 2;
  const cy = VIEW.h / 2;
  const r = Math.min(VIEW.w, VIEW.h) / 2 - 44;
  if (nodes.length === 0) return [];
  if (nodes.length === 1) return [{ id: nodes[0]!, x: cx, y: cy }];
  return nodes.map((id, i) => {
    const angle = (2 * Math.PI * i) / nodes.length - Math.PI / 2;
    return { id, x: cx + r * Math.cos(angle), y: cy + r * Math.sin(angle) };
  });
}

function matchesEdge(edge: GraphEdge, a: number, b: number) {
  return (edge.from === a && edge.to === b) || (edge.from === b && edge.to === a);
}

function edgeStyle(from: number, to: number, graph: GraphFrame) {
  if (graph.relaxedEdges.some((e) => matchesEdge(e, from, to))) {
    return { stroke: "#f59e0b", width: 4 };
  }
  if (graph.treeEdges.some((e) => matchesEdge(e, from, to))) {
    return { stroke: "#16a34a", width: 3.5 };
  }
  const path = graph.path;
  for (let i = 0; i < path.length - 1; i += 1) {
    if (matchesEdge({ from: path[i]!, to: path[i + 1]! }, from, to)) {
      return { stroke: "#0284c7", width: 3.5 };
    }
  }
  return { stroke: "#cbd5e1", width: 2 };
}

function nodeFill(id: number, graph: GraphFrame): string {
  if (graph.current === id) return "#fbbf24";
  if (id === graph.source) return "#0284c7";
  if (graph.frontier.includes(id)) return "#7dd3fc";
  if (graph.path.includes(id) && id !== graph.source) return "#38bdf8";
  if (graph.visited.includes(id)) return "#16a34a";
  return "#334155";
}

function nodeLabelColor(id: number, graph: GraphFrame): string {
  const fill = nodeFill(id, graph);
  return fill === "#7dd3fc" || fill === "#fbbf24" || fill === "#38bdf8"
    ? "#0f172a"
    : "#ffffff";
}

export type GraphCanvasProps = {
  step: Step | undefined;
};

export function GraphCanvas({ step }: GraphCanvasProps) {
  const graph = step?.graph;
  const nodes = graph?.nodes ?? [];
  const positions = layout(nodes);
  const pos = new Map(positions.map((p) => [p.id, p]));

  return (
    <div>
      <div
        className="rounded-lg border border-slate-200 bg-white p-3"
        aria-label="Graph visualization"
      >
        {nodes.length === 0 ? (
          <p className="py-16 text-center text-sm text-slate-500">
            No graph to display
          </p>
        ) : (
          <svg
            viewBox={`0 0 ${VIEW.w} ${VIEW.h}`}
            className="mx-auto h-[280px] w-full max-w-[520px]"
            role="img"
          >
            {(graph?.edges ?? []).map((edge) => {
              const a = pos.get(edge.from);
              const b = pos.get(edge.to);
              if (!a || !b) return null;
              const style = edgeStyle(edge.from, edge.to, graph!);
              return (
                <motion.line
                  key={`${edge.from}-${edge.to}`}
                  x1={a.x}
                  y1={a.y}
                  x2={b.x}
                  y2={b.y}
                  stroke={style.stroke}
                  strokeWidth={style.width}
                  strokeLinecap="round"
                  initial={false}
                  animate={{ stroke: style.stroke, strokeWidth: style.width }}
                  transition={{ duration: 0.2 }}
                />
              );
            })}
            {positions.map(({ id, x, y }) => (
              <g key={id}>
                <motion.circle
                  cx={x}
                  cy={y}
                  r={NODE_R}
                  initial={false}
                  fill={nodeFill(id, graph!)}
                  animate={{ fill: nodeFill(id, graph!) }}
                  transition={{ duration: 0.2 }}
                  stroke="#e2e8f0"
                  strokeWidth={2}
                />
                <text
                  x={x}
                  y={y}
                  textAnchor="middle"
                  dominantBaseline="central"
                  fontSize={14}
                  fontWeight={600}
                  fill={nodeLabelColor(id, graph!)}
                >
                  {id}
                </text>
              </g>
            ))}
          </svg>
        )}
      </div>
      <div className="mt-3 flex flex-wrap items-center justify-center gap-2 text-xs text-slate-600">
        <span>
          Queue:{" "}
          <span className="font-mono font-medium text-slate-800">
            [{(graph?.frontier ?? []).join(", ")}]
          </span>
        </span>
        <span className="text-slate-300">·</span>
        <span>
          Path:{" "}
          <span className="font-mono font-medium text-slate-800">
            {(graph?.path ?? []).join(" → ") || "—"}
          </span>
        </span>
      </div>
      <p className="mt-2 text-center text-xs text-slate-500">
        <span className="font-semibold text-sky-700">source</span>
        {" · "}
        <span className="font-semibold text-amber-600">current</span>
        {" · "}
        <span className="font-semibold text-sky-400">frontier</span>
        {" · "}
        <span className="font-semibold text-green-600">visited</span>
        {" · "}
        <span className="font-semibold text-green-700">tree edge</span>
        {" · "}
        <span className="font-semibold text-amber-500">relaxed</span>
      </p>
    </div>
  );
}
