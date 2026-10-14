// Checks that the packaged page and its assets still match the ThreeUI originals.
// Run with `npm run verify:assets`. Once you start editing kage.html for your own
// version, that one line is expected to fail — the rest should keep passing.
import { createHash } from "node:crypto";
import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("../public/landing-pages/", import.meta.url));
const A = "secret-pathways-assets/";
const expected = {
  "kage.html": "c8e06b90397ac246baf0ab6f32f5f6b570acc6fe03c7009f711b579fb72d9f49",
  [A + "fonts.css"]: "985f85a904a4096f92c06552b06f42a45973ac004af4780d68f18af65ddcc1b0",
  [A + "three.min.js"]: "8a5f7249903b54d30f79f708699d2fed2d6a1d0741a4cd41377d1f01bb5a2271",
  [A + "generated/kage-sanmon-preview.webp"]: "23937f8c8350c55730c3bd17066a250548b2d29aad0e6ffb96218c1354b6db43",
  [A + "generated/kage-approach.webp"]: "39ff338936097e1bde0c4eadcf09805b9890862703186e67314942de7e0bc36c",
  [A + "generated/kage-lantern-court.webp"]: "c0a6ff7da1cd6909d66e2f3f690b0d524a693e01d2222ab846d0074a90f47471",
  [A + "generated/kage-moonwater.webp"]: "b8c8060c51c87a103bae619b3a4cc8b8b80632649d83f1f2c2299051e7f9b400",
  [A + "foreground/png/temple-wall.webp"]: "41c00f017e4ecf2147ee468d74da955bb4e2dad773f75a575022842eaf7609ce",
  [A + "foreground/png/pine-tree.webp"]: "79b233716d067bbc64c1507f79e4a30ba5f445995158c78562cc5b81f607ede7",
  [A + "foreground/png/tall-grass.webp"]: "8db0b5fbd160a7225391a6283a99681e346e205f24191031657285ef85ef12d2",
  [A + "foreground/png/sakura-branch.webp"]: "48564194d40496090dbf3bba2a68785cf91fafb655dc8d43ac16f6678aff196d",
  [A + "foreground/png/maple-leaves.webp"]: "35a90fec62c1a6bbfbbe73cd5d7b1acb889e80546d404182ef9a45fe417b531f",
  [A + "foreground/png/stone-lantern.webp"]: "d5f3c881bc9d92b72eaaff2b709614d66e21a19e14025d2b9b16a15ab52df3bc",
  [A + "foreground/png/garden-bush.webp"]: "707e2516ebc0108041fe0ddc26d8bff0a69dc9700641f837765018b64e9ff15e",
  [A + "foreground/png/basalt-stones.webp"]: "150f1c87e181d651c318168c271bb65c9c8abac6dea6f2421fdd081c5b740471",
  [A + "foreground/png/hill.webp"]: "ffba816244bcba98e4e33c6ee56165edfe4048db4af122ef3f5822180a85edbc",
  [A + "foreground/png/shrine-ruins.webp"]: "77006e58f2066e6fa9bfc504df396db49b1c7977858fa52d34dd2dad5feced77",
};

let failed = 0;
for (const [path, hash] of Object.entries(expected)) {
  let actual = "missing";
  try { actual = createHash("sha256").update(await readFile(root + path)).digest("hex"); } catch {}
  const ok = actual === hash;
  if (!ok) failed++;
  console.log(`${ok ? "ok      " : "CHANGED "} ${path}`);
}
console.log(failed ? `\n${failed} file(s) differ from the ThreeUI originals.` : "\nAll 17 files match the ThreeUI originals.");
process.exit(failed ? 1 : 0);
