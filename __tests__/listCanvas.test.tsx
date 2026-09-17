import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { ListCanvas } from "@/components/player/ListCanvas";
import { generateReverseListSteps } from "@/lib/algorithms/reverse-list/generateSteps";
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
});
