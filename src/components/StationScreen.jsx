import BigButton from "./ui/BigButton.jsx";
import CoverImage from "./ui/CoverImage.jsx";
import ListenButton from "./ui/ListenButton.jsx";

export default function StationScreen({ domain, isActivityComplete, onOpenActivity, onOpenSummary }) {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 pb-16 pt-6">
      {/* صورة المحطة الحقيقية بدل مربّع لوني بأيقونة */}
      {domain.photo ? (
        <CoverImage src={domain.photo} ratio="banner" className="mb-6">
          <div className="flex items-center gap-3">
            <span className="text-4xl" aria-hidden>
              {domain.icon}
            </span>
            <h1 className="text-3xl sm:text-4xl font-black text-white leading-tight">
              {domain.title}
            </h1>
          </div>
        </CoverImage>
      ) : (
        <div className="text-center mb-8">
          <div
            className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl mx-auto mb-3"
            style={{ background: `${domain.color}17` }}
          >
            {domain.icon}
          </div>
          <h1 className="text-3xl font-black" style={{ color: domain.color }}>
            {domain.title}
          </h1>
        </div>
      )}

      <div className="mb-6 flex justify-center">
        <ListenButton text={domain.title} label="اقرأ اسم المحطة" size="sm" />
      </div>

      <div className="bg-surface rounded-3xl border border-black/5 p-5 mb-6" style={{ boxShadow: "var(--shadow-card)" }}>
        <h2 className="font-bold text-base mb-3" style={{ color: domain.color }}>
          🎯 الأهداف
        </h2>
        <ul className="list-disc pr-5 space-y-1.5 text-olive-trunk text-sm leading-relaxed">
          {domain.objectives.map((obj, i) => (
            <li key={i}>{obj}</li>
          ))}
        </ul>
      </div>

      <h2 className="font-bold text-base mb-3" style={{ color: domain.color }}>
        📋 الفعاليات
      </h2>
      <div className="space-y-2.5">
        {domain.activities.map((activity) => {
          const done = isActivityComplete(activity.id);
          return (
            <button
              key={activity.id}
              onClick={() => onOpenActivity(activity)}
              className={`w-full flex items-center justify-between rounded-2xl border p-4 text-right transition-all duration-300 ease-out hover:-translate-y-0.5 ${
                done ? "bg-green-50 border-green-200" : "bg-surface border-black/5"
              }`}
              style={{ boxShadow: "var(--shadow-card)" }}
            >
              <span className="min-w-0">
                <span className="font-bold block">{activity.title}</span>
                {activity.skill && (
                  <span className="inline-block mt-1 text-[11px] font-bold text-olive-green bg-olive-green/10 rounded-full px-2 py-0.5">
                    {activity.skill}
                  </span>
                )}
              </span>
              <span className="flex items-center gap-2 shrink-0">
                <span className="text-xs text-olive-trunk">{activity.points} نقطة</span>
                <span className="text-xl">{done ? "✅" : "⬜"}</span>
              </span>
            </button>
          );
        })}
      </div>

      <div className="mt-6">
        <BigButton variant="gold" className="w-full" onClick={onOpenSummary}>
          📝 التلخيص والإجمال
        </BigButton>
      </div>
    </div>
  );
}
