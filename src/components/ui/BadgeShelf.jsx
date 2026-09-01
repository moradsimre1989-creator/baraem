import { useState } from "react";
import BigButton from "./BigButton.jsx";

/*
  رفّ شارات الصف
  ================
  مشترك بين شاشة وحدة الزيتونة وشجرة المواد: الشارات واحدة في الاثنتين،
  ونسختان منها كانتا ستفترقان عند أول تعديل.
*/

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

export default BadgeShelf;
