import { promises as fs } from "node:fs";
import path from "node:path";

const generatedDirectory = path.resolve("generated/prisma");
const importPattern = /(\b(?:from|import)\s*["'])(\.?\.?\/[^"']+)(["'])/g;

async function visit(directory) {
  const entries = await fs.readdir(directory, { withFileTypes: true });

  for (const entry of entries) {
    const entryPath = path.join(directory, entry.name);
    if (entry.isDirectory()) {
      await visit(entryPath);
      continue;
    }

    if (!/\.(?:js|ts|mjs|cjs)$/.test(entry.name)) continue;

    const source = await fs.readFile(entryPath, "utf8");
    const fixed = source.replace(importPattern, (match, prefix, specifier, suffix) => {
      if (path.extname(specifier)) return match;
      return `${prefix}${specifier}.js${suffix}`;
    });

    if (fixed !== source) await fs.writeFile(entryPath, fixed);
  }
}

await visit(generatedDirectory);
