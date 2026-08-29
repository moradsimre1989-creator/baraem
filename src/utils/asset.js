/*
  مسارات الأصول العامة (مجلد public)
  ===================================
  ملفات الصوت والفيديو تُشار إليها في البيانات بمسار مطلق مثل "/video/x.mp4".
  هذا صحيح حين يكون الموقع في جذر النطاق، ويكسر حين يُنشر تحت مسار فرعي مثل
  `‎/zaytouna-app/‎` على GitHub Pages. Vite يعيد كتابة المسارات المطلقة داخل
  index.html وحدها، لا داخل سلاسل JavaScript — فنعالجها هنا.

  `import.meta.env.BASE_URL` ينتهي دائماً بشرطة مائلة، ويساوي "/" في التطوير
  المحلي وفي نسخة الـ Artifact، فلا يتغيّر أي سلوك قائم.
*/

export function asset(path) {
  if (!path) return path;
  // المسارات الكاملة (http, data:, blob:) تُترك كما هي
  if (/^[a-z]+:/i.test(path)) return path;
  return `${import.meta.env.BASE_URL}${String(path).replace(/^\/+/, "")}`;
}
