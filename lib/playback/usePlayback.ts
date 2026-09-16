"use client";

import { useCallback, useEffect, useState } from "react";
import type { PlaybackSpeed, Step } from "@/lib/algorithms/types";
import { BASE_STEP_MS } from "@/lib/algorithms/types";
import { parseArrayInput } from "@/lib/algorithms/parseInput";
import { randomArray } from "@/lib/algorithms/randomArray";

export function usePlayback(
  generateSteps: (input: number[]) => Step[],
  initialInput: number[] = [8, 3, 5, 1, 9, 2, 7, 4],
) {
  const [input, setInput] = useState<number[]>(initialInput);
  const [inputText, setInputText] = useState(initialInput.join(", "));
  const [inputError, setInputError] = useState<string | null>(null);
  const [steps, setSteps] = useState<Step[]>(() => generateSteps(initialInput));
  const [index, setIndex] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState<PlaybackSpeed>(1);

  const step = steps[index];

  const regenerate = useCallback(
    (next: number[]) => {
      setInput(next);
      setInputText(next.join(", "));
      setInputError(null);
      setSteps(generateSteps(next));
      setIndex(0);
      setPlaying(false);
    },
    [generateSteps],
  );

  const play = () => setPlaying(true);
  const pause = () => setPlaying(false);

  const stepForward = () => {
    setPlaying(false);
    setIndex((i) => Math.min(i + 1, Math.max(steps.length - 1, 0)));
  };

  const stepBackward = () => {
    setPlaying(false);
    setIndex((i) => Math.max(i - 1, 0));
  };

  const reset = () => {
    setPlaying(false);
    setIndex(0);
  };

  const randomize = () => regenerate(randomArray(10));

  const applyInputText = (raw: string) => {
    setInputText(raw);
    const parsed = parseArrayInput(raw);
    if (!parsed.ok) {
      setInputError(parsed.error);
      return;
    }
    regenerate(parsed.values);
  };

  useEffect(() => {
    if (!playing) return;
    if (index >= steps.length - 1) {
      setPlaying(false);
      return;
    }
    const delay = BASE_STEP_MS / speed;
    const id = window.setTimeout(() => {
      setIndex((i) => Math.min(i + 1, steps.length - 1));
    }, delay);
    return () => window.clearTimeout(id);
  }, [playing, index, speed, steps.length]);

  return {
    input,
    inputText,
    inputError,
    steps,
    step,
    index,
    playing,
    speed,
    setSpeed,
    play,
    pause,
    stepForward,
    stepBackward,
    reset,
    randomize,
    applyInputText,
    setInputText,
  };
}
