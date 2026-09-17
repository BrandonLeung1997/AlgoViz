"use client";

import { motion } from "framer-motion";
import type { ListNodeFrame, Step } from "@/lib/algorithms/types";
import { walkIds } from "@/lib/algorithms/reverse-list/listFrame";
import { cn } from "@/lib/utils";

const NODE_W = 56;
const NODE_H = 48;
const GAP = 48;
const LABEL_H = 54;
const PAD_X = 20;
const PAD_Y = 48;
const NULL_UNDER = 28;
const CURVE_BASE = 36;
const SELF_LOOP = 34;

const POINTER_ORDER = [
  "head",
  "slow",
  "fast",
  "prev",
  "curr",
  "next",
  "p",
  "q",
  "tail",
] as const;

const POINTER_LABEL_CLASS: Record<string, string> = {
  curr: "text-amber-700",
  prev: "text-slate-600",
  next: "text-green-700",
  head: "text-sky-700",
  slow: "text-sky-600",
  fast: "text-amber-700",
  p: "text-sky-600",
  q: "text-amber-700",
  tail: "text-green-700",
};

function pointersOn(
  id: number,
  pointers: Record<string, number | null>,
): string[] {
  const names: string[] = [];
  for (const name of POINTER_ORDER) {
    if (pointers[name] === id) names.push(name);
  }
  for (const [name, value] of Object.entries(pointers)) {
    if (
      value === id &&
      !POINTER_ORDER.includes(name as (typeof POINTER_ORDER)[number])
    ) {
      names.push(name);
    }
  }
  return names;
}

function nodeFill(
  id: number,
  roles: string[],
  reversed: Set<number>,
): string {
  if (roles.includes("slow") && roles.includes("fast")) return "#f43f5e";
  if (roles.includes("p") && roles.includes("q")) return "#f43f5e";
  if (roles.includes("fast") || roles.includes("curr") || roles.includes("q")) {
    return "#fbbf24";
  }
  if (roles.includes("slow") || roles.includes("p")) return "#38bdf8";
  if (roles.includes("next") || roles.includes("tail")) return "#22c55e";
  if (roles.includes("prev")) return "#64748b";
  if (reversed.has(id)) return "#0369a1";
  return "#334155";
}

function labelFill(roles: string[]): string {
  if (
    roles.includes("curr") ||
    roles.includes("fast") ||
    roles.includes("slow") ||
    roles.includes("p") ||
    roles.includes("q")
  ) {
    return "#0f172a";
  }
  return "#ffffff";
}

function slotCenterX(index: number): number {
  return PAD_X + index * (NODE_W + GAP) + NODE_W / 2;
}

function isBackEdge(from: number, to: number): boolean {
  return to <= from;
}

function backDrop(from: number, to: number): number {
  if (to > from) return 0;
  if (to === from) return SELF_LOOP;
  return CURVE_BASE + (from - to - 1) * 10;
}

function arrowPath(from: number, to: number, y: number): string {
  if (to === from + 1) {
    const x1 = slotCenterX(from) + NODE_W / 2 - 2;
    const x2 = slotCenterX(to) - NODE_W / 2 + 2;
    return `M ${x1} ${y} L ${x2} ${y}`;
  }
  const x1 = slotCenterX(from);
  const x2 = slotCenterX(to);
  if (to <= from) {
    const y1 = y + NODE_H / 2 - 2;
    if (to === from) {
      return `M ${x1 - 12} ${y1} C ${x1 - 22} ${y1 + SELF_LOOP} ${x1 + 22} ${y1 + SELF_LOOP} ${x1 + 12} ${y1}`;
    }
    const drop = backDrop(from, to);
    const mx = (x1 + x2) / 2;
    return `M ${x1} ${y1} Q ${mx} ${y1 + drop} ${x2} ${y1}`;
  }
  const y1 = y - NODE_H / 2 - 2;
  const span = Math.max(1, to - from);
  const lift = Math.min(y1 - 8, CURVE_BASE + (span - 1) * 10);
  const mx = (x1 + x2) / 2;
  return `M ${x1} ${y1} Q ${mx} ${y1 - lift} ${x2} ${y1}`;
}

export type ListCanvasProps = {
  step: Step | undefined;
};

export function ListCanvas({ step }: ListCanvasProps) {
  const list = step?.list;
  const allNodes = list?.nodes ?? [];
  const pointers = list?.pointers ?? {};
  const reversed = new Set(list?.highlightIds ?? []);
  const merge = "p" in pointers && "q" in pointers;
  const tortoise = "slow" in pointers || "fast" in pointers;

  if (merge) {
    const byId = new Map(allNodes.map((node) => [node.id, node]));
    const pick = (start: number | null) =>
      walkIds(allNodes, start)
        .map((id) => byId.get(id))
        .filter((node): node is ListNodeFrame => node != null);
    return (
      <div>
        <div
          className="space-y-3 overflow-x-auto rounded-lg border border-slate-200 bg-white p-3"
          aria-label="Linked list visualization"
        >
          <ChainRow
            label="List A"
            nodes={pick(pointers.p ?? null)}
            pointers={pointers}
            reversed={reversed}
            markerId="a"
          />
          <ChainRow
            label="List B"
            nodes={pick(pointers.q ?? null)}
            pointers={pointers}
            reversed={reversed}
            markerId="b"
          />
          <ChainRow
            label="Merged"
            nodes={pick(list?.head ?? null)}
            pointers={pointers}
            reversed={reversed}
            markerId="out"
          />
        </div>
        {step?.array.length ? (
          <p className="mt-2 text-center text-xs tabular-nums text-slate-500">
            Values: {step.array.join(", ")}
          </p>
        ) : null}
        <p className="mt-1 text-center text-xs text-slate-500">
          <span className="font-semibold text-sky-600">p</span>
          {" · "}
          <span className="font-semibold text-amber-600">q</span>
          {" · "}
          <span className="font-semibold text-green-700">tail</span>
          {" · "}
          <span className="font-semibold text-sky-700">merged</span>
        </p>
      </div>
    );
  }

  const nodes = [...allNodes].sort((a, b) => a.id - b.id);
  const n = nodes.length;
  const indexOf = new Map(nodes.map((node, i) => [node.id, i]));

  const edges = nodes.filter(
    (node) => node.next !== null && indexOf.has(node.next),
  );
  const maxBack = edges.reduce((max, node) => {
    const from = indexOf.get(node.id)!;
    const to = indexOf.get(node.next!)!;
    return Math.max(max, backDrop(from, to));
  }, 0);
  const extraBottom = Math.max(NULL_UNDER, maxBack + 16);

  const width = PAD_X * 2 + n * NODE_W + Math.max(0, n - 1) * GAP;
  const height = PAD_Y * 2 + LABEL_H + NODE_H + extraBottom;
  const nodeY = PAD_Y + LABEL_H;
  const arrowY = nodeY + NODE_H / 2;

  if (n === 0) {
    return (
      <div>
        <div
          className="rounded-lg border border-slate-200 bg-white p-3"
          aria-label="Linked list visualization"
        >
          <p className="py-16 text-center text-sm text-slate-500">Empty list</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div
        className="overflow-x-auto rounded-lg border border-slate-200 bg-white p-3"
        aria-label="Linked list visualization"
      >
        <ChainSvg
          nodes={nodes}
          pointers={pointers}
          reversed={reversed}
          width={width}
          height={height}
          nodeY={nodeY}
          arrowY={arrowY}
          edges={edges}
          indexOf={indexOf}
          markerId="list"
        />
      </div>
      {step?.array.length ? (
        <p className="mt-2 text-center text-xs tabular-nums text-slate-500">
          Values: {step.array.join(", ")}
        </p>
      ) : null}
      {tortoise ? (
        <p className="mt-1 text-center text-xs text-slate-500">
          <span className="font-semibold text-sky-600">tortoise</span>
          {" · "}
          <span className="font-semibold text-amber-600">hare</span>
          {" · "}
          <span className="font-semibold text-rose-600">meeting node</span>
          {" · "}
          <span className="font-semibold text-sky-600">cycle back-edge</span>
        </p>
      ) : (
        <p className="mt-1 text-center text-xs text-slate-500">
          <span className="font-semibold text-amber-600">current</span>
          {" · "}
          <span className="font-semibold text-slate-600">previous</span>
          {" · "}
          <span className="font-semibold text-green-700">successor</span>
          {" · "}
          <span className="font-semibold text-sky-700">reversed prefix</span>
        </p>
      )}
    </div>
  );
}

function ChainRow({
  label,
  nodes,
  pointers,
  reversed,
  markerId,
}: {
  label: string;
  nodes: ListNodeFrame[];
  pointers: Record<string, number | null>;
  reversed: Set<number>;
  markerId: string;
}) {
  const n = nodes.length;
  const indexOf = new Map(nodes.map((node, i) => [node.id, i]));
  const onRow = new Set(nodes.map((node) => node.id));
  const edges = nodes.filter(
    (node) => node.next !== null && onRow.has(node.next),
  );
  const extraBottom = NULL_UNDER;
  const width = PAD_X * 2 + Math.max(n, 1) * NODE_W + Math.max(0, n - 1) * GAP;
  const height = LABEL_H + NODE_H + extraBottom + 8;
  const nodeY = LABEL_H;
  const arrowY = nodeY + NODE_H / 2;

  return (
    <div>
      <p className="mb-1 text-xs font-semibold text-slate-600">{label}</p>
      {n === 0 ? (
        <p className="py-4 text-center text-sm text-slate-500">empty</p>
      ) : (
        <div
          className="relative mx-auto"
          style={{ width, height, minWidth: width }}
        >
          <ChainSvg
            nodes={nodes}
            pointers={pointers}
            reversed={reversed}
            width={width}
            height={height}
            nodeY={nodeY}
            arrowY={arrowY}
            edges={edges}
            indexOf={indexOf}
            markerId={markerId}
          />
        </div>
      )}
    </div>
  );
}

function ChainSvg({
  nodes,
  pointers,
  reversed,
  width,
  height,
  nodeY,
  arrowY,
  edges,
  indexOf,
  markerId,
}: {
  nodes: ListNodeFrame[];
  pointers: Record<string, number | null>;
  reversed: Set<number>;
  width: number;
  height: number;
  nodeY: number;
  arrowY: number;
  edges: ListNodeFrame[];
  indexOf: Map<number, number>;
  markerId: string;
}) {
  const fwd = `${markerId}-arrow`;
  const back = `${markerId}-arrow-back`;
  return (
    <>
      <svg
        className="pointer-events-none absolute inset-0"
        width={width}
        height={height}
        viewBox={`0 0 ${width} ${height}`}
        aria-hidden
      >
        <defs>
          <marker
            id={fwd}
            markerWidth="8"
            markerHeight="8"
            refX="6"
            refY="4"
            orient="auto"
          >
            <path d="M0,0 L8,4 L0,8 Z" fill="#94a3b8" />
          </marker>
          <marker
            id={back}
            markerWidth="8"
            markerHeight="8"
            refX="6"
            refY="4"
            orient="auto"
          >
            <path d="M0,0 L8,4 L0,8 Z" fill="#0ea5e9" />
          </marker>
        </defs>
        {edges.map((node) => {
          const from = indexOf.get(node.id)!;
          const to = indexOf.get(node.next!)!;
          const isBack = isBackEdge(from, to);
          return (
            <path
              key={`e-${node.id}`}
              data-kind={isBack ? "back" : "forward"}
              d={arrowPath(from, to, arrowY)}
              fill="none"
              stroke={isBack ? "#0ea5e9" : "#94a3b8"}
              strokeWidth={2}
              markerEnd={isBack ? `url(#${back})` : `url(#${fwd})`}
            />
          );
        })}
        {nodes.map((node, i) =>
          node.next === null ? (
            <g key={`null-${node.id}`}>
              <line
                x1={slotCenterX(i)}
                y1={nodeY + NODE_H}
                x2={slotCenterX(i)}
                y2={nodeY + NODE_H + 8}
                stroke="#94a3b8"
                strokeWidth={2}
                markerEnd={`url(#${fwd})`}
              />
            </g>
          ) : null,
        )}
      </svg>
      {nodes.map((node, i) => (
        <NodeSlot
          key={node.id}
          node={node}
          roles={pointersOn(node.id, pointers)}
          reversed={reversed}
          x={PAD_X + i * (NODE_W + GAP)}
          y={nodeY}
        />
      ))}
    </>
  );
}

function NodeSlot({
  node,
  roles,
  reversed,
  x,
  y,
}: {
  node: ListNodeFrame;
  roles: string[];
  reversed: Set<number>;
  x: number;
  y: number;
}) {
  const fill = nodeFill(node.id, roles, reversed);
  const isHead = roles.includes("head");
  return (
    <div className="absolute" style={{ left: x, top: y - LABEL_H }}>
      <div
        className="flex h-[54px] flex-col items-center justify-end leading-tight"
        style={{ width: NODE_W }}
      >
        {roles.map((role) => (
          <span
            key={role}
            className={cn(
              "text-[10px] font-semibold",
              POINTER_LABEL_CLASS[role] ?? "text-slate-600",
            )}
          >
            {role}
          </span>
        ))}
      </div>
      <motion.div
        className={cn(
          "flex items-center justify-center rounded-md text-sm font-semibold tabular-nums",
          isHead && "ring-2 ring-sky-500 ring-offset-1",
        )}
        style={{ width: NODE_W, height: NODE_H, color: labelFill(roles) }}
        initial={false}
        animate={{ backgroundColor: fill }}
        transition={{ duration: 0.2 }}
      >
        {node.value}
      </motion.div>
      {node.next === null ? (
        <p className="mt-4 text-center text-[10px] font-semibold text-slate-500">
          null
        </p>
      ) : null}
    </div>
  );
}
