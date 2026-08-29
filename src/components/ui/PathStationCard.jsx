import CoverImage from "./CoverImage.jsx";

/*
  بطاقة محطة مصوّرة
  ==================
  الصورة هي البطاقة، لا زخرفة فوقها: تملأ الإطار كاملاً، ويجلس العنوان
  والتقدّم فوقها داخل التدرّج الداكن. هذا ما يجعل الشبكة تُقرأ كصور أولاً —
  وهو المطلوب لطالب في الصف الثاني يتعرّف على المحطة من صورتها قبل اسمها.

  مستعملة في شاشة الوحدة (تبويب المسار) وفي شاشة المسار المستقلّة معاً،
  فتبقى المحطة بشكل واحد أينما ظهرت.
*/

export default function PathStationCard({
  cover,
  icon,
  title,
  description,
  index,
  done = 0,
  total = 0,
  badge,
  onClick,
}) {
  const percent = total === 0 ? 0 : Math.round((done / total) * 100);
  const complete = total > 0 && done === total;

  return (
    <button
      onClick={onClick}
      className="group w-full text-right transition-all duration-300 hover:-translate-y-1"
      aria-label={
        index == null
          ? `${title} — ${done} من ${total} مكتمل`
          : `المحطة ${index + 1}: ${title} — ${done} من ${total} مكتمل`
      }
    >
      <CoverImage
        src={cover}
        ratio="card"
        className="border-2 border-transparent group-hover:border-olive-green group-focus-visible:border-olive-green"
      >
        <div className="flex items-start justify-between gap-2 mb-auto">
          {/* رقم المحطة بخلفية داكنة لا بيضاء: الشارة البيضاء تختفي فوق الصور الفاتحة */}
          {index != null && (
            <span className="rounded-full bg-black/55 px-3 py-1 text-sm font-black text-white backdrop-blur-sm">
              {index + 1}
            </span>
          )}
          {complete && badge && (
            <span className="mr-auto rounded-full bg-olive-green px-3 py-1 text-sm font-bold text-white">
              {badge.emoji} {badge.label}
            </span>
          )}
        </div>

        <div>
          <div className="flex items-center gap-2 mb-1">
            {icon && (
              <span className="text-2xl" aria-hidden>
                {icon}
              </span>
            )}
            <h3 className="text-xl font-black text-white leading-tight [text-shadow:0_2px_8px_rgb(0_0_0/70%)]">
              {title}
            </h3>
          </div>
          {description && (
            <p className="text-white/90 text-sm leading-snug mb-3 line-clamp-2 [text-shadow:0_1px_6px_rgb(0_0_0/70%)]">
              {description}
            </p>
          )}

          <div className="flex items-center gap-2">
            <div className="h-2.5 flex-1 rounded-full bg-white/25 overflow-hidden">
              <div
                className="h-full rounded-full bg-olive-gold transition-all duration-500"
                style={{ width: `${percent}%` }}
              />
            </div>
            <span className="text-sm font-bold text-white shrink-0">
              {done}/{total}
            </span>
          </div>
        </div>
      </CoverImage>
    </button>
  );
}
