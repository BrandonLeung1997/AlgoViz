import { cleanup, render, screen, within } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { HashCanvas } from "@/components/player/HashCanvas";
import { generateHashChainingSteps } from "@/lib/algorithms/hash-chaining/generateSteps";
import { generateLinearProbingSteps } from "@/lib/algorithms/linear-probing/generateSteps";
import type { Step } from "@/lib/algorithms/types";

afterEach(() => {
  cleanup();
});

const emptyStep: Step = {
  array: [],
  highlights: [],
  codeLineId: "done",
  explanation: "empty",
};

describe("HashCanvas", () => {
  it("shows No table to display when hash is missing", () => {
    render(<HashCanvas step={emptyStep} />);
    expect(screen.getByText("No table to display")).toBeInTheDocument();
  });

  it("shows the hash caption", () => {
    const step = generateHashChainingSteps([10, 15, 20], 5, 15)[0];
    render(<HashCanvas step={step} />);
    expect(screen.getByText(/hash\(k\) = k % m/)).toBeInTheDocument();
  });

  it("shows bucket 0 chain 10, 15, 20 after those inserts", () => {
    const step = generateHashChainingSteps([10, 15, 20], 5, 15).at(-1);
    render(<HashCanvas step={step} />);
    expect(screen.getByLabelText("bucket 0")).toBeInTheDocument();
    expect(screen.getByText("10")).toBeInTheDocument();
    expect(screen.getByText("15")).toBeInTheDocument();
    expect(screen.getByText("20")).toBeInTheDocument();
  });

  it("probe caption uses h(k, i) and shows slot 5 and slot 6", () => {
    const step = generateLinearProbingSteps([5, 12], 7, 12).at(-1);
    render(<HashCanvas step={step} />);
    expect(
      screen.getByText(/h\(k, i\) = \(k % m \+ i\) % m/),
    ).toBeInTheDocument();
    expect(screen.getByLabelText("slot 5")).toBeInTheDocument();
    expect(screen.getByLabelText("slot 6")).toBeInTheDocument();
    expect(within(screen.getByLabelText("slot 5")).getByText("5")).toBeInTheDocument();
    expect(within(screen.getByLabelText("slot 6")).getByText("12")).toBeInTheDocument();
  });

  it("chaining last step still shows bucket 0", () => {
    const step = generateHashChainingSteps([10, 15, 20], 5, 15).at(-1);
    render(<HashCanvas step={step} />);
    expect(screen.getByLabelText("bucket 0")).toBeInTheDocument();
  });
});
