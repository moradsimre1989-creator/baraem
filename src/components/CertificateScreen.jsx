import { useState } from "react";
import BigButton from "./ui/BigButton.jsx";
import CoverImage from "./ui/CoverImage.jsx";
import oliveTreeFullPhoto from "../assets/photos/olive-tree-full.webp";
import oliveBranchesPhoto from "../assets/photos/olive-branches-sunset.webp";

/*
  شاشة الإنجازات والشهادة
  ========================
  الشارات تُعرض بصورها الحقيقية لا برموزها وحدها: الشارة التي تحمل صورة جذور
  الشجرة تذكّر الطالب بالمحطة التي نالها فيها، والرمز وحده لا يفعل ذلك.
  الشارة غير المكتسَبة تبقى ظاهرة بالرمادي — الهدف أن يعرف ما ينقصه، لا أن يُخفى عنه.

  الشهادة نفسها قابلة للطباعة: `print-hidden` يخفي كل ما ليس جزءاً منها،
  وصورة الغلاف تُطبع بألوانها بفضل print-color-adjust في index.css.
*/

function BadgeCard({ badge }) {
  return (
    <div
      className={`rounded-2xl overflow-hidden border-2 transition-colors ${
        badge.earned ? "border-olive-gold bg-olive-gold/5" : "border-border bg-surface"
      }`}
    >
      <div className="relative aspect-[4/3]">
        {badge.photo && (
          <img
            src={badge.photo}
            alt=""
            loading="lazy"
            decoding="async"
            className={`absolute inset-0 h-full w-full object-cover ${
              badge.earned ? "" : "grayscale opacity-60"
            }`}
          />
        )}
        <span className="absolute bottom-1.5 right-1.5 text-2xl drop-shadow-lg" aria-hidden>
          {badge.emoji}
        </span>
        {badge.earned && (
          <span className="absolute top-1.5 left-1.5 rounded-full bg-olive-green px-2 py-0.5 text-xs font-bold text-white">
            ✓
          </span>
        )}
      </div>
      <p
        className={`px-2 py-2 text-center text-sm font-bold leading-tight ${
          badge.earned ? "text-olive-ink" : "text-olive-trunk"
        }`}
      >
        {badge.label}
      </p>
    </div>
  );
}

export default function CertificateScreen({ unit, totalPoints, badges = [] }) {
  const [name, setName] = useState("");
  const today = new Date().toLocaleDateString("ar-EG", { year: "numeric", month: "long", day: "numeric" });
  const earned = badges.filter((b) => b.earned);

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 pb-16 pt-6 space-y-6">
      <div className="print-hidden">
        <CoverImage src={oliveBranchesPhoto} ratio="banner" className="mb-6">
          <div>
            <h1 className="text-3xl sm:text-4xl font-black text-white mb-1">🏆 إنجازاتي</h1>
            <p className="text-white/90">
              {earned.length} من {badges.length} شارة · {totalPoints} نقطة
            </p>
          </div>
        </CoverImage>
      </div>

      {/* رفّ الشارات المصوّر */}
      {badges.length > 0 && (
        <section className="print-hidden">
          <h2 className="text-2xl font-black text-olive-ink mb-4">🏅 شاراتي</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {badges.map((b) => (
              <BadgeCard key={b.label} badge={b} />
            ))}
          </div>
        </section>
      )}

      <div className="print-hidden">
        <h2 className="text-2xl font-black text-olive-ink mb-3">📜 شهادة الإنجاز</h2>
        <p className="text-olive-trunk mb-3">اكتب اسمك ثم اطبع شهادتك</p>
        <input
          className="w-full rounded-2xl border-2 border-olive-green/30 p-3 text-lg text-center"
          placeholder="اكتب اسم الطالب هنا"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>

      <div
        id="certificate"
        className="bg-surface rounded-3xl overflow-hidden text-center"
        style={{ boxShadow: "var(--shadow-card)", border: "6px double #c68a2e" }}
      >
        <img
          src={oliveTreeFullPhoto}
          alt="شجرة زيتون معمّرة في بستان"
          className="w-full h-40 object-cover"
        />
        <div className="p-8 space-y-4">
          <p className="text-olive-green font-bold tracking-wide">شهادة إنجاز</p>
          <h2 className="text-2xl font-black text-olive-ink">مُتقن وحدة الزيتونة {unit.year}</h2>
          <p className="text-olive-trunk">تُمنح هذه الشهادة إلى</p>
          <p className="font-quran text-3xl font-bold text-olive-gold min-h-12 border-b-2 border-dotted border-olive-gold/50 inline-block px-6 pb-2">
            {name || "________________"}
          </p>
          <p className="text-olive-trunk leading-relaxed max-w-md mx-auto">
            تقديراً لإتمامه رحلة تعليمية تفاعلية حول قصيدة «الزَّيْتونَة»، وجمع{" "}
            <span className="font-bold text-olive-ink">{totalPoints}</span> نقطة عبر محطات اللغة
            والعلوم والرياضيات والفنون وغيرها.
          </p>

          {earned.length > 0 && (
            <div className="flex flex-wrap justify-center gap-2 pt-2">
              {earned.map((b) => (
                <span
                  key={b.label}
                  className="inline-flex items-center gap-1.5 rounded-full bg-olive-gold/15 px-3 py-1 text-sm font-bold text-olive-ink"
                >
                  <span aria-hidden>{b.emoji}</span>
                  {b.label}
                </span>
              ))}
            </div>
          )}

          <p className="text-sm text-olive-trunk pt-2">
            {unit.school} — {today}
          </p>
        </div>
      </div>

      <div className="print-hidden flex justify-center">
        <BigButton variant="primary" onClick={() => window.print()}>
          🖨️ اطبع الشهادة
        </BigButton>
      </div>
    </div>
  );
}
