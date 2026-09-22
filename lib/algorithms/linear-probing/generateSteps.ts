import type { HashFrame, Step } from "@/lib/algorithms/types";

type LastFrame = {
  op?: "insert" | "search";
  key?: number;
  hashIndex?: number;
  probeIndex?: number;
  found?: boolean;
};

export function generateLinearProbingSteps(
  keys: number[],
  tableSize: number,
  searchKey: number,
): Step[] {
  const steps: Step[] = [];
  const m = tableSize;
  const slots: (number | null)[] = Array.from({ length: m }, () => null);
  let last: LastFrame = {};

  const push = (opts: {
    codeLineId: string;
    explanation: string;
    op?: "insert" | "search";
    key?: number;
    hashIndex?: number;
    probeIndex?: number;
    found?: boolean;
    status?: string;
  }) => {
    const hash: HashFrame = {
      bucketCount: m,
      layout: "probe",
      slots: [...slots],
    };
    if (opts.op !== undefined) hash.op = opts.op;
    if (opts.key !== undefined) hash.key = opts.key;
    if (opts.hashIndex !== undefined) hash.hashIndex = opts.hashIndex;
    if (opts.probeIndex !== undefined) hash.probeIndex = opts.probeIndex;
    if (opts.found !== undefined) hash.found = opts.found;
    if (opts.status !== undefined) hash.status = opts.status;
    last = {
      op: opts.op,
      key: opts.key,
      hashIndex: opts.hashIndex,
      probeIndex: opts.probeIndex,
      found: opts.found,
    };
    steps.push({
      array: [...keys],
      highlights: [],
      hash,
      codeLineId: opts.codeLineId,
      explanation: opts.explanation,
    });
  };

  const pushDone = () => {
    const hash: HashFrame = {
      bucketCount: m,
      layout: "probe",
      slots: [...slots],
    };
    if (last.op !== undefined) hash.op = last.op;
    if (last.key !== undefined) hash.key = last.key;
    if (last.hashIndex !== undefined) hash.hashIndex = last.hashIndex;
    if (last.probeIndex !== undefined) hash.probeIndex = last.probeIndex;
    if (last.found !== undefined) hash.found = last.found;
    steps.push({
      array: [...keys],
      highlights: [],
      hash,
      codeLineId: "done",
      explanation: "Inserts finished; search complete.",
    });
  };

  push({
    codeLineId: "fn-def",
    explanation: `Start with ${m} empty slots.`,
  });

  for (const key of keys) {
    const home = key % m;
    push({
      codeLineId: "hash",
      explanation: `${key} hashes to home slot ${home}.`,
      op: "insert",
      key,
      hashIndex: home,
      status: "h(k, i) = (k % m + i) % m",
    });
    let placed = false;
    let lastJ = home;
    for (let i = 0; i < m; i += 1) {
      const j = (home + i) % m;
      lastJ = j;
      push({
        codeLineId: "probe",
        explanation: `Probe slot ${j} for ${key}.`,
        op: "insert",
        key,
        hashIndex: home,
        probeIndex: j,
        status: `probe slot ${j}`,
      });
      if (slots[j] === key) {
        push({
          codeLineId: "found",
          explanation: `${key} is already in slot ${j}; skip insert.`,
          op: "insert",
          key,
          hashIndex: home,
          probeIndex: j,
          found: true,
          status: "already present, skip",
        });
        placed = true;
        break;
      }
      if (slots[j] === null) {
        slots[j] = key;
        push({
          codeLineId: "insert",
          explanation: `Place ${key} in slot ${j}.`,
          op: "insert",
          key,
          hashIndex: home,
          probeIndex: j,
          status: "place",
        });
        placed = true;
        break;
      }
    }
    if (!placed) {
      push({
        codeLineId: "full",
        explanation: `Table is full; ${key} was not inserted.`,
        op: "insert",
        key,
        hashIndex: home,
        probeIndex: lastJ,
        status: "table full",
      });
      break;
    }
  }

  const home = searchKey % m;
  push({
    codeLineId: "hash",
    explanation: `Search ${searchKey} hashes to home slot ${home}.`,
    op: "search",
    key: searchKey,
    hashIndex: home,
    status: "h(k, i) = (k % m + i) % m",
  });
  let lastJ = home;
  for (let i = 0; i < m; i += 1) {
    const j = (home + i) % m;
    lastJ = j;
    push({
      codeLineId: "probe",
      explanation: `Probe slot ${j} for ${searchKey}.`,
      op: "search",
      key: searchKey,
      hashIndex: home,
      probeIndex: j,
      status: `probe slot ${j}`,
    });
    if (slots[j] === searchKey) {
      push({
        codeLineId: "found",
        explanation: `Found ${searchKey} in slot ${j}.`,
        op: "search",
        key: searchKey,
        hashIndex: home,
        probeIndex: j,
        found: true,
        status: "hit",
      });
      pushDone();
      return steps;
    }
    if (slots[j] === null) {
      push({
        codeLineId: "miss",
        explanation: `${searchKey} hits an empty slot at ${j}.`,
        op: "search",
        key: searchKey,
        hashIndex: home,
        probeIndex: j,
        found: false,
        status: "empty slot",
      });
      pushDone();
      return steps;
    }
  }
  push({
    codeLineId: "miss",
    explanation: `${searchKey} is not in the table.`,
    op: "search",
    key: searchKey,
    hashIndex: home,
    probeIndex: lastJ,
    found: false,
    status: "not found (full scan)",
  });
  pushDone();
  return steps;
}
