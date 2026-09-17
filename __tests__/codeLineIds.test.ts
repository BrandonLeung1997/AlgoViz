import { describe, expect, it } from "vitest";
import { MERGE_SORT_CODE } from "@/lib/algorithms/merge-sort/code";
import { generateMergeSortSteps } from "@/lib/algorithms/merge-sort/generateSteps";
import { BINARY_SEARCH_CODE } from "@/lib/algorithms/binary-search/code";
import { generateBinarySearchSteps } from "@/lib/algorithms/binary-search/generateSteps";
import { LINEAR_SEARCH_CODE } from "@/lib/algorithms/linear-search/code";
import { generateLinearSearchSteps } from "@/lib/algorithms/linear-search/generateSteps";
import { QUICK_SORT_CODE } from "@/lib/algorithms/quick-sort/code";
import { generateQuickSortSteps } from "@/lib/algorithms/quick-sort/generateSteps";
import { BUBBLE_SORT_CODE } from "@/lib/algorithms/bubble-sort/code";
import { generateBubbleSortSteps } from "@/lib/algorithms/bubble-sort/generateSteps";
import { INSERTION_SORT_CODE } from "@/lib/algorithms/insertion-sort/code";
import { generateInsertionSortSteps } from "@/lib/algorithms/insertion-sort/generateSteps";
import { SELECTION_SORT_CODE } from "@/lib/algorithms/selection-sort/code";
import { generateSelectionSortSteps } from "@/lib/algorithms/selection-sort/generateSteps";
import { HEAP_SORT_CODE } from "@/lib/algorithms/heap-sort/code";
import { generateHeapSortSteps } from "@/lib/algorithms/heap-sort/generateSteps";
import { BFS_CODE } from "@/lib/algorithms/bfs/code";
import { generateBfsSteps } from "@/lib/algorithms/bfs/generateSteps";
import { DFS_CODE } from "@/lib/algorithms/dfs/code";
import { generateDfsSteps } from "@/lib/algorithms/dfs/generateSteps";
import { DIJKSTRA_CODE } from "@/lib/algorithms/dijkstra/code";
import { generateDijkstraSteps } from "@/lib/algorithms/dijkstra/generateSteps";
import { BELLMAN_FORD_CODE } from "@/lib/algorithms/bellman-ford/code";
import { generateBellmanFordSteps } from "@/lib/algorithms/bellman-ford/generateSteps";
import { KRUSKAL_CODE } from "@/lib/algorithms/kruskal/code";
import { generateKruskalSteps } from "@/lib/algorithms/kruskal/generateSteps";
import { PRIM_CODE } from "@/lib/algorithms/prim/code";
import { generatePrimSteps } from "@/lib/algorithms/prim/generateSteps";
import {
  DEFAULT_BELLMAN_FORD_GRAPH,
  DEFAULT_DIJKSTRA_GRAPH,
  DEFAULT_MST_GRAPH,
} from "@/lib/algorithms/randomGraph";
import { TOPO_SORT_CODE } from "@/lib/algorithms/topological-sort/code";
import { generateTopoSortSteps } from "@/lib/algorithms/topological-sort/generateSteps";
import { LCS_CODE } from "@/lib/algorithms/lcs/code";
import { generateLcsSteps } from "@/lib/algorithms/lcs/generateSteps";
import { EDIT_DISTANCE_CODE } from "@/lib/algorithms/edit-distance/code";
import { generateEditDistanceSteps } from "@/lib/algorithms/edit-distance/generateSteps";
import type { Graph } from "@/lib/algorithms/types";

describe("merge sort code line ids", () => {
  it("python, javascript, and cpp share the same id set", () => {
    const ids = (lang: keyof typeof MERGE_SORT_CODE) =>
      new Set(MERGE_SORT_CODE[lang].map((l) => l.id));
    expect(ids("javascript")).toEqual(ids("python"));
    expect(ids("cpp")).toEqual(ids("python"));
  });

  it("every generated step codeLineId exists in the listings", () => {
    const valid = new Set(MERGE_SORT_CODE.python.map((l) => l.id));
    for (const step of generateMergeSortSteps([9, 4, 1, 7, 3])) {
      expect(valid.has(step.codeLineId)).toBe(true);
    }
  });
});

describe("binary search code line ids", () => {
  it("python, javascript, and cpp share the same id set", () => {
    const ids = (lang: keyof typeof BINARY_SEARCH_CODE) =>
      new Set(BINARY_SEARCH_CODE[lang].map((l) => l.id));
    expect(ids("javascript")).toEqual(ids("python"));
    expect(ids("cpp")).toEqual(ids("python"));
  });

  it("every generated step codeLineId exists in the listings", () => {
    const valid = new Set(BINARY_SEARCH_CODE.python.map((l) => l.id));
    const runs = [
      generateBinarySearchSteps([1, 3, 5, 7, 9], 7),
      generateBinarySearchSteps([1, 3, 5, 7, 9], 4),
      generateBinarySearchSteps([1, 3, 5, 7, 9], 1),
      generateBinarySearchSteps([1, 3, 5, 7, 9], 9),
      generateBinarySearchSteps([], 1),
    ];
    for (const steps of runs) {
      for (const step of steps) {
        expect(valid.has(step.codeLineId)).toBe(true);
      }
    }
  });
});

describe("linear search code line ids", () => {
  it("python, javascript, and cpp share the same id set", () => {
    const ids = (lang: keyof typeof LINEAR_SEARCH_CODE) =>
      new Set(LINEAR_SEARCH_CODE[lang].map((l) => l.id));
    expect(ids("javascript")).toEqual(ids("python"));
    expect(ids("cpp")).toEqual(ids("python"));
  });

  it("every generated step codeLineId exists in the listings", () => {
    const valid = new Set(LINEAR_SEARCH_CODE.python.map((l) => l.id));
    const runs = [
      generateLinearSearchSteps([9, 3, 1], 3),
      generateLinearSearchSteps([9, 3, 1], 4),
      generateLinearSearchSteps([], 1),
    ];
    for (const steps of runs) {
      for (const step of steps) {
        expect(valid.has(step.codeLineId)).toBe(true);
      }
    }
  });
});

describe("quick sort code line ids", () => {
  it("python, javascript, and cpp share the same id set", () => {
    const ids = (lang: keyof typeof QUICK_SORT_CODE) =>
      new Set(QUICK_SORT_CODE[lang].map((l) => l.id));
    expect(ids("javascript")).toEqual(ids("python"));
    expect(ids("cpp")).toEqual(ids("python"));
  });

  it("every generated step codeLineId exists in the listings", () => {
    const valid = new Set(QUICK_SORT_CODE.python.map((l) => l.id));
    const runs = [
      generateQuickSortSteps([9, 4, 1, 7, 3]),
      generateQuickSortSteps([1, 2, 3, 4]),
      generateQuickSortSteps([7]),
      generateQuickSortSteps([]),
    ];
    for (const steps of runs) {
      for (const step of steps) {
        expect(valid.has(step.codeLineId)).toBe(true);
      }
    }
  });
});

describe("bubble sort code line ids", () => {
  it("python, javascript, and cpp share the same id set", () => {
    const ids = (lang: keyof typeof BUBBLE_SORT_CODE) =>
      new Set(BUBBLE_SORT_CODE[lang].map((l) => l.id));
    expect(ids("javascript")).toEqual(ids("python"));
    expect(ids("cpp")).toEqual(ids("python"));
  });

  it("every generated step codeLineId exists in the listings", () => {
    const valid = new Set(BUBBLE_SORT_CODE.python.map((l) => l.id));
    const runs = [
      generateBubbleSortSteps([9, 4, 1, 7, 3]),
      generateBubbleSortSteps([1, 2, 3, 4]),
      generateBubbleSortSteps([7]),
      generateBubbleSortSteps([]),
    ];
    for (const steps of runs) {
      for (const step of steps) {
        expect(valid.has(step.codeLineId)).toBe(true);
      }
    }
  });
});

describe("insertion sort code line ids", () => {
  it("python, javascript, and cpp share the same id set", () => {
    const ids = (lang: keyof typeof INSERTION_SORT_CODE) =>
      new Set(INSERTION_SORT_CODE[lang].map((l) => l.id));
    expect(ids("javascript")).toEqual(ids("python"));
    expect(ids("cpp")).toEqual(ids("python"));
  });

  it("every generated step codeLineId exists in the listings", () => {
    const valid = new Set(INSERTION_SORT_CODE.python.map((l) => l.id));
    const runs = [
      generateInsertionSortSteps([9, 4, 1, 7, 3]),
      generateInsertionSortSteps([1, 2, 3, 4]),
      generateInsertionSortSteps([4, 3, 2, 1]),
      generateInsertionSortSteps([7]),
      generateInsertionSortSteps([]),
    ];
    for (const steps of runs) {
      for (const step of steps) {
        expect(valid.has(step.codeLineId)).toBe(true);
      }
    }
  });
});

describe("selection sort code line ids", () => {
  it("python, javascript, and cpp share the same id set", () => {
    const ids = (lang: keyof typeof SELECTION_SORT_CODE) =>
      new Set(SELECTION_SORT_CODE[lang].map((l) => l.id));
    expect(ids("javascript")).toEqual(ids("python"));
    expect(ids("cpp")).toEqual(ids("python"));
  });

  it("every generated step codeLineId exists in the listings", () => {
    const valid = new Set(SELECTION_SORT_CODE.python.map((l) => l.id));
    const runs = [
      generateSelectionSortSteps([9, 4, 1, 7, 3]),
      generateSelectionSortSteps([1, 2, 3, 4]),
      generateSelectionSortSteps([4, 3, 2, 1]),
      generateSelectionSortSteps([3, 1, 1, 2]),
      generateSelectionSortSteps([7]),
      generateSelectionSortSteps([]),
    ];
    for (const steps of runs) {
      for (const step of steps) {
        expect(valid.has(step.codeLineId)).toBe(true);
      }
    }
  });
});

describe("heap sort code line ids", () => {
  it("python, javascript, and cpp share the same id set", () => {
    const ids = (lang: keyof typeof HEAP_SORT_CODE) =>
      new Set(HEAP_SORT_CODE[lang].map((l) => l.id));
    expect(ids("javascript")).toEqual(ids("python"));
    expect(ids("cpp")).toEqual(ids("python"));
  });

  it("every generated step codeLineId exists in the listings", () => {
    const valid = new Set(HEAP_SORT_CODE.python.map((l) => l.id));
    const runs = [
      generateHeapSortSteps([9, 4, 1, 7, 3]),
      generateHeapSortSteps([1, 2, 3, 4]),
      generateHeapSortSteps([4, 3, 2, 1]),
      generateHeapSortSteps([3, 1, 1, 2]),
      generateHeapSortSteps([7]),
      generateHeapSortSteps([]),
    ];
    for (const steps of runs) {
      for (const step of steps) {
        expect(valid.has(step.codeLineId)).toBe(true);
      }
    }
  });
});

describe("bfs code line ids", () => {
  const demo: Graph = {
    nodes: [0, 1, 2, 3],
    adj: { 0: [1, 2], 1: [0, 3], 2: [0], 3: [1] },
  };

  it("python, javascript, and cpp share the same id set", () => {
    const ids = (lang: keyof typeof BFS_CODE) =>
      new Set(BFS_CODE[lang].map((l) => l.id));
    expect(ids("javascript")).toEqual(ids("python"));
    expect(ids("cpp")).toEqual(ids("python"));
  });

  it("every generated step codeLineId exists in the listings", () => {
    const valid = new Set(BFS_CODE.python.map((l) => l.id));
    const runs = [
      generateBfsSteps(demo, 0),
      generateBfsSteps({ nodes: [0], adj: { 0: [] } }, 0),
      generateBfsSteps(
        {
          nodes: [0, 1, 2],
          adj: { 0: [1], 1: [0], 2: [] },
        },
        0,
      ),
    ];
    for (const steps of runs) {
      for (const step of steps) {
        expect(valid.has(step.codeLineId)).toBe(true);
      }
    }
  });
});

describe("dfs code line ids", () => {
  const demo: Graph = {
    nodes: [0, 1, 2, 3],
    adj: { 0: [1, 2], 1: [0, 3], 2: [0], 3: [1] },
  };

  it("python, javascript, and cpp share the same id set", () => {
    const ids = (lang: keyof typeof DFS_CODE) =>
      new Set(DFS_CODE[lang].map((l) => l.id));
    expect(ids("javascript")).toEqual(ids("python"));
    expect(ids("cpp")).toEqual(ids("python"));
  });

  it("every generated step codeLineId exists in the listings", () => {
    const valid = new Set(DFS_CODE.python.map((l) => l.id));
    const runs = [
      generateDfsSteps(demo, 0),
      generateDfsSteps({ nodes: [0], adj: { 0: [] } }, 0),
      generateDfsSteps(
        {
          nodes: [0, 1, 2],
          adj: { 0: [1], 1: [0], 2: [] },
        },
        0,
      ),
    ];
    for (const steps of runs) {
      for (const step of steps) {
        expect(valid.has(step.codeLineId)).toBe(true);
      }
    }
  });
});

describe("dijkstra code line ids", () => {
  const demo: Graph = {
    nodes: [0, 1, 2],
    adj: { 0: [1, 2], 1: [0, 2], 2: [0, 1] },
    weights: { "0-1": 1, "1-2": 1, "0-2": 10 },
  };

  it("python, javascript, and cpp share the same id set", () => {
    const ids = (lang: keyof typeof DIJKSTRA_CODE) =>
      new Set(DIJKSTRA_CODE[lang].map((l) => l.id));
    expect(ids("javascript")).toEqual(ids("python"));
    expect(ids("cpp")).toEqual(ids("python"));
  });

  it("every generated step codeLineId exists in the listings", () => {
    const valid = new Set(DIJKSTRA_CODE.python.map((l) => l.id));
    const runs = [
      generateDijkstraSteps(demo, 0),
      generateDijkstraSteps({ nodes: [0], adj: { 0: [] } }, 0),
      generateDijkstraSteps(
        {
          nodes: [0, 1, 2],
          adj: { 0: [1], 1: [0], 2: [] },
        },
        0,
      ),
    ];
    for (const steps of runs) {
      for (const step of steps) {
        expect(valid.has(step.codeLineId)).toBe(true);
      }
    }
  });
});

describe("bellman-ford code line ids", () => {
  const tiny: Graph = {
    nodes: [0, 1],
    adj: { 0: [1], 1: [] },
    directedWeights: { "0>1": 2 },
  };
  const cycle: Graph = {
    nodes: [0, 1, 2],
    adj: { 0: [1], 1: [2], 2: [1] },
    directedWeights: { "0>1": 1, "1>2": -3, "2>1": 1 },
  };

  it("python, javascript, and cpp share the same id set", () => {
    const ids = (lang: keyof typeof BELLMAN_FORD_CODE) =>
      new Set(BELLMAN_FORD_CODE[lang].map((l) => l.id));
    expect(ids("javascript")).toEqual(ids("python"));
    expect(ids("cpp")).toEqual(ids("python"));
  });

  it("every generated step codeLineId exists in the listings", () => {
    const valid = new Set(BELLMAN_FORD_CODE.python.map((l) => l.id));
    const runs = [
      generateBellmanFordSteps(DEFAULT_BELLMAN_FORD_GRAPH, 0),
      generateBellmanFordSteps(tiny, 0),
      generateBellmanFordSteps(cycle, 0),
    ];
    for (const steps of runs) {
      for (const step of steps) {
        expect(valid.has(step.codeLineId)).toBe(true);
      }
    }
  });
});

describe("kruskal code line ids", () => {
  const triangle: Graph = {
    nodes: [0, 1, 2],
    adj: { 0: [1, 2], 1: [0, 2], 2: [0, 1] },
    weights: { "0-1": 1, "1-2": 1, "0-2": 10 },
  };
  const disconnected: Graph = {
    nodes: [0, 1, 2, 3],
    adj: { 0: [1], 1: [0], 2: [3], 3: [2] },
    weights: { "0-1": 1, "2-3": 2 },
  };

  it("python, javascript, and cpp share the same id set", () => {
    const ids = (lang: keyof typeof KRUSKAL_CODE) =>
      new Set(KRUSKAL_CODE[lang].map((l) => l.id));
    expect(ids("javascript")).toEqual(ids("python"));
    expect(ids("cpp")).toEqual(ids("python"));
  });

  it("every generated step codeLineId exists in the listings", () => {
    const valid = new Set(KRUSKAL_CODE.python.map((l) => l.id));
    const runs = [
      generateKruskalSteps(DEFAULT_MST_GRAPH),
      generateKruskalSteps(triangle),
      generateKruskalSteps({ nodes: [0], adj: { 0: [] } }),
      generateKruskalSteps(disconnected),
    ];
    for (const steps of runs) {
      for (const step of steps) {
        expect(valid.has(step.codeLineId)).toBe(true);
      }
    }
  });
});

describe("prim code line ids", () => {
  const disconnected: Graph = {
    nodes: [0, 1, 2, 3],
    adj: { 0: [1], 1: [0], 2: [3], 3: [2] },
    weights: { "0-1": 1, "2-3": 2 },
  };

  it("python, javascript, and cpp share the same id set", () => {
    const ids = (lang: keyof typeof PRIM_CODE) =>
      new Set(PRIM_CODE[lang].map((l) => l.id));
    expect(ids("javascript")).toEqual(ids("python"));
    expect(ids("cpp")).toEqual(ids("python"));
  });

  it("every generated step codeLineId exists in the listings", () => {
    const valid = new Set(PRIM_CODE.python.map((l) => l.id));
    const runs = [
      generatePrimSteps(DEFAULT_DIJKSTRA_GRAPH, 0),
      generatePrimSteps({ nodes: [0], adj: { 0: [] } }, 0),
      generatePrimSteps(disconnected, 0),
    ];
    for (const steps of runs) {
      for (const step of steps) {
        expect(valid.has(step.codeLineId)).toBe(true);
      }
    }
  });
});

describe("topological sort code line ids", () => {
  const diamond: Graph = {
    nodes: [0, 1, 2, 3],
    adj: { 0: [1, 2], 1: [3], 2: [3], 3: [] },
  };

  it("python, javascript, and cpp share the same id set", () => {
    const ids = (lang: keyof typeof TOPO_SORT_CODE) =>
      new Set(TOPO_SORT_CODE[lang].map((l) => l.id));
    expect(ids("javascript")).toEqual(ids("python"));
    expect(ids("cpp")).toEqual(ids("python"));
  });

  it("every generated step codeLineId exists in the listings", () => {
    const valid = new Set(TOPO_SORT_CODE.python.map((l) => l.id));
    const runs = [
      generateTopoSortSteps(diamond),
      generateTopoSortSteps({ nodes: [0], adj: { 0: [] } }),
      generateTopoSortSteps({
        nodes: [0, 1, 2],
        adj: { 0: [1], 1: [2], 2: [0] },
      }),
    ];
    for (const steps of runs) {
      for (const step of steps) {
        expect(valid.has(step.codeLineId)).toBe(true);
      }
    }
  });
});

describe("lcs code line ids", () => {
  it("python, javascript, and cpp share the same id set", () => {
    const ids = (lang: keyof typeof LCS_CODE) =>
      new Set(LCS_CODE[lang].map((l) => l.id));
    expect(ids("javascript")).toEqual(ids("python"));
    expect(ids("cpp")).toEqual(ids("python"));
  });

  it("every generated step codeLineId exists in the listings", () => {
    const valid = new Set(LCS_CODE.python.map((l) => l.id));
    const runs = [
      generateLcsSteps("ABCD", "ACBD"),
      generateLcsSteps("", ""),
      generateLcsSteps("ABC", ""),
      generateLcsSteps("ABC", "XYZ"),
      generateLcsSteps("AGGTAB", "GXTXAYB"),
    ];
    for (const steps of runs) {
      for (const step of steps) {
        expect(valid.has(step.codeLineId)).toBe(true);
      }
    }
  });

  it("every write step codeLineId is in the listings", () => {
    const valid = new Set(LCS_CODE.python.map((l) => l.id));
    for (const step of generateLcsSteps("ABCD", "ACBD")) {
      if (step.codeLineId === "match" || step.codeLineId === "skip") {
        expect(valid.has(step.codeLineId)).toBe(true);
        expect(step.dpTable?.write).toBeDefined();
      }
    }
  });
});

describe("edit distance code line ids", () => {
  it("python, javascript, and cpp share the same id set", () => {
    const ids = (lang: keyof typeof EDIT_DISTANCE_CODE) =>
      new Set(EDIT_DISTANCE_CODE[lang].map((l) => l.id));
    expect(ids("javascript")).toEqual(ids("python"));
    expect(ids("cpp")).toEqual(ids("python"));
  });

  it("every generated step codeLineId exists in the listings", () => {
    const valid = new Set(EDIT_DISTANCE_CODE.python.map((l) => l.id));
    const runs = [
      generateEditDistanceSteps("cat", "cut"),
      generateEditDistanceSteps("", ""),
      generateEditDistanceSteps("ABC", ""),
      generateEditDistanceSteps("", "XYZ"),
      generateEditDistanceSteps("ABC", "DEF"),
      generateEditDistanceSteps("kitten", "sitting"),
    ];
    for (const steps of runs) {
      for (const step of steps) {
        expect(valid.has(step.codeLineId)).toBe(true);
      }
    }
  });

  it("every write step codeLineId is in the listings", () => {
    const valid = new Set(EDIT_DISTANCE_CODE.python.map((l) => l.id));
    for (const step of generateEditDistanceSteps("cat", "cut")) {
      if (step.codeLineId === "match" || step.codeLineId === "mismatch") {
        expect(valid.has(step.codeLineId)).toBe(true);
        expect(step.dpTable?.write).toBeDefined();
      }
    }
  });
});
