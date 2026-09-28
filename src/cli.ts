#!/usr/bin/env node
/**
 * fixturebox — sanitize JSON from a file or stdin into a safe fixture.
 *
 *   cat production-response.json | fixturebox
 *   fixturebox response.json > fixtures/response.json
 */
import * as fs from "node:fs";
import { fixture } from "./index";

function main(): void {
  const argv = process.argv.slice(2);
  const outFileArg = argv.indexOf("-o");
  const skipIndices = new Set(
    outFileArg >= 0 ? [outFileArg, outFileArg + 1] : [],
  );
  const outFile = outFileArg >= 0 ? argv[outFileArg + 1] : undefined;
  const file = argv.find((a, i) => !a.startsWith("-") && !skipIndices.has(i));

  let data: unknown;
  try {
    const raw = file ? fs.readFileSync(file, "utf8") : fs.readFileSync(0, "utf8");
    data = JSON.parse(raw);
  } catch (err) {
    console.error(`fixturebox: cannot read JSON input (${(err as Error).message})`);
    process.exit(1);
  }

  const output = JSON.stringify(fixture(data), null, 2);
  if (outFile) {
    fs.writeFileSync(outFile, output + "\n");
    console.error(`fixturebox: wrote ${outFile}`);
  } else {
    console.log(output);
  }
}

main();
