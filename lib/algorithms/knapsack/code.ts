import type { CodeLine } from "@/lib/algorithms/types";

export const KNAPSACK_CODE: Record<
  "python" | "javascript" | "cpp",
  CodeLine[]
> = {
  python: [
    { id: "fn-def", text: "def knapsack(items, W):" },
    { id: "init-table", text: "    dp = [[0]*(W+1) for _ in range(len(items)+1)]" },
    { id: "loop-i", text: "    for i, (wt, val) in enumerate(items, 1):" },
    { id: "loop-j", text: "        for w in range(W+1):" },
    { id: "skip", text: "            skip = dp[i-1][w]  # don't take item i" },
    { id: "take", text: "            take = val + dp[i-1][w-wt] if wt <= w else skip" },
    { id: "choose", text: "            dp[i][w] = max(skip, take)" },
    { id: "reconstruct", text: "    # reconstruct one subset from dp" },
    { id: "done", text: "    return dp[-1][-1]" },
  ],
  javascript: [
    { id: "fn-def", text: "function knapsack(items, W) {" },
    { id: "init-table", text: "  const dp = Array.from({ length: items.length + 1 }, () => Array(W + 1).fill(0));" },
    { id: "loop-i", text: "  for (let i = 1; i <= items.length; i++) {" },
    { id: "loop-j", text: "    for (let w = 0; w <= W; w++) {" },
    { id: "skip", text: "      const skip = dp[i - 1][w]; // don't take item i" },
    { id: "take", text: "      const take = items[i - 1].weight <= w ? items[i - 1].value + dp[i - 1][w - items[i - 1].weight] : skip;" },
    { id: "choose", text: "      dp[i][w] = Math.max(skip, take);" },
    { id: "reconstruct", text: "  // reconstruct one subset from dp" },
    { id: "done", text: "  return dp[items.length][W];" },
  ],
  cpp: [
    { id: "fn-def", text: "int knapsack(const vector<Item>& items, int W) {" },
    { id: "init-table", text: "  vector<vector<int>> dp(items.size()+1, vector<int>(W+1, 0));" },
    { id: "loop-i", text: "  for (int i = 1; i <= (int)items.size(); ++i) {" },
    { id: "loop-j", text: "    for (int w = 0; w <= W; ++w) {" },
    { id: "skip", text: "      int skip = dp[i-1][w]; // don't take item i" },
    { id: "take", text: "      int take = items[i-1].weight <= w ? items[i-1].value + dp[i-1][w-items[i-1].weight] : skip;" },
    { id: "choose", text: "      dp[i][w] = max(skip, take);" },
    { id: "reconstruct", text: "  // reconstruct one subset from dp" },
    { id: "done", text: "  return dp[items.size()][W];" },
  ],
};
