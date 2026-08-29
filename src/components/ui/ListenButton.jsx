import { useEffect, useState } from "react";
import { speakArabic, stopSpeaking } from "../../utils/speech.js";

/*
  زر الاستماع الموحّد
  ====================
  كانت القراءة الصوتية مستخدمة في أربعة مكوّنات فقط بنسخ متكرّرة. هذا الزر هو
  النسخة الواحدة: نفس الشكل ونفس السلوك في كل مكان — يقرأ، ويوقف، ويعيد.
  يستخدم Web Speech API المدمج في المتصفّح (بلا إنترنت وبلا تكلفة)، وإن كان
  المتصفّح لا يدعمه لا يُعرض الزر أصلاً بدل أن يبدو معطّلاً بلا سبب.
*/

const SUPPORTED = typeof window !== "undefined" && "speechSynthesis" in window;

export default function ListenButton({
  text,
  label = "استمع",
  className = "",
  size = "md",
}) {
  const [speaking, setSpeaking] = useState(false);

  // إيقاف القراءة عند مغادرة الشاشة، وإلا استمر الصوت فوق الشاشة التالية
  useEffect(() => () => stopSpeaking(), []);

  if (!SUPPORTED || !text) return null;

  const toggle = () => {
    if (speaking) {
      stopSpeaking();
      setSpeaking(false);
      return;
    }
    setSpeaking(true);
    speakArabic(text);
    // لا نملك حدثاً موثوقاً لنهاية النطق في كل المتصفّحات، فنستطلع الحالة
    const timer = setInterval(() => {
      if (!window.speechSynthesis.speaking) {
        setSpeaking(false);
        clearInterval(timer);
      }
    }, 300);
  };

  const sizes = {
    sm: "text-sm px-3 py-2 gap-1.5",
    md: "text-base px-4 py-2.5 gap-2",
  };

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={speaking ? "أوقف القراءة" : `${label}: ${text.slice(0, 60)}`}
      className={`inline-flex items-center rounded-full font-bold transition-all duration-200 active:scale-95 ${
        speaking
          ? "bg-brand text-white"
          : "bg-brand-soft text-brand hover:bg-brand hover:text-white"
      } ${sizes[size]} ${className}`}
    >
      <span aria-hidden>{speaking ? "⏹️" : "🔊"}</span>
      <span>{speaking ? "أوقف" : label}</span>
    </button>
  );
}

/** زر «أعد سماع السؤال» — نفس الآلية بصياغة أوضح للطالب. */
export function ReplayButton({ text, className = "" }) {
  return <ListenButton text={text} label="أعد السؤال" size="sm" className={className} />;
}
