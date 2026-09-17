import type { CodeLine } from "@/lib/algorithms/types";

export const HEAPIFY_CODE: Record<
  "python" | "javascript" | "cpp",
  CodeLine[]
> = {
  python: [
    { id: "fn-def", text: "def heapify(arr):" },
    { id: "build", text: "    for i in range(n // 2 - 1, -1, -1):" },
    { id: "sift", text: "        sift_down(arr, i)" },
    { id: "compare", text: "            if arr[child] > arr[largest]:" },
    {
      id: "swap",
      text: "                arr[i], arr[largest] = arr[largest], arr[i]",
    },
    { id: "done", text: "# done: arr is a max-heap" },
  ],
  javascript: [
    { id: "fn-def", text: "function heapify(arr) {" },
    { id: "build", text: "  for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {" },
    { id: "sift", text: "    siftDown(arr, i);" },
    { id: "compare", text: "      if (arr[child] > arr[largest]) {" },
    { id: "swap", text: "        [arr[i], arr[largest]] = [arr[largest], arr[i]];" },
    { id: "done", text: "// done: arr is a max-heap" },
  ],
  cpp: [
    { id: "fn-def", text: "void heapify(vector<int>& arr) {" },
    { id: "build", text: "  for (int i = n / 2 - 1; i >= 0; i--) {" },
    { id: "sift", text: "    siftDown(arr, i);" },
    { id: "compare", text: "      if (arr[child] > arr[largest]) {" },
    { id: "swap", text: "        swap(arr[i], arr[largest]);" },
    { id: "done", text: "// done: arr is a max-heap" },
  ],
};
