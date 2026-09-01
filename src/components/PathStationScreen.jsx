import { useEffect } from "react";
import { stationSubjects, stationActivities } from "../data/units/zaytounaPath.js";
import { useGrade } from "../context/GradeContext.jsx";
import { playStationComplete } from "../utils/sound.js";
import CoverImage from "./ui/CoverImage.jsx";
import ListenButton from "./ui/ListenButton.jsx";

/*
  محطة واحدة من المسار الموضوعي
  ==============================
  الأنشطة مقسّمة بحسب **المادة**: كل مادة قسم مستقل (اللغة العربية، موطن،
  دين…) بترتيب المواد في وحدة الزيتونة نفسها، فتجد المعلّمة مادّتها في مكانها
  المعتاد في كل محطة.

  المرحلة البيداغوجية (أكتشف ← أفهم ← أتدرّب…) لم تُلغَ بل صارت شارة صغيرة على
  كل نشاط: التسلسل محفوظ داخل المادة، والمعلّمة ترى أين يقع النشاط من الرحلة
  بلا أن يتقطّع درس مادّتها على ثمانية عناوين.

  «أنجزت» ليست قائمة أنشطة بل نتيجة المحطة وشارتها، وتبقى في آخر الصفحة.
*/

/* قسم المادة: عنوان بلون المادة وعدّاد خاص بها، وأنشطتها تحته */
function SubjectSection({ group, isActivityComplete, onOpenActivity }) {
  const { domain, items } = group;
  const done = items.filter((i) => isActivityComplete(i.activity.id)).length;

  return (
    <section className="mb-8">
      <div
        className="flex items-center gap-3 mb-3 rounded-2xl px-4 py-3"
        style={{ background: `${domain.color}14` }}
      >
        <span className="text-3xl" aria-hidden>
          {domain.icon}
        </span>
        <h2 className="text-2xl font-black" style={{ color: domain.color }}>
          {domain.title}
        </h2>
        <span className="mr-auto text-sm font-bold text-olive-trunk shrink-0">
          {done}/{items.length}
        </span>
      </div>

      <div
        className="space-y-3 border-r-4 pr-4"
        style={{ borderColor: `${domain.color}33` }}
      >
        {items.map(({ activity, domain: itemDomain, phase }) => {
          const complete = isActivityComplete(activity.id);
          return (
            <button
              key={`${itemDomain.id}/${activity.id}`}
              onClick={() => onOpenActivity(itemDomain, activity)}
              className={`w-full flex items-center justify-between gap-3 rounded-2xl border p-4 text-right transition-all duration-300 hover:-translate-y-0.5 ${
                complete ? "bg-green-50 border-green-200" : "bg-surface border-black/5"
              }`}
              style={{ boxShadow: "var(--shadow-card)" }}
            >
              <span className="min-w-0">
                <span className="font-bold block leading-snug">{activity.title}</span>
                <span className="mt-1.5 flex flex-wrap items-center gap-2">
                  {/* المرحلة البيداغوجية للنشاط — تُبقي التسلسل ظاهراً بعد أن
                      صار التقسيم الأعلى بالمادة */}
                  <span className="inline-block text-xs font-bold text-olive-trunk bg-surface-alt rounded-full px-2.5 py-1">
                    {phase.icon} {phase.title}
                  </span>
                  {activity.skill && (
                    <span className="inline-block text-xs font-bold text-olive-green bg-olive-green/10 rounded-full px-2.5 py-1">
                      {activity.skill}
                    </span>
                  )}
                </span>
              </span>
              <span className="flex items-center gap-2 shrink-0">
                <span className="text-sm text-olive-trunk">{activity.points} نقطة</span>
                <span className="text-2xl" aria-hidden>
                  {complete ? "✅" : "⬜"}
                </span>
              </span>
            </button>
          );
        })}
      </div>
    </section>
  );
}

export default function PathStationScreen({
  unit,
  station,
  isActivityComplete,
  onOpenActivity,
  onNextStation,
  nextStation,
}) {
  const { grade } = useGrade();
  const groups = stationSubjects(unit, station, grade);
  const items = stationActivities(unit, station, grade);
  const done = items.filter((i) => isActivityComplete(i.activity.id)).length;
  const total = items.length;
  const earnedPoints = items
    .filter((i) => isActivityComplete(i.activity.id))
    .reduce((sum, i) => sum + (i.activity.points || 0), 0);
  const complete = total > 0 && done === total;

  // نغمة الإنجاز عند اكتمال المحطة — مرة واحدة لكل محطة، لا عند كل عودة إليها
  useEffect(() => {
    if (complete) playStationComplete();
  }, [complete, station.id]);

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 pt-6 pb-16">
      <CoverImage src={station.cover} ratio="banner" className="mb-6">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <span className="text-4xl" aria-hidden>
              {station.icon}
            </span>
            <h1 className="text-3xl sm:text-4xl font-black text-white leading-tight">
              {station.title}
            </h1>
          </div>
          <p className="text-white/90 leading-relaxed">{station.description}</p>
        </div>
      </CoverImage>

      <div className="mb-8 flex flex-wrap items-center gap-3">
        <ListenButton text={`${station.title}. ${station.description}`} />
        <div className="flex-1 min-w-[10rem]">
          <div className="h-3 rounded-full bg-surface-alt overflow-hidden">
            <div
              className="h-full rounded-full bg-olive-green transition-all duration-500"
              style={{ width: `${total ? (done / total) * 100 : 0}%` }}
            />
          </div>
        </div>
        <span className="font-bold text-olive-trunk">
          {done}/{total}
        </span>
      </div>

      {groups.map((group) => (
        <SubjectSection
          key={group.domain.id}
          group={group}
          isActivityComplete={isActivityComplete}
          onOpenActivity={onOpenActivity}
        />
      ))}

      {/* المرحلة الثامنة: أنجزت — نتيجة المحطة وشارتها */}
      <section
        className={`rounded-3xl border-2 p-6 text-center transition-colors ${
          complete ? "border-olive-gold bg-olive-gold/10" : "border-dashed border-border bg-surface"
        }`}
      >
        <div className="text-5xl mb-2" aria-hidden>
          {complete ? station.badge.emoji : "🔒"}
        </div>
        <h2 className="text-2xl font-black text-olive-ink mb-1">أنجزت</h2>
        {complete ? (
          <>
            <p className="text-olive-trunk mb-4">
              أحسنت! أكملت المحطة كاملة وجمعت {earnedPoints} نقطة، ونلت شارة «
              {station.badge.label}».
            </p>
            {nextStation && (
              <button
                onClick={() => onNextStation(nextStation)}
                className="inline-flex items-center gap-2 rounded-2xl bg-cta px-6 py-3.5 font-bold text-cta-ink transition-transform active:scale-95"
              >
                المحطة التالية: {nextStation.title} <span aria-hidden>←</span>
              </button>
            )}
          </>
        ) : (
          <p className="text-olive-trunk">
            أكمل {total - done} نشاطاً متبقياً لتنال شارة «{station.badge.label}».
          </p>
        )}
      </section>
    </div>
  );
}
