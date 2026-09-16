import type { CodeLine } from "@/lib/algorithms/types";

export const BINARY_SEARCH_CODE: Record<
  "python" | "javascript" | "cpp",
  CodeLine[]
> = {
  python: [
    { id: "fn-def", text: "def binary_search(arr, target):" },
    { id: "init-bounds", text: "    low, high = 0, len(arr) - 1" },
    { id: "loop", text: "    while low <= high:" },
    { id: "mid", text: "        mid = (low + high) // 2" },
    { id: "compare", text: "        if arr[mid] == target:" },
    { id: "found", text: "            return mid" },
    { id: "go-right", text: "        if arr[mid] < target: low = mid + 1" },
    { id: "go-left", text: "        else: high = mid - 1" },
    { id: "not-found", text: "    return -1" },
  ],
  javascript: [
    { id: "fn-def", text: "function binarySearch(arr, target) {" },
    { id: "init-bounds", text: "  let low = 0, high = arr.length - 1;" },
    { id: "loop", text: "  while (low <= high) {" },
    { id: "mid", text: "    const mid = Math.floor((low + high) / 2);" },
    { id: "compare", text: "    if (arr[mid] === target) {" },
    { id: "found", text: "      return mid;" },
    { id: "go-right", text: "    if (arr[mid] < target) low = mid + 1;" },
    { id: "go-left", text: "    else high = mid - 1;" },
    { id: "not-found", text: "  return -1;" },
  ],
  cpp: [
    { id: "fn-def", text: "int binarySearch(const vector<int>& arr, int target) {" },
    { id: "init-bounds", text: "  int low = 0, high = (int)arr.size() - 1;" },
    { id: "loop", text: "  while (low <= high) {" },
    { id: "mid", text: "    int mid = low + (high - low) / 2;" },
    { id: "compare", text: "    if (arr[mid] == target) {" },
    { id: "found", text: "      return mid;" },
    { id: "go-right", text: "    if (arr[mid] < target) low = mid + 1;" },
    { id: "go-left", text: "    else high = mid - 1;" },
    { id: "not-found", text: "  return -1;" },
  ],
};
