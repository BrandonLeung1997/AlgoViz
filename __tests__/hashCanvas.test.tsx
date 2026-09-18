import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { HashCanvas } from "@/components/player/HashCanvas";
import { generateHashChainingSteps } from "@/lib/algorithms/hash-chaining/generateSteps";
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
});
