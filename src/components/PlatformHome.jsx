import oliveBranchesPhoto from "../assets/photos/olive-branches-sunset.webp";

const PASTEL_BG = {
  "pastel-blue": "bg-pastel-blue",
  "pastel-green": "bg-pastel-green",
  "pastel-yellow": "bg-pastel-yellow",
  "pastel-pink": "bg-pastel-pink",
  "pastel-purple": "bg-pastel-purple",
  "pastel-orange": "bg-pastel-orange",
};
const TOPIC_PASTELS = ["pastel-blue", "pastel-green", "pastel-yellow", "pastel-pink", "pastel-purple", "pastel-orange"];
const WEEK_LABELS = ["الأحد", "الاثنين", "الثلاثاء", "الأربعاء", "الخميس"];
const RECOMMENDED_TYPES = ["video", "story"];

function startOfDay(ts) {
  const d = new Date(ts);
  d.setHours(0, 0, 0, 0);
  return d.getTime();
}

function computeWeek(activityResults) {
  const doneDays = new Set(Object.values(activityResults).map((r) => startOfDay(r.at)));
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const sunday = new Date(today);
  sunday.setDate(today.getDate() - today.getDay());
  return WEEK_LABELS.map((label, i) => {
    const d = new Date(sunday);
    d.setDate(sunday.getDate() + i);
    const ts = d.getTime();
    return { label, done: doneDays.has(ts), isToday: ts === today.getTime() };
  });
}

function computeStreak(activityResults) {
  const doneDays = new Set(Object.values(activityResults).map((r) => startOfDay(r.at)));
  if (doneDays.size === 0) return 0;
  const cursor = new Date();
  cursor.setHours(0, 0, 0, 0);
  if (!doneDays.has(cursor.getTime())) cursor.setDate(cursor.getDate() - 1);
  let streak = 0;
  while (doneDays.has(cursor.getTime())) {
    streak++;
    cursor.setDate(cursor.getDate() - 1);
  }
  return streak;
}

function StatCard({ emoji, value, label, pastel }) {
  return (
    <div className={`rounded-2xl ${PASTEL_BG[pastel]} p-4 text-center`}>
      <div className="text-2xl mb-1" aria-hidden>
        {emoji}
      </div>
      <div className="text-2xl font-black text-olive-ink tabular-nums">{value}</div>
      <div className="text-xs text-olive-trunk font-bold mt-0.5">{label}</div>
    </div>
  );
}

function RecommendedCard({ domain, activity, pastel, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`group shrink-0 w-64 text-right rounded-[24px] ${PASTEL_BG[pastel]} p-5 border border-black/5 transition-all duration-300 ease-out hover:-translate-y-1`}
      style={{ boxShadow: "var(--shadow-card)" }}
    >
      <div className="w-11 h-11 rounded-xl bg-white/70 flex items-center justify-center text-xl mb-3">
        {domain.icon}
      </div>
      <h4 className="font-black text-sm text-olive-ink leading-snug mb-1">{activity.title}</h4>
      <p className="text-xs text-olive-trunk">{domain.title}</p>
    </button>
  );
}

export default function PlatformHome({ unit, progress, onOpenMap, onOpenActivity }) {
  const overall = unit.domains.reduce(
    (acc, d) => {
      const p = progress.getDomainProgress(d);
      return { done: acc.done + p.done, total: acc.total + p.total };
    },
    { done: 0, total: 0 }
  );
  const overallPercent = overall.total > 0 ? Math.round((overall.done / overall.total) * 100) : 0;
  const domainsComplete = unit.domains.filter((d) => progress.getDomainProgress(d).ratio === 1).length;
  const badges = progress.getBadges(unit);
  const earnedBadges = badges.filter((b) => b.earned).length;
  const week = computeWeek(progress.activityResults);
  const streak = computeStreak(progress.activityResults);

  const recommended = unit.domains
    .flatMap((domain) => domain.activities.filter((a) => RECOMMENDED_TYPES.includes(a.type)).map((activity) => ({ domain, activity })))
    .slice(0, 6);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-6 pb-16">
      <div className="mb-8 text-center">
        <h1
          className="text-4xl sm:text-5xl font-black tracking-tight bg-clip-text text-transparent"
          style={{ backgroundImage: "linear-gradient(90deg, var(--color-brand), var(--color-olive-green))" }}
        >
          🌱 بَراعِم
        </h1>
        <p className="text-olive-trunk text-sm sm:text-base mt-3 max-w-lg mx-auto leading-relaxed">
          منصّة تعليمية رقمية تحوّل نصوصاً ومواد دراسية إلى رحلات تعلّم تفاعلية وممتعة.
        </p>
      </div>

      {/* Bento: بطاقة الدرس + الشارات */}
      <div className="grid lg:grid-cols-3 gap-5 mb-6">
        <div
          className="lg:col-span-2 rounded-[28px] overflow-hidden relative min-h-[220px] flex items-end"
          style={{ boxShadow: "var(--shadow-hover)" }}
        >
          <img
            src={oliveBranchesPhoto}
            alt="أغصان شجرة زيتون حقيقية عند الغروب"
            decoding="async"
            fetchPriority="high"
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div
            className="absolute inset-0"
            style={{ background: "linear-gradient(to top, rgb(15 23 42 / 78%), rgb(15 23 42 / 15%) 60%)" }}
          />
          <div className="relative z-10 p-6 sm:p-8 w-full">
            <p className="text-white/80 text-sm font-bold mb-1">🌿 {unit.text.title}</p>
            <p className="text-white text-lg sm:text-xl font-black mb-4 max-w-md text-balance">
              رحلة بين اللغة والطبيعة والسلام
            </p>
            <div className="max-w-xs mb-4">
              <div className="flex items-center justify-between text-xs font-bold text-white/90 mb-1.5">
                <span>التقدّم</span>
                <span className="tabular-nums">{overallPercent}%</span>
              </div>
              <div className="w-full h-2 rounded-full bg-white/25 overflow-hidden">
                <div className="h-full rounded-full bg-cta transition-all duration-500 ease-out" style={{ width: `${overallPercent}%` }} />
              </div>
            </div>
            <button
              onClick={onOpenMap}
              className="inline-flex items-center gap-2 bg-cta text-cta-ink px-6 py-3 rounded-2xl font-bold shadow-[0_10px_24px_-6px_rgb(246_200_76/50%)] hover:brightness-95 transition-all duration-300 active:scale-[0.97]"
            >
              تابع الدرس ←
            </button>
          </div>
        </div>

        <div className="rounded-[28px] bg-brand-soft p-6 flex flex-col" style={{ boxShadow: "var(--shadow-card)" }}>
          <p className="text-sm font-bold text-brand mb-1">🏅 شارات الصف</p>
          <p className="text-3xl font-black text-olive-ink tabular-nums">
            {earnedBadges}
            <span className="text-lg text-olive-trunk">/{badges.length}</span>
          </p>
          <div className="flex flex-wrap gap-2 mt-4">
            {badges.slice(0, 6).map((b) => (
              <div
                key={b.label}
                title={b.label}
                className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg ${b.earned ? "bg-white" : "bg-white/40 opacity-50"}`}
              >
                {b.emoji}
              </div>
            ))}
          </div>
          <button onClick={onOpenMap} className="mt-auto pt-4 text-sm font-bold text-brand hover:underline self-start">
            عرض كل الشارات ←
          </button>
        </div>
      </div>

      {/* تقدّمي */}
      <h2 className="font-black text-lg text-olive-ink mb-3">تقدّمي</h2>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        <StatCard emoji="⭐" value={`${domainsComplete}/${unit.domains.length}`} label="محطات مكتملة" pastel="pastel-yellow" />
        <StatCard emoji="✓" value={`${overall.done}/${overall.total}`} label="أنشطة مكتملة" pastel="pastel-green" />
        <StatCard emoji="🏆" value={`${earnedBadges}/${badges.length}`} label="شارات" pastel="pastel-pink" />
        <StatCard emoji="🔥" value={streak} label="أيام متتالية" pastel="pastel-orange" />
      </div>

      {/* رحلتي هذا الأسبوع */}
      <h2 className="font-black text-lg text-olive-ink mb-3">رحلتي هذا الأسبوع</h2>
      <div className="flex gap-3 mb-8">
        {week.map((day) => (
          <div key={day.label} className="flex-1 flex flex-col items-center gap-2">
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300 ${
                day.done
                  ? "bg-olive-green text-white"
                  : day.isToday
                    ? "bg-white text-brand border-2 border-brand"
                    : "bg-white text-olive-trunk border border-border"
              }`}
            >
              {day.done ? "✓" : ""}
            </div>
            <span className="text-[11px] text-olive-trunk font-bold">{day.label}</span>
          </div>
        ))}
      </div>

      {/* مقترح لك */}
      {recommended.length > 0 && (
        <>
          <h2 className="font-black text-lg text-olive-ink mb-3">مقترح لك</h2>
          <div className="flex gap-4 overflow-x-auto pb-2 -mx-1 px-1">
            {recommended.map(({ domain, activity }, i) => (
              <RecommendedCard
                key={activity.id}
                domain={domain}
                activity={activity}
                pastel={TOPIC_PASTELS[i % TOPIC_PASTELS.length]}
                onClick={() => onOpenActivity(domain, activity)}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
