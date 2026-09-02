/*
  محرّك تحليل قراءة الطالب
  ==========================
  يقارن ما نطقه الطالب بنصّ القصيدة كلمةً كلمة، ويحدّد نوع كل خطأ ومكانه.

  المقارنة ليست سطحية: المحاذاة تتمّ بخوارزمية Needleman–Wunsch على مستوى
  الكلمات، وهي تجد أفضل اصطفاف ممكن بين قراءتين مختلفتي الطول. المقارنة
  الساذجة (الكلمة رقم ١ بالكلمة رقم ١) تنهار عند أول حذف: يصير كل ما بعده
  خطأً وإن قرأه الطالب صحيحاً.

  التطبيع قبل المقارنة يحذف التشكيل ويوحّد الألفات والهمزات والتاء المربوطة
  والألف المقصورة — لأن محرّك التعرّف على الكلام يعيد نصّاً بلا تشكيل، فمقارنة
  المشكول بغير المشكول تجعل كل كلمة خاطئة. أما العرض فيبقى بالنصّ المشكول
  الأصلي كما هو مكتوب في القصيدة.

  ما يُكشف من الكلام: مستوى الكلمة — صحيحة، مستبدَلة، محذوفة، مضافة، مكرّرة —
  زائدَ إبدال الحروف المتشابهة (ظ/ز، ض/د، ث/س…) وهو أشيع أخطاء النطق.

  ⚠️ حدّ باقٍ: الحركات لا تُسمع. محرّك المتصفّح يعيد نصّاً بلا تشكيل، فقراءة
  «زَيْتونةُ» و«زَيْتونةَ» سواء عنده. لذلك تُدرَّب الحركة بالاختيار لا بالسماع
  (buildHarakatDrills في آخر الملف) — وهو فحص يقينيّ بخلاف تخمين الصوت.
*/

/** حروف التشكيل العربية */
const TASHKEEL = /[ً-ْٰـ]/g;

/**
 * تطبيع كلمة للمقارنة وحدها — لا للعرض.
 * يوحّد ما يُنطق متشابهاً ويُكتب مختلفاً، فلا يُحسب اختلافُ رسمٍ خطأَ نطق.
 */
export function normalizeWord(word) {
  return String(word)
    .replace(TASHKEEL, "")
    .replace(/[إأآا]/g, "ا")
    .replace(/ى/g, "ي")
    .replace(/ة/g, "ه")
    .replace(/ؤ/g, "و")
    .replace(/ئ/g, "ي")
    .replace(/[^ء-ي]/g, "")
    .trim();
}

/** يقسّم نصاً إلى كلمات ذات دلالة (يتجاهل الفواصل وعلامات الترقيم) */
export function toWords(text) {
  return String(text)
    .split(/[\s،.,؛:!؟?\n]+/)
    .map((w) => w.trim())
    .filter((w) => normalizeWord(w).length > 0);
}

/*
  حروف يخلط بينها القارئ المبتدئ فعلاً: مخارجها متقاربة، ورسمها أحياناً متشابه.
  مسافة ليفنشتاين تعدّ إبدال «الظليل ← الزليل» خطأً واحداً في كلمة من ستّة
  أحرف، فيخرج التشابه 0.83 — فوق عتبة القبول — فيمرّ الخطأ. وهو ليس خطأً
  عابراً بل بيت القصيد في تدريب النطق.

  لذلك يُعامَل الاختلاف في هذه الأزواج وحدها معاملةً خاصة: لا يُحسب مطابقةً
  مهما ارتفع التشابه، ويُسمّى للطالب باسمه: «قلت ز بدل ظ».
*/
const CONFUSABLE = [
  ["ظ", "ز"], ["ظ", "ذ"], ["ذ", "ز"], ["ذ", "د"],
  ["ض", "د"], ["ض", "ظ"], ["ص", "س"], ["ث", "س"], ["ث", "ت"],
  ["ط", "ت"], ["ق", "ك"], ["ح", "ه"], ["ع", "ا"], ["غ", "خ"], ["ش", "س"],
];

function confusablePair(x, y) {
  return CONFUSABLE.some(([p, q]) => (x === p && y === q) || (x === q && y === p));
}

/**
 * يكشف إبدال حرف متشابه بين كلمتين متساويتي الطول.
 * يُعيد { expected, heard } لأول إبدال، أو null إن لم يكن الفرق من هذا النوع.
 * الشرط أن يكون الاختلاف في موضع أو موضعين فقط وكلّها من الأزواج المتشابهة —
 * وإلا فهي كلمة أخرى لا خطأ نطق.
 */
export function letterConfusion(expected, heard) {
  if (!expected || !heard || expected.length !== heard.length) return null;
  const diffs = [];
  for (let i = 0; i < expected.length; i++) {
    if (expected[i] !== heard[i]) diffs.push([expected[i], heard[i]]);
  }
  if (diffs.length === 0 || diffs.length > 2) return null;
  if (!diffs.every(([x, y]) => confusablePair(x, y))) return null;
  return { expected: diffs[0][0], heard: diffs[0][1], count: diffs.length };
}

export function similarity(a, b) {
  if (a === b) return 1;
  if (!a.length || !b.length) return 0;
  // إبدال حرف متشابه لا يُقبل مهما قارب الشكل — هذا خطأ نطق لا تقريب
  if (letterConfusion(a, b)) return 0.5;
  const m = a.length;
  const n = b.length;
  let prev = Array.from({ length: n + 1 }, (_, j) => j);
  for (let i = 1; i <= m; i++) {
    const cur = [i];
    for (let j = 1; j <= n; j++) {
      cur[j] = Math.min(
        prev[j] + 1,
        cur[j - 1] + 1,
        prev[j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1)
      );
    }
    prev = cur;
  }
  return 1 - prev[n] / Math.max(m, n);
}

const GAP = -1;
const MATCH = 2;
const MISMATCH = -1;

/**
 * محاذاة كلمات القراءة على كلمات النصّ (Needleman–Wunsch).
 * تُعيد قائمة عمليات: match | sub | del | ins، كل عملية تحمل موضعها في النصّ.
 */
export function alignWords(expected, actual) {
  const n = expected.length;
  const m = actual.length;
  const score = Array.from({ length: n + 1 }, () => new Array(m + 1).fill(0));
  for (let i = 1; i <= n; i++) score[i][0] = i * GAP;
  for (let j = 1; j <= m; j++) score[0][j] = j * GAP;

  const sim = (i, j) => {
    const s = similarity(expected[i - 1].norm, actual[j - 1]);
    // التشابه العالي يُعامل مطابقةً: الطفل قد يبتلع حرفاً أو يمدّه
    return s >= 0.82 ? MATCH : s >= 0.55 ? 0 : MISMATCH;
  };

  for (let i = 1; i <= n; i++) {
    for (let j = 1; j <= m; j++) {
      score[i][j] = Math.max(
        score[i - 1][j - 1] + sim(i, j),
        score[i - 1][j] + GAP,
        score[i][j - 1] + GAP
      );
    }
  }

  const ops = [];
  let i = n;
  let j = m;
  while (i > 0 || j > 0) {
    if (i > 0 && j > 0 && score[i][j] === score[i - 1][j - 1] + sim(i, j)) {
      const s = similarity(expected[i - 1].norm, actual[j - 1]);
      ops.push({
        type: s >= 0.82 ? "match" : "sub",
        index: i - 1,
        expected: expected[i - 1],
        heard: actual[j - 1],
        similarity: s,
      });
      i--;
      j--;
    } else if (i > 0 && score[i][j] === score[i - 1][j] + GAP) {
      ops.push({ type: "del", index: i - 1, expected: expected[i - 1], heard: null, similarity: 0 });
      i--;
    } else {
      ops.push({ type: "ins", index: i, expected: null, heard: actual[j - 1], similarity: 0 });
      j--;
    }
  }
  return ops.reverse();
}

/**
 * يحلّل قراءة الطالب مقابل نصّ القصيدة.
 *
 * @param {{word:string, norm:string, lineIndex:number}[]} expected كلمات القصيدة
 * @param {string} transcript ما سمعه محرّك التعرّف
 * @param {object} opts { seconds, confidence, referenceSeconds }
 */
export function analyzeReading(expected, transcript, opts = {}) {
  const { seconds = 0, confidence = 1, referenceSeconds = 0 } = opts;
  const actual = toWords(transcript).map(normalizeWord);

  // تسجيل بلا كلام مفهوم — لا نعطي نتيجة مضلّلة
  if (actual.length === 0) {
    return { ok: false, reason: "silent" };
  }
  // سُمع أقلّ من ربع القصيدة: غالباً ضجيج أو ميكروفون بعيد لا قراءة ناقصة
  if (actual.length < expected.length * 0.25) {
    return { ok: false, reason: "unclear" };
  }

  const ops = alignWords(expected, actual);

  // التكرار حالة خاصة من الإضافة: كلمة زائدة تطابق ما قبلها أو ما بعدها
  for (let k = 0; k < ops.length; k++) {
    if (ops[k].type !== "ins") continue;
    const prev = ops[k - 1];
    const next = ops[k + 1];
    const near = [prev, next].filter((o) => o && o.expected);
    if (near.some((o) => similarity(o.expected.norm, ops[k].heard) >= 0.82)) {
      ops[k].type = "rep";
    }
  }

  const words = expected.map((w, idx) => {
    const op = ops.find((o) => o.expected && o.index === idx);
    return {
      ...w,
      status: op ? op.type : "del",
      heard: op?.heard ?? null,
      similarity: op?.similarity ?? 0,
      // إبدال حرف متشابه، إن كان هذا سبب الخطأ — ليُسمّى للطالب باسمه
      confusion: op?.heard ? letterConfusion(w.norm, op.heard) : null,
    };
  });

  const correct = words.filter((w) => w.status === "match").length;
  const wrong = words.filter((w) => w.status === "sub");
  const missed = words.filter((w) => w.status === "del");
  const added = ops.filter((o) => o.type === "ins");
  const repeated = ops.filter((o) => o.type === "rep");

  const accuracy = Math.round((correct / expected.length) * 100);

  /* الطلاقة من سرعة القراءة مقارنةً بتسجيل المعلّمة، لا من عدد الأخطاء:
     الطالب قد يقرأ كل كلمة صحيحة لكن متقطّعاً، والعكس. النافذة واسعة عمداً
     (نصف سرعة المعلّمة إلى ضعفها) لأن اختلاف السرعة وحده ليس خطأً. */
  let fluency = "جيّدة";
  if (referenceSeconds > 0 && seconds > 0) {
    const ratio = seconds / referenceSeconds;
    if (ratio > 2) fluency = "بطيئة — تدرّب على القراءة المتّصلة";
    else if (ratio < 0.5) fluency = "سريعة — اقرأ بتأنٍّ وانتبه للوقفات";
    else if (ratio > 1.4) fluency = "متأنّية";
    else fluency = "جيّدة";
  }

  /* الأخطاء منخفضة الثقة لا تُعرض للطالب: اتّهامه بخطأ لم يرتكبه أسوأ من
     تفويت خطأ ارتكبه. تذهب إلى تقرير المعلّمة تحت «تحتاج مراجعة». */
  const CONFIDENCE_FLOOR = 0.55;
  const lowConfidence = confidence < CONFIDENCE_FLOOR;
  const needsReview = lowConfidence ? [...wrong, ...missed] : wrong.filter((w) => w.similarity >= 0.6);
  const shownErrors = lowConfidence ? [] : wrong.filter((w) => w.similarity < 0.6);

  return {
    ok: true,
    totalWords: expected.length,
    correct,
    accuracy,
    fluency,
    seconds: Math.round(seconds),
    words,
    wrong,
    missed,
    added: added.map((o) => o.heard),
    repeated: repeated.map((o) => o.heard),
    errorCount: wrong.length + missed.length + added.length,
    practiceWords: [...shownErrors, ...missed].slice(0, 8),
    needsReview,
    lowConfidence,
    confidence,
    transcript,
  };
}

/**
 * تقسيم تقريبي للكلمة إلى مقاطع صوتية عربية.
 * قاعدة مبسّطة: المقطع يبدأ بحرف صامت ويُغلق عند حرف مدّ أو سكون. ليست
 * تقطيعاً عروضياً دقيقاً، لكنها تكفي لأن يقرأ الطفل الكلمة مقطعاً مقطعاً —
 * وهو الغرض التربوي هنا.
 */
export function splitSyllables(word) {
  const chars = [...String(word)];
  const out = [];
  let cur = "";
  for (let i = 0; i < chars.length; i++) {
    const c = chars[i];
    cur += c;
    const next = chars[i + 1] ?? "";
    const isTashkeel = /[ً-ْٰ]/.test(c);
    const nextIsTashkeel = /[ً-ْٰ]/.test(next);
    const isLong = /[اويى]/.test(c);
    // نغلق المقطع بعد حركة أو حرف مدّ، ما لم يكن التالي تشكيلاً يلحق الحرف
    if ((isTashkeel || isLong) && !nextIsTashkeel && next && normalizeWord(cur).length >= 2) {
      out.push(cur);
      cur = "";
    }
  }
  if (cur) {
    if (out.length && normalizeWord(cur).length < 2) out[out.length - 1] += cur;
    else out.push(cur);
  }
  return out.length ? out : [word];
}

/** هل يدعم هذا المتصفّح التعرّف على الكلام؟ */
export function speechRecognitionSupported() {
  return typeof window !== "undefined" && Boolean(window.SpeechRecognition || window.webkitSpeechRecognition);
}

/*
  تدريب الحركات
  ==============
  محرّك التعرّف على الكلام لا يعيد حركات، فلا سبيل إلى سماع «زَيْتونةُ» وتمييزها
  من «زَيْتونةَ». لكن الحركة تُفحص بيقين تامّ حين يختارها الطالب بدل أن ينطقها:
  نعرض الكلمة وقد رُفعت حركة حرف واحد، ويختار الطالب الحركة الصحيحة.

  هذا ليس التفافاً على النقص بل تدريب مختلف: الأول يدرّب النطق، وهذا يدرّب
  معرفة الحركة وقراءتها — وهي مهارة سابقة للنطق الصحيح لا بديلة عنه.
*/

/** الحركات التي ندرّب عليها، وأسماؤها كما ينطقها المعلّم */
export const HARAKAT = [
  { mark: "\u064E", name: "فَتحة" },
  { mark: "\u064F", name: "ضَمّة" },
  { mark: "\u0650", name: "كَسرة" },
  { mark: "\u0652", name: "سُكون" },
];

/**
 * يولّد أسئلة حركات من أبيات القصيدة.
 * لكل سؤال: الكلمة كاملة، وموضع الحرف، والحركة الصحيحة، والكلمة وقد أُزيلت
 * منها تلك الحركة وحدها — فيرى الطالب باقي التشكيل ويركّز على موضع واحد.
 */
export function buildHarakatDrills(lines, limit = 6) {
  const marks = new Set(HARAKAT.map((h) => h.mark));
  const out = [];

  for (const line of lines) {
    for (const part of [line.sadr, line.ajuz]) {
      for (const word of String(part).split(/\s+/)) {
        const chars = [...word];
        // مواضع الحركات داخل الكلمة (الحركة تتبع حرفها)
        const spots = chars
          .map((c, i) => (marks.has(c) && i > 0 && /[ء-ي]/.test(chars[i - 1]) ? i : -1))
          .filter((i) => i > 0);
        if (spots.length === 0) continue;

        // نختار موضعاً واحداً ثابتاً لكل كلمة (الأوسط) فلا يتغيّر السؤال عند كل رسم
        const at = spots[Math.floor(spots.length / 2)];
        const blanked = chars.filter((_, i) => i !== at).join("");
        out.push({
          word,
          blanked,
          letter: chars[at - 1],
          answer: chars[at],
          answerName: HARAKAT.find((h) => h.mark === chars[at])?.name ?? "",
        });
      }
    }
  }
  return out.slice(0, limit);
}
