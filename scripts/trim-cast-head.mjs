#!/usr/bin/env node
// Trims events from the START of an asciinema v3 cast until the file fits under a target size.
// Preserves the tail (final answer) and rebases remaining event timestamps.
// Rewrites the file in place. Files are versioned in git — restore with `git checkout` if needed.
// Usage: node scripts/trim-cast-head.mjs <file> [targetMiB=24]

import fs from "node:fs";

const file = process.argv[2];
const targetMiB = parseFloat(process.argv[3] || "24");
if (!file) {
  console.error("usage: node scripts/trim-cast-head.mjs <file> [targetMiB=24]");
  process.exit(1);
}

const targetBytes = Math.floor(targetMiB * 1048576);
const raw = fs.readFileSync(file, "utf8");
const lines = raw.split("\n");
const header = lines[0];
const events = lines.slice(1);

// header + newline is always kept
const headerBytes = Buffer.byteLength(header, "utf8") + 1;
const eventBytes = events.map((l) => Buffer.byteLength(l, "utf8") + 1);
const totalBefore = headerBytes + eventBytes.reduce((a, b) => a + b, 0);

if (totalBefore <= targetBytes) {
  console.log(
    `${file} is already ${(totalBefore / 1048576).toFixed(2)} MiB (≤ ${targetMiB} MiB) — no trim needed`,
  );
  process.exit(0);
}

// Find smallest N such that dropping first N events fits under the target.
// Walk from the tail keeping a running sum until we exceed target minus header.
const budget = targetBytes - headerBytes;
let tailSum = 0;
let keepFromIdx = events.length;
for (let i = events.length - 1; i >= 0; i--) {
  if (tailSum + eventBytes[i] > budget) break;
  tailSum += eventBytes[i];
  keepFromIdx = i;
}

if (keepFromIdx === events.length) {
  console.error(
    `target ${targetMiB} MiB is smaller than a single tail event — pick a larger target`,
  );
  process.exit(1);
}

const dropped = events.slice(0, keepFromIdx);
const kept = events.slice(keepFromIdx);

// Compute time dropped so we can log it (and note rebased duration).
let droppedTime = 0;
for (const line of dropped) {
  if (!line.trim()) continue;
  try {
    const arr = JSON.parse(line);
    if (Array.isArray(arr) && typeof arr[0] === "number") droppedTime += arr[0];
  } catch {
    /* ignore */
  }
}
// First kept event's delta becomes 0 so playback starts immediately (no dead pause at boot).
let keptTime = 0;
const rebased = kept.map((line, i) => {
  if (!line.trim()) return line;
  try {
    const arr = JSON.parse(line);
    if (Array.isArray(arr) && typeof arr[0] === "number") {
      if (i === 0) arr[0] = 0;
      keptTime += arr[0];
      return JSON.stringify(arr);
    }
    return line;
  } catch {
    return line;
  }
});

const out = [header, ...rebased].join("\n");
fs.writeFileSync(file, out);

const after = fs.statSync(file).size;
const mib = (b) => (b / 1048576).toFixed(2);
const min = (s) => (s / 60).toFixed(1);
console.log(
  `${file}: ${mib(totalBefore)} → ${mib(after)} MiB | dropped ${dropped.length} events (~${min(droppedTime)} min from head) | kept ${kept.length} events (~${min(keptTime)} min)`,
);
