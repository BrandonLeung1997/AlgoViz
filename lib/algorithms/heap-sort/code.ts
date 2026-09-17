import type { CodeLine } from "@/lib/algorithms/types";

export const HEAP_SORT_CODE: Record<
  "python" | "javascript" | "cpp",
  CodeLine[]
> = {
  python: [
    { id: "fn-def", text: "def heap_sort(arr):" },
    { id: "build", text: "    for i in range(n // 2 - 1, -1, -1):" },
    { id: "sift", text: "        sift_down(arr, i, heap_size)" },
    { id: "compare", text: "            if arr[child] > arr[largest]:" },
    {
      id: "swap",
      text: "                arr[i], arr[largest] = arr[largest], arr[i]",
    },
    { id: "extract", text: "        arr[0], arr[end] = arr[end], arr[0]" },
    { id: "done", text: "# done: arr is sorted" },
  ],
  javascript: [
    { id: "fn-def", text: "function heapSort(arr) {" },
    { id: "build", text: "  for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {" },
    { id: "sift", text: "    siftDown(arr, i, heapSize);" },
    { id: "compare", text: "      if (arr[child] > arr[largest]) {" },
    { id: "swap", text: "        [arr[i], arr[largest]] = [arr[largest], arr[i]];" },
    { id: "extract", text: "    [arr[0], arr[end]] = [arr[end], arr[0]];" },
    { id: "done", text: "// done: arr is sorted" },
  ],
  cpp: [
    { id: "fn-def", text: "void heapSort(vector<int>& arr) {" },
    { id: "build", text: "  for (int i = n / 2 - 1; i >= 0; i--) {" },
    { id: "sift", text: "    siftDown(arr, i, heapSize);" },
    { id: "compare", text: "      if (arr[child] > arr[largest]) {" },
    { id: "swap", text: "        swap(arr[i], arr[largest]);" },
    { id: "extract", text: "    swap(arr[0], arr[end]);" },
    { id: "done", text: "// done: arr is sorted" },
  ],
};
