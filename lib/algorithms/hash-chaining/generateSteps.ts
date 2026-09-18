import type { HashFrame, Step } from "@/lib/algorithms/types";

function cloneBuckets(buckets: number[][]): number[][] {
  return buckets.map((chain) => [...chain]);
}

type LastFrame = {
  op?: "insert" | "search";
  key?: number;
  hashIndex?: number;
  current: { bucket: number; offset: number } | null;
  found?: boolean;
};

export function generateHashChainingSteps(
  keys: number[],
  bucketCount: number,
  searchKey: number,
): Step[] {
  const steps: Step[] = [];
  const m = bucketCount;
  const buckets: number[][] = Array.from({ length: m }, () => []);
  let last: LastFrame = { current: null };

  const push = (opts: {
    codeLineId: string;
    explanation: string;
    op?: "insert" | "search";
    key?: number;
    hashIndex?: number;
    current: { bucket: number; offset: number } | null;
    found?: boolean;
    status?: string;
  }) => {
    const hash: HashFrame = {
      bucketCount: m,
      buckets: cloneBuckets(buckets),
      current: opts.current,
    };
    if (opts.op !== undefined) hash.op = opts.op;
    if (opts.key !== undefined) hash.key = opts.key;
    if (opts.hashIndex !== undefined) hash.hashIndex = opts.hashIndex;
    if (opts.found !== undefined) hash.found = opts.found;
    if (opts.status !== undefined) hash.status = opts.status;
    last = {
      op: opts.op,
      key: opts.key,
      hashIndex: opts.hashIndex,
      current: opts.current,
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
      buckets: cloneBuckets(buckets),
      current: last.current,
    };
    if (last.op !== undefined) hash.op = last.op;
    if (last.key !== undefined) hash.key = last.key;
    if (last.hashIndex !== undefined) hash.hashIndex = last.hashIndex;
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
    explanation: `Start with ${m} empty chains.`,
    current: null,
  });

  for (const key of keys) {
    const i = key % m;
    push({
      codeLineId: "hash",
      explanation: `${key} hashes to bucket ${i}.`,
      op: "insert",
      key,
      hashIndex: i,
      current: null,
      status: "hash(k) = k % m",
    });
    const chain = buckets[i]!;
    let duplicate = false;
    for (let offset = 0; offset < chain.length; offset += 1) {
      push({
        codeLineId: "walk",
        explanation: `Compare ${key} to ${chain[offset]} in bucket ${i}.`,
        op: "insert",
        key,
        hashIndex: i,
        current: { bucket: i, offset },
        status: "scan chain",
      });
      if (chain[offset] === key) {
        push({
          codeLineId: "found",
          explanation: `${key} is already in the chain; skip insert.`,
          op: "insert",
          key,
          hashIndex: i,
          current: { bucket: i, offset },
          found: true,
          status: "already present, skip",
        });
        duplicate = true;
        break;
      }
    }
    if (duplicate) continue;
    chain.push(key);
    push({
      codeLineId: "insert",
      explanation: `Append ${key} to bucket ${i}.`,
      op: "insert",
      key,
      hashIndex: i,
      current: { bucket: i, offset: chain.length - 1 },
      status: "append",
    });
  }

  const i = searchKey % m;
  push({
    codeLineId: "hash",
    explanation: `Search ${searchKey} hashes to bucket ${i}.`,
    op: "search",
    key: searchKey,
    hashIndex: i,
    current: null,
    status: "hash(k) = k % m",
  });
  const chain = buckets[i]!;
  for (let offset = 0; offset < chain.length; offset += 1) {
    push({
      codeLineId: "walk",
      explanation: `Compare ${searchKey} to ${chain[offset]} in bucket ${i}.`,
      op: "search",
      key: searchKey,
      hashIndex: i,
      current: { bucket: i, offset },
      status: "scan chain",
    });
    if (chain[offset] === searchKey) {
      push({
        codeLineId: "found",
        explanation: `Found ${searchKey} in bucket ${i}.`,
        op: "search",
        key: searchKey,
        hashIndex: i,
        current: { bucket: i, offset },
        found: true,
        status: "hit",
      });
      pushDone();
      return steps;
    }
  }
  push({
    codeLineId: "miss",
    explanation: `${searchKey} is not in bucket ${i}.`,
    op: "search",
    key: searchKey,
    hashIndex: i,
    current: null,
    found: false,
    status: "not in chain",
  });
  pushDone();
  return steps;
}
