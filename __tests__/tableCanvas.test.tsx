import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { TableCanvas } from "@/components/player/TableCanvas";
import { generateLcsSteps } from "@/lib/algorithms/lcs/generateSteps";
import { generateEditDistanceSteps } from "@/lib/algorithms/edit-distance/generateSteps";
import type { Step } from "@/lib/algorithms/types";

afterEach(() => {
  cleanup();
});

describe("TableCanvas footer", () => {
  it("still says LCS for an LCS step", () => {
    const step = generateLcsSteps("ABCD", "ACBD").at(-1);
    render(<TableCanvas step={step} />);
    expect(screen.getByText(/LCS:/)).toBeInTheDocument();
    expect(screen.queryByText(/Distance:/)).not.toBeInTheDocument();
  });

  it("says Distance for an edit-distance step", () => {
    const step = generateEditDistanceSteps("cat", "cut").at(-1);
    render(
      <TableCanvas
        step={step}
        resultLabel="Distance"
        hint="dp[i][j] = edit distance of X[:i] and Y[:j] (row-major fill)"
      />,
    );
    expect(screen.getByText(/Distance:/)).toBeInTheDocument();
    expect(screen.queryByText(/LCS:/)).not.toBeInTheDocument();
    expect(screen.getByText(/Distance:/).textContent).toMatch(/1/);
  });
});

describe("TableCanvas axis labels", () => {
  it("keeps character headers for LCS when labels are omitted", () => {
    const step = generateLcsSteps("AB", "CD")[0];
    render(<TableCanvas step={step} />);
    expect(screen.getByText("A")).toBeInTheDocument();
    expect(screen.getByText("B")).toBeInTheDocument();
    expect(screen.getByText("C")).toBeInTheDocument();
    expect(screen.getByText("D")).toBeInTheDocument();
    expect(screen.getAllByText("ε").length).toBeGreaterThanOrEqual(2);
    expect(screen.queryByText("w=2 v=3")).not.toBeInTheDocument();
  });

  it("renders knapsack item and capacity labels when provided", () => {
    const step: Step = {
      array: [],
      highlights: [],
      codeLineId: "done",
      explanation: "done",
      dpTable: {
        x: "",
        y: "",
        cells: [
          [0, 0, 0],
          [0, 0, 3],
        ],
        rowLabels: ["ε", "w=2 v=3"],
        colLabels: ["0", "1", "2"],
        resultLabel: "Value",
        reconstructed: "items 1 value=3",
      },
    };
    render(<TableCanvas step={step} />);
    expect(screen.getByText("w=2 v=3")).toBeInTheDocument();
    expect(screen.getAllByText("0").length).toBeGreaterThan(0);
    expect(screen.getByText("1")).toBeInTheDocument();
    expect(screen.getByText("2")).toBeInTheDocument();
    expect(screen.getByText(/Value:/)).toBeInTheDocument();
    expect(screen.getByText(/items 1 value=3/)).toBeInTheDocument();
  });

  it("renders ∞ for unreachable Infinity cells without changing LCS integers", () => {
    const step: Step = {
      array: [],
      highlights: [],
      codeLineId: "done",
      explanation: "done",
      dpTable: {
        x: "",
        y: "",
        cells: [
          [0, Number.POSITIVE_INFINITY, Number.POSITIVE_INFINITY],
          [0, Number.POSITIVE_INFINITY, 1],
        ],
        rowLabels: ["ε", "c=2"],
        colLabels: ["0", "1", "2"],
        resultLabel: "Coins",
        reconstructed: "impossible",
      },
    };
    render(<TableCanvas step={step} />);
    expect(screen.getAllByText("∞").length).toBe(3);
    expect(screen.queryByText("Infinity")).not.toBeInTheDocument();
    expect(screen.getByText(/impossible/)).toBeInTheDocument();

    cleanup();
    const lcs = generateLcsSteps("AB", "CD").at(-1)!;
    render(<TableCanvas step={lcs} />);
    expect(screen.queryByText("∞")).not.toBeInTheDocument();
    expect(screen.getAllByText("0").length).toBeGreaterThan(0);
  });
});
