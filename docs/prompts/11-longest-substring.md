# Task: add Longest Substring Without Repeating Characters

Implement **one** algorithm: **variable sliding window** on a string (`lastIndex` / set). Do not add other string window variants (min window substring is out of scope).

**Prerequisite:** pointers family. ArrayCanvas draws **bar heights from numbers**, so it is a poor character viz.

## Sequence canvas (required if ArrayCanvas cannot show characters)

Add `components/player/SequenceCanvas.tsx` (or generalize ArrayCanvas with `mode: "bars" | "cells"`):

- Equal-size cells showing characters
- Window `[low, high]` highlighted (`activeRange`)
- Current right index `comparing`
- Duplicate that caused a shrink `writing` / amber

`Step.array` can be unused; add optional `sequence?: { chars: string[]; range?: { low: number; high: number } }` **or** put the string in `dpTable.x` (hack — don’t). Prefer a small `SequenceFrame` on `Step`:

```
sequence?: { chars: string[]; highlights: Highlight[]; range?: { low: number; high: number } }
```

Keep LCS TableCanvas untouched.

## Files to create

- `lib/algorithms/longest-substring/meta.ts` — `slug: "longest-substring"`, `title: "Longest Substring Without Repeat"`, `family: "pointers"`
- `lib/algorithms/longest-substring/code.ts` — Python / JS / C++, **same ids**
- `lib/algorithms/longest-substring/generateSteps.ts` — `generateLongestSubstringSteps(s: string): Step[]`
- `components/player/LongestSubstringStudio.tsx`
- `app/algorithms/longest-substring/page.tsx`
- `__tests__/generateLongestSubstringSteps.test.ts`

## Algorithm

Right pointer expands; if `s[r]` is inside the window, move left until it isn’t (set or last-seen index). Track best length and best slice for the final highlight.

Use `MAX_STRING_LENGTH` (already 10) via `parseStringInput`.

**Suggested ids:** `fn-def`, `expand`, `shrink`, `update-best`, `done`.

**Complexity:** O(n) time with a set/map, O(min(n, alphabet)) extra.

## Studio

Clone LCS’s single-string field (only one string). Randomize with `randomLcsString`. Thunk playback.

## Tests

- `"abcabcbb"` → length 3 (`abc`) if you allow length 8; if `MAX_STRING_LENGTH` is 10 that’s fine.
- `"bbbbb"` → 1.
- `""` → 0.
- `"pwwkew"` → 3.
- Shrink steps exist when a repeat appears.
- Valid ids. Existing LCS/two-sum/sliding-window tests pass.

## Done when

`npm test` passes; pointers card; `/algorithms/longest-substring` expands/shrinks a character window.
