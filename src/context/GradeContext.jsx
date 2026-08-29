import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

/*
  مستوى الصف (الثاني / الثالث)
  =============================
  كان الاختيار موجوداً داخل محطة الرياضيات وحدها عبر حالة محلية. هنا نرفعه إلى
  المنصّة كلها بلا تغيير سلوك المحتوى القائم: النشاط الذي لا يحمل حقل `grade`
  يظهر للصفّين معاً — وهذا حال كل الأنشطة الحالية عدا أنشطة الرياضيات المعلَّمة.
  الاختيار يُحفظ محلياً كباقي التقدّم، فلا يُسأل الطالب عنه في كل زيارة.
*/

const STORAGE_KEY = "zaytouna-grade-v1";

export const GRADES = [
  {
    value: 2,
    title: "الصف الثاني",
    emoji: "🌱",
    tagline: "مستكشف البستان",
    description: "نصوص قصيرة، كلمات مألوفة، وأسئلة مدعومة بالصور والصوت.",
  },
  {
    value: 3,
    title: "الصف الثالث",
    emoji: "🌳",
    tagline: "خبير البستان",
    description: "نصوص أطول، أسئلة فهم واستنتاج، وكتابة فقرة قصيرة.",
  },
];

function loadGrade() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const value = Number(raw);
    if (value === 2 || value === 3) return value;
  } catch {
    // تخزين معطوب أو محجوب — نعامله كأن الطالب لم يختر بعد
  }
  return null;
}

const GradeContext = createContext(null);

export function GradeProvider({ children }) {
  const [grade, setGradeState] = useState(loadGrade);

  useEffect(() => {
    try {
      if (grade) localStorage.setItem(STORAGE_KEY, String(grade));
    } catch {
      // التخزين غير متاح — الاختيار يبقى فعّالاً لهذه الجلسة فقط
    }
  }, [grade]);

  const setGrade = useCallback((value) => setGradeState(value), []);
  const clearGrade = useCallback(() => {
    setGradeState(null);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      // لا شيء نفعله
    }
  }, []);

  const value = useMemo(
    () => ({
      grade,
      setGrade,
      clearGrade,
      hasChosen: grade !== null,
      info: GRADES.find((g) => g.value === grade) ?? null,
      /** يصفّي قائمة أنشطة بحسب الصف المختار. بلا اختيار: تُعرض كلها. */
      filterActivities: (activities) =>
        (activities ?? []).filter((a) => a && (!a.grade || !grade || a.grade === grade)),
    }),
    [grade, setGrade, clearGrade]
  );

  return <GradeContext.Provider value={value}>{children}</GradeContext.Provider>;
}

export function useGrade() {
  const ctx = useContext(GradeContext);
  if (!ctx) throw new Error("useGrade يجب أن يُستدعى داخل <GradeProvider>");
  return ctx;
}
