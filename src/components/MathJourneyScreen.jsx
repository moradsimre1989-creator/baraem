import { altFor } from "../data/photoCredits.js";
import BigButton from "./ui/BigButton.jsx";
import { useGrade } from "../context/GradeContext.jsx";
import oliveBranchesPhoto from "../assets/photos/olive-branches-sunset.webp";

const PASTEL_BG = {
  "pastel-blue": "bg-pastel-blue",
  "pastel-green": "bg-pastel-green",
  "pastel-yellow": "bg-pastel-yellow",
  "pastel-pink": "bg-pastel-pink",
  "pastel-purple": "bg-pastel-purple",
  "pastel-orange": "bg-pastel-orange",
};
const GROUP_PASTELS = ["pastel-orange", "pastel-yellow", "pastel-blue", "pastel-green", "pastel-purple", "pastel-pink", "pastel-orange", "pastel-blue"];

function visibleActivities(group, activitiesById, grade) {
  return group.activities
    .map((id) => activitiesById[id])
    .filter(Boolean)
    .filter((a) => !a.grade || a.grade === grade);
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
        <div className="h-full rounded-full bg-olive-gold transition-all duration-500 ease-out" style={{ width: `${percent}%` }} />
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

export default function MathJourneyScreen({ domain, isActivityComplete, onOpenGroup, onOpenCertificate }) {
  // الصف صار اختياراً عامّاً للمنصّة كلها بدل حالة محلية في محطة الرياضيات وحدها،
  // حتى لا يتعارض المبدّل هنا مع المبدّل في الشريط العلوي.
  const { grade: chosenGrade, setGrade } = useGrade();
  const grade = chosenGrade ?? 2;
  const activitiesById = Object.fromEntries(domain.activities.map((a) => [a.id, a]));
  const groups = domain.groups || [];

  const groupProgress = (group) => {
    const acts = visibleActivities(group, activitiesById, grade);
    const done = acts.filter((a) => isActivityComplete(a.id)).length;
    return { done, total: acts.length, ratio: acts.length > 0 ? done / acts.length : 0 };
  };

  const overall = groups.reduce(
    (acc, g) => {
      const p = groupProgress(g);
      return { done: acc.done + p.done, total: acc.total + p.total };
    },
    { done: 0, total: 0 }
  );
  const allComplete = overall.total > 0 && overall.done === overall.total;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 pb-16 pt-6">
      <div className="relative rounded-[28px] overflow-hidden mb-8 min-h-[200px] flex items-end" style={{ boxShadow: "var(--shadow-hover)" }}>
        <img src={oliveBranchesPhoto} alt={altFor(oliveBranchesPhoto, "بستان زيتون")} decoding="async" fetchPriority="high" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgb(15 23 42 / 78%), rgb(15 23 42 / 15%) 55%)" }} />
        <div className="relative z-10 p-6 sm:p-8 text-center w-full">
          <h1 className="text-2xl sm:text-3xl font-black text-white mb-2">🌿 مغامرة الرياضيات في زيتونة البستان</h1>
          <p className="text-white/85 text-sm sm:text-base">كل غصن يخفي مسألة… وكل حبة زيتون تحمل تحديًا!</p>
        </div>
      </div>

      <div className="flex justify-center gap-3 mb-8">
        <button
          onClick={() => setGrade(2)}
          className={`rounded-2xl px-5 py-3 font-bold text-sm transition-all duration-200 ${
            grade === 2 ? "bg-olive-gold text-white" : "bg-white text-olive-trunk border border-border"
          }`}
        >
          🌱 الصف الثاني — مستكشف البستان
        </button>
        <button
          onClick={() => setGrade(3)}
          className={`rounded-2xl px-5 py-3 font-bold text-sm transition-all duration-200 ${
            grade === 3 ? "bg-olive-gold text-white" : "bg-white text-olive-trunk border border-border"
          }`}
        >
          🌿 الصف الثالث — خبير البستان
        </button>
      </div>

      {allComplete && (
        <div className="rounded-[24px] bg-pastel-yellow p-6 text-center mb-8" style={{ boxShadow: "var(--shadow-card)" }}>
          <div className="text-5xl mb-2">🏆</div>
          <p className="text-xl font-black text-olive-ink">أحسنت! أصبحت بطل حساب الزيتونة</p>
          <BigButton variant="primary" className="mt-4" onClick={onOpenCertificate}>
            شاهد إنجازي 🎉
          </BigButton>
        </div>
      )}

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {groups.map((group, i) => (
          <GroupCard key={group.id} group={group} index={i} progress={groupProgress(group)} onClick={() => onOpenGroup(group, grade)} />
        ))}
      </div>
    </div>
  );
}
