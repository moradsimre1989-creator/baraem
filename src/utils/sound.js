/*
  نغمات التغذية الراجعة
  ======================
  مولَّدة بـ Web Audio API لا بملفات صوت: لا وزن إضافي على الحزمة، وتعمل بلا
  إنترنت، ولا تحتاج ترخيصاً لأي مقطع.

  النغمات قصيرة وهادئة عمداً — الطلب كان «أصواتاً خفيفة» لا مؤثرات مشتّتة —
  وبمستوى صوت منخفض حتى لا تزعج صفّاً كاملاً يعمل على أجهزة متجاورة.
*/

let ctx = null;

function audioContext() {
  if (typeof window === "undefined") return null;
  const Ctor = window.AudioContext || window.webkitAudioContext;
  if (!Ctor) return null;
  if (!ctx) ctx = new Ctor();
  // المتصفّح يوقف السياق حتى أول تفاعل من المستخدم
  if (ctx.state === "suspended") ctx.resume().catch(() => {});
  return ctx;
}

/** هل يفضّل المستخدم تقليل الحركة/التنبيهات؟ نحترم ذلك ونصمت. */
function reducedMotion() {
  return (
    typeof window !== "undefined" &&
    window.matchMedia?.("(prefers-reduced-motion: reduce)").matches
  );
}

function tone(frequency, startAt, duration, volume) {
  const audio = audioContext();
  if (!audio) return;
  const osc = audio.createOscillator();
  const gain = audio.createGain();
  osc.type = "sine";
  osc.frequency.value = frequency;

  const t0 = audio.currentTime + startAt;
  // صعود وهبوط ناعمان — النغمة المقطوعة فجأة تُسمع كطقطقة
  gain.gain.setValueAtTime(0, t0);
  gain.gain.linearRampToValueAtTime(volume, t0 + 0.02);
  gain.gain.exponentialRampToValueAtTime(0.0001, t0 + duration);

  osc.connect(gain).connect(audio.destination);
  osc.start(t0);
  osc.stop(t0 + duration + 0.05);
}

/** إجابة صحيحة: نغمتان صاعدتان قصيرتان. */
export function playCorrect() {
  if (reducedMotion()) return;
  try {
    tone(660, 0, 0.14, 0.07); // مي
    tone(880, 0.11, 0.2, 0.07); // لا
  } catch {
    // الصوت غير متاح في هذا المتصفّح — نتجاهل بصمت
  }
}

/**
 * محاولة غير صحيحة: نغمة واحدة هابطة وخفيفة.
 * هادئة عمداً وأخفض من نغمة الصواب — الغرض إشعار لا توبيخ، والطالب يعيد
 * المحاولة فوراً.
 */
export function playWrong() {
  if (reducedMotion()) return;
  try {
    tone(392, 0, 0.12, 0.05); // صول
    tone(311, 0.1, 0.18, 0.05); // مي بيمول
  } catch {
    // الصوت غير متاح — نتجاهل بصمت
  }
}

/** إكمال محطة: ثلاث نغمات صاعدة أطول قليلاً. */
export function playStationComplete() {
  if (reducedMotion()) return;
  try {
    tone(523, 0, 0.16, 0.07); // دو
    tone(659, 0.13, 0.16, 0.07); // مي
    tone(784, 0.26, 0.34, 0.08); // صول
  } catch {
    // الصوت غير متاح — نتجاهل بصمت
  }
}
