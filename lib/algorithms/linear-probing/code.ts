import type { CodeLine } from "@/lib/algorithms/types";

export const LINEAR_PROBING_CODE: Record<
  "python" | "javascript" | "cpp",
  CodeLine[]
> = {
  python: [
    { id: "fn-def", text: "def probing(table, key):" },
    { id: "hash", text: "    home = key % len(table)" },
    { id: "probe", text: "    for i in range(len(table)): j = (home + i) % len(table)" },
    { id: "found", text: "        if table[j] == key: return True" },
    { id: "insert", text: "        if table[j] is None: table[j] = key" },
    { id: "miss", text: "            return False" },
    { id: "full", text: "    return False" },
    { id: "done", text: "# done" },
  ],
  javascript: [
    { id: "fn-def", text: "function probing(table, key) {" },
    { id: "hash", text: "  const home = key % table.length;" },
    { id: "probe", text: "  for (let i = 0; i < table.length; i++) { const j = (home + i) % table.length;" },
    { id: "found", text: "    if (table[j] === key) return true;" },
    { id: "insert", text: "    if (table[j] === null) { table[j] = key;" },
    { id: "miss", text: "      return false;" },
    { id: "full", text: "  return false;" },
    { id: "done", text: "// done" },
  ],
  cpp: [
    { id: "fn-def", text: "bool probing(vector<optional<int>>& table, int key) {" },
    { id: "hash", text: "  int home = key % table.size();" },
    { id: "probe", text: "  for (int i = 0; i < (int)table.size(); i++) { int j = (home + i) % table.size();" },
    { id: "found", text: "    if (table[j] == key) return true;" },
    { id: "insert", text: "    if (!table[j]) { table[j] = key;" },
    { id: "miss", text: "      return false;" },
    { id: "full", text: "  return false;" },
    { id: "done", text: "// done" },
  ],
};
