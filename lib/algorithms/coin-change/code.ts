import type { CodeLine } from "@/lib/algorithms/types";

export const COIN_CHANGE_CODE: Record<
  "python" | "javascript" | "cpp",
  CodeLine[]
> = {
  python: [
    { id: "fn-def", text: "def coin_change(coins, amount):" },
    { id: "init-table", text: "    INF = float('inf'); dp = [[INF]*(amount+1) for _ in range(len(coins)+1)]" },
    { id: "loop-i", text: "    for i, c in enumerate(coins, 1):" },
    { id: "loop-j", text: "        for a in range(amount+1):" },
    { id: "skip", text: "            skip = dp[i-1][a]  # don't use coin c" },
    { id: "take", text: "            take = 1 + dp[i][a-c] if c <= a else skip  # reuse same row" },
    { id: "choose", text: "            dp[i][a] = min(skip, take)" },
    { id: "impossible", text: "    if dp[-1][-1] == INF: return None  # impossible" },
    { id: "done", text: "    return dp[-1][-1]" },
  ],
  javascript: [
    { id: "fn-def", text: "function coinChange(coins, amount) {" },
    { id: "init-table", text: "  const INF = Infinity, dp = Array.from({ length: coins.length + 1 }, () => Array(amount + 1).fill(INF));" },
    { id: "loop-i", text: "  for (let i = 1; i <= coins.length; i++) {" },
    { id: "loop-j", text: "    for (let a = 0; a <= amount; a++) {" },
    { id: "skip", text: "      const skip = dp[i - 1][a]; // don't use coin c" },
    { id: "take", text: "      const take = coins[i - 1] <= a ? 1 + dp[i][a - coins[i - 1]] : skip; // reuse same row" },
    { id: "choose", text: "      dp[i][a] = Math.min(skip, take);" },
    { id: "impossible", text: "  if (dp.at(-1).at(-1) === INF) return null; // impossible" },
    { id: "done", text: "  return dp[coins.length][amount];" },
  ],
  cpp: [
    { id: "fn-def", text: "int coinChange(const vector<int>& coins, int amount) {" },
    { id: "init-table", text: "  const int INF = 1e9; vector<vector<int>> dp(coins.size()+1, vector<int>(amount+1, INF));" },
    { id: "loop-i", text: "  for (int i = 1; i <= (int)coins.size(); ++i) {" },
    { id: "loop-j", text: "    for (int a = 0; a <= amount; ++a) {" },
    { id: "skip", text: "      int skip = dp[i-1][a]; // don't use coin c" },
    { id: "take", text: "      int take = coins[i-1] <= a ? 1 + dp[i][a-coins[i-1]] : skip; // reuse same row" },
    { id: "choose", text: "      dp[i][a] = min(skip, take);" },
    { id: "impossible", text: "  if (dp.back().back() >= INF) return -1; // impossible" },
    { id: "done", text: "  return dp[coins.size()][amount];" },
  ],
};
