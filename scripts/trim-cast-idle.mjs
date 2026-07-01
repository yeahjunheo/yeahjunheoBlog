#!/usr/bin/env node
// Caps idle gaps in asciinema v3 cast files to a max delta (default 2.0s).
// Rewrites files in place. Files are versioned in git — restore with `git checkout` if needed.
// Usage: node scripts/trim-cast-idle.mjs [dir] [limit]

import fs from "node:fs";
import path from "node:path";

const dir = process.argv[2] || "public/casts";
const limit = parseFloat(process.argv[3] || "2.0");

const files = fs.readdirSync(dir).filter((f) => f.endsWith(".cast"));
if (!files.length) {
  console.log(`no .cast files in ${dir}`);
  process.exit(0);
}

let totalBefore = 0;
let totalAfter = 0;

for (const file of files) {
  const p = path.join(dir, file);
  const before = fs.statSync(p).size;
  const raw = fs.readFileSync(p, "utf8");
  const lines = raw.split("\n");
  const header = lines[0];
  let capped = 0;
  let origDuration = 0;
  let newDuration = 0;

  const trimmed = lines.slice(1).map((line) => {
    if (!line.trim()) return line;
    try {
      const arr = JSON.parse(line);
      if (Array.isArray(arr) && typeof arr[0] === "number") {
        origDuration += arr[0];
        if (arr[0] > limit) {
          arr[0] = limit;
          capped++;
        }
        newDuration += arr[0];
        return JSON.stringify(arr);
      }
      return line;
    } catch {
      return line;
    }
  });

  const out = [header, ...trimmed].join("\n");
  fs.writeFileSync(p, out);
  const after = fs.statSync(p).size;
  totalBefore += before;
  totalAfter += after;

  const mib = (b) => (b / 1048576).toFixed(2);
  const min = (s) => (s / 60).toFixed(1);
  console.log(
    `${file}: ${mib(before)} → ${mib(after)} MiB | ${min(origDuration)} → ${min(newDuration)} min | capped ${capped} gaps`,
  );
}

console.log(
  `\ntotal: ${(totalBefore / 1048576).toFixed(2)} → ${(totalAfter / 1048576).toFixed(2)} MiB`,
);
