import type { CodeLine } from "@/lib/algorithms/types";

export const SELECTION_SORT_CODE: Record<
  "python" | "javascript" | "cpp",
  CodeLine[]
> = {
  python: [
    { id: "fn-def", text: "def selection_sort(arr):" },
    { id: "scan", text: "        if arr[j] < arr[min_idx]:" },
    { id: "new-min", text: "            min_idx = j" },
    {
      id: "swap",
      text: "        arr[i], arr[min_idx] = arr[min_idx], arr[i]",
    },
    { id: "pass-end", text: "        # arr[i] is now sorted" },
    { id: "done", text: "# done: arr is sorted" },
  ],
  javascript: [
    { id: "fn-def", text: "function selectionSort(arr) {" },
    { id: "scan", text: "    if (arr[j] < arr[minIdx]) {" },
    { id: "new-min", text: "      minIdx = j;" },
    { id: "swap", text: "    [arr[i], arr[minIdx]] = [arr[minIdx], arr[i]];" },
    { id: "pass-end", text: "    // arr[i] is now sorted" },
    { id: "done", text: "// done: arr is sorted" },
  ],
  cpp: [
    { id: "fn-def", text: "void selectionSort(vector<int>& arr) {" },
    { id: "scan", text: "    if (arr[j] < arr[minIdx]) {" },
    { id: "new-min", text: "      minIdx = j;" },
    { id: "swap", text: "    swap(arr[i], arr[minIdx]);" },
    { id: "pass-end", text: "    // arr[i] is now sorted" },
    { id: "done", text: "// done: arr is sorted" },
  ],
};
