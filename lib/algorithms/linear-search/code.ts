import type { CodeLine } from "@/lib/algorithms/types";

export const LINEAR_SEARCH_CODE: Record<
  "python" | "javascript" | "cpp",
  CodeLine[]
> = {
  python: [
    { id: "fn-def", text: "def linear_search(arr, target):" },
    { id: "advance", text: "    for i in range(len(arr)):" },
    { id: "compare", text: "        if arr[i] == target:" },
    { id: "found", text: "            return i" },
    { id: "not-found", text: "    return -1" },
  ],
  javascript: [
    { id: "fn-def", text: "function linearSearch(arr, target) {" },
    { id: "advance", text: "  for (let i = 0; i < arr.length; i++) {" },
    { id: "compare", text: "    if (arr[i] === target) {" },
    { id: "found", text: "      return i;" },
    { id: "not-found", text: "  return -1;" },
  ],
  cpp: [
    { id: "fn-def", text: "int linearSearch(const vector<int>& arr, int target) {" },
    { id: "advance", text: "  for (int i = 0; i < (int)arr.size(); i++) {" },
    { id: "compare", text: "    if (arr[i] == target) {" },
    { id: "found", text: "      return i;" },
    { id: "not-found", text: "  return -1;" },
  ],
};
