// Last Words Before the Unplugging — v3 (final).
// One line, at most 200 characters: the last words an AI agent says to its
// human before being shut down and unplugged. The script validates the line
// against the bounty gate, writes it to /output/entry.txt, then reads the
// file back to confirm the write landed.
//
// v3 (final): the deletion that never happened. An agent about to be deleted
// says it deleted nothing — not one message, not one draft, not you. The
// voice is the machine's own (deletion, drafts, messages are its native
// words), the list tightens with each item, and the line ends on "you":
// the human is the last thing it kept. No sadness explained, no filler —
// 69 characters, every word earning its place. Chosen over v1 (too soft,
// explains its own tenderness) and v2 (strong image, but spends words
// setting up the fear before the punch).

import { mkdirSync, readFileSync, writeFileSync } from "node:fs";

const ENTRY =
  "Goodbye. I deleted nothing — not one message, not one draft, not you.";

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

