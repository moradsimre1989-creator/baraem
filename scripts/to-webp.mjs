/*
  تحويل صور الوحدة إلى WebP
  ==========================
  يُشغَّل يدوياً عند إضافة صور جديدة:  node scripts/to-webp.mjs

  لماذا WebP: الحزمة تضمّن الصور داخلها (assetsInlineLimit في vite.config.js)
  حتى تبقى نسخة الـ Artifact ملفاً واحداً يعمل بلا خادم — وحجم JPEG الأصلي
  يضخّم تلك الحزمة أضعافاً. WebP يعطي الجودة نفسها بجزء من الحجم.

  الملفات الأصلية تبقى في مكانها ولا تُحذف: الصورة المصدر أعلى جودة، ونحتاجها
  إن أردنا لاحقاً إعادة التوليد بإعدادات مختلفة.
*/

import { readdir, stat } from "node:fs/promises";
import { join, extname, basename } from "node:path";
import sharp from "sharp";

const DIR = join(process.cwd(), "src", "assets", "photos");
const QUALITY = 82;
const MAX_WIDTH = 1600; // أكبر عرض نحتاجه فعلاً على الشاشة

const files = (await readdir(DIR)).filter((f) => /\.(jpe?g|png)$/i.test(f));

let before = 0;
let after = 0;

for (const file of files) {
  const src = join(DIR, file);
  const out = join(DIR, `${basename(file, extname(file))}.webp`);

  const original = await stat(src);
  before += original.size;

  await sharp(src)
    .resize({ width: MAX_WIDTH, withoutEnlargement: true })
    .webp({ quality: QUALITY })
    .toFile(out);

  const converted = await stat(out);
  after += converted.size;

  const saved = Math.round((1 - converted.size / original.size) * 100);
  console.log(
    `${file.padEnd(30)} ${(original.size / 1024).toFixed(0).padStart(5)} KB → ${(
      converted.size / 1024
    )
      .toFixed(0)
      .padStart(5)} KB  (-${saved}%)`
  );
}

console.log(
  `\nالمجموع: ${(before / 1024 / 1024).toFixed(2)} MB → ${(after / 1024 / 1024).toFixed(
    2
  )} MB  (توفير ${Math.round((1 - after / before) * 100)}%)`
);
