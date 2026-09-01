import { useState } from "react";
import { zaytounaPath, stationActivities } from "../data/units/zaytounaPath.js";
import { useGrade } from "../context/GradeContext.jsx";
import PathStationCard from "./ui/PathStationCard.jsx";
import ListenButton from "./ui/ListenButton.jsx";
import BadgeShelf from "./ui/BadgeShelf.jsx";
import oliveBranchesPhoto from "../assets/photos/olive-branches-sunset.webp";

/*
  وحدة الزيتونة — شاشة واحدة
  ============================
  كانت الوحدة شاشتين متوازيتين: «مسار الزيتونة» (14 محطة موضوعية) و«شجرة
  المواد» (11 مادة). المحتوى واحد في الاثنتين، والطالب كان يرى الرحلة مرتين
  بترتيبين، ولا شيء يخبره أيّهما الأصل.

  الآن شاشة واحدة: المسار هو الرحلة، والمادة **عدسة فوقه** لا مسار مواز.
  اختيار مادة لا ينقلك إلى شاشة أخرى، بل يصفّي المحطات نفسها فتبقى الرحلة
  هي الإطار: «أرِني موطن داخل هذه الرحلة» بدل «اخرج من الرحلة إلى قائمة موطن».

  ما ورثته الشاشة من شجرة المواد ولم يضِع: صورة الغلاف، التقدّم العام،
  رفّ الشارات، والوصول إلى كل مادة على حدة.
*/

function StationCardFor({ unit, station, index, grade, subjectId, isActivityComplete, onOpen }) {
  const all = stationActivities(unit, station, grade);
  const items = subjectId ? all.filter((i) => i.domain.id === subjectId) : all;
  if (items.length === 0) return null;

  const done = items.filter((i) => isActivityComplete(i.activity.id)).length;
  return (
    <PathStationCard
      cover={station.cover}
      icon={station.icon}
      title={station.title}
      description={station.description}
      index={index}
      done={done}
      total={items.length}
      badge={station.badge}
      onClick={() => onOpen(station, subjectId)}
    />
  );
}

export default function ZaytounaPathScreen({
  unit,
  isActivityComplete,
  onOpenStation,
  badges,
  onOpenDomainById,
}) {
  const { grade, info } = useGrade();
  // null = كل المواد. التصفية عرض فقط ولا تمسّ التقدّم المحفوظ.
  const [subjectId, setSubjectId] = useState(null);

  const allItems = zaytounaPath.stations.flatMap((s) => stationActivities(unit, s, grade));

  // المواد الحاضرة فعلاً في المسار، بترتيب وحدة الزيتونة نفسه
  const subjects = unit.domains
    .map((domain) => {
      const items = allItems.filter((i) => i.domain.id === domain.id);
      const ids = [...new Set(items.map((i) => i.activity.id))];
      return { domain, total: ids.length, done: ids.filter((id) => isActivityComplete(id)).length };
    })
    .filter((s) => s.total > 0);

  const shown = subjectId ? allItems.filter((i) => i.domain.id === subjectId) : allItems;
  const uniqueIds = [...new Set(shown.map((i) => i.activity.id))];
  const doneCount = uniqueIds.filter((id) => isActivityComplete(id)).length;
  const overall = uniqueIds.length === 0 ? 0 : Math.round((doneCount / uniqueIds.length) * 100);

  const activeSubject = subjects.find((s) => s.domain.id === subjectId)?.domain ?? null;
  const visibleStations = zaytounaPath.stations.filter(
    (s) =>
      !subjectId ||
      stationActivities(unit, s, grade).some((i) => i.domain.id === subjectId)
  );

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 pt-6 pb-16">
      <div className="relative mb-8">
        <img
          src={oliveBranchesPhoto}
          alt="أغصان شجرة زيتون حقيقية عند الغروب"
          decoding="async"
          fetchPriority="high"
          className="w-full h-56 sm:h-72 object-cover rounded-[28px]"
          style={{ boxShadow: "var(--shadow-hover)" }}
        />
        <div
          className="absolute inset-0 rounded-[28px] flex flex-col items-center justify-end pb-6 px-4 text-center"
          style={{ background: "linear-gradient(to top, rgb(0 0 0 / 62%), transparent 62%)" }}
        >
          <h1 className="text-3xl sm:text-4xl font-black text-white leading-tight drop-shadow-lg">
            {zaytounaPath.title} 🫒
          </h1>
          <p className="text-white/90 mt-1">{zaytounaPath.subtitle}</p>
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-3 mb-8">
        {info && (
          <span className="rounded-full bg-olive-green/10 px-4 py-1.5 font-bold text-olive-green">
            {info.emoji} {info.title}
          </span>
        )}
        <ListenButton text={`${zaytounaPath.title}. ${zaytounaPath.subtitle}`} />
      </div>

      {badges && <BadgeShelf badges={badges} onOpenDomainById={onOpenDomainById} />}

      {/* عدسة المواد — ورثت دور شجرة المواد */}
      <section className="mb-6">
        <h2 className="font-bold text-olive-trunk mb-3">📚 اعرض مادة بعينها</h2>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setSubjectId(null)}
            aria-pressed={subjectId === null}
            className={`rounded-full px-4 py-2 font-bold border-2 transition-colors duration-200 ${
              subjectId === null
                ? "bg-olive-ink text-white border-olive-ink"
                : "bg-surface text-olive-trunk border-border hover:border-olive-ink/30"
            }`}
          >
            🫒 كل المواد
          </button>
          {subjects.map(({ domain, done, total }) => {
            const active = subjectId === domain.id;
            return (
              <button
                key={domain.id}
                onClick={() => setSubjectId(active ? null : domain.id)}
                aria-pressed={active}
                className="rounded-full px-4 py-2 font-bold border-2 transition-colors duration-200"
                style={
                  active
                    ? { background: domain.color, borderColor: domain.color, color: "#fff" }
                    : { background: `${domain.color}14`, borderColor: `${domain.color}40`, color: domain.color }
                }
              >
                {domain.icon} {domain.title}
                <span className="mr-1.5 opacity-75">
                  {done}/{total}
                </span>
              </button>
            );
          })}
        </div>
      </section>

      <div
        className="mb-8 rounded-3xl bg-surface border border-border p-5"
        style={{ boxShadow: "var(--shadow-card)" }}
      >
        <div className="flex items-center justify-between mb-2">
          <span className="font-bold text-olive-ink">
            {activeSubject ? `تقدّمك في ${activeSubject.title}` : "تقدّمك في المسار"}
          </span>
          <span className="font-black text-olive-green">{overall}%</span>
        </div>
        <div className="h-4 rounded-full bg-surface-alt overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-500"
            style={{
              width: `${overall}%`,
              background: activeSubject ? activeSubject.color : "var(--color-olive-green)",
            }}
          />
        </div>
        <p className="mt-2 text-olive-trunk">
          أنجزت {doneCount} من {uniqueIds.length} نشاطاً في {visibleStations.length} محطة.
        </p>
      </div>

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {zaytounaPath.stations.map((station, i) => (
          <StationCardFor
            key={station.id}
            unit={unit}
            station={station}
            index={i}
            grade={grade}
            subjectId={subjectId}
            isActivityComplete={isActivityComplete}
            onOpen={onOpenStation}
          />
        ))}
      </div>
    </div>
  );
}
