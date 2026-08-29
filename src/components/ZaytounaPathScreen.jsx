import { zaytounaPath, stationActivities } from "../data/units/zaytounaPath.js";
import { useGrade } from "../context/GradeContext.jsx";
import PathStationCard from "./ui/PathStationCard.jsx";
import ListenButton from "./ui/ListenButton.jsx";

/*
  شاشة المسار الموضوعي
  =====================
  قراءة ثانية للمحتوى نفسه: 14 محطة بترتيب الموضوع لا بترتيب المادة.
  شجرة المواد تبقى كما هي وتعمل كما كانت — هذه الشاشة إضافة فوقها.
*/

function PathStationCardFor({ unit, station, index, grade, isActivityComplete, onOpen }) {
  const items = stationActivities(unit, station, grade);
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
      onClick={() => onOpen(station)}
    />
  );
}

export default function ZaytounaPathScreen({ unit, isActivityComplete, onOpenStation }) {
  const { grade, info } = useGrade();

  const allItems = zaytounaPath.stations.flatMap((s) => stationActivities(unit, s, grade));
  const uniqueIds = [...new Set(allItems.map((i) => i.activity.id))];
  const doneCount = uniqueIds.filter((id) => isActivityComplete(id)).length;
  const overall = uniqueIds.length === 0 ? 0 : Math.round((doneCount / uniqueIds.length) * 100);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 pt-6 pb-16">
      <header className="text-center mb-8">
        <h1 className="text-3xl sm:text-4xl font-black text-olive-ink mb-2">
          {zaytounaPath.title}
        </h1>
        <p className="text-olive-trunk mb-3">{zaytounaPath.subtitle}</p>
        {info && (
          <span className="inline-block rounded-full bg-olive-green/10 px-4 py-1.5 font-bold text-olive-green">
            {info.emoji} {info.title}
          </span>
        )}
        <div className="mt-4 flex justify-center">
          <ListenButton text={`${zaytounaPath.title}. ${zaytounaPath.subtitle}`} />
        </div>
      </header>

      <div
        className="mb-8 rounded-3xl bg-surface border border-border p-5"
        style={{ boxShadow: "var(--shadow-card)" }}
      >
        <div className="flex items-center justify-between mb-2">
          <span className="font-bold text-olive-ink">تقدّمك في المسار</span>
          <span className="font-black text-olive-green">{overall}%</span>
        </div>
        <div className="h-4 rounded-full bg-surface-alt overflow-hidden">
          <div
            className="h-full rounded-full bg-olive-green transition-all duration-500"
            style={{ width: `${overall}%` }}
          />
        </div>
        <p className="mt-2 text-olive-trunk">
          أنجزت {doneCount} من {uniqueIds.length} نشاطاً في {zaytounaPath.stations.length} محطة.
        </p>
      </div>

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {zaytounaPath.stations.map((station, i) => (
          <PathStationCardFor
            key={station.id}
            unit={unit}
            station={station}
            index={i}
            grade={grade}
            isActivityComplete={isActivityComplete}
            onOpen={onOpenStation}
          />
        ))}
      </div>
    </div>
  );
}
