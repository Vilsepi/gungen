#!/usr/bin/env node

import { parseArgs } from "node:util";

import { renderSvgCanvas } from "../src/testing/render-svg.ts";

const { values } = parseArgs({
  options: {
    category: { type: "string" },
    dataModelSeed: { type: "string" },
    partSizeSeed: { type: "string" },
    aestheticDetailSeed: { type: "string" },
  },
  allowPositionals: false,
});

try {
  process.stdout.write(renderSvgCanvas(values));
} catch (error) {
  const message = error instanceof Error ? error.message : String(error);
  process.stderr.write(`${message}\n`);
  process.exitCode = 1;
}
