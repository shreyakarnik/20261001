// Checks that the bundled Three.js runtime is still the unmodified original.
// Run with `npm run verify:assets`.
import { createHash } from "node:crypto";
import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("../public/landing-pages/", import.meta.url));
const expected = {
  "assets/three.min.js": "8a5f7249903b54d30f79f708699d2fed2d6a1d0741a4cd41377d1f01bb5a2271",
};

let failed = 0;
for (const [path, hash] of Object.entries(expected)) {
  let actual = "missing";
  try { actual = createHash("sha256").update(await readFile(root + path)).digest("hex"); } catch {}
  const ok = actual === hash;
  if (!ok) failed++;
  console.log(`${ok ? "ok      " : "CHANGED "} ${path}`);
}
console.log(failed ? `\n${failed} file(s) differ from the original.` : "\nThe Three.js runtime matches the original.");
process.exit(failed ? 1 : 0);
