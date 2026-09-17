import type { CodeLine } from "@/lib/algorithms/types";

export const EDIT_DISTANCE_CODE: Record<
  "python" | "javascript" | "cpp",
  CodeLine[]
> = {
  python: [
    { id: "fn-def", text: "def edit_distance(x, y):" },
    { id: "init-row", text: "    dp = [[j for j in range(len(y)+1)] for _ in range(len(x)+1)]" },
    { id: "init-col", text: "    for i in range(1, len(x)+1): dp[i][0] = i" },
    { id: "loop-i", text: "    for i in range(1, len(x)+1):" },
    { id: "loop-j", text: "        for j in range(1, len(y)+1):" },
    { id: "match", text: "            if x[i-1] == y[j-1]: dp[i][j] = dp[i-1][j-1]" },
    { id: "mismatch", text: "            else: dp[i][j] = 1 + min(dp[i-1][j], dp[i][j-1], dp[i-1][j-1])" },
    { id: "done", text: "    return dp[-1][-1]" },
  ],
  javascript: [
    { id: "fn-def", text: "function editDistance(x, y) {" },
    { id: "init-row", text: "  const dp = Array.from({ length: x.length + 1 }, (_, i) => Array.from({ length: y.length + 1 }, (_, j) => (i === 0 ? j : 0)));" },
    { id: "init-col", text: "  for (let i = 1; i <= x.length; i++) dp[i][0] = i;" },
    { id: "loop-i", text: "  for (let i = 1; i <= x.length; i++) {" },
    { id: "loop-j", text: "    for (let j = 1; j <= y.length; j++) {" },
    { id: "match", text: "      if (x[i - 1] === y[j - 1]) dp[i][j] = dp[i - 1][j - 1];" },
    { id: "mismatch", text: "      else dp[i][j] = 1 + Math.min(dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1]);" },
    { id: "done", text: "  return dp[x.length][y.length];" },
  ],
  cpp: [
    { id: "fn-def", text: "int editDistance(const string& x, const string& y) {" },
    { id: "init-row", text: "  vector<vector<int>> dp(x.size()+1, vector<int>(y.size()+1)); for (int j = 0; j <= (int)y.size(); ++j) dp[0][j] = j;" },
    { id: "init-col", text: "  for (int i = 1; i <= (int)x.size(); ++i) dp[i][0] = i;" },
    { id: "loop-i", text: "  for (int i = 1; i <= (int)x.size(); ++i) {" },
    { id: "loop-j", text: "    for (int j = 1; j <= (int)y.size(); ++j) {" },
    { id: "match", text: "      if (x[i-1] == y[j-1]) dp[i][j] = dp[i-1][j-1];" },
    { id: "mismatch", text: "      else dp[i][j] = 1 + min({dp[i-1][j], dp[i][j-1], dp[i-1][j-1]});" },
    { id: "done", text: "  return dp[x.size()][y.size()];" },
  ],
};
