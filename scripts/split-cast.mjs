#!/usr/bin/env node
// Splits an asciinema v3 cast into N parts, each ≤ targetMiB.
// Output: <basename>-part-1.cast, <basename>-part-2.cast, ...
// The original file is deleted after successful split (files are versioned in git).
//
// Caveat: asciinema events carry cumulative terminal state. Parts 2+ start mid-session,
// so they get a synthetic reset prelude that puts the terminal into a clean known state
// (alt screen buffer, clear, home, cursor visible). Application-level state (nvim buffer,
// scrollback, TUI layout) won't be restored — parts 2+ start blank and fill as events arrive.
//
// Usage: node scripts/split-cast.mjs <file> [targetMiB=24]

import fs from "node:fs";
import path from "node:path";

const file = process.argv[2];
const targetMiB = parseFloat(process.argv[3] || "24");
if (!file) {
  console.error("usage: node scripts/split-cast.mjs <file> [targetMiB=24]");
  process.exit(1);
}

const targetBytes = Math.floor(targetMiB * 1048576);
const raw = fs.readFileSync(file, "utf8");
const lines = raw.split("\n");
const header = lines[0];
const events = lines.slice(1);
const headerBytes = Buffer.byteLength(header, "utf8") + 1;
const totalBytes = Buffer.byteLength(raw, "utf8");

if (totalBytes <= targetBytes) {
  console.log(
    `${file} is ${(totalBytes / 1048576).toFixed(2)} MiB, ≤ ${targetMiB} MiB — no split needed`,
  );
  process.exit(0);
}

// Synthetic reset for parts 2+: alt screen on, clear, home, show cursor.
const RESET_PRELUDE = JSON.stringify([
  0,
  "o",
  "[?1049h[2J[H[?25h",
]);
const preludeBytes = Buffer.byteLength(RESET_PRELUDE, "utf8") + 1;

// Bucket events into parts sized to fit under targetBytes.
const parts = [[]];
let currentBytes = 0;
const budgetForPart = (idx) =>
  idx === 0 ? targetBytes - headerBytes : targetBytes - headerBytes - preludeBytes;

for (const line of events) {
  const lineBytes = Buffer.byteLength(line, "utf8") + 1;
  const partIdx = parts.length - 1;
  if (
    currentBytes + lineBytes > budgetForPart(partIdx) &&
    parts[partIdx].length > 0
  ) {
    parts.push([]);
    currentBytes = 0;
  }
  parts[parts.length - 1].push(line);
  currentBytes += lineBytes;
}

// Rebase the first event of each part 2+ to delta 0 so playback starts immediately.
const rebaseFirst = (evts) =>
  evts.map((line, i) => {
    if (i !== 0 || !line.trim()) return line;
    try {
      const arr = JSON.parse(line);
      if (Array.isArray(arr) && typeof arr[0] === "number") {
        arr[0] = 0;
        return JSON.stringify(arr);
      }
      return line;
    } catch {
      return line;
    }
  });

const dir = path.dirname(file);
const ext = path.extname(file);
const base = path.basename(file, ext);
// Strip an existing "-part-N" suffix if the user is re-splitting a previous output.
const cleanBase = base.replace(/-part-\d+$/, "");

const outputs = [];
for (let i = 0; i < parts.length; i++) {
  const partEvents = i === 0 ? parts[i] : [RESET_PRELUDE, ...rebaseFirst(parts[i])];
  const outPath = path.join(dir, `${cleanBase}-part-${i + 1}${ext}`);
  const out = [header, ...partEvents].join("\n");
  fs.writeFileSync(outPath, out);
  const size = fs.statSync(outPath).size;
  outputs.push({ path: outPath, size, events: partEvents.length });
}

fs.unlinkSync(file);

const mib = (b) => (b / 1048576).toFixed(2);
console.log(
  `split ${file} (${mib(totalBytes)} MiB, ${events.length} events) into ${outputs.length} parts:`,
);
for (const o of outputs) {
  console.log(`  ${o.path}: ${mib(o.size)} MiB, ${o.events} events`);
}
console.log(`(original ${file} removed — recover from git if needed)`);
