import { useState } from "react";
import BigButton from "./ui/BigButton.jsx";

export default function CertificateScreen({ unit, totalPoints }) {
  const [name, setName] = useState("");
  const today = new Date().toLocaleDateString("ar-EG", { year: "numeric", month: "long", day: "numeric" });

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 pb-16 pt-6 space-y-5">
      <div className="text-center mb-2 print-hidden">
        <h1 className="text-3xl font-black text-olive-ink">🏆 شهادة الإنجاز</h1>
        <p className="text-olive-trunk mt-1">اكتب اسمك ثم اطبع شهادتك</p>
      </div>

      <div className="print-hidden">
        <input
          className="w-full rounded-2xl border-2 border-olive-green/30 p-3 text-lg text-center mb-5"
          placeholder="اكتب اسم الطالب هنا"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>

      <div
        id="certificate"
        className="bg-surface rounded-3xl p-10 text-center space-y-4"
        style={{ boxShadow: "var(--shadow-card)", border: "6px double #c68a2e" }}
      >
        <div className="text-5xl">🫒</div>
        <p className="text-olive-green font-bold text-sm tracking-wide">شهادة إنجاز</p>
        <h2 className="text-2xl font-black text-olive-ink">مُتقن وحدة الزيتونة {unit.year}</h2>
        <p className="text-olive-trunk">تُمنح هذه الشهادة إلى</p>
        <p className="font-quran text-3xl font-bold text-olive-gold min-h-12 border-b-2 border-dotted border-olive-gold/50 inline-block px-6 pb-2">
          {name || "________________"}
        </p>
        <p className="text-olive-trunk leading-relaxed max-w-md mx-auto">
          تقديراً لإتمامه رحلة تعليمية تفاعلية حول قصيدة «الزَّيْتونَة»، وجمع{" "}
          <span className="font-bold text-olive-ink">{totalPoints}</span> نقطة عبر محطات اللغة والعلوم والرياضيات
          والفنون وغيرها.
        </p>
        <p className="text-sm text-olive-trunk">{unit.school} — {today}</p>
      </div>

      <div className="print-hidden flex justify-center">
        <BigButton variant="primary" onClick={() => window.print()}>
          🖨️ اطبع الشهادة
        </BigButton>
      </div>
    </div>
  );
}
