import { useState } from "react";
import { findAnswer } from "../data/teacherFaq.js";

const SUGGESTIONS = ["كيف أضيف وحدة جديدة؟", "كيف تعمل النقاط؟", "كيف أعيد ضبط تقدّم الطالب؟", "كم محطة في الوحدة؟"];

const FALLBACK =
  "يمكنني مساعدتك بأسئلة عن: إضافة وحدة جديدة، نظام النقاط، إعادة الضبط، محتوى المحطات، التسجيل الصوتي، أو الطباعة. جرّبي صياغة مختلفة 🙂";

const GREETING = { from: "bot", text: "أهلاً! أنا مساعد المعلّمة، اسأليني عن كيفية استخدام التطبيق. (مساعد إرشادي مبني داخل التطبيق، وليس ذكاءً اصطناعياً متصلاً بالإنترنت.)" };

export default function TeacherAssistant() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([GREETING]);
  const [draft, setDraft] = useState("");

  const ask = (question) => {
    if (!question.trim()) return;
    const answer = findAnswer(question) || FALLBACK;
    setMessages((m) => [...m, { from: "user", text: question }, { from: "bot", text: answer }]);
    setDraft("");
  };

  return (
    <div className="fixed bottom-5 left-5 z-50 print-hidden" dir="rtl">
      {open && (
        <div className="mb-3 w-80 max-w-[90vw] bg-white rounded-3xl border-2 border-olive-green/20 shadow-lg flex flex-col overflow-hidden" style={{ maxHeight: "70vh" }}>
          <div className="bg-olive-green text-white px-4 py-3 flex items-center justify-between">
            <span className="font-bold">🤖 مساعد المعلّمة</span>
            <button onClick={() => setOpen(false)} aria-label="إغلاق" className="text-xl leading-none">
              ×
            </button>
          </div>
          <div className="flex-1 overflow-y-auto p-3 space-y-2" style={{ minHeight: "200px" }}>
            {messages.map((m, i) => (
              <div
                key={i}
                className={`rounded-2xl px-3 py-2 text-sm max-w-[85%] ${
                  m.from === "bot" ? "bg-olive-cream text-olive-ink" : "bg-olive-gold text-white mr-auto ml-0"
                }`}
                style={m.from === "user" ? { marginInlineStart: "auto" } : {}}
              >
                {m.text}
              </div>
            ))}
          </div>
          <div className="p-2 border-t border-black/5 flex flex-wrap gap-1">
            {SUGGESTIONS.map((s) => (
              <button key={s} onClick={() => ask(s)} className="text-xs bg-olive-cream rounded-full px-2 py-1 border border-olive-green/20 hover:border-olive-green">
                {s}
              </button>
            ))}
          </div>
          <form
            className="p-2 border-t border-black/5 flex gap-2"
            onSubmit={(e) => {
              e.preventDefault();
              ask(draft);
            }}
          >
            <input
              className="flex-1 rounded-xl border-2 border-olive-green/20 px-3 py-2 text-sm"
              placeholder="اكتبي سؤالك..."
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
            />
            <button type="submit" className="bg-olive-green text-white rounded-xl px-3 font-bold">
              إرسال
            </button>
          </form>
        </div>
      )}
      <button
        onClick={() => setOpen((o) => !o)}
        className="w-14 h-14 rounded-full bg-olive-green text-white text-2xl shadow-lg flex items-center justify-center hover:scale-105 transition"
        aria-label="مساعد المعلّمة"
      >
        🤖
      </button>
    </div>
  );
}
