import { unit as zaytouna } from "./units/zaytouna.js";

// براعم: منصّة تعليمية تضمّ مواد دراسية، وكل مادة تضمّ وحدات تعليمية.
// لإضافة مادة جديدة: أضف كائناً جديداً لمصفوفة subjects.
// لإضافة وحدة جديدة داخل مادة موجودة: أضف الوحدة (بنفس سكيما src/data/units/*.js) إلى units الخاصة بها.
export const platform = {
  name: "براعم",
  tagline: "منصّة الوحدات التعليمية",
  subjects: [
    {
      id: "arabic-language",
      title: "اللغة العربية",
      icon: "📖",
      color: "#2FA36B",
      description: "وحدات تعليمية تفاعلية حول نصوص وقصائد عربية أصيلة، كل نص هو نقطة انطلاق لرحلة تعلّم متعددة المجالات.",
      units: [zaytouna],
    },
  ],
};
