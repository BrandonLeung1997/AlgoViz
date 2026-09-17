"use client";

import { useCallback, useState } from "react";
import { usePlayback } from "@/lib/playback/usePlayback";
import { generateCoinChangeSteps } from "@/lib/algorithms/coin-change/generateSteps";
import { COIN_CHANGE_CODE } from "@/lib/algorithms/coin-change/code";
import { coinChangeMeta } from "@/lib/algorithms/coin-change/meta";
import {
  formatCoins,
  parseAmountInput,
  parseCoins,
  randomCoinChange,
} from "@/lib/algorithms/coin-change/parseCoins";
import { TableCanvas } from "@/components/player/TableCanvas";
import { ControlPanel } from "@/components/player/ControlPanel";
import { ArrayInput } from "@/components/player/ArrayInput";
import { CodePanel } from "@/components/player/CodePanel";
import { ExplanationPanel } from "@/components/player/ExplanationPanel";
import { ComplexityPanel } from "@/components/player/ComplexityPanel";

const DEFAULT_COINS = [1, 3, 4];
const DEFAULT_AMOUNT = 8;

export function CoinChangeStudio() {
  const [coins, setCoins] = useState<number[]>(DEFAULT_COINS);
  const [amount, setAmount] = useState(DEFAULT_AMOUNT);
  const [coinsText, setCoinsText] = useState(formatCoins(DEFAULT_COINS));
  const [amountText, setAmountText] = useState(String(DEFAULT_AMOUNT));
  const [coinsError, setCoinsError] = useState<string | null>(null);
  const [amountError, setAmountError] = useState<string | null>(null);

  const generateSteps = useCallback(
    () => generateCoinChangeSteps(coins, amount),
    [coins, amount],
  );
  const playback = usePlayback(generateSteps, [0]);
  const [language, setLanguage] = useState<"python" | "javascript" | "cpp">(
    "python",
  );

  const applyCoins = (raw: string) => {
    setCoinsText(raw);
    const parsed = parseCoins(raw);
    if (!parsed.ok) {
      setCoinsError(parsed.error);
      return;
    }
    setCoinsError(null);
    setCoins(parsed.coins);
    setCoinsText(formatCoins(parsed.coins));
  };

  const applyAmount = (raw: string) => {
    setAmountText(raw);
    const parsed = parseAmountInput(raw);
    if (!parsed.ok) {
      setAmountError(parsed.error);
      return;
    }
    setAmountError(null);
    setAmount(parsed.value);
    setAmountText(String(parsed.value));
  };

  const randomize = () => {
    const next = randomCoinChange();
    setCoins(next.coins);
    setAmount(next.amount);
    setCoinsText(formatCoins(next.coins));
    setAmountText(String(next.amount));
    setCoinsError(null);
    setAmountError(null);
  };

  return (
    <div className="mx-auto grid max-w-6xl gap-6 px-4 py-6 lg:grid-cols-[1.4fr_1fr]">
      <section className="space-y-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
            {coinChangeMeta.title}
          </h1>
          <p className="mt-1 text-slate-600">{coinChangeMeta.summary}</p>
        </div>
        <div className="rounded-lg border border-slate-200 bg-white p-4">
          <TableCanvas
            step={playback.step}
            resultLabel="Coins"
            hint="dp[i][a] = fewest coins using first i types to make a (∞ if impossible)"
          />
        </div>
        <ControlPanel
          playing={playback.playing}
          speed={playback.speed}
          onPlay={playback.play}
          onPause={playback.pause}
          onStepForward={playback.stepForward}
          onStepBackward={playback.stepBackward}
          onReset={playback.reset}
          onRandomize={randomize}
          onSpeedChange={playback.setSpeed}
          disableBack={playback.index === 0}
          disableForward={playback.index >= playback.steps.length - 1}
        />
        <ArrayInput
          label="Coins"
          value={coinsText}
          error={coinsError}
          onChange={setCoinsText}
          onApply={applyCoins}
          placeholder="e.g. 1, 3, 4"
        />
        <ArrayInput
          label="Amount"
          value={amountText}
          error={amountError}
          onChange={setAmountText}
          onApply={applyAmount}
          placeholder="e.g. 8"
        />
        <p className="-mt-2 text-xs text-slate-500">
          Positive integers. Max 6 coin types and amount 15. Each denomination
          may be reused (unbounded).
        </p>
      </section>
      <aside className="space-y-4">
        <CodePanel
          lines={COIN_CHANGE_CODE[language]}
          activeLineId={playback.step?.codeLineId ?? "fn-def"}
          language={language}
          onLanguageChange={setLanguage}
        />
        <ExplanationPanel text={playback.step?.explanation ?? ""} />
        <ComplexityPanel meta={coinChangeMeta} />
      </aside>
    </div>
  );
}
