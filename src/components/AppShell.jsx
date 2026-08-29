import { useEffect, useRef, useState } from "react";
import { GRADES, useGrade } from "../context/GradeContext.jsx";

const NAV_ITEMS = [
  { key: "home", label: "الرئيسية", icon: "🏠" },
  { key: "path", label: "مسار الزيتونة", icon: "🛤️" },
  { key: "map", label: "وحدة الزيتونة", icon: "🌿" },
  { key: "challenge", label: "التحديات", icon: "⚡" },
  { key: "achievements", label: "الإنجازات", icon: "🏆" },
];

function TeacherToolsMenu({
  onOpenPedagogy,
  onOpenDiscussion,
  onOpenTeacherMode,
  onOpenChallenge,
  onOpenExitTicket,
  onOpenCertificate,
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const onClickOutside = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  const items = [
    { label: "🎓 الخريطة التربوية", onClick: onOpenPedagogy },
    { label: "💬 مجلس الزيتونة", onClick: onOpenDiscussion },
    { label: "🧑‍🏫 وضع المعلّمة", onClick: onOpenTeacherMode },
    { label: "⚡ تحدي 60 ثانية", onClick: onOpenChallenge },
    { label: "🍃 بطاقة الخروج", onClick: onOpenExitTicket },
    { label: "🏆 شهادة الإنجاز", onClick: onOpenCertificate },
  ];

  return (
    <div className="relative hidden sm:block" ref={ref}>
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-1.5 font-bold text-sm text-olive-ink hover:text-brand transition-colors duration-200 rounded-xl px-3 py-2 hover:bg-black/[0.04]"
      >
        🧰 أدوات المعلّمة
        <span className={`transition-transform duration-200 ${open ? "rotate-180" : ""}`} aria-hidden>
          ▾
        </span>
      </button>
      {open && (
        <div
          className="absolute top-full left-0 mt-1 bg-white rounded-2xl border border-border py-2 min-w-[200px] z-50"
          style={{ boxShadow: "var(--shadow-hover)" }}
        >
          {items.map((item) => (
            <button
              key={item.label}
              onClick={() => {
                item.onClick();
                setOpen(false);
              }}
              className="w-full text-right px-4 py-2.5 text-sm font-bold hover:bg-olive-cream transition-colors duration-150"
            >
              {item.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function ShareButton() {
  const [copied, setCopied] = useState(false);

  const share = async () => {
    const shareData = {
      title: "براعم — وحدة الزيتونة",
      text: "جرّب معنا رحلة الزيتونة التعليمية 🫒",
      url: window.location.href,
    };
    if (navigator.share) {
      try {
        await navigator.share(shareData);
        return;
      } catch {
        return;
      }
    }
    try {
      await navigator.clipboard.writeText(shareData.url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // نسخ غير مدعوم في هذا المتصفح
    }
  };

  return (
    <button
      onClick={share}
      className="flex items-center gap-1.5 rounded-xl px-3 py-2 text-sm font-bold text-olive-trunk hover:bg-black/[0.04] transition-colors duration-200"
    >
      {copied ? "✅ تم نسخ الرابط" : "🔗 شارك"}
    </button>
  );
}

/* مبدّل الصف — المعلّمة قد تشغّل الجهاز نفسه لصفّين في اليوم نفسه */
function GradeChip() {
  const { grade, info, setGrade } = useGrade();
  if (!grade) return null;
  const other = GRADES.find((g) => g.value !== grade);

  return (
    <button
      onClick={() => setGrade(other.value)}
      title={`التبديل إلى ${other.title}`}
      aria-label={`الصف الحالي: ${info.title}. اضغط للتبديل إلى ${other.title}`}
      className="flex items-center gap-1.5 rounded-full bg-olive-green/10 px-3.5 py-1.5 text-sm font-bold text-olive-green transition-colors duration-200 hover:bg-olive-green/20"
    >
      <span aria-hidden>{info.emoji}</span>
      <span className="hidden sm:inline">{info.title}</span>
      <span className="sm:hidden">{grade}</span>
      <span aria-hidden className="opacity-60">
        ⇄
      </span>
    </button>
  );
}

function SidebarLink({ item, active, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-3 w-full rounded-2xl px-4 py-3 text-sm font-bold transition-all duration-200 ${
        active ? "bg-brand-soft text-brand" : "text-olive-trunk hover:bg-black/[0.04] hover:text-olive-ink"
      }`}
    >
      <span className="text-lg" aria-hidden>
        {item.icon}
      </span>
      <span>{item.label}</span>
    </button>
  );
}

export default function AppShell({
  activeKey,
  onNavigate,
  backLabel,
  onBack,
  totalPoints,
  onResetProgress,
  onOpenPedagogy,
  onOpenDiscussion,
  onOpenTeacherMode,
  onOpenChallenge,
  onOpenExitTicket,
  onOpenCertificate,
  children,
}) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const showTeacherTools =
    onOpenPedagogy || onOpenDiscussion || onOpenTeacherMode || onOpenChallenge || onOpenExitTicket || onOpenCertificate;

  return (
    <div className="min-h-screen bg-olive-cream lg:flex">
      {/* الشريط الجانبي — لوحة التحكم على الحواسيب */}
      <aside className="hidden lg:flex lg:flex-col lg:w-64 lg:shrink-0 border-s border-border bg-white px-4 py-6 gap-1 sticky top-0 h-screen">
        <div className="flex items-center gap-2 font-extrabold text-brand text-xl px-2 mb-6">
          <span aria-hidden>🌱</span>
          <span>براعم</span>
        </div>
        {NAV_ITEMS.map((item) => (
          <SidebarLink
            key={item.key}
            item={item}
            active={activeKey === item.key}
            onClick={() => onNavigate(item.key)}
          />
        ))}
        <div className="mt-auto px-2 pt-4 border-t border-border">
          <div className="flex items-center gap-1.5 bg-pastel-yellow text-olive-ink rounded-full px-3.5 py-1.5 font-bold text-sm w-fit">
            <span aria-hidden>🫒</span>
            <span>{totalPoints} نقطة</span>
          </div>
        </div>
      </aside>

      <div className="flex-1 min-w-0">
        {/* الشريط العلوي */}
        <header
          className={`sticky top-0 z-40 transition-all duration-300 ${
            scrolled ? "bg-white/85 backdrop-blur-md shadow-[0_1px_0_0_rgb(15_23_42/6%)]" : "bg-olive-cream/0"
          }`}
        >
          <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2 min-w-0">
              {backLabel ? (
                <button
                  onClick={onBack}
                  className="flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-bold text-olive-trunk hover:bg-black/[0.04] transition-colors duration-200 shrink-0"
                >
                  <span aria-hidden>⬅</span>
                  <span className="truncate">{backLabel}</span>
                </button>
              ) : (
                <div className="lg:hidden flex items-center gap-2 font-extrabold text-brand text-lg shrink-0">
                  <span aria-hidden>🌱</span>
                  <span>براعم</span>
                </div>
              )}
              {showTeacherTools && (
                <TeacherToolsMenu
                  onOpenPedagogy={onOpenPedagogy}
                  onOpenDiscussion={onOpenDiscussion}
                  onOpenTeacherMode={onOpenTeacherMode}
                  onOpenChallenge={onOpenChallenge}
                  onOpenExitTicket={onOpenExitTicket}
                  onOpenCertificate={onOpenCertificate}
                />
              )}
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <GradeChip />
              <ShareButton />
              <div className="lg:hidden flex items-center gap-1.5 bg-pastel-yellow text-olive-ink rounded-full px-3.5 py-1.5 font-bold text-sm">
                <span aria-hidden>🫒</span>
                <span>{totalPoints}</span>
              </div>
              {onResetProgress && (
                <button
                  onClick={() => {
                    if (confirm("سيتم مسح كل التقدّم المحفوظ. متابعة؟")) onResetProgress();
                  }}
                  className="hidden sm:inline text-xs text-olive-trunk underline underline-offset-2 hover:text-olive-ink"
                >
                  إعادة البدء
                </button>
              )}
            </div>
          </div>
        </header>

        <main className="pb-24 lg:pb-10">{children}</main>
      </div>

      {/* شريط تنقّل سفلي — الهاتف */}
      <nav className="lg:hidden fixed bottom-0 inset-x-0 z-40 bg-white border-t border-border px-2 py-2 flex items-center justify-around">
        {NAV_ITEMS.map((item) => (
          <button
            key={item.key}
            onClick={() => onNavigate(item.key)}
            className={`flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-xl text-[11px] font-bold transition-colors duration-200 ${
              activeKey === item.key ? "text-brand" : "text-olive-trunk"
            }`}
          >
            <span className="text-lg" aria-hidden>
              {item.icon}
            </span>
            <span>{item.label}</span>
          </button>
        ))}
      </nav>
    </div>
  );
}
