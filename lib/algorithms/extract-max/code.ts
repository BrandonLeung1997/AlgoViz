import type { CodeLine } from "@/lib/algorithms/types";

export const EXTRACT_MAX_CODE: Record<
  "python" | "javascript" | "cpp",
  CodeLine[]
> = {
  python: [
    { id: "fn-def", text: "def extract_max(heap):" },
    { id: "swap-last", text: "    heap[0], heap[-1] = heap[-1], heap[0]" },
    { id: "pop", text: "    max_val = heap.pop()" },
    { id: "sift", text: "    sift_down(heap, 0)" },
    { id: "compare", text: "        if heap[child] > heap[largest]:" },
    {
      id: "swap",
      text: "            heap[i], heap[largest] = heap[largest], heap[i]",
    },
    { id: "done", text: "# done: max extracted, heap repaired" },
  ],
  javascript: [
    { id: "fn-def", text: "function extractMax(heap) {" },
    { id: "swap-last", text: "  [heap[0], heap.at(-1)] = [heap.at(-1), heap[0]];" },
    { id: "pop", text: "  const maxVal = heap.pop();" },
    { id: "sift", text: "  siftDown(heap, 0);" },
    { id: "compare", text: "    if (heap[child] > heap[largest]) {" },
    {
      id: "swap",
      text: "      [heap[i], heap[largest]] = [heap[largest], heap[i]];",
    },
    { id: "done", text: "// done: max extracted, heap repaired" },
  ],
  cpp: [
    { id: "fn-def", text: "int extractMax(vector<int>& heap) {" },
    { id: "swap-last", text: "  swap(heap[0], heap.back());" },
    { id: "pop", text: "  int maxVal = heap.back(); heap.pop_back();" },
    { id: "sift", text: "  siftDown(heap, 0);" },
    { id: "compare", text: "    if (heap[child] > heap[largest]) {" },
    { id: "swap", text: "      swap(heap[i], heap[largest]);" },
    { id: "done", text: "// done: max extracted, heap repaired" },
  ],
};
