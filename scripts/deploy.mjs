/*
  نشر موقع براعم
  ===============
      npm run deploy

  يبني الموقع بمسار GitHub Pages الفرعي، ويدفع الناتج إلى فرع `gh-pages`.
  الموقع يتحدّث خلال دقيقة تقريباً.

  لماذا فرع منفصل لا GitHub Actions: التوكن الحالي لا يملك صلاحية `workflow`،
  فلا يستطيع رفع ملف داخل ‎.github/workflows‎. ملف الـ Actions جاهز في المستودع
  تحت `.github/workflows/deploy.yml` — امنحي الصلاحية مرة واحدة بـ
  `gh auth refresh -s workflow` ثم ادفعيه، وعندها يصير البناء والنشر تلقائيين
  عند كل دفعة ولن تحتاجي هذا السكربت.

  الفرع `gh-pages` يحوي **ناتج البناء فقط**، لا الكود. الكود على `main`.
*/

import { execFileSync } from "node:child_process";
import { cpSync, existsSync, mkdirSync, readdirSync, rmSync, copyFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const ROOT = process.cwd();
const WORKTREE = join(ROOT, ".gh-pages");
const BRANCH = "gh-pages";
const BASE = "/baraem/"; // يطابق اسم المستودع — غيّرهما معاً أو ينكسر كل رابط أصل

function run(cmd, args, opts = {}) {
  return execFileSync(cmd, args, { stdio: "inherit", ...opts });
}

function quiet(cmd, args, opts = {}) {
  return execFileSync(cmd, args, { encoding: "utf8", ...opts }).trim();
}

// 1) تحذير مبكر: تغييرات غير محفوظة تعني نشر شيء لا يوافق أي لقطة في المستودع
const dirty = quiet("git", ["status", "--porcelain"]);
if (dirty) {
  console.warn("⚠️  توجد تغييرات غير مُودَعة في git — سيُنشر الموقع من ملفاتك الحالية:\n");
  console.warn(dirty.split("\n").slice(0, 10).join("\n"));
  console.warn("");
}

// 2) البناء بالمسار الفرعي
console.log(`\n▶ البناء بمسار ${BASE}\n`);
// npm على ويندوز ملف دفعي، فنستدعي npm.cmd مباشرة بدل تشغيل صدفة — تمرير
// الوسائط عبر صدفة يفتح باب حقن الأوامر ويطلق تحذير إهمال في Node.
run(process.platform === "win32" ? "npm.cmd" : "npm", ["run", "build"], {
  env: { ...process.env, VITE_BASE: BASE },
});

// 3) تجهيز نسخة عمل لفرع gh-pages
if (existsSync(WORKTREE)) {
  try {
    run("git", ["worktree", "remove", "--force", WORKTREE], { stdio: "ignore" });
  } catch {
    rmSync(WORKTREE, { recursive: true, force: true });
  }
}
console.log(`\n▶ تجهيز فرع ${BRANCH}\n`);
try {
  run("git", ["fetch", "origin", BRANCH], { stdio: "ignore" });
  run("git", ["worktree", "add", WORKTREE, BRANCH], { stdio: "ignore" });
} catch {
  // الفرع غير موجود بعد — ننشئه من الصفر
  run("git", ["worktree", "add", "-B", BRANCH, WORKTREE], { stdio: "ignore" });
}

// 4) استبدال المحتوى بالكامل (الملف المحذوف من dist يجب أن يختفي من الموقع)
for (const entry of readdirSync(WORKTREE)) {
  if (entry === ".git") continue;
  rmSync(join(WORKTREE, entry), { recursive: true, force: true });
}
cpSync(join(ROOT, "dist"), WORKTREE, { recursive: true });

// تطبيق صفحة واحدة: أي رابط خاطئ يعيد الطالب إلى التطبيق لا إلى صفحة خطأ
copyFileSync(join(WORKTREE, "index.html"), join(WORKTREE, "404.html"));
// يمنع GitHub من تمرير الملفات عبر Jekyll (يحذف ما يبدأ بشرطة سفلية)
writeFileSync(join(WORKTREE, ".nojekyll"), "");

// 5) الإيداع والدفع
console.log(`\n▶ الدفع إلى ${BRANCH}\n`);
run("git", ["add", "-A"], { cwd: WORKTREE });

const changed = quiet("git", ["status", "--porcelain"], { cwd: WORKTREE });
if (!changed) {
  console.log("لا تغييرات — الموقع محدَّث أصلاً.");
} else {
  const sha = quiet("git", ["rev-parse", "--short", "HEAD"], { cwd: ROOT });
  run("git", ["commit", "-q", "-m", `نشر براعم من ${sha}`], { cwd: WORKTREE });
  run("git", ["push", "origin", BRANCH], { cwd: WORKTREE });
  console.log("\n✅ نُشر. الموقع يتحدّث خلال دقيقة تقريباً:");
  console.log("   https://moradsimre1989-creator.github.io/baraem/\n");
}

// 6) تنظيف نسخة العمل حتى لا تبقى في مجلد المشروع
run("git", ["worktree", "remove", "--force", WORKTREE], { stdio: "ignore" });
