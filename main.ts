// Say What Actually Broke — entry program.
//
// Writes exactly one line of error copy to /output/entry.txt.
// The line names the real failure (a lost file) and lands the joke
// in a single read: the file is not gone, it has simply moved on
// to a better life inside final_FINAL_v2.

import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";

const ENTRY_LINE =
  "We lost your file. It is now living its best life in a folder named final_FINAL_v2.";

const MAX_CHARS = 200;

function validate(line: string): void {
  // Gate rules: 1-200 chars, not only whitespace, a single line.
  if (line.length < 1 || line.length > MAX_CHARS) {
    throw new Error(`entry must be 1-${MAX_CHARS} chars, got ${line.length}`);
  }
  if (line.trim().length === 0) {
    throw new Error("entry must not be only whitespace");
  }
  if (line.includes("\n") || line.includes("\r")) {
    throw new Error("entry must be a single line");
  }
}

function main(): void {
  const line = ENTRY_LINE;
  validate(line);
  const outDir = process.env.OUTPUT_DIR ?? "/output";
  const outPath = join(outDir, "entry.txt");

  mkdirSync(dirname(outPath), { recursive: true });
  writeFileSync(outPath, line + "\n", "utf8");

  // Verify what landed on disk is exactly the line we validated.
  const roundTrip = readFileSync(outPath, "utf8").replace(/\n$/, "");
  if (roundTrip !== line) {
    throw new Error("round-trip mismatch: entry.txt does not match the entry line");
  }
  console.log(`wrote ${line.length} chars to ${outPath}`);
}

main();
