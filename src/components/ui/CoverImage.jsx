import { altFor } from "../../data/photoCredits.js";

/*
  صورة غلاف موحّدة
  =================
  كل الأغلفة بنفس النسبة ونفس التدرّج الداكن، حتى تبدو المحطات عائلة واحدة
  مهما اختلفت إضاءة الصور الأصلية. التدرّج من الأسفل هو ما يجعل العنوان
  مقروءاً فوق أي صورة — بلا هذه الطبقة يذوب النص الأبيض في الصور الفاتحة.

  الوصف البديل يُقرأ تلقائياً من سجلّ الصور، فلا يُنسى في أي موضع استعمال.
*/

const RATIOS = {
  wide: "aspect-[16/9]",
  banner: "aspect-[21/9]",
  card: "aspect-[4/3]",
};

export default function CoverImage({
  src,
  alt,
  ratio = "wide",
  overlay = "strong",
  className = "",
  children,
  rounded = "rounded-3xl",
}) {
  const overlays = {
    // تدرّج من الأسفل: أغمق تحت النص، شفاف فوق الصورة
    strong: "linear-gradient(to top, rgb(15 30 20 / 82%) 0%, rgb(15 30 20 / 45%) 45%, rgb(15 30 20 / 12%) 100%)",
    soft: "linear-gradient(to top, rgb(15 30 20 / 62%) 0%, rgb(15 30 20 / 22%) 60%, transparent 100%)",
  };

  return (
    <div className={`relative overflow-hidden ${rounded} ${RATIOS[ratio]} ${className}`}>
      <img
        src={src}
        alt={alt ?? altFor(src)}
        loading="lazy"
        decoding="async"
        className="absolute inset-0 h-full w-full object-cover"
      />
      <div
        aria-hidden
        className="absolute inset-0"
        style={{ background: overlays[overlay] }}
      />
      {children && (
        <div className="absolute inset-0 flex flex-col justify-end p-4 sm:p-6">{children}</div>
      )}
    </div>
  );
}
