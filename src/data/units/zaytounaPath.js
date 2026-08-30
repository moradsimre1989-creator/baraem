/*
  مسار الزيتونة الموضوعي
  =======================
  طبقة عرض فوق `zaytouna.js` — لا تكرّر أي محتوى ولا تحذف أي شيء.

  الوحدة نفسها مقسّمة بحسب **المادة** (عربية، رياضيات، علوم، موطن...)، وهذا
  التقسيم يبقى كما هو ويعمل كما كان. هذا الملف يضيف قراءة ثانية للمحتوى نفسه
  بحسب **الموضوع**: من التعرّف على الشجرة حتى الاختبار النهائي، كما يعيشها
  الطالب في رحلة واحدة متسلسلة.

  كل نشاط يُشار إليه بمعرّفه فقط (`domainId/activityId`)، فالتقدّم محفوظ بمعرّف
  النشاط — أي أن إنجاز نشاط من المسار الموضوعي يظهر فوراً في شجرة المواد
  والعكس صحيح. ونشاط واحد قد يظهر في محطتين موضوعيتين حين يخدم الموضوعين معاً.
*/

import oliveTreeFullPhoto from "../../assets/photos/olive-tree-full.webp";
import oliveRootsPhoto from "../../assets/photos/olive-roots.webp";
import oliveBranchesPhoto from "../../assets/photos/olive-branches-sunset.webp";
import olivePickingPhoto from "../../assets/photos/olive-picking.webp";
import oliveCombToolPhoto from "../../assets/photos/olive-comb-tool.webp";
import oliveOilPressPhoto from "../../assets/photos/olive-oil-press.webp";
import oilDropPhoto from "../../assets/photos/oil-drop.webp";
import oliveOilBottlePhoto from "../../assets/photos/olive-oil-bottle.webp";
import whiteDovePhoto from "../../assets/photos/white-dove.webp";
import oliveLeavesPhoto from "../../assets/photos/olive-leaves.webp";
import oliveOrchardWidePhoto from "../../assets/photos/olive-orchard-wide.webp";
import oliveBlossomPhoto from "../../assets/photos/olive-blossom.webp";
import treeShadePhoto from "../../assets/photos/tree-shade.webp";
import oliveGroveRegionPhoto from "../../assets/photos/olive-grove-region.webp";

/**
 * المسار البيداغوجي الثابت داخل كل محطة.
 * الترتيب مقصود: تشويق ← مُدخل ← فهم ← تدريب ← تطبيق حياتي ← تحدٍّ ← تقويم ← إنجاز.
 * المرحلة التي لا أنشطة لها في محطة ما لا تُعرض أصلاً.
 */
export const PHASES = [
  { id: "discover", title: "أكتشف", icon: "🔍", hint: "صورة أو سؤال يفتح شهيّتك للموضوع." },
  { id: "watch", title: "أستمع وأشاهد", icon: "🎧", hint: "نص مسموع أو قصة أو فيديو." },
  { id: "understand", title: "أفهم", icon: "🧠", hint: "أسئلة تتأكّد أنك فهمت." },
  { id: "practice", title: "أتدرّب", icon: "🎯", hint: "ألعاب وأنشطة تثبّت ما تعلّمته." },
  { id: "apply", title: "أطبّق", icon: "🌍", hint: "مهمة تربط الدرس بحياتك." },
  { id: "challenge", title: "أتحدّى نفسي", icon: "🚀", hint: "أسئلة أصعب قليلاً." },
  { id: "assess", title: "أقيّم تعلّمي", icon: "📝", hint: "اختبار قصير في نهاية المحطة." },
  { id: "done", title: "أنجزت", icon: "🏅", hint: "شارتك ونتيجتك." },
];

/** ترتيب المراحل للفرز السريع */
export const PHASE_ORDER = PHASES.map((p) => p.id);

/**
 * محطات المسار الموضوعي.
 * `steps` هو خريطة: معرّف المرحلة ← قائمة "domainId/activityId".
 */
export const zaytounaPath = {
  id: "zaytouna-path",
  title: "مسار الزيتونة",
  subtitle: "رحلة واحدة من التعرّف على الشجرة حتى الاختبار النهائي",
  stations: [
    {
      id: "discover-tree",
      title: "أتعرّف على شجرة الزيتون",
      icon: "🌳",
      cover: oliveTreeFullPhoto,
      description: "من أين نبدأ؟ نتعرّف على الشجرة التي رافقت أجدادنا آلاف السنين.",
      badge: { emoji: "🌱", label: "صديق الزيتونة" },
      steps: {
        discover: ["arabic/predict-see-1", "arabic/idea-tree-1"],
        watch: ["arabic/read-1"],
        understand: ["science/senses-mcq", "arabic/text-type-mcq"],
        practice: ["science/living-sort"],
        apply: ["arabic/garden-planting-open"],
        challenge: ["science/tree-compare-venn"],
      },
    },
    {
      id: "tree-parts",
      title: "أجزاء شجرة الزيتون",
      icon: "🌿",
      cover: oliveRootsPhoto,
      description: "جذر يشرب، وجذع يحمل، وورقة تصنع الغذاء — لكل جزء عمل.",
      badge: { emoji: "🔬", label: "عارف الأجزاء" },
      steps: {
        discover: ["science/tree-hotspot"],
        understand: ["science/tree-parts-match", "science/leaf-factory-mcq"],
        practice: ["science/needs-sort", "science/water-journey-order"],
        apply: ["arabic/tree-part-verse1-mcq"],
        challenge: ["science/roots-xray-facts"],
      },
    },
    {
      id: "olive-story",
      title: "قصة الزيتونة",
      icon: "📖",
      cover: oliveBranchesPhoto,
      description: "قصيدة الزيتونة، وقصة غصن الزيتون الذي حمل خبر السلام.",
      badge: { emoji: "📖", label: "راوي القصة" },
      steps: {
        discover: ["arabic/predict-hear-1"],
        watch: ["religion/noah-story"],
        understand: ["religion/noah-mcq", "arabic/noah-story-mcq"],
        practice: ["arabic/comp-where-1", "arabic/comp-above-1"],
        apply: ["religion/blessed-tree-open"],
      },
    },
    {
      id: "harvest-season",
      title: "موسم قطاف الزيتون",
      icon: "🧺",
      cover: olivePickingPhoto,
      description: "في الخريف تجتمع العائلة تحت الشجرة — هذا هو الموسم.",
      badge: { emoji: "🧺", label: "قاطف ماهر" },
      steps: {
        watch: ["homeland/olive-season-story"],
        understand: ["homeland/reading-comp-mcq", "homeland/listening-comp-mcq"],
        practice: ["homeland/dictation-mcq-1", "homeland/dictation-mcq-2", "social-emotional/sel-listening-tf"],
        apply: ["homeland/write-story-open", "social-emotional/sel-help-open"],
        challenge: ["math/subtract-word-1"],
      },
    },
    {
      id: "harvest-tools",
      title: "أدوات القطاف قديمًا وحديثًا",
      icon: "🪝",
      cover: oliveCombToolPhoto,
      description: "المشط والشادر والشقشاشة — أسماء أدوات ورثناها عن الأجداد.",
      badge: { emoji: "🪝", label: "خبير الأدوات" },
      steps: {
        discover: ["homeland/tools-sentence-match"],
        understand: ["homeland/dictation-mcq-2"],
        practice: ["science/material-sort", "economy/economy-chain-order"],
        apply: ["homeland/proverb-open"],
      },
    },
    {
      id: "to-the-press",
      title: "من الزيتونة إلى المعصرة",
      icon: "⚙️",
      cover: oliveOilPressPhoto,
      description: "بعد القطاف تبدأ الرحلة: من السلّة إلى حجر المعصرة.",
      badge: { emoji: "⚙️", label: "عامل المعصرة" },
      steps: {
        discover: ["science/oil-water-predict-mcq"],
        understand: ["science/oil-process-facts", "science/oil-water-explain-facts"],
        practice: ["economy/raw-product-sort"],
        apply: ["economy/shop-math"],
      },
    },
    {
      id: "oil-production",
      title: "مراحل إنتاج زيت الزيتون",
      icon: "🫗",
      cover: oilDropPhoto,
      description: "من البذرة إلى الشجرة إلى الثمرة إلى القطرة الذهبية.",
      badge: { emoji: "🫗", label: "صانع الزيت" },
      steps: {
        discover: ["science/growth-order"],
        understand: ["science/growth-timeline-facts"],
        practice: ["science/oil-process-facts"],
        apply: ["economy/sources-open", "economy/economy-budget-math"],
      },
    },
    {
      id: "benefits",
      title: "فوائد الزيت والزيتون",
      icon: "💚",
      cover: oliveOilBottlePhoto,
      description: "لماذا قيل عن الزيتون إنه شجرة مباركة؟ نفرّق بين الحقيقة والخرافة.",
      badge: { emoji: "💚", label: "حارس الصحة" },
      steps: {
        discover: ["arabic/oil-heals-open"],
        understand: ["science/fact-or-myth-1", "science/fact-or-myth-2"],
        practice: ["science/fact-or-myth-3", "science/fact-or-myth-4", "economy/need-want-sort", "economy/economy-price-tf"],
        apply: ["arabic/ahmad-scenario-open"],
      },
    },
    {
      id: "heritage",
      title: "الزيتونة في تراثنا",
      icon: "🕊️",
      cover: whiteDovePhoto,
      description: "غصن الزيتون رمز للسلام، وذكرٌ في كتبنا، ومَثَلٌ على ألسنة الناس.",
      badge: { emoji: "🕊️", label: "سفير السلام" },
      steps: {
        discover: ["religion/peace-symbol-mcq", "religion/religion-blessed-tf"],
        watch: ["religion/quran-surah-tin-recitation"],
        understand: ["homeland/levant-facts", "homeland/africa-facts"],
        practice: ["homeland/homeland-countries-sort", "religion/values-tree-match"],
        apply: ["social-emotional/proverb-meaning-mcq", "religion/religion-peace-blank"],
        challenge: ["homeland/region-direction-mcq"],
      },
    },
    {
      id: "vocabulary",
      title: "مفردات وتراكيب لغوية",
      icon: "💎",
      cover: oliveLeavesPhoto,
      description: "كنز الكلمات: مرادف وعكس، مفرد وجمع، وحروف تبني كلمات.",
      badge: { emoji: "💎", label: "كنّاز الكلمات" },
      steps: {
        discover: ["arabic/word-treasure-1"],
        understand: ["arabic/word-picture-1", "arabic/synonym-match-1"],
        practice: [
          "arabic/singular-plural-1",
          "arabic/opposites-1",
          "arabic/word-build-poem",
          "arabic/missing-letter-1",
          "arabic/missing-letter-2",
        ],
        apply: ["arabic/sentence-writing-1", "hebrew-english/en-tree-parts-blank"],
        challenge: ["arabic/sun-moon-sort", "arabic/letter-anagram-1"],
      },
    },
    {
      id: "comprehension",
      title: "فهم المقروء والمسموع",
      icon: "🎧",
      cover: oliveOrchardWidePhoto,
      description: "أستمع جيداً، أقرأ بتأنٍّ، ثم أجيب بثقة.",
      badge: { emoji: "🎧", label: "المستمع اليقظ" },
      steps: {
        watch: ["arabic/listen-word-1", "arabic/listen-word-2", "arabic/listen-word-3"],
        understand: ["arabic/comp-gives-1", "arabic/comp-shade-1", "arabic/comp-symbol-1"],
        practice: ["arabic/truefalse-1", "arabic/truefalse-2", "arabic/truefalse-3", "arabic/truefalse-4"],
        challenge: ["arabic/verse-meaning-mcq", "arabic/qafiya-mcq"],
      },
    },
    {
      id: "song",
      title: "أنشودة الزيتونة",
      icon: "🎵",
      cover: oliveBlossomPhoto,
      description: "نشاهد، نغنّي، ونتعرّف على الآلات التي ترافق اللحن.",
      badge: { emoji: "🎵", label: "الموسيقي" },
      steps: {
        watch: ["music/jojo-video"],
        understand: ["music/branches-video-discussion"],
        practice: ["music/tempo-mcq", "music/guess-instrument-mcq", "music/instrument-sort"],
        apply: ["music/song-open"],
        challenge: ["music/branches-movement-game"],
      },
    },
    {
      id: "games",
      title: "ألعاب وتحديات",
      icon: "🎮",
      cover: treeShadePhoto,
      description: "نخرج إلى الساحة، نلعب بالظلال، ونرسم ما تعلّمناه.",
      badge: { emoji: "🎮", label: "بطل الساحة" },
      steps: {
        discover: ["sports/sports-safety-tf"],
        practice: [
          "sports/sports-warmup-order",
          "sports/tree-growth-game-outdoor",
          "sports/balance-outdoor",
          "sports/shadow-catch-outdoor",
        ],
        understand: ["arts/arts-leaf-two-colors-tf", "arts/arts-shape-mcq"],
        apply: ["arts/draw-tree", "arts/palette-mcq", "arts/arts-describe-open", "arts/arts-warm-cool-sort"],
        challenge: ["science/shadow-sim-1", "science/shadow-mcq", "sports/beautiful-shadow-outdoor"],
      },
    },
    {
      id: "final-test",
      title: "اختبار نهائي",
      icon: "🏆",
      cover: oliveGroveRegionPhoto,
      description: "ثمانية أسئلة تجمع كل ما تعلّمته في رحلة الزيتونة.",
      badge: { emoji: "🏆", label: "خبير الزيتونة" },
      steps: {
        assess: [
          "arabic/challenge-1",
          "arabic/challenge-2",
          "arabic/challenge-3",
          "arabic/challenge-4",
          "arabic/challenge-5",
          "arabic/challenge-6",
          "arabic/challenge-7",
          "arabic/challenge-8",
        ],
        challenge: ["math/math-challenge-1", "math/math-challenge-4", "math/math-challenge-7"],
      },
    },
  ],
};

/** يفكّ "domainId/activityId" إلى كائن النشاط الفعلي من الوحدة. */
export function resolveRef(unit, ref) {
  const [domainId, activityId] = ref.split("/");
  const domain = unit.domains.find((d) => d.id === domainId);
  if (!domain) return null;
  const activity = domain.activities.find((a) => a.id === activityId);
  if (!activity) return null;
  return { domain, activity };
}

/**
 * كل أنشطة محطة موضوعية، مرتّبة بحسب المرحلة، ومصفّاة بحسب الصف.
 * النشاط بلا حقل `grade` يظهر للصفّين معاً.
 */
export function stationActivities(unit, station, grade) {
  const out = [];
  for (const phase of PHASES) {
    const refs = station.steps[phase.id] ?? [];
    for (const ref of refs) {
      const resolved = resolveRef(unit, ref);
      if (!resolved) continue;
      if (grade && resolved.activity.grade && resolved.activity.grade !== grade) continue;
      out.push({ ...resolved, phase, ref });
    }
  }
  return out;
}

/** المراحل غير الفارغة في محطة، لعرضها كأقسام. */
export function stationPhases(unit, station, grade) {
  const items = stationActivities(unit, station, grade);
  return PHASES.map((phase) => ({
    phase,
    items: items.filter((i) => i.phase.id === phase.id),
  })).filter((g) => g.items.length > 0);
}

/** كل مراجع المسار — للتحقّق من عدم وجود مرجع مكسور. */
export function allRefs() {
  return zaytounaPath.stations.flatMap((s) => Object.values(s.steps).flat());
}
