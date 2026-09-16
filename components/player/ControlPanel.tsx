"use client";

import {
  Pause,
  Play,
  RotateCcw,
  Shuffle,
  SkipBack,
  SkipForward,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import type { PlaybackSpeed } from "@/lib/algorithms/types";

const SPEEDS: PlaybackSpeed[] = [0.5, 1, 1.5, 2, 3, 4];

export type ControlPanelProps = {
  playing: boolean;
  speed: PlaybackSpeed;
  onPlay: () => void;
  onPause: () => void;
  onStepForward: () => void;
  onStepBackward: () => void;
  onReset: () => void;
  onRandomize: () => void;
  onSpeedChange: (speed: PlaybackSpeed) => void;
  disableBack: boolean;
  disableForward: boolean;
};

export function ControlPanel({
  playing,
  speed,
  onPlay,
  onPause,
  onStepForward,
  onStepBackward,
  onReset,
  onRandomize,
  onSpeedChange,
  disableBack,
  disableForward,
}: ControlPanelProps) {
  const speedIndex = Math.max(0, SPEEDS.indexOf(speed));

  return (
    <div className="flex flex-wrap items-center gap-3 rounded-lg border border-slate-200 bg-white p-3">
      <div className="flex items-center gap-1">
        <Button
          type="button"
          variant="outline"
          size="icon"
          onClick={onStepBackward}
          disabled={disableBack}
          aria-label="Step backward"
        >
          <SkipBack />
        </Button>
        {playing ? (
          <Button
            type="button"
            variant="default"
            size="icon"
            onClick={onPause}
            aria-label="Pause"
          >
            <Pause />
          </Button>
        ) : (
          <Button
            type="button"
            variant="default"
            size="icon"
            onClick={onPlay}
            aria-label="Play"
          >
            <Play />
          </Button>
        )}
        <Button
          type="button"
          variant="outline"
          size="icon"
          onClick={onStepForward}
          disabled={disableForward}
          aria-label="Step forward"
        >
          <SkipForward />
        </Button>
        <Button
          type="button"
          variant="outline"
          size="icon"
          onClick={onReset}
          aria-label="Reset"
        >
          <RotateCcw />
        </Button>
        <Button
          type="button"
          variant="outline"
          size="icon"
          onClick={onRandomize}
          aria-label="Randomize array"
        >
          <Shuffle />
        </Button>
      </div>
      <div className="flex min-w-[140px] flex-1 items-center gap-3 sm:max-w-xs">
        <span className="shrink-0 text-xs text-slate-600">Speed</span>
        <Slider
          min={0}
          max={SPEEDS.length - 1}
          step={1}
          value={[speedIndex]}
          onValueChange={(values) => {
            const idx = Array.isArray(values) ? (values[0] ?? speedIndex) : values;
            const next = SPEEDS[idx];
            if (next !== undefined) onSpeedChange(next);
          }}
          aria-label="Playback speed"
        />
        <span className="w-8 shrink-0 text-right text-sm font-medium tabular-nums text-slate-800">
          {speed}x
        </span>
      </div>
    </div>
  );
}
