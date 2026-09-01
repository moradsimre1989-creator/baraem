import BadgeShelf from "./ui/BadgeShelf.jsx";
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
