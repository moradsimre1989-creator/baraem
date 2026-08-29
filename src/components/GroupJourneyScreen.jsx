import BigButton from "./ui/BigButton.jsx";

const PASTEL_BG = {
  "pastel-blue": "bg-pastel-blue",
  "pastel-green": "bg-pastel-green",
  "pastel-yellow": "bg-pastel-yellow",
  "pastel-pink": "bg-pastel-pink",
  "pastel-purple": "bg-pastel-purple",
  "pastel-orange": "bg-pastel-orange",
};
const GROUP_PASTELS = ["pastel-blue", "pastel-green", "pastel-orange", "pastel-purple", "pastel-yellow", "pastel-pink"];

function groupProgress(group, activitiesById, isActivityComplete) {
  const total = group.activities.length;
  const done = group.activities.filter((id) => isActivityComplete(id)).length;
  return { done, total, ratio: total > 0 ? done / total : 0 };
}

function GroupCard({ group, index, progress, onClick }) {
  const pastel = GROUP_PASTELS[index % GROUP_PASTELS.length];
  const percent = Math.round(progress.ratio * 100);
  const complete = progress.total > 0 && progress.done === progress.total;

  return (
    <button
      onClick={onClick}
      className={`group text-right rounded-[24px] ${PASTEL_BG[pastel]} p-5 border border-black/5 transition-all duration-300 ease-out hover:-translate-y-1 relative`}
      style={{ boxShadow: "var(--shadow-card)" }}
      onMouseEnter={(e) => (e.currentTarget.style.boxShadow = "var(--shadow-hover)")}
      onMouseLeave={(e) => (e.currentTarget.style.boxShadow = "var(--shadow-card)")}
    >
      {complete && <span className="absolute top-4 left-4 text-xl">✓</span>}
      <div className="w-14 h-14 rounded-2xl bg-white/70 flex items-center justify-center text-3xl mb-3">{group.icon}</div>
      <h3 className="font-black text-lg text-olive-ink mb-1">{group.title}</h3>
      <p className="text-xs text-olive-trunk mb-4 leading-relaxed">{group.description}</p>
      <div className="w-full h-1.5 rounded-full bg-white/60 overflow-hidden mb-2">
        <div className="h-full rounded-full bg-olive-green transition-all duration-500 ease-out" style={{ width: `${percent}%` }} />
      </div>
      <div className="flex items-center justify-between">
        <span className="text-xs text-olive-trunk font-bold">
          {progress.done}/{progress.total} أنشطة
        </span>
        <span className="inline-flex items-center gap-1 bg-cta text-cta-ink text-xs font-bold rounded-full px-3 py-1.5">
          {complete ? "راجع ↩" : "ابدأ →"}
        </span>
      </div>
    </button>
  );
}

export default function GroupJourneyScreen({ domain, subtitle, isActivityComplete, onOpenGroup, onOpenCertificate }) {
  const groups = domain.groups || [];
  const overall = groups.reduce(
    (acc, g) => {
      const p = groupProgress(g, domain.activities, isActivityComplete);
      return { done: acc.done + p.done, total: acc.total + p.total };
    },
    { done: 0, total: 0 }
  );
  const allComplete = overall.total > 0 && overall.done === overall.total;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 pb-16 pt-6">
      <div className="text-center mb-8">
        <div className="w-16 h-16 rounded-2xl bg-pastel-blue flex items-center justify-center text-3xl mx-auto mb-3">
          {domain.icon}
        </div>
        <h1 className="text-3xl font-black text-olive-ink">{domain.title}</h1>
        {subtitle && <p className="text-olive-trunk mt-2 max-w-lg mx-auto">{subtitle}</p>}
      </div>

      {allComplete && (
        <div className="rounded-[24px] bg-pastel-yellow p-6 text-center mb-8" style={{ boxShadow: "var(--shadow-card)" }}>
          <div className="text-5xl mb-2">🏆</div>
          <p className="text-xl font-black text-olive-ink">أحسنت! أنهيت كل محطات هذا القسم</p>
          <BigButton variant="primary" className="mt-4" onClick={onOpenCertificate}>
            شاهد إنجازي 🎉
          </BigButton>
        </div>
      )}

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {groups.map((group, i) => (
          <GroupCard
            key={group.id}
            group={group}
            index={i}
            progress={groupProgress(group, domain.activities, isActivityComplete)}
            onClick={() => onOpenGroup(group)}
          />
        ))}
      </div>
    </div>
  );
}
