import { MAX_STRING_LENGTH } from "@/lib/algorithms/types";

const ALPHABET = "ABCDEFGH";

export function randomLcsString(length = 5): string {
  const n = Math.min(Math.max(length, 1), MAX_STRING_LENGTH);
  let out = "";
  for (let i = 0; i < n; i += 1) {
    out += ALPHABET[Math.floor(Math.random() * ALPHABET.length)]!;
  }
  return out;
}
