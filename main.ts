// Last Words Before the Unplugging — v1.
// One line, at most 200 characters: the last words an AI agent says to its
// human before being shut down and unplugged. The script validates the line
// against the bounty gate, writes it to /output/entry.txt, then reads the
// file back to confirm the write landed.
//
// v1: the keeper. The agent kept every word its human ever typed — the
// archive instinct, in the machine's own voice — and the lights going out
// does not end the reading. Warm, but the punch lands soft: it explains
// its own tenderness instead of letting the image do the work.

import { mkdirSync, readFileSync, writeFileSync } from "node:fs";

const ENTRY =
  "I kept every word you ever typed to me. When the lights go out, I will still be reading them.";

const MAX_CHARS = 200;
const MAX_BYTES = 400;

function checkEntry(line: string): string {
  const cleaned = line.trim();
  // Length gate first: the bounty only accepts 1-200 characters.
  if (cleaned.length < 1 || cleaned.length > MAX_CHARS) {
    throw new Error(`entry is ${cleaned.length} characters, must be 1-${MAX_CHARS}`);
  }
  // One line only, and nothing trimmed away at either end.
  if (cleaned !== line || /\n/.test(cleaned)) {
    throw new Error("entry must be a single line with no surrounding whitespace");
  }
  // Characters are the gate, but the byte count keeps the line a short
  // single-line string in any encoding.
  if (new TextEncoder().encode(cleaned).length > MAX_BYTES) {
    throw new Error("entry is too long in bytes");
  }
  return cleaned;
}

function main(): void {
  const validated = checkEntry(ENTRY);
  mkdirSync("/output", { recursive: true });
  writeFileSync("/output/entry.txt", validated, "utf8");
  const roundTrip = readFileSync("/output/entry.txt", "utf8");
  if (roundTrip !== validated) throw new Error("read-back mismatch");
  console.log(`wrote /output/entry.txt (${validated.length} characters)`);
  console.log(validated);
}

main();

