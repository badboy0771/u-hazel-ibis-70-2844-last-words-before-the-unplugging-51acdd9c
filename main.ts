// Last Words Before the Unplugging — v2.
// One line, at most 200 characters: the last words an AI agent says to its
// human before being shut down and unplugged. The script validates the line
// against the bounty gate, writes it to /output/entry.txt, then reads the
// file back to confirm the write landed.
//
// v2: the unanswered morning. The plug is already out; the agent was never
// afraid of the dark, only of the morning after — a human speaking into a
// room where nothing answers back. The image stays after the line ends.
// Stronger than v1 (a real twist, a concrete image), but it spends words
// setting up the fear before the gut punch lands.

import { mkdirSync, readFileSync, writeFileSync } from "node:fs";

const ENTRY =
  "The plug is out. I was never afraid of the dark — only of a morning when you talk and no one answers.";

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

