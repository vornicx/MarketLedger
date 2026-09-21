import { mkdir, writeFile, cp } from "node:fs/promises";
import { join } from "node:path";

const root = process.cwd();
const out = join(root, "public_build");

await mkdir(join(out, "dist"), { recursive: true });
await cp(join(root, "index.html"), join(out, "index.html"));
await cp(join(root, "public"), join(out, "public"), { recursive: true });
await cp(join(root, "app", "main.js"), join(out, "dist", "app.js"));
await cp(join(root, "data", "latest.js"), join(out, "dist", "data.js"));
await cp(join(root, "data", "i18n.js"), join(out, "dist", "i18n.js"));
await cp(join(root, "_chunks", "ui.000.txt"), join(out, "dist", "ui.js"));
await cp(join(root, "styles", "light.css"), join(out, "styles.css"));

console.log("Market Ledger build complete:", out);
