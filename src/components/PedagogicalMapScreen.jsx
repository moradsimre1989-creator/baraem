import { unit } from "../data/units/zaytouna.js";
import { pedagogicalMap as m } from "../data/pedagogicalMap.js";

function Section({ title, icon, children }) {
  return (
    <section className="bg-surface rounded-3xl border border-black/5 p-6" style={{ boxShadow: "var(--shadow-card)" }}>
      <h2 className="font-bold text-lg mb-4 flex items-center gap-2 text-olive-ink">
        <span aria-hidden>{icon}</span> {title}
      </h2>
      {children}
    </section>
  );
}

export default function PedagogicalMapScreen() {
  const arabic = unit.domains.find((d) => d.id === "arabic");

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 pb-16 pt-6 space-y-5">
      <div className="text-center mb-2">
        <p className="text-olive-green font-bold text-sm">للمعلّمة وللمرشد التربوي</p>
        <h1 className="text-3xl font-black text-olive-ink">🎓 الخريطة التربوية للوحدة</h1>
      </div>

      <Section title="النص المحوري" icon="📜">
        <p className="text-olive-trunk mb-3">{m.centralText}</p>
        <div className="font-quran text-lg leading-loose bg-surface-alt rounded-2xl p-4">
          {unit.text.lines.map((l, i) => (
            <p key={i}>
              {l.sadr} <span className="text-olive-green mx-1">•</span> {l.ajuz}
            </p>
          ))}
        </div>
        <p className="text-sm text-olive-trunk mt-3">الفئة العمرية: {m.ageGroup}</p>
      </Section>

      <Section title="المجالات" icon="🌳">
        <div className="flex flex-wrap gap-2">
          {m.domains.map((d) => (
            <span key={d} className="bg-surface-alt rounded-full px-3 py-1.5 text-sm font-medium">
              {d}
            </span>
          ))}
        </div>
      </Section>

      <div className="grid sm:grid-cols-2 gap-5">
        <Section title="طرق التعلّم" icon="🧭">
          <ul className="list-disc pr-5 space-y-1.5 text-sm text-olive-trunk">
            {m.learningMethods.map((x, i) => (
              <li key={i}>{x}</li>
            ))}
          </ul>
        </Section>
        <Section title="مهارات القرن الحادي والعشرين" icon="✨">
          <ul className="list-disc pr-5 space-y-1.5 text-sm text-olive-trunk">
            {m.skills21.map((x, i) => (
              <li key={i}>{x}</li>
            ))}
          </ul>
        </Section>
      </div>

      <Section title="التقويم" icon="📊">
        <div className="space-y-2">
          {m.assessment.map((a) => (
            <div key={a.type} className="flex items-start gap-3 text-sm">
              <span className="shrink-0 bg-olive-green/10 text-olive-green font-bold rounded-full px-3 py-1">{a.type}</span>
              <span className="text-olive-trunk pt-1">{a.desc}</span>
            </div>
          ))}
        </div>
      </Section>

      <Section title="الفروق الفردية" icon="🌱">
        <div className="grid sm:grid-cols-3 gap-3">
          {m.differentiation.map((d) => (
            <div key={d.label} className="bg-surface-alt rounded-2xl p-4 text-center">
              <div className="text-2xl mb-1">{d.icon}</div>
              <div className="font-bold text-sm mb-1">{d.label}</div>
              <div className="text-xs text-olive-trunk">{d.desc}</div>
            </div>
          ))}
        </div>
      </Section>

      <Section title="مسار التعلّم" icon="🔁">
        <div className="flex flex-wrap items-center gap-2 text-sm">
          {m.learningFlow.map((step, i) => (
            <div key={step} className="flex items-center gap-2">
              <span className="bg-olive-green text-white rounded-full px-3 py-1.5 font-bold">{step}</span>
              {i < m.learningFlow.length - 1 && <span className="text-olive-trunk" aria-hidden>←</span>}
            </div>
          ))}
        </div>
      </Section>

      <Section title="مصفوفة تغطية المهارات — اللغة العربية" icon="📋">
        <p className="text-xs text-olive-trunk mb-3">
          كل نشاط في المحطة المركزية مرتبط بمرحلة تعلّمية ومهارة محدّدة — لا توجد أنشطة عشوائية.
        </p>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-right text-olive-trunk">
                <th className="py-2 pl-4 font-bold">النشاط</th>
                <th className="py-2 pl-4 font-bold">المرحلة</th>
                <th className="py-2 font-bold">المهارة</th>
              </tr>
            </thead>
            <tbody>
              {arabic.activities.map((a) => (
                <tr key={a.id} className="border-t border-black/5">
                  <td className="py-1.5 pl-4">{a.title}</td>
                  <td className="py-1.5 pl-4 text-olive-trunk whitespace-nowrap">{a.stage || "—"}</td>
                  <td className="py-1.5">
                    {a.skill ? (
                      <span className="text-[11px] font-bold text-olive-green bg-olive-green/10 rounded-full px-2 py-0.5">
                        {a.skill}
                      </span>
                    ) : (
                      "—"
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Section>

      <Section title="الربط بين المجالات" icon="🔗">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-right text-olive-trunk">
                <th className="py-2 pl-4 font-bold">المجالان</th>
                <th className="py-2 font-bold">مثال</th>
              </tr>
            </thead>
            <tbody>
              {m.crossDomainLinks.map((l) => (
                <tr key={l.pair} className="border-t border-black/5">
                  <td className="py-2 pl-4 font-bold whitespace-nowrap">{l.pair}</td>
                  <td className="py-2 text-olive-trunk">{l.question}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Section>
    </div>
  );
}
