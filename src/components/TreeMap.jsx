import { useState } from "react";
import BigButton from "./ui/BigButton.jsx";
import { altFor } from "../data/photoCredits.js";
import oliveBranchesPhoto from "../assets/photos/olive-branches-sunset.webp";

function OliveTreeHero() {
  return (
    <img
      src={oliveBranchesPhoto}
      alt="أغصان شجرة زيتون حقيقية عند الغروب"
      decoding="async"
      fetchPriority="high"
      className="w-full h-64 sm:h-80 md:h-96 object-cover rounded-[28px]"
      style={{ boxShadow: "var(--shadow-hover)" }}
    />
  );
}

const PASTEL_BG = {
  "pastel-blue": "bg-pastel-blue",
  "pastel-green": "bg-pastel-green",
  "pastel-yellow": "bg-pastel-yellow",
  "pastel-pink": "bg-pastel-pink",
  "pastel-purple": "bg-pastel-purple",
  "pastel-orange": "bg-pastel-orange",
};
const CARD_PASTELS = ["pastel-blue", "pastel-green", "pastel-yellow", "pastel-pink", "pastel-purple"];

function BranchCard({ domain, progress, index, onClick }) {
  const percent = Math.round(progress.ratio * 100);
  const pastel = CARD_PASTELS[index % CARD_PASTELS.length];

  return (
    <button
      onClick={onClick}
      disabled={domain.comingSoon}
      className={`group relative rounded-[24px] ${PASTEL_BG[pastel]} p-5 text-center border border-black/5 transition-all duration-300 ease-out hover:-translate-y-1 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand disabled:opacity-60 disabled:hover:translate-y-0 disabled:cursor-not-allowed`}
      style={{ boxShadow: "var(--shadow-card)" }}
      onMouseEnter={(e) => (e.currentTarget.style.boxShadow = "var(--shadow-hover)")}
      onMouseLeave={(e) => (e.currentTarget.style.boxShadow = "var(--shadow-card)")}
    >
      {/* صورة المحطة الحقيقية، والأيقونة شارة صغيرة فوقها بدل أن تحلّ محلّها */}
      <div className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden mb-3">
        {domain.photo ? (
          <img
            src={domain.photo}
            alt={altFor(domain.photo, domain.title)}
            loading="lazy"
            decoding="async"
            className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="absolute inset-0 bg-white/70 flex items-center justify-center text-3xl">
            {domain.icon}
          </div>
        )}
        {domain.photo && (
          <span
            className="absolute bottom-2 right-2 w-10 h-10 rounded-xl bg-white/90 flex items-center justify-center text-2xl"
            aria-hidden
          >
            {domain.icon}
          </span>
        )}
      </div>
      <div className="font-bold text-base text-olive-ink">{domain.title}</div>
      {domain.comingSoon ? (
        <span className="inline-block mt-2 text-xs bg-white/70 rounded-full px-3 py-1 text-olive-trunk">
          قريباً 🌱
        </span>
      ) : (
        <div className="mt-3">
          <div className="w-full h-1.5 rounded-full bg-white/60 overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-500 ease-out"
              style={{ width: `${percent}%`, background: domain.color }}
            />
          </div>
          <div className="text-xs mt-1.5 text-olive-trunk font-medium">
            {progress.done}/{progress.total} {percent === 100 ? "🫒 مكتمل" : ""}
          </div>
        </div>
      )}
    </button>
  );
}

function BadgePopup({ badge, onClose, onGoToDomain }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4" onClick={onClose}>
      <div
        className="bg-white rounded-3xl p-6 max-w-xs w-full text-center space-y-3"
        style={{ boxShadow: "var(--shadow-hover)" }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative mx-auto w-full aspect-[4/3] rounded-2xl overflow-hidden">
          {badge.photo && (
            <img
              src={badge.photo}
              alt=""
              loading="lazy"
              decoding="async"
              className={`absolute inset-0 h-full w-full object-cover ${
                badge.earned ? "" : "grayscale opacity-70"
              }`}
            />
          )}
          <span className="absolute bottom-2 right-2 text-4xl drop-shadow-lg" aria-hidden>
            {badge.emoji}
          </span>
        </div>
        <p className="text-xl font-black">{badge.label}</p>
        {badge.earned ? (
          <p className="text-green-700 font-bold">🎉 أحسنت! حصلت على هذه الشارة</p>
        ) : (
          <p className="text-olive-trunk">{badge.hint}</p>
        )}
        <div className="flex justify-center gap-2 pt-2">
          {!badge.earned && badge.domainId && (
            <BigButton variant="primary" className="!px-4 !py-2 text-sm" onClick={() => onGoToDomain(badge.domainId)}>
              🌿 اذهب إلى المحطة
            </BigButton>
          )}
          <BigButton variant="outline" className="!px-4 !py-2 text-sm" onClick={onClose}>
            إغلاق
          </BigButton>
        </div>
      </div>
    </div>
  );
}

function BadgeShelf({ badges, onOpenDomainById }) {
  const earnedCount = badges.filter((b) => b.earned).length;
  const [copied, setCopied] = useState(false);
  const [activeBadge, setActiveBadge] = useState(null);

  const shareBadges = async () => {
    const earnedLabels = badges.filter((b) => b.earned).map((b) => `${b.emoji} ${b.label}`);
    const text =
      earnedCount > 0
        ? `صفّنا حصل على ${earnedCount} من ${badges.length} شارات في رحلة الزيتونة! 🫒\n${earnedLabels.join("، ")}`
        : `تابعوا رحلتنا مع وحدة الزيتونة 🫒`;
    const shareData = { title: "شارات صفّنا 🏅", text, url: window.location.href };
    if (navigator.share) {
      try {
        await navigator.share(shareData);
        return;
      } catch {
        return;
      }
    }
    try {
      await navigator.clipboard.writeText(`${text}\n${shareData.url}`);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // نسخ غير مدعوم في هذا المتصفح
    }
  };

  return (
    <div className="bg-surface rounded-3xl border border-black/5 p-5 mb-8" style={{ boxShadow: "var(--shadow-card)" }}>
      <div className="flex items-center justify-between mb-3">
        <h2 className="font-bold text-sm text-olive-trunk">🏅 شارات الصف</h2>
        <div className="flex items-center gap-3">
          <span className="text-xs text-olive-trunk font-bold">
            {earnedCount}/{badges.length}
          </span>
          <button onClick={shareBadges} className="text-xs font-bold text-olive-green hover:underline">
            {copied ? "✅ تم النسخ" : "🔗 شارك إنجازنا"}
          </button>
        </div>
      </div>
      <div className="flex flex-wrap gap-3">
        {badges.map((b) => (
          <button
            key={b.label}
            title={b.label}
            onClick={() => setActiveBadge(b)}
            className={`flex flex-col items-center gap-1 w-[4.5rem] transition-all duration-300 hover:-translate-y-0.5 ${
              b.earned ? "opacity-100" : "opacity-40 hover:opacity-70"
            }`}
          >
            <div
              className={`relative w-14 h-14 rounded-2xl overflow-hidden ${
                b.earned ? "ring-2 ring-olive-gold" : "bg-black/5"
              }`}
            >
              {b.photo && (
                <img
                  src={b.photo}
                  alt=""
                  loading="lazy"
                  decoding="async"
                  className={`absolute inset-0 h-full w-full object-cover ${b.earned ? "" : "grayscale"}`}
                />
              )}
              <span
                className="absolute inset-x-0 bottom-0 bg-black/45 text-center text-base leading-6"
                aria-hidden
              >
                {b.emoji}
              </span>
            </div>
            <span className="text-[11px] text-center text-olive-trunk leading-tight">{b.label}</span>
          </button>
        ))}
      </div>

      {activeBadge && (
        <BadgePopup
          badge={activeBadge}
          onClose={() => setActiveBadge(null)}
          onGoToDomain={(domainId) => {
            setActiveBadge(null);
            onOpenDomainById(domainId);
          }}
        />
      )}
    </div>
  );
}

export default function TreeMap({ unit, getDomainProgress, badges, onOpenDomain }) {
  const firstDomain = unit.domains[0];

  const overall = unit.domains.reduce(
    (acc, d) => {
      const p = getDomainProgress(d);
      return { done: acc.done + p.done, total: acc.total + p.total };
    },
    { done: 0, total: 0 }
  );
  const overallPercent = overall.total > 0 ? Math.round((overall.done / overall.total) * 100) : 0;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 pb-16">
      <section className="py-8 md:py-12 text-center">
        <div className="relative mb-8">
          <OliveTreeHero />
          <div
            className="absolute inset-0 rounded-[28px] flex items-end justify-center pb-6 px-4"
            style={{ background: "linear-gradient(to top, rgb(0 0 0 / 55%), transparent 60%)" }}
          >
            <h1 className="text-3xl sm:text-5xl font-black text-white leading-tight text-balance drop-shadow-lg">
              {unit.text.title} 🫒
            </h1>
          </div>
        </div>
        <div className="max-w-xl mx-auto">
          <p className="text-olive-green font-bold text-sm mb-2">{unit.school} · الصف الثاني</p>
          <p className="text-olive-trunk text-base sm:text-lg leading-relaxed">
            رحلة تعلّم تفاعلية عمرها 11 محطة، تدور كلّها حول قصيدة الزيتونة: لغة عربية، لغات، رياضيات،
            علوم، وفنون — كلّها على شكل شجرة زيتون تتقدّم فيها خطوة بخطوة.
          </p>
          <button
            onClick={() => onOpenDomain(firstDomain)}
            className="mt-6 inline-flex items-center gap-2 bg-cta text-cta-ink px-7 py-3.5 rounded-2xl font-bold shadow-[0_10px_24px_-6px_rgb(255_216_77/60%)] hover:brightness-95 transition-all duration-300 active:scale-[0.97]"
          >
            🫒 ابدأ الرحلة
          </button>

          <div className="mt-6 max-w-xs mx-auto md:mx-0">
            <div className="flex items-center justify-between text-xs font-bold text-olive-trunk mb-1.5">
              <span>تقدّم الصف في رحلة الزيتونة</span>
              <span>{overallPercent}%</span>
            </div>
            <div className="w-full h-2.5 rounded-full bg-black/[0.06] overflow-hidden">
              <div
                className="h-full rounded-full bg-olive-green transition-all duration-500 ease-out"
                style={{ width: `${overallPercent}%` }}
              />
            </div>
          </div>
        </div>
      </section>

      {badges && (
        <BadgeShelf
          badges={badges}
          onOpenDomainById={(domainId) => {
            const domain = unit.domains.find((d) => d.id === domainId);
            if (domain) onOpenDomain(domain);
          }}
        />
      )}

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5">
        {unit.domains.map((domain, i) => (
          <BranchCard
            key={domain.id}
            domain={domain}
            index={i}
            progress={getDomainProgress(domain)}
            onClick={() => onOpenDomain(domain)}
          />
        ))}
      </div>
    </div>
  );
}
