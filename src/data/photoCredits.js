/*
  سجلّ صور وحدة الزيتونة
  =======================
  مصدر واحد للحقيقة لكل صورة في الوحدة: الوصف البديل العربي (للوصولية وقارئ
  الشاشة)، ومصدر الصورة والمصوّر والترخيص.

  ⚠️ حقول المصدر/المصوّر/الترخيص مُعلَّمة "غير موثّق" حيث لا نملك السجلّ الأصلي
  لهذه الصور. لم تُملأ بقيم مُفترَضة عمداً: ادّعاء ترخيص غير محقَّق أسوأ من
  الاعتراف بأنه غير موثّق، خاصة في مادة تعليمية تُعرض في مدرسة.
  عند التحقّق من مصدر أي صورة، املأ حقولها هنا — لا حاجة لتعديل أي مكان آخر.
*/

/** @typedef {{ alt: string, source: string|null, photographer: string|null, license: string|null }} PhotoCredit */

const UNVERIFIED = { source: null, photographer: null, license: null };

/** @type {Record<string, PhotoCredit>} */
export const photoCredits = {
  "olive-branches-sunset.webp": {
    alt: "أغصان شجرة زيتون محمّلة بالأوراق الفضية على خلفية سماء عند الغروب",
    ...UNVERIFIED,
  },
  "olive-tree-full.webp": {
    alt: "شجرة زيتون معمّرة كاملة بجذع سميك وتاج عريض من الأغصان",
    ...UNVERIFIED,
  },
  "olives-closeup.webp": {
    alt: "حبّات زيتون خضراء وسوداء عن قرب بين أوراق الشجرة",
    ...UNVERIFIED,
  },
  "olive-picking.webp": {
    alt: "كمية كبيرة من ثمار الزيتون المقطوفة حديثاً مختلطة بأوراق خضراء",
    ...UNVERIFIED,
  },
  "olive-orchard-wide.webp": {
    alt: "بستان زيتون واسع تصطفّ فيه الأشجار على مدّ النظر",
    ...UNVERIFIED,
  },
  "olive-grove-region.webp": {
    alt: "منطقة زراعية تنتشر فيها أشجار الزيتون على تلال متدرّجة",
    ...UNVERIFIED,
  },
  "olive-blossom.webp": {
    alt: "زهور الزيتون البيضاء الصغيرة متفتّحة على غصن أخضر",
    ...UNVERIFIED,
  },
  "olive-leaves.webp": {
    alt: "أوراق زيتون خضراء رفيعة، وجهها أخضر داكن وظهرها فضّي",
    ...UNVERIFIED,
  },
  "olive-roots.webp": {
    alt: "جذور شجرة زيتون ضخمة بارزة فوق سطح التربة حول الجذع",
    ...UNVERIFIED,
  },
  "tree-trunk.webp": {
    alt: "جذع شجرة زيتون معمّرة بلحائه المتشقّق وتجاويفه العميقة",
    ...UNVERIFIED,
  },
  "tree-shade.webp": {
    alt: "ظلّ شجرة ممتدّ على الأرض تحت ضوء الشمس",
    ...UNVERIFIED,
  },
  "olive-comb-tool.webp": {
    alt: "مشط قطف الزيتون اليدوي، وهو أداة بأسنان طويلة تُمشَّط بها الأغصان",
    ...UNVERIFIED,
  },
  "olive-oil-press.webp": {
    alt: "معصرة زيتون تُطحن فيها الثمار لاستخراج الزيت",
    ...UNVERIFIED,
  },
  "olive-oil-bottle.webp": {
    alt: "قنينة زجاجية مملوءة بزيت الزيتون الذهبي",
    ...UNVERIFIED,
  },
  "oil-drop.webp": {
    alt: "قطرة زيت زيتون ذهبية لامعة",
    ...UNVERIFIED,
  },
  "olives-in-water.webp": {
    alt: "حبّات زيتون مغمورة في الماء داخل وعاء، كما في مرحلة التخليل",
    ...UNVERIFIED,
  },
  "water-drop.webp": {
    alt: "قطرة ماء صافية تسقط وتُحدث دوائر على سطح الماء",
    ...UNVERIFIED,
  },
  "olive-seed.webp": {
    alt: "بذرة (نواة) زيتون بلونها البنّي وشكلها المدبّب",
    ...UNVERIFIED,
  },
  "seedling.webp": {
    alt: "شتلة صغيرة خضراء تنبت من التربة بورقتين أوليّتين",
    ...UNVERIFIED,
  },
  "olive-count-four.webp": {
    alt: "أربع حبّات زيتون مرتّبة للعدّ",
    ...UNVERIFIED,
  },
  "bird-on-branch.webp": {
    alt: "طائر صغير واقف على غصن شجرة",
    ...UNVERIFIED,
  },
  "white-dove.webp": {
    alt: "حمامة بيضاء، رمز السلام",
    ...UNVERIFIED,
  },
  "earthworm-soil.webp": {
    alt: "دودة أرض تتحرّك في التربة الرطبة بين جذور النباتات",
    ...UNVERIFIED,
  },
};

/**
 * الوصف البديل لصورة بحسب اسم ملفها.
 * يقبل المسار الكامل الذي ينتجه Vite عند الاستيراد، ويستخرج اسم الملف منه.
 */
export function altFor(srcOrFileName, fallback = "") {
  if (!srcOrFileName) return fallback;
  const name = String(srcOrFileName).split("/").pop().split("?")[0];
  // Vite يضيف بصمة للاسم عند البناء: olive-leaves-a1b2c3d4.jpg
  const base = name.replace(/-[A-Za-z0-9_-]{8,}(\.[a-z]+)$/, "$1");
  return photoCredits[base]?.alt ?? photoCredits[name]?.alt ?? fallback;
}

/** كل الصور التي ما زال مصدرها بحاجة إلى توثيق — تُعرض في شاشة المعلّمة. */
export function unverifiedPhotos() {
  return Object.entries(photoCredits)
    .filter(([, c]) => !c.license)
    .map(([file, c]) => ({ file, alt: c.alt }));
}
