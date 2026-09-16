"use client";

import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import type { CodeLine } from "@/lib/algorithms/types";
import { cn } from "@/lib/utils";

export type CodeLanguage = "python" | "javascript" | "cpp";

export type CodePanelProps = {
  lines: CodeLine[];
  activeLineId: string;
  language: CodeLanguage;
  onLanguageChange: (language: CodeLanguage) => void;
};

function CodeBlock({
  lines,
  activeLineId,
}: {
  lines: CodeLine[];
  activeLineId: string;
}) {
  return (
    <pre className="overflow-x-auto rounded-md border border-slate-200 bg-slate-50 p-3 font-mono text-xs leading-relaxed text-slate-800">
      {lines.map((line) => {
        const active = line.id === activeLineId;
        return (
          <div
            key={line.id}
            className={cn(
              "border-l-2 border-transparent px-2 py-0.5",
              active && "border-amber-500 bg-amber-100",
            )}
          >
            {line.text || "\u00a0"}
          </div>
        );
      })}
    </pre>
  );
}

export function CodePanel({
  lines,
  activeLineId,
  language,
  onLanguageChange,
}: CodePanelProps) {
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-3">
      <h2 className="mb-2 text-sm font-semibold text-slate-800">Code</h2>
      <Tabs
        value={language}
        onValueChange={(v) => {
          if (v === "python" || v === "javascript" || v === "cpp") {
            onLanguageChange(v);
          }
        }}
      >
        <TabsList>
          <TabsTrigger value="python">Python</TabsTrigger>
          <TabsTrigger value="javascript">JavaScript</TabsTrigger>
          <TabsTrigger value="cpp">C++</TabsTrigger>
        </TabsList>
        <TabsContent value="python" className="mt-2">
          <CodeBlock lines={lines} activeLineId={activeLineId} />
        </TabsContent>
        <TabsContent value="javascript" className="mt-2">
          <CodeBlock lines={lines} activeLineId={activeLineId} />
        </TabsContent>
        <TabsContent value="cpp" className="mt-2">
          <CodeBlock lines={lines} activeLineId={activeLineId} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
