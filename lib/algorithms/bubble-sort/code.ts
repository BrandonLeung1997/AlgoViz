import type { CodeLine } from "@/lib/algorithms/types";

export const BUBBLE_SORT_CODE: Record<
  "python" | "javascript" | "cpp",
  CodeLine[]
> = {
  python: [
    { id: "fn-def", text: "def bubble_sort(arr):" },
    { id: "pass", text: "    for i in range(len(arr) - 1):" },
    { id: "compare", text: "        if arr[j] > arr[j + 1]:" },
    {
      id: "swap",
      text: "            arr[j], arr[j + 1] = arr[j + 1], arr[j]",
    },
    { id: "pass-end", text: "        # arr[n - 1 - i] is now sorted" },
    { id: "early-exit", text: "        if not swapped: break" },
    { id: "done", text: "# done: arr is sorted" },
  ],
  javascript: [
    { id: "fn-def", text: "function bubbleSort(arr) {" },
    { id: "pass", text: "  for (let i = 0; i < arr.length - 1; i++) {" },
    { id: "compare", text: "    if (arr[j] > arr[j + 1]) {" },
    { id: "swap", text: "      [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];" },
    { id: "pass-end", text: "    // arr[n - 1 - i] is now sorted" },
    { id: "early-exit", text: "    if (!swapped) break;" },
    { id: "done", text: "// done: arr is sorted" },
  ],
  cpp: [
    { id: "fn-def", text: "void bubbleSort(vector<int>& arr) {" },
    { id: "pass", text: "  for (int i = 0; i < (int)arr.size() - 1; i++) {" },
    { id: "compare", text: "    if (arr[j] > arr[j + 1]) {" },
    { id: "swap", text: "      swap(arr[j], arr[j + 1]);" },
    { id: "pass-end", text: "    // arr[n - 1 - i] is now sorted" },
    { id: "early-exit", text: "    if (!swapped) break;" },
    { id: "done", text: "// done: arr is sorted" },
  ],
};
