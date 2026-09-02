import { useEffect, useMemo, useRef, useState } from "react";
import BigButton from "./ui/BigButton.jsx";
import { speak, stopSpeaking, startRecording } from "../utils/speech.js";
import { playCorrect, playWrong } from "../utils/sound.js";
import { segmentForWord } from "../data/poemAudioMap.js";
import {
  toWords,
  normalizeWord,
  analyzeReading,
  splitSyllables,
  similarity,
  speechRecognitionSupported,
  buildHarakatDrills,
  HARAKAT,
} from "../utils/readingCheck.js";

/*
  روبوت القراءة الذكي
  ====================
  يسجّل قراءة الطالب، يحوّلها إلى نصّ بمحرّك المتصفّح، يحاذيها بنصّ القصيدة
  كلمةً كلمة (readingCheck.js)، ثم يعرض الأخطاء ويدرّب عليها.

  حدود صريحة، مكتوبة هنا حتى لا يَعِد أحدٌ المعلّمة بما لا يقع:
  - التعرّف على الكلام يجري في المتصفّح عبر Web Speech API. في كروم يُرسَل
    الصوت إلى خوادم غوغل للتحويل — وهذا يُخبَر به المستخدم صراحةً في البطاقة
    قبل أول تسجيل، لأنه صوت طفل.
  - المكشوف من الكلام: مستوى الكلمة (صحيحة، مستبدَلة، محذوفة، مضافة، مكرّرة)
    زائدَ إبدال الحروف المتشابهة (ظ/ز، ض/د، ث/س…) وهو أشيع أخطاء النطق.
  - الحركات لا تُسمع: المحرّك يعيد نصاً بلا تشكيل، فـ«زَيْتونةُ» و«زَيْتونةَ»
    سواء عنده. لذلك تُدرَّب بالاختيار في HarakatDrill — فحص يقينيّ لا تخمين صوت.
  - لا توقيت لكل كلمة من المحرّك، فتظليل الكلمة أثناء القراءة يسير بإيقاع
    تسجيل المعلّمة (مرشد بصري) لا بتتبّع صوت الطالب لحظةً بلحظة.
  - نطق الكلمة المفردة يأتي من النطق الآلي: استخراج كلمة بعينها من تسجيل
    المعلّمة يحتاج محاذاة قسرية (forced alignment) لا تتوفّر بلا خادم.

  الخصوصية: الميكروفون لا يعمل إلا بضغطة، ومؤشّر أحمر ظاهر طوال التسجيل،
  ولا يُحفظ صوت الطالب بعد التحليل — يبقى في ذاكرة الصفحة ويُمحى بالإغلاق
  أو بزرّ «احذف تسجيلي».
*/

const ROBOT_STATES = {
  idle: { face: "🤖", ring: "border-olive-green/40", say: "مرحبًا! استمع أولًا إلى قراءة المعلمة." },
  countdown: { face: "😊", ring: "border-olive-gold", say: "استعد..." },
  recording: { face: "👂", ring: "border-red-400", say: "أنا أستمع إليك، اقرأ بصوت واضح." },
  analyzing: { face: "🤔", ring: "border-brand", say: "لحظة، أراجع قراءتك..." },
  great: { face: "🎉", ring: "border-olive-green", say: "أحسنت! قراءة رائعة." },
  encourage: { face: "💪", ring: "border-olive-gold", say: "محاولة جيدة! لنتمرن على بعض الكلمات." },
};

const STATUS_STYLE = {
  match: "text-olive-green",
  sub: "text-red-600 underline decoration-wavy decoration-red-400",
  del: "text-orange-600 line-through decoration-orange-400",
  rep: "text-blue-600",
};

/** وجه الروبوت — حالة بصرية واحدة لكل مرحلة، بلا صور خارجية */
function RobotFace({ state, speaking }) {
  const s = ROBOT_STATES[state] ?? ROBOT_STATES.idle;
  return (
    <div className="flex items-center gap-4">
      <div
        className={`relative shrink-0 w-20 h-20 rounded-3xl border-4 ${s.ring} bg-white flex items-center justify-center text-4xl transition-colors duration-300`}
      >
        <span aria-hidden>{s.face}</span>
        {state === "recording" && (
          <span className="absolute -top-1.5 -left-1.5 flex h-4 w-4">
            <span className="absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-70 animate-ping" />
            <span className="relative inline-flex h-4 w-4 rounded-full bg-red-500" />
          </span>
        )}
        {speaking && state !== "recording" && (
          <span className="absolute -bottom-2 text-xl" aria-hidden>
            🔊
          </span>
        )}
      </div>
      {/* التعليمة مكتوبة دائماً بجانب الصوت، لمن يقرأ ولا يسمع */}
      <p className="text-lg font-bold text-olive-ink leading-snug">{s.say}</p>
    </div>
  );
}

/** بطاقة تصحيح كلمة واحدة: نطق صحيح، مقاطع، تسجيل، ونتيجة فورية */
function WordDrill({ item, onDone, teacherAudioSrc }) {
  const [heard, setHeard] = useState(null);
  const [result, setResult] = useState(null);
  const [listening, setListening] = useState(false);
  const recRef = useRef(null);

  const syllables = useMemo(() => splitSyllables(item.word), [item.word]);
  const target = normalizeWord(item.word);
  const seg = useMemo(() => segmentForWord(item.word), [item.word]);
  const segAudio = useRef(null);

  /* التصحيح بصوت المعلّمة: نشغّل الشطر الذي وردت فيه الكلمة من تسجيلها،
     ونوقفه عند نهايته بالضبط. النطق الآلي يبقى بديلاً حين لا نعرف الشطر —
     ولا يُخفى ذلك عن الطالب، فالزرّان مختلفا التسمية. */
  const playTeacherSegment = () => {
    const a = segAudio.current;
    if (!a || !seg) return;
    stopSpeaking();
    a.currentTime = seg.start;
    a.play().catch(() => {});
    const stopAt = () => {
      if (a.currentTime >= seg.end) {
        a.pause();
        a.removeEventListener("timeupdate", stopAt);
      }
    };
    a.addEventListener("timeupdate", stopAt);
  };

  const tryAgain = () => {
    if (!speechRecognitionSupported()) return;
    const Rec = window.SpeechRecognition || window.webkitSpeechRecognition;
    const rec = new Rec();
    rec.lang = "ar-SA";
    rec.interimResults = false;
    rec.maxAlternatives = 3;
    recRef.current = rec;
    setListening(true);
    setResult(null);

    rec.onresult = (e) => {
      const alts = [...e.results[0]].map((r) => normalizeWord(r.transcript));
      const best = Math.max(...alts.map((a) => similarity(target, a)));
      setHeard(alts[0]);
      const ok = best >= 0.8;
      setResult(ok ? "correct" : "retry");
      if (ok) {
        playCorrect();
        onDone?.(item.word);
      } else playWrong();
    };
    rec.onerror = () => {
      setListening(false);
      setResult("error");
    };
    rec.onend = () => setListening(false);
    rec.start();
  };

  return (
    <div className="rounded-2xl border-2 border-olive-green/25 bg-white p-4">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
        <div>
          <p className="font-quran text-3xl font-bold text-olive-ink">{item.word}</p>
          <p className="text-sm text-olive-trunk mt-1">
            {item.status === "del"
              ? "لم أسمع هذه الكلمة — جرّب قراءتها"
              : `سمعتُ: «${item.heard ?? "—"}»`}
          </p>
        </div>
        <span className="rounded-full bg-olive-cream px-3 py-1 text-sm font-bold text-olive-trunk">
          {item.status === "del" ? "كلمة محذوفة" : "كلمة تحتاج تدريبًا"}
        </span>
      </div>

      {/* الخطأ يُسمّى باسمه: «قلت ز بدل ظ» أوضح للطفل من «الكلمة خاطئة» */}
      {item.confusion && (
        <div className="mb-3 rounded-xl bg-amber-50 border-2 border-olive-gold/40 p-3">
          <p className="font-bold text-olive-ink">
            انتبه إلى الحرف: الصواب{" "}
            <span className="font-quran text-2xl text-olive-green">{item.confusion.expected}</span>{" "}
            وقد سمعتُ{" "}
            <span className="font-quran text-2xl text-red-600">{item.confusion.heard}</span>
          </p>
        </div>
      )}
      <div className="rounded-xl bg-olive-cream p-3 mb-3 text-center">
        <p className="text-sm text-olive-trunk mb-1">اقرأها مقطعًا مقطعًا:</p>
        <p className="font-quran text-2xl font-bold text-olive-green">{syllables.join(" – ")}</p>
      </div>

      <audio ref={segAudio} src={teacherAudioSrc} preload="metadata" className="hidden" />

      <div className="flex flex-wrap gap-2">
        {seg && (
          <BigButton variant="gold" className="!px-4 !py-2 text-base" onClick={playTeacherSegment}>
            👩‍🏫 استمع إلى المعلّمة: «{seg.text}»
          </BigButton>
        )}
        <BigButton
          variant="outline"
          className="!px-4 !py-2 text-base"
          onClick={() => speak(item.word, "ar-SA", 0.55)}
        >
          🔊 الكلمة وحدها (نطق آلي)
        </BigButton>
        {speechRecognitionSupported() && (
          <BigButton
            variant={listening ? "gold" : "primary"}
            className="!px-4 !py-2 text-base"
            onClick={tryAgain}
            disabled={listening}
          >
            {listening ? "🎙 أستمع..." : "🎙 سجّل نطقي"}
          </BigButton>
        )}
      </div>

      {result === "correct" && (
        <p className="mt-3 font-bold text-olive-green">✅ ممتاز! لقد تحسّن نطقك.</p>
      )}
      {result === "retry" && (
        <p className="mt-3 font-bold text-olive-gold">
          محاولة جميلة — سمعتُ «{heard}». استمع مرة أخرى واقرأها ببطء.
        </p>
      )}
      {result === "error" && (
        <p className="mt-3 text-olive-trunk">تعذّر السماع. اقترب من الميكروفون وحاول ثانية.</p>
      )}
    </div>
  );
}

/*
  تدريب الحركات
  ==============
  الحركة لا تُسمع: محرّك المتصفّح يعيد نصّاً بلا تشكيل، فقراءة «زَيْتونةُ»
  و«زَيْتونةَ» سواء عنده. فتُدرَّب بالاختيار لا بالسماع — وهذا فحص يقينيّ لا
  تخمين صوت. الطالب يرى الكلمة وقد رُفعت حركة حرف واحد، ويختار الصحيحة.
*/
function HarakatDrill({ lines }) {
  const drills = useMemo(() => buildHarakatDrills(lines, 6), [lines]);
  const [i, setI] = useState(0);
  const [picked, setPicked] = useState(null);
  const [score, setScore] = useState(0);

  if (drills.length === 0) return null;
  const d = drills[i];
  const done = i >= drills.length;

  const pick = (mark) => {
    if (picked) return;
    setPicked(mark);
    if (mark === d.answer) {
      setScore((s) => s + 1);
      playCorrect();
    } else playWrong();
  };

  const next = () => {
    setPicked(null);
    setI((n) => n + 1);
  };

  if (done) {
    return (
      <div className="rounded-2xl border-2 border-olive-green/30 bg-olive-green/5 p-5 text-center">
        <p className="text-xl font-black text-olive-green">
          🎯 أنهيت تدريب الحركات: {score} من {drills.length}
        </p>
        <BigButton
          variant="outline"
          className="!px-4 !py-2 text-base mt-3"
          onClick={() => {
            setI(0);
            setScore(0);
            setPicked(null);
          }}
        >
          🔄 أعد التدريب
        </BigButton>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border-2 border-brand/30 bg-white p-5">
      <div className="flex items-center justify-between mb-3">
        <h4 className="text-xl font-black text-olive-ink">حَرَكات — أيّ حركة فوق الحرف؟</h4>
        <span className="text-sm font-bold text-olive-trunk">
          {i + 1}/{drills.length}
        </span>
      </div>

      <p className="text-center font-quran text-4xl mb-1">{d.blanked}</p>
      <p className="text-center text-olive-trunk mb-4">
        ما الحركة الصحيحة فوق الحرف{" "}
        <span className="font-quran text-2xl text-olive-green">{d.letter}</span>؟
      </p>

      <div className="flex flex-wrap justify-center gap-2">
        {HARAKAT.map((h) => {
          const isAnswer = h.mark === d.answer;
          const chosen = picked === h.mark;
          return (
            <button
              key={h.name}
              onClick={() => pick(h.mark)}
              disabled={Boolean(picked)}
              className={`rounded-2xl border-2 px-5 py-3 font-bold transition-colors ${
                picked && isAnswer
                  ? "bg-olive-green text-white border-olive-green"
                  : chosen
                    ? "bg-red-50 border-red-400 text-red-700"
                    : "bg-white border-border hover:border-olive-green"
              }`}
            >
              <span className="font-quran text-2xl">{d.letter + h.mark}</span>
              <span className="block text-sm mt-0.5">{h.name}</span>
            </button>
          );
        })}
      </div>

      {picked && (
        <div className="mt-4 text-center">
          <p className={`font-bold ${picked === d.answer ? "text-olive-green" : "text-olive-gold"}`}>
            {picked === d.answer
              ? `أحسنت! الكلمة: ${d.word}`
              : `الصواب: ${d.answerName} — الكلمة: ${d.word}`}
          </p>
          <BigButton variant="primary" className="!px-4 !py-2 text-base mt-2" onClick={next}>
            التالي ←
          </BigButton>
        </div>
      )}
    </div>
  );
}

export default function ReadingRobot({ lines, teacherAudioSrc, referenceSeconds = 30.7 }) {
  const [state, setState] = useState("idle");
  const [count, setCount] = useState(0);
  const [highlight, setHighlight] = useState(-1);
  const [report, setReport] = useState(null);
  const [error, setError] = useState(null);
  const [myAudio, setMyAudio] = useState(null);
  const [mastered, setMastered] = useState([]);
  const [robotVoice, setRobotVoice] = useState(true);

  const recorderRef = useRef(null);
  const recognitionRef = useRef(null);
  const teacherRef = useRef(null);
  const startedAt = useRef(0);
  const transcriptRef = useRef("");
  const confidenceRef = useRef(1);
  const timers = useRef([]);

  const expected = useMemo(
    () =>
      lines.flatMap((line, lineIndex) =>
        toWords(`${line.sadr} ${line.ajuz}`).map((w) => ({
          word: w,
          norm: normalizeWord(w),
          lineIndex,
        }))
      ),
    [lines]
  );

  const clearTimers = () => {
    timers.current.forEach(clearTimeout);
    timers.current = [];
  };

  useEffect(() => () => {
    clearTimers();
    stopSpeaking();
    try {
      recognitionRef.current?.stop();
    } catch {
      /* المحرّك متوقّف أصلاً */
    }
  }, []);

  const say = (text) => {
    if (robotVoice) speak(text, "ar-SA", 0.8);
  };

  const playTeacher = () => {
    stopSpeaking();
    const a = teacherRef.current;
    if (!a) return;
    a.currentTime = 0;
    a.play().catch(() => {});
  };

  /* التظليل مرشد بصري بإيقاع تسجيل المعلّمة: محرّك التعرّف لا يعطي توقيت كل
     كلمة، فالتتبّع اللحظي لصوت الطالب غير ممكن بهذه الأدوات. */
  const runHighlight = () => {
    const per = (referenceSeconds * 1000) / expected.length;
    expected.forEach((_, i) => {
      timers.current.push(setTimeout(() => setHighlight(i), i * per));
    });
  };

  const beginRecording = async () => {
    setError(null);
    setReport(null);
    setMyAudio(null);
    setMastered([]);
    stopSpeaking();

    let rec;
    try {
      rec = await startRecording();
    } catch {
      setError("لم أستطع فتح الميكروفون. اسمح للتطبيق باستخدامه ثم حاول مرة أخرى.");
      setState("idle");
      return;
    }
    recorderRef.current = rec;

    // التعرّف على الكلام بالتوازي مع التسجيل
    if (speechRecognitionSupported()) {
      const Rec = window.SpeechRecognition || window.webkitSpeechRecognition;
      const r = new Rec();
      r.lang = "ar-SA";
      r.continuous = true;
      r.interimResults = true;
      transcriptRef.current = "";
      confidenceRef.current = 1;
      r.onresult = (e) => {
        let finalText = "";
        for (let i = 0; i < e.results.length; i++) {
          if (e.results[i].isFinal) {
            finalText += e.results[i][0].transcript + " ";
            if (typeof e.results[i][0].confidence === "number" && e.results[i][0].confidence > 0)
              confidenceRef.current = Math.min(confidenceRef.current, e.results[i][0].confidence);
          }
        }
        transcriptRef.current = finalText;
      };
      r.onerror = () => {};
      recognitionRef.current = r;
      try {
        r.start();
      } catch {
        /* بدأ مسبقاً */
      }
    }

    startedAt.current = Date.now();
    setState("recording");
    setHighlight(0);
    runHighlight();
    say("أنا أستمع إليك، اقرأ بصوت واضح.");
  };

  const startCountdown = () => {
    stopSpeaking();
    setState("countdown");
    setCount(3);
    [3, 2, 1].forEach((n, i) => {
      timers.current.push(
        setTimeout(() => {
          setCount(n);
          if (robotVoice) speak(String(n), "ar-SA", 1);
        }, i * 900)
      );
    });
    timers.current.push(setTimeout(beginRecording, 2700));
  };

  const stopAndAnalyze = async () => {
    clearTimers();
    setHighlight(-1);
    setState("analyzing");
    try {
      recognitionRef.current?.stop();
    } catch {
      /* متوقّف */
    }

    const seconds = (Date.now() - startedAt.current) / 1000;
    let url = null;
    try {
      url = await recorderRef.current?.stop();
    } catch {
      /* لا تسجيل */
    }
    setMyAudio(url);

    // نمهل المحرّك لحظة ليُنهي آخر مقطع
    await new Promise((r) => setTimeout(r, 900));

    if (!speechRecognitionSupported()) {
      setError(
        "متصفّحك لا يدعم التعرّف على الكلام العربي. جرّب Chrome أو Edge — أو استمع إلى تسجيلك وقارنه بقراءة المعلمة."
      );
      setState("idle");
      return;
    }

    const result = analyzeReading(expected, transcriptRef.current, {
      seconds,
      confidence: confidenceRef.current,
      referenceSeconds,
    });

    if (!result.ok) {
      setError(
        result.reason === "silent"
          ? "لم أسمع قراءتك. تأكّد من الميكروفون واقرأ بصوت أعلى."
          : "لم أتمكن من سماع القراءة بوضوح. اقترب من الميكروفون وحاول مرة أخرى في مكان هادئ."
      );
      setState("idle");
      return;
    }

    setReport(result);
    const good = result.accuracy >= 85;
    setState(good ? "great" : "encourage");
    say(
      good
        ? `أحسنت! قرأت ${result.correct} كلمة بصورة صحيحة.`
        : `قرأت ${result.correct} كلمة بصورة صحيحة. لنتمرن معًا على الكلمات التي تحتاج إلى تحسين.`
    );
  };

  const reset = () => {
    clearTimers();
    stopSpeaking();
    setReport(null);
    setError(null);
    setHighlight(-1);
    setMyAudio(null);
    setMastered([]);
    setState("idle");
  };

  const recording = state === "recording";
  const drills = report?.practiceWords?.filter((w) => !mastered.includes(w.word)) ?? [];

  return (
    <section
      className="rounded-3xl border-2 border-olive-green/30 bg-white p-5 sm:p-6"
      style={{ boxShadow: "var(--shadow-card)" }}
      aria-label="تدرّب على قراءة القصيدة"
    >
      <div className="flex flex-wrap items-start justify-between gap-3 mb-4">
        <h3 className="text-2xl font-black text-olive-ink">🤖 تدرّب على قراءة القصيدة</h3>
        <button
          onClick={() => {
            setRobotVoice((v) => !v);
            stopSpeaking();
          }}
          className="rounded-full border border-border px-3 py-1.5 text-sm font-bold text-olive-trunk"
        >
          {robotVoice ? "🔈 صوت الروبوت: يعمل" : "🔇 صوت الروبوت: متوقف"}
        </button>
      </div>

      <RobotFace state={state} speaking={robotVoice} />

      <p className="mt-4 text-olive-trunk leading-relaxed">
        استمع أولًا إلى قراءة المعلمة، ثم اضغط على الميكروفون واقرأ القصيدة بصوت واضح. سأساعدك على
        تحسين قراءتك!
      </p>

      <audio ref={teacherRef} src={teacherAudioSrc} preload="metadata" className="hidden" />

      {/* أثناء التسجيل لا يُعرض زرّ صوت المعلّمة: صوتان معًا يفسدان التحليل */}
      <div className="mt-4 flex flex-wrap gap-3">
        {!recording && (
          <BigButton variant="outline" className="!px-4 !py-2 text-base" onClick={playTeacher}>
            👩‍🏫 استمع إلى المعلمة
          </BigButton>
        )}
        {!recording && state !== "countdown" && (
          <BigButton variant="primary" className="!px-4 !py-2 text-base" onClick={startCountdown}>
            🎙 ابدأ القراءة
          </BigButton>
        )}
        {recording && (
          <BigButton variant="gold" className="!px-4 !py-2 text-base" onClick={stopAndAnalyze}>
            ⏹ إيقاف التسجيل
          </BigButton>
        )}
        {myAudio && !recording && (
          <BigButton
            variant="outline"
            className="!px-4 !py-2 text-base"
            onClick={() => new Audio(myAudio).play()}
          >
            ▶ استمع إلى قراءتي
          </BigButton>
        )}
        {(report || error) && (
          <BigButton variant="outline" className="!px-4 !py-2 text-base" onClick={reset}>
            🔄 حاول مرة أخرى
          </BigButton>
        )}
      </div>

      {state === "countdown" && (
        <p className="mt-5 text-center text-6xl font-black text-olive-gold">{count}</p>
      )}

      {error && (
        <p className="mt-4 rounded-2xl bg-amber-50 border-2 border-olive-gold/40 p-4 font-bold text-olive-ink">
          {error}
        </p>
      )}

      {/* النصّ أمام الطالب أثناء القراءة، مع تظليل الكلمة المتوقّعة */}
      {(recording || state === "countdown") && (
        <div className="mt-5 rounded-2xl bg-olive-cream p-4">
          {lines.map((line, li) => (
            <p key={li} className="font-quran text-2xl sm:text-3xl leading-loose text-center">
              {expected.map((w, wi) =>
                w.lineIndex !== li ? null : (
                  <span
                    key={wi}
                    className={`px-1 rounded transition-colors duration-200 ${
                      wi === highlight ? "bg-olive-gold text-white" : ""
                    }`}
                  >
                    {w.word}{" "}
                  </span>
                )
              )}
            </p>
          ))}
        </div>
      )}

      {report && (
        <div className="mt-5 space-y-5">
          <div className="rounded-2xl bg-olive-cream p-4">
            <p className="text-xl font-black text-olive-ink mb-2">
              {report.accuracy >= 85 ? "🎉 أحسنت!" : "💪 محاولة جيدة!"} قرأتَ{" "}
              <span className="text-olive-green">{report.correct}</span> كلمة بصورة صحيحة
              {report.practiceWords.length > 0 && (
                <>
                  ، وتحتاج إلى التدرّب على{" "}
                  <span className="text-red-600">{report.practiceWords.length}</span> كلمات
                </>
              )}
              .
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
              {[
                ["كلمات القصيدة", report.totalWords],
                ["نسبة الدقة", `${report.accuracy}%`],
                ["مدة القراءة", `${report.seconds} ثانية`],
                ["الطلاقة", report.fluency],
              ].map(([label, value]) => (
                <div key={label} className="rounded-xl bg-white p-2">
                  <p className="text-sm text-olive-trunk">{label}</p>
                  <p className="font-black text-olive-ink">{value}</p>
                </div>
              ))}
            </div>
            {report.lowConfidence && (
              <p className="mt-3 text-sm text-olive-trunk">
                ℹ️ لم يكن التسجيل واضحًا تمامًا، فلم أعرض أخطاءً قد لا تكون صحيحة.
              </p>
            )}
          </div>

          <div className="rounded-2xl border border-border p-4">
            <p className="font-bold text-olive-trunk mb-3">
              قراءتك بالألوان — <span className={STATUS_STYLE.match}>صحيحة</span> ·{" "}
              <span className={STATUS_STYLE.sub}>خاطئة</span> ·{" "}
              <span className={STATUS_STYLE.del}>محذوفة</span>
            </p>
            {lines.map((line, li) => (
              <p key={li} className="font-quran text-2xl leading-loose text-center">
                {report.words.map((w, wi) =>
                  w.lineIndex !== li ? null : (
                    <span key={wi} className={`px-1 ${STATUS_STYLE[w.status] ?? ""}`}>
                      {w.word}{" "}
                    </span>
                  )
                )}
              </p>
            ))}
            {report.added.length > 0 && (
              <p className="mt-3 text-blue-600 font-bold">
                كلمات زائدة سمعتها: {report.added.join("، ")}
              </p>
            )}
            {report.repeated.length > 0 && (
              <p className="mt-1 text-blue-600 font-bold">
                كلمات مكرّرة: {report.repeated.join("، ")}
              </p>
            )}
          </div>

          {drills.length > 0 && (
            <div className="space-y-3">
              <p className="text-xl font-black text-olive-ink">
                📝 لنتمرن على {drills.length} {drills.length === 1 ? "كلمة" : "كلمات"}
              </p>
              {drills.map((w) => (
                <WordDrill
                  key={w.word + w.lineIndex}
                  item={w}
                  teacherAudioSrc={teacherAudioSrc}
                  onDone={(word) => setMastered((m) => [...m, word])}
                />
              ))}
            </div>
          )}
          <HarakatDrill lines={lines} />

          {report.practiceWords.length > 0 && drills.length === 0 && (
            <p className="rounded-2xl bg-olive-green/10 p-4 text-center text-xl font-black text-olive-green">
              🌟 ممتاز! أتقنت كل الكلمات التي تدرّبت عليها.
            </p>
          )}
        </div>
      )}

      <details className="mt-5">
        <summary className="cursor-pointer font-bold text-olive-trunk">
          🔒 الخصوصية وحدود الروبوت
        </summary>
        <div className="mt-2 space-y-1.5 text-sm text-olive-trunk leading-relaxed">
          <p>• الميكروفون لا يعمل إلا بضغطك، ويظهر مؤشّر أحمر طوال التسجيل.</p>
          <p>• تسجيلك لا يُحفظ بعد التحليل، ولا يُشارك مع طلاب آخرين، ولا يُستخدم لتدريب أي نموذج.</p>
          <p>
            • تحويل الكلام إلى نصّ يجري عبر خدمة المتصفّح (في Chrome يُرسَل الصوت إلى خوادم Google
            لهذا الغرض). أبلغوا المدرسة قبل الاستعمال الصفّي.
          </p>
          <p>
            • الروبوت يفحص <b>الكلمات</b>: الصحيحة والمستبدَلة والمحذوفة والمضافة والمكرّرة. لا يفحص
            التشكيل ولا مخارج الحروف — هذا يحتاج أدوات لا تتوفّر في المتصفّح.
          </p>
          {myAudio && (
            <button
              onClick={() => setMyAudio(null)}
              className="mt-1 rounded-full border border-red-300 px-3 py-1 font-bold text-red-600"
            >
              🗑 احذف تسجيلي الآن
            </button>
          )}
        </div>
      </details>
    </section>
  );
}
