import BigButton from "./ui/BigButton.jsx";
import oliveRootsPhoto from "../assets/photos/olive-roots.webp";

const PASTEL_BG = {
  "pastel-blue": "bg-pastel-blue",
  "pastel-green": "bg-pastel-green",
  "pastel-yellow": "bg-pastel-yellow",
  "pastel-pink": "bg-pastel-pink",
  "pastel-purple": "bg-pastel-purple",
  "pastel-orange": "bg-pastel-orange",
};
const GROUP_PASTELS = ["pastel-green", "pastel-blue", "pastel-orange", "pastel-yellow", "pastel-purple", "pastel-pink", "pastel-green", "pastel-blue"];

// موضع كل محطة حول الشجرة التفاعلية (نسبة مئوية من الحاوية)
const TREE_SPOTS = [
  { top: "10%", left: "50%" },
  { top: "24%", left: "18%" },
  { top: "24%", left: "82%" },
  { top: "46%", left: "12%" },
  { top: "46%", left: "88%" },
  { top: "68%", left: "20%" },
  { top: "68%", left: "80%" },
  { top: "86%", left: "50%" },
];

function groupProgress(group, activitiesById, isActivityComplete) {
  const total = group.activities.length;
  const done = group.activities.filter((id) => isActivityComplete(id)).length;
  return { done, total, ratio: total > 0 ? done / total : 0 };
}

function TreeSpotButton({ group, index, progress, onClick }) {
  const complete = progress.total > 0 && progress.done === progress.total;
  const started = progress.done > 0 && !complete;
  const pos = TREE_SPOTS[index % TREE_SPOTS.length];

  return (
    <button
      onClick={onClick}
      title={group.title}
      style={{ top: pos.top, left: pos.left, transform: "translate(-50%, -50%)", boxShadow: "var(--shadow-card)" }}
      className={`absolute w-14 h-14 sm:w-16 sm:h-16 rounded-full flex items-center justify-center text-2xl sm:text-3xl border-2 transition-transform duration-200 hover:scale-110 backdrop-blur-sm ${
        complete ? "bg-olive-gold/90 border-white" : started ? "bg-white/90 border-olive-gold" : "bg-white/70 border-white"
      }`}
    >
      {complete ? "👑" : group.icon}
    </button>
  );
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
      {complete && <span className="absolute top-4 left-4 text-xl">👑</span>}
      <div className="w-14 h-14 rounded-2xl bg-white/70 flex items-center justify-center text-3xl mb-3">{group.icon}</div>
      <h3 className="font-black text-lg text-olive-ink mb-1">{group.title}</h3>
      <p className="text-xs text-olive-trunk mb-4 leading-relaxed">{group.description}</p>
      <div className="w-full h-1.5 rounded-full bg-white/60 overflow-hidden mb-2">
        <div className="h-full rounded-full bg-olive-green transition-all duration-500 ease-out" style={{ width: `${percent}%` }} />
      </div>
      <div className="flex items-center justify-between">
        <span className="text-xs text-olive-trunk font-bold">
          {progress.done}/{progress.total} تجارب
        </span>
        <span className="inline-flex items-center gap-1 bg-cta text-cta-ink text-xs font-bold rounded-full px-3 py-1.5">
          {complete ? "راجع ↩" : "ابدأ →"}
        </span>
      </div>
    </button>
  );
}

export default function ScienceLabScreen({ domain, isActivityComplete, onOpenGroup, onOpenCertificate }) {
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
      <div className="text-center mb-6">
        <h1 className="text-2xl sm:text-3xl font-black text-olive-ink">🌿🔬 مختبر الزيتونة العجيب</h1>
        <p className="text-olive-trunk mt-2 max-w-lg mx-auto">البس معطف العالِم… ولنكتشف معًا أسرار زيتونة البستان!</p>
      </div>

      {/* الشجرة التفاعلية: اضغط على أي محطة لفتحها */}
      <div
        className="relative w-full h-[340px] sm:h-[400px] rounded-[28px] overflow-hidden mb-10"
        style={{ background: "linear-gradient(to bottom, #eaf6ee 0%, #f6f1e2 75%, #ede3c8 100%)", boxShadow: "var(--shadow-hover)" }}
      >
        <img
          src={oliveRootsPhoto}
          alt=""
          aria-hidden
          loading="lazy"
          decoding="async"
          className="absolute bottom-0 left-1/2 -translate-x-1/2 w-40 sm:w-48 opacity-30 object-cover rounded-t-full"
        />
        <svg viewBox="0 0 220 220" className="absolute inset-0 w-full h-full" preserveAspectRatio="xMidYMax meet">
          <path d="M110 210 L110 100" stroke="#8a6a4a" strokeWidth="14" strokeLinecap="round" />
          <path d="M110 175 Q80 195 55 215" stroke="#8a6a4a" strokeWidth="6" strokeLinecap="round" fill="none" />
          <path d="M110 175 Q140 195 165 215" stroke="#8a6a4a" strokeWidth="6" strokeLinecap="round" fill="none" />
          <path d="M110 130 L70 95" stroke="#8a6a4a" strokeWidth="8" strokeLinecap="round" />
          <path d="M110 115 L155 90" stroke="#8a6a4a" strokeWidth="8" strokeLinecap="round" />
          <circle cx="110" cy="70" r="55" fill="#3cae79" />
          <circle cx="60" cy="90" r="34" fill="#2fa36b" />
          <circle cx="165" cy="85" r="36" fill="#2fa36b" />
          <circle cx="90" cy="95" r="5" fill="#e3a93b" />
          <circle cx="135" cy="60" r="5" fill="#c9974a" />
          <circle cx="150" cy="105" r="5" fill="#e3a93b" />
        </svg>

        {groups.map((group, i) => (
          <TreeSpotButton
            key={group.id}
            group={group}
            index={i}
            progress={groupProgress(group, domain.activities, isActivityComplete)}
            onClick={() => onOpenGroup(group)}
          />
        ))}
      </div>

      {allComplete && (
        <div className="rounded-[24px] bg-pastel-yellow p-6 text-center mb-8" style={{ boxShadow: "var(--shadow-card)" }}>
          <div className="text-5xl mb-2">🏆</div>
          <p className="text-xl font-black text-olive-ink">أحسنت! أصبحت عالِم الزيتونة الصغير</p>
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
