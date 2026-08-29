/*
  صورة معاينة الرابط (Open Graph)
  ================================
      npm run og

  تولّد public/og-cover.jpg بمقاس 1200×630 — المقاس الذي تتوقّعه واتساب وفيسبوك
  وتيليجرام وغيرها. تُبنى من صورة زيتون حقيقية من صور الوحدة نفسها، مع تعتيم
  متدرّج من الأسفل ليقرأ العنوان الذي تعرضه المنصّات فوق الصورة أو تحتها.

  لا نطبع نصاً عربياً داخل الصورة عمداً: محرّك SVG داخل sharp لا يشكّل الحروف
  العربية ولا يوصلها، فتخرج الكلمات مقطّعة ومعكوسة. العنوان والوصف يأتيان من
  وسوم og:title و og:description في index.html، وكل المنصّات تعرضهما بجانب
  الصورة بخطّ يدعم العربية أصلاً.
*/

import { stat } from "node:fs/promises";
import { join } from "node:path";
import sharp from "sharp";

const SRC = join(process.cwd(), "src", "assets", "photos", "olive-tree-full.jpg");
const OUT = join(process.cwd(), "public", "og-cover.jpg");

const W = 1200;
const H = 630;

// تعتيم متدرّج: شفاف في الأعلى، داكن في الأسفل حيث يقع النص عادةً
const overlay = Buffer.from(`
<svg width="${W}" height="${H}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="shade" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%"   stop-color="#0f2318" stop-opacity="0.00" />
      <stop offset="65%"  stop-color="#0f2318" stop-opacity="0.10" />
      <stop offset="100%" stop-color="#0f2318" stop-opacity="0.40" />
    </linearGradient>
  </defs>
  <rect width="${W}" height="${H}" fill="url(#shade)" />
</svg>
`);

await sharp(SRC)
  .resize(W, H, { fit: "cover", position: "attention" }) // يقصّ حول أبرز جزء في الصورة
  // رفع خفيف للسطوع والتشبّع: المعاينة تُعرض بحجم صغير جداً في واتساب،
  // والصورة الباهتة تضيع فيها تفاصيل الشجرة.
  .modulate({ brightness: 1.10, saturation: 1.15 })
  .composite([{ input: overlay, blend: "over" }])
  // JPEG أساسي لا متوالٍ: زاحف واتساب يفشل في قراءة الصور المتوالية
  // (progressive) فلا يعرض معاينة إطلاقاً، بينما المتصفّح يعرضها عادياً.
  // والحجم تحت 200 KB لأن واتساب يتجاهل الصور الثقيلة.
  .jpeg({ quality: 78, progressive: false, mozjpeg: true })
  .toFile(OUT);

const { size } = await stat(OUT);
console.log(`✅ ${OUT}`);
console.log(`   ${W}×${H} — ${(size / 1024).toFixed(0)} KB — جاهزة لوسم og:image`);
