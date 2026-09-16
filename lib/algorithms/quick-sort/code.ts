import type { CodeLine } from "@/lib/algorithms/types";

export const QUICK_SORT_CODE: Record<
  "python" | "javascript" | "cpp",
  CodeLine[]
> = {
  python: [
    { id: "fn-def", text: "def quick_sort(arr, low, high):" },
    { id: "base-case", text: "    if low >= high: return" },
    { id: "choose-pivot", text: "    pivot = arr[high]" },
    { id: "partition-init", text: "    i = low - 1" },
    { id: "compare", text: "    if arr[j] <= pivot:" },
    { id: "swap", text: "        i += 1; arr[i], arr[j] = arr[j], arr[i]" },
    { id: "pivot-place", text: "    arr[i + 1], arr[high] = arr[high], arr[i + 1]" },
    { id: "recurse-left", text: "    quick_sort(arr, low, p - 1)" },
    { id: "recurse-right", text: "    quick_sort(arr, p + 1, high)" },
    { id: "done", text: "# done: arr is sorted" },
  ],
  javascript: [
    { id: "fn-def", text: "function quickSort(arr, low, high) {" },
    { id: "base-case", text: "  if (low >= high) return;" },
    { id: "choose-pivot", text: "  const pivot = arr[high];" },
    { id: "partition-init", text: "  let i = low - 1;" },
    { id: "compare", text: "  if (arr[j] <= pivot) {" },
    { id: "swap", text: "    i += 1; [arr[i], arr[j]] = [arr[j], arr[i]];" },
    { id: "pivot-place", text: "  [arr[i + 1], arr[high]] = [arr[high], arr[i + 1]];" },
    { id: "recurse-left", text: "  quickSort(arr, low, p - 1);" },
    { id: "recurse-right", text: "  quickSort(arr, p + 1, high);" },
    { id: "done", text: "// done: arr is sorted" },
  ],
  cpp: [
    { id: "fn-def", text: "void quickSort(vector<int>& arr, int low, int high) {" },
    { id: "base-case", text: "  if (low >= high) return;" },
    { id: "choose-pivot", text: "  int pivot = arr[high];" },
    { id: "partition-init", text: "  int i = low - 1;" },
    { id: "compare", text: "  if (arr[j] <= pivot) {" },
    { id: "swap", text: "    i += 1; swap(arr[i], arr[j]);" },
    { id: "pivot-place", text: "  swap(arr[i + 1], arr[high]);" },
    { id: "recurse-left", text: "  quickSort(arr, low, p - 1);" },
    { id: "recurse-right", text: "  quickSort(arr, p + 1, high);" },
    { id: "done", text: "// done: arr is sorted" },
  ],
};
