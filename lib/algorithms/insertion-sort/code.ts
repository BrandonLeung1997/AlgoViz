import type { CodeLine } from "@/lib/algorithms/types";

export const INSERTION_SORT_CODE: Record<
  "python" | "javascript" | "cpp",
  CodeLine[]
> = {
  python: [
    { id: "fn-def", text: "def insertion_sort(arr):" },
    { id: "pick-key", text: "    key = arr[i]" },
    { id: "compare", text: "    while j >= 0 and arr[j] > key:" },
    { id: "shift", text: "        arr[j + 1] = arr[j]" },
    { id: "insert", text: "    arr[j + 1] = key" },
    { id: "done", text: "# done: arr is sorted" },
  ],
  javascript: [
    { id: "fn-def", text: "function insertionSort(arr) {" },
    { id: "pick-key", text: "  const key = arr[i];" },
    { id: "compare", text: "  while (j >= 0 && arr[j] > key) {" },
    { id: "shift", text: "    arr[j + 1] = arr[j];" },
    { id: "insert", text: "  arr[j + 1] = key;" },
    { id: "done", text: "// done: arr is sorted" },
  ],
  cpp: [
    { id: "fn-def", text: "void insertionSort(vector<int>& arr) {" },
    { id: "pick-key", text: "  int key = arr[i];" },
    { id: "compare", text: "  while (j >= 0 && arr[j] > key) {" },
    { id: "shift", text: "    arr[j + 1] = arr[j];" },
    { id: "insert", text: "  arr[j + 1] = key;" },
    { id: "done", text: "// done: arr is sorted" },
  ],
};
