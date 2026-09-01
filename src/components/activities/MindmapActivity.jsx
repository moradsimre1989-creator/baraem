import { useMemo, useState } from "react";
import BigButton from "../ui/BigButton.jsx";
import ListenButton from "../ui/ListenButton.jsx";
import { playCorrect, playWrong } from "../../utils/sound.js";
import oliveTreeFullPhoto from "../../assets/photos/olive-tree-full.webp";

/*
  الخريطة الذهنية
  ================
  الطالب يبني أشعّة حول السؤال في المركز. حين تعطي البيانات حقل `distractors`
  يصير النشاط تمييزاً لا جمعاً: بنك الكلمات يخلط الصحيح بالبعيد عن الموضوع،
  والطالب يختار ما يخصّ الزيتونة وحده. الكلمة الخاطئة لا تُضاف شعاعاً، ويبقى
  زرّها ظاهراً ليعيد المحاولة — لا نحذفه ولا نكشف الصواب.

  الخلط يجري مرة واحدة (useMemo) وإلا قفزت الأزرار مع كل ضغطة.
*/

/** خلط ثابت مبني على النصّ نفسه، فلا يتغيّر الترتيب بين عمليات الرسم */
function shuffleStable(words) {
  return [...words]
    .map((w) => [w, [...w].reduce((h, c) => (h * 31 + c.charCodeAt(0)) % 9973, 7)])
    .sort((a, b) => a[1] - b[1])
    .map(([w]) => w);
}

export default function MindmapActivity({ activity, onComplete }) {
  const { wordBank, distractors } = activity.data;
  const [rays, setRays] = useState([]);
  const [draft, setDraft] = useState("");
  const [usedWords, setUsedWords] = useState([]);
  const [wrongWord, setWrongWord] = useState(null);
  const [wrongCount, setWrongCount] = useState(0);

  const correctSet = useMemo(() => new Set(wordBank ?? []), [wordBank]);
  const shownWords = useMemo(
    () => (wordBank ? shuffleStable([...wordBank, ...(distractors ?? [])]) : []),
    [wordBank, distractors]
  );

  const addRay = () => {
    if (!draft.trim()) return;
    setRays((r) => [...r, draft.trim()]);
    setDraft("");
  };

  const pickWord = (word) => {
    if (usedWords.includes(word)) return;
    if (!correctSet.has(word)) {
      setWrongWord(word);
      setWrongCount((c) => c + 1);
      playWrong();
      return;
    }
    setWrongWord(null);
    setRays((r) => [...r, word]);
    setUsedWords((w) => [...w, word]);
    playCorrect();
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col items-center gap-4">
        <div className="relative w-56 h-56">
          <div className="absolute inset-0 flex items-center justify-center">
            {/* مركز الخريطة صورة شجرة زيتون حقيقية لا قرصاً ذهبياً: القرص كان
                يُقرأ كشمس بأشعّة، والموضوع شجرة. التعتيم فوق الصورة يبقي
                السؤال مقروءاً مهما كانت فاتحة. */}
            <div className="relative w-32 h-32 rounded-full overflow-hidden shadow-lg z-10 ring-4 ring-olive-gold">
              <img
                src={oliveTreeFullPhoto}
                alt="شجرة زيتون معمّرة"
                decoding="async"
                className="absolute inset-0 h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-black/45" />
              <p className="absolute inset-0 flex items-center justify-center p-2 text-center font-bold text-lg text-white [text-shadow:0_1px_6px_rgb(0_0_0/80%)]">
                {activity.data.prompt}
              </p>
            </div>
          </div>
          {rays.map((ray, i) => {
            const angle = (i / Math.max(rays.length, 1)) * 2 * Math.PI;
            const x = 100 * Math.cos(angle);
            const y = 100 * Math.sin(angle);
            return (
              <div
                key={i}
                className="absolute bg-white border-2 border-olive-green rounded-xl px-2 py-1 text-sm font-bold shadow animate-[fadeIn_0.4s_ease-out]"
                style={{
                  top: `calc(50% + ${y}px - 16px)`,
                  left: `calc(50% + ${x}px - 40px)`,
                  width: "80px",
                  textAlign: "center",
                }}
              >
                {ray}
              </div>
            );
          })}
        </div>
      </div>

      {wordBank ? (
        <div className="space-y-3">
          {distractors && (
            <div className="flex items-center justify-center gap-2 text-center">
              <p className="font-bold text-olive-ink">
                اختر الكلمات التي لها علاقة بالزيتونة فقط
              </p>
              <ListenButton text="اختر الكلمات التي لها علاقة بالزيتونة فقط" />
            </div>
          )}
          <div className="flex flex-wrap justify-center gap-2">
            {shownWords.map((word) => {
              const used = usedWords.includes(word);
              const isWrong = wrongWord === word;
              return (
                <button
                  key={word}
                  onClick={() => pickWord(word)}
                  disabled={used}
                  aria-label={word}
                  className={`rounded-full px-4 py-2 font-bold border-2 transition-all duration-200 ${
                    used
                      ? "bg-olive-green/10 border-olive-green/20 text-olive-trunk/50"
                      : isWrong
                        ? "bg-rose-50 border-rose-400 text-rose-700 animate-[shake_0.3s_ease-in-out]"
                        : "bg-white border-olive-green text-olive-green hover:bg-olive-green hover:text-white"
                  }`}
                >
                  {word} {used ? "✓" : "🌿"}
                </button>
              );
            })}
          </div>
          {wrongWord && (
            <p className="text-center font-bold text-rose-700">
              «{wrongWord}» لا علاقة لها بالزيتونة — جرّب كلمة أخرى.
              {wrongCount >= 3 && " فكّر: ماذا نأخذ من الشجرة؟ وما لونها؟"}
            </p>
          )}
        </div>
      ) : (
        <div className="flex gap-3">
          <input
            className="flex-1 rounded-xl border-2 border-olive-green/30 p-3 text-lg"
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && addRay()}
            placeholder="اكتب فكرة جديدة..."
          />
          <BigButton variant="outline" className="!px-5 !py-2" onClick={addRay}>
            أضف شعاعاً ✨
          </BigButton>
        </div>
      )}

      <BigButton
        variant="primary"
        disabled={rays.length < activity.data.minRays}
        onClick={() => onComplete(activity.points, { rays })}
      >
        أنهيت ({rays.length}/{activity.data.minRays} أشعّة)
      </BigButton>
    </div>
  );
}
