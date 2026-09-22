import { describe, expect, it } from "vitest";
import type { HashFrame } from "@/lib/algorithms/types";

describe("HashFrame probe fields", () => {
  it("allows layout probe with slots and probeIndex", () => {
    const hash: HashFrame = {
      bucketCount: 7,
      layout: "probe",
      slots: [null, null, null, null, null, 5, 12],
      hashIndex: 5,
      probeIndex: 6,
    };
    expect(hash.layout).toBe("probe");
    expect(hash.slots?.[5]).toBe(5);
    expect(hash.slots?.[6]).toBe(12);
    expect(hash.probeIndex).toBe(6);
  });
});
