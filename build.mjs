import { mkdir, readFile, writeFile, cp } from "node:fs/promises";
import { join } from "node:path";

const root = process.cwd();
const out = join(root, "public_build");
const chunks = join(root, "_chunks");

async function concat(prefix, destination) {
  const names = ["000","001","002","003","004"];
  const parts = [];
  for (const n of names) {
    try { parts.push(await readFile(join(chunks, `${prefix}.${n}.txt`), "utf8")); }
    catch (error) { if (error?.code !== "ENOENT") throw error; }
  }
  await writeFile(destination, parts.join(""), "utf8");
}

await mkdir(join(out, "dist"), { recursive: true });
await cp(join(root, "index.html"), join(out, "index.html"));
await cp(join(root, "public"), join(out, "public"), { recursive: true });
await cp(join(root, "app", "main.js"), join(out, "dist", "app.js"));
await cp(join(root, "data", "latest.js"), join(out, "dist", "data.js"));
await cp(join(root, "data", "i18n.js"), join(out, "dist", "i18n.js"));
await concat("ui", join(out, "dist", "ui.js"));
await concat("styles", join(out, "styles.css"));
await writeFile(
  join(out, "styles.css"),
  (await readFile(join(out, "styles.css"), "utf8")) + "\n" + (await readFile(join(root, "styles", "light.css"), "utf8")),
  "utf8"
);

console.log("Market Ledger build complete:", out);
