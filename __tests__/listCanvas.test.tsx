import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { ListCanvas } from "@/components/player/ListCanvas";
import { generateReverseListSteps } from "@/lib/algorithms/reverse-list/generateSteps";
import { generateCycleDetectionSteps } from "@/lib/algorithms/cycle-detection/generateSteps";
import { generateMergeListsSteps } from "@/lib/algorithms/merge-lists/generateSteps";
import type { Step } from "@/lib/algorithms/types";

afterEach(() => {
  cleanup();
});

const emptyStep: Step = {
  array: [],
  highlights: [],
  list: { nodes: [], head: null },
  codeLineId: "done",
  explanation: "empty",
};

describe("ListCanvas", () => {
  it("shows Empty list when there are no nodes", () => {
    render(<ListCanvas step={emptyStep} />);
    expect(screen.getByText("Empty list")).toBeInTheDocument();
  });

  it("labels curr, next, and head while reversing", () => {
    const step = generateReverseListSteps([1, 2, 3, 4]).find(
      (s) => s.codeLineId === "save-next",
    );
    render(<ListCanvas step={step} />);
    expect(screen.getByText("curr")).toBeInTheDocument();
    expect(screen.getByText("next")).toBeInTheDocument();
    expect(screen.getByText("head")).toBeInTheDocument();
    expect(screen.getByText("1")).toBeInTheDocument();
    expect(screen.getByText("4")).toBeInTheDocument();
  });

  it("labels prev after the first advance", () => {
    const step = generateReverseListSteps([1, 2, 3, 4]).find(
      (s) => s.codeLineId === "advance",
    );
    render(<ListCanvas step={step} />);
    expect(screen.getByText("prev")).toBeInTheDocument();
  });

  it("labels slow, fast, and head during cycle detection", () => {
    const step = generateCycleDetectionSteps([1, 2, 3, 4], 1).find(
      (s) => s.codeLineId === "init",
    );
    render(<ListCanvas step={step} />);
    expect(screen.getByText("slow")).toBeInTheDocument();
    expect(screen.getByText("fast")).toBeInTheDocument();
    expect(screen.getByText("head")).toBeInTheDocument();
  });

  it("draws a back-edge when the tail points to an earlier node", () => {
    const step = generateCycleDetectionSteps([1, 2, 3, 4], 1)[0];
    const { container } = render(<ListCanvas step={step} />);
    expect(container.querySelector('path[data-kind="back"]')).not.toBeNull();
    expect(container.querySelector('path[data-kind="forward"]')).not.toBeNull();
  });

  it("draws a self-loop back-edge for a single-node cycle", () => {
    const step = generateCycleDetectionSteps([7], 0)[0];
    const { container } = render(<ListCanvas step={step} />);
    expect(container.querySelector('path[data-kind="back"]')).not.toBeNull();
  });

  it("keeps an acyclic reverse-list as a straight chain at the start", () => {
    const step = generateReverseListSteps([1, 2, 3, 4])[0];
    const { container } = render(<ListCanvas step={step} />);
    expect(container.querySelector('path[data-kind="back"]')).toBeNull();
    expect(
      container.querySelectorAll('path[data-kind="forward"]').length,
    ).toBe(3);
  });

  it("labels List A, List B, and Merged for a merge step", () => {
    const step = generateMergeListsSteps([1, 3, 5], [2, 4])[0];
    render(<ListCanvas step={step} />);
    expect(screen.getByText("List A")).toBeInTheDocument();
    expect(screen.getByText("List B")).toBeInTheDocument();
    expect(screen.getByText("Merged")).toBeInTheDocument();
  });

  it("does not show merge row labels for reverse-list", () => {
    const step = generateReverseListSteps([1, 2, 3, 4])[0];
    render(<ListCanvas step={step} />);
    expect(screen.queryByText("List A")).not.toBeInTheDocument();
    expect(screen.queryByText("Merged")).not.toBeInTheDocument();
  });

  it("does not show merge row labels for cycle detection", () => {
    const step = generateCycleDetectionSteps([1, 2, 3, 4], 1)[0];
    render(<ListCanvas step={step} />);
    expect(screen.queryByText("List A")).not.toBeInTheDocument();
    expect(screen.queryByText("Merged")).not.toBeInTheDocument();
  });
});
