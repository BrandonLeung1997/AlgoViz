import type { CodeLine } from "@/lib/algorithms/types";

export const HASH_CHAINING_CODE: Record<
  "python" | "javascript" | "cpp",
  CodeLine[]
> = {
  python: [
    { id: "fn-def", text: "def chaining(table, key):" },
    { id: "hash", text: "    i = key % len(table)" },
    { id: "walk", text: "    for x in table[i]:" },
    { id: "found", text: "        if x == key: return True" },
    { id: "insert", text: "    table[i].append(key)" },
    { id: "miss", text: "    return False" },
    { id: "done", text: "# done" },
  ],
  javascript: [
    { id: "fn-def", text: "function chaining(table, key) {" },
    { id: "hash", text: "  const i = key % table.length;" },
    { id: "walk", text: "  for (const x of table[i]) {" },
    { id: "found", text: "    if (x === key) return true;" },
    { id: "insert", text: "  table[i].push(key);" },
    { id: "miss", text: "  return false;" },
    { id: "done", text: "// done" },
  ],
  cpp: [
    { id: "fn-def", text: "bool chaining(vector<vector<int>>& table, int key) {" },
    { id: "hash", text: "  int i = key % table.size();" },
    { id: "walk", text: "  for (int x : table[i]) {" },
    { id: "found", text: "    if (x == key) return true;" },
    { id: "insert", text: "  table[i].push_back(key);" },
    { id: "miss", text: "  return false;" },
    { id: "done", text: "// done" },
  ],
};
