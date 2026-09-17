import type { CodeLine } from "@/lib/algorithms/types";

export const HEAP_INSERT_CODE: Record<
  "python" | "javascript" | "cpp",
  CodeLine[]
> = {
  python: [
    { id: "fn-def", text: "def insert(heap, value):" },
    { id: "append", text: "    heap.append(value)" },
    { id: "compare", text: "        if heap[parent] < heap[i]:" },
    {
      id: "swap",
      text: "            heap[i], heap[parent] = heap[parent], heap[i]",
    },
    { id: "done", text: "# done: heap is a max-heap" },
  ],
  javascript: [
    { id: "fn-def", text: "function insert(heap, value) {" },
    { id: "append", text: "  heap.push(value);" },
    { id: "compare", text: "    if (heap[parent] < heap[i]) {" },
    {
      id: "swap",
      text: "      [heap[i], heap[parent]] = [heap[parent], heap[i]];",
    },
    { id: "done", text: "// done: heap is a max-heap" },
  ],
  cpp: [
    { id: "fn-def", text: "void insert(vector<int>& heap, int value) {" },
    { id: "append", text: "  heap.push_back(value);" },
    { id: "compare", text: "    if (heap[parent] < heap[i]) {" },
    { id: "swap", text: "      swap(heap[i], heap[parent]);" },
    { id: "done", text: "// done: heap is a max-heap" },
  ],
};
