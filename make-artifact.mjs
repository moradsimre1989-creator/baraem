import { readFileSync, readdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const distAssets = join(process.cwd(), "dist", "assets");
const files = readdirSync(distAssets);
const cssFile = files.find((f) => f.endsWith(".css"));
const jsFile = files.find((f) => f.endsWith(".js"));

const css = readFileSync(join(distAssets, cssFile), "utf8");
const js = readFileSync(join(distAssets, jsFile), "utf8");

const html = `<title>براعم | وحدة الزيتونة</title>
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link
  href="https://fonts.googleapis.com/css2?family=Tajawal:wght@400;500;700;800;900&family=Noto+Naskh+Arabic:wght@400..700&display=swap"
  rel="stylesheet"
/>
<style>
${css}
</style>
<div id="root"></div>
<script type="module">
${js}
</script>
`;

const outPath = join(
  "C:/Users/user/AppData/Local/Temp/claude/c--Users-user-Desktop------/0bc4135b-d3e9-46ce-93e2-5003e160c203/scratchpad",
  "zaytouna-artifact-preview.html"
);
writeFileSync(outPath, html, "utf8");
console.log("wrote", outPath, `(${(html.length / 1024).toFixed(0)} KB)`);
