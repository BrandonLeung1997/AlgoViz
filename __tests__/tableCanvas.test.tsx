import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { TableCanvas } from "@/components/player/TableCanvas";
import { generateLcsSteps } from "@/lib/algorithms/lcs/generateSteps";
import { generateEditDistanceSteps } from "@/lib/algorithms/edit-distance/generateSteps";

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
