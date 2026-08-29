import { useState } from "react";
import ActivityRenderer from "./activities/ActivityRenderer.jsx";
import BigButton from "./ui/BigButton.jsx";

function TeacherNoteCard({ note }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="mb-5">
      <button
        onClick={() => setOpen((o) => !o)}
        className="text-xs font-bold text-olive-trunk hover:text-olive-green underline underline-offset-2"
      >
        {open ? "إخفاء معلومة المعلّمة 🎓" : "🎓 معلومة للمعلّمة"}
      </button>
      {open && (
        <div className="mt-2 grid sm:grid-cols-2 gap-2 bg-olive-cream rounded-2xl p-4 text-sm">
          {note.goal && (
            <p>
              <span className="font-bold">🎯 الهدف: </span>
              {note.goal}
            </p>
          )}
          {note.duration && (
            <p>
              <span className="font-bold">⏱️ المدة: </span>
              {note.duration}
            </p>
          )}
          {note.groupMode && (
            <p>
              <span className="font-bold">👥 نمط العمل: </span>
              {note.groupMode}
            </p>
          )}
          {note.skill && (
            <p>
              <span className="font-bold">🧠 المهارة: </span>
              {note.skill}
            </p>
          )}
        </div>
      )}
    </div>
  );
}

export default function ActivityScreen({ activity, domain, isComplete, onComplete, onBack }) {
  const [resetKey, setResetKey] = useState(0);
  const [justCompleted, setJustCompleted] = useState(false);
  const [retrying, setRetrying] = useState(false);

  const handleComplete = (points, answer) => {
    onComplete(points, answer);
    setJustCompleted(true);
    setRetrying(false);
  };

  const showCongrats = (justCompleted || isComplete) && !retrying;

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 pb-16 pt-6">
      <div className="bg-surface rounded-3xl border border-black/5 p-6" style={{ boxShadow: "var(--shadow-card)" }}>
        <h1 className="text-2xl font-black mb-2" style={{ color: domain.color }}>
          {activity.title}
        </h1>

        {activity.verseRef && (
          <div className="inline-flex items-center gap-2 bg-olive-green/10 text-olive-green rounded-full px-3 py-1.5 text-xs font-bold mb-5">
            <span aria-hidden>🌿</span>
            <span>ارتباط النشاط بالقصيدة:</span>
            <span className="font-quran font-normal">«{activity.verseRef}»</span>
          </div>
        )}

        {activity.teacherNote && <TeacherNoteCard note={activity.teacherNote} />}

        {showCongrats ? (
          <div className="text-center space-y-4 py-8">
            <div className="text-6xl">🎉</div>
            <p className="text-xl font-bold text-green-700">أحسنت! أكملت هذه الفعالية</p>
            <div className="flex justify-center gap-3">
              <BigButton
                variant="outline"
                onClick={() => {
                  setJustCompleted(false);
                  setRetrying(true);
                  setResetKey((k) => k + 1);
                }}
              >
                🔁 أعد المحاولة
              </BigButton>
              <BigButton variant="primary" onClick={onBack}>
                العودة للمحطة
              </BigButton>
            </div>
          </div>
        ) : (
          <ActivityRenderer key={resetKey} activity={activity} onComplete={handleComplete} />
        )}
      </div>
    </div>
  );
}
