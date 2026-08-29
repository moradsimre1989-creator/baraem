/*
  نشر موقع براعم على Cloudflare Pages
  ====================================
      npm run deploy:cf

  يبني الموقع ويرفعه مباشرة إلى مشروع Pages باسم `baraem`، فيصير على
  https://baraem.pages.dev — بالفيديو والصوت، وبلا أي اسم شخصي في الرابط.

  يحتاج توكن Cloudflare بصلاحية «Cloudflare Pages: Edit». يُقرأ من متغيّر
  البيئة CLOUDFLARE_API_TOKEN، أو من ملف ‎~/.cf-token‎ إن لم يكن المتغيّر مضبوطاً.
  التوكن لا يُطبع ولا يُودَع في المستودع أبداً.

  الرفع مباشر (Direct Upload) لا عبر ربط GitHub: الربط خطوة تفاعلية في المتصفّح
  لا تمرّ عبر API، بينما الرفع المباشر يعمل بالتوكن وحده.
*/

import { execFileSync } from "node:child_process";
import { readFileSync, existsSync } from "node:fs";
import { homedir } from "node:os";
import { join } from "node:path";

const ROOT = process.cwd();
const PROJECT = "baraem";
const SITE = "https://baraem.pages.dev";
const TOKEN_FILE = join(homedir(), ".cf-token");

function token() {
  if (process.env.CLOUDFLARE_API_TOKEN) return process.env.CLOUDFLARE_API_TOKEN.trim();
  if (existsSync(TOKEN_FILE)) return readFileSync(TOKEN_FILE, "utf8").trim();
  console.error(
    `لا يوجد توكن Cloudflare.\n` +
      `اضبط CLOUDFLARE_API_TOKEN، أو احفظ التوكن في ${TOKEN_FILE}\n` +
      `أنشئه من: https://dash.cloudflare.com/profile/api-tokens (صلاحية Cloudflare Pages: Edit)`
  );
  process.exit(1);
}

const CF_TOKEN = token();

function run(cmd, args, opts = {}) {
  return execFileSync(cmd, args, { stdio: "inherit", ...opts });
}

// 1) البناء — جذر النطاق، فلا حاجة لمسار فرعي
console.log("\n▶ البناء\n");
run(process.execPath, [join(ROOT, "node_modules", "vite", "bin", "vite.js"), "build"], {
  env: { ...process.env, VITE_BASE: "/", VITE_SITE_URL: SITE },
});

// 2) الرفع
console.log("\n▶ الرفع إلى Cloudflare Pages\n");
run(
  process.execPath,
  [
    join(ROOT, "node_modules", "wrangler", "bin", "wrangler.js"),
    "pages",
    "deploy",
    "dist",
    "--project-name",
    PROJECT,
    "--branch",
    "main",
    "--commit-dirty=true",
  ],
  { env: { ...process.env, CLOUDFLARE_API_TOKEN: CF_TOKEN } }
);

console.log(`\n✅ نُشر على ${SITE}\n`);
