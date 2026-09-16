import { describe, expect, it, vi, beforeEach, afterEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { usePlayback } from "@/lib/playback/usePlayback";
import { generateMergeSortSteps } from "@/lib/algorithms/merge-sort/generateSteps";

describe("usePlayback", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });
  afterEach(() => {
    vi.useRealTimers();
  });

  it("starts at index 0 with steps for the initial array", () => {
    const { result } = renderHook(() =>
      usePlayback(generateMergeSortSteps, [3, 1, 2]),
    );
    expect(result.current.index).toBe(0);
    expect(result.current.steps.length).toBeGreaterThan(0);
    expect(result.current.playing).toBe(false);
  });

  it("stepForward and stepBackward move the index", () => {
    const { result } = renderHook(() =>
      usePlayback(generateMergeSortSteps, [3, 1, 2]),
    );
    act(() => result.current.stepForward());
    expect(result.current.index).toBe(1);
    act(() => result.current.stepBackward());
    expect(result.current.index).toBe(0);
  });

  it("play advances over time and pause stops", () => {
    const { result } = renderHook(() =>
      usePlayback(generateMergeSortSteps, [3, 1, 2]),
    );
    act(() => result.current.play());
    expect(result.current.playing).toBe(true);
    act(() => {
      vi.advanceTimersByTime(700);
    });
    expect(result.current.index).toBeGreaterThan(0);
    const at = result.current.index;
    act(() => result.current.pause());
    act(() => {
      vi.advanceTimersByTime(5000);
    });
    expect(result.current.index).toBe(at);
  });

  it("applyInputText regenerates steps on valid input", () => {
    const { result } = renderHook(() =>
      usePlayback(generateMergeSortSteps, [3, 1, 2]),
    );
    act(() => result.current.applyInputText("9, 8, 7"));
    expect(result.current.inputError).toBeNull();
    expect(result.current.input).toEqual([9, 8, 7]);
    expect(result.current.index).toBe(0);
  });

  it("keeps previous steps on invalid input", () => {
    const { result } = renderHook(() =>
      usePlayback(generateMergeSortSteps, [3, 1, 2]),
    );
    const prevLen = result.current.steps.length;
    act(() => result.current.applyInputText("1, nope"));
    expect(result.current.inputError).toBeTruthy();
    expect(result.current.steps.length).toBe(prevLen);
    expect(result.current.input).toEqual([3, 1, 2]);
  });
});
