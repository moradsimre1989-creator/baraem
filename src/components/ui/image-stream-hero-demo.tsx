// عرض توضيحي لمكوّن ImageStreamHero داخل مشروع "براعم".
// استُبدلت صور الـ CDN الأصلية بصور وحدة الزيتونة المحلية، حتى يبقى
// التطبيق شغّالاً بدون إنترنت كما هو اليوم.

import { ImageStreamHero } from "@/components/ui/image-stream-hero";

import oliveBranchesSunset from "@/assets/photos/olive-branches-sunset.webp";
import oliveTreeFull from "@/assets/photos/olive-tree-full.webp";
import olivesCloseup from "@/assets/photos/olives-closeup.webp";
import oliveOilBottle from "@/assets/photos/olive-oil-bottle.webp";
import oliveOrchardWide from "@/assets/photos/olive-orchard-wide.webp";
import oliveBlossom from "@/assets/photos/olive-blossom.webp";
import olivePicking from "@/assets/photos/olive-picking.webp";
import oliveLeaves from "@/assets/photos/olive-leaves.webp";
import oliveOilPress from "@/assets/photos/olive-oil-press.webp";
import oliveRoots from "@/assets/photos/olive-roots.webp";
import treeShade from "@/assets/photos/tree-shade.webp";
import seedling from "@/assets/photos/seedling.webp";

const IMAGES = [
  { src: oliveBranchesSunset, alt: "أغصان زيتون عند الغروب" },
  { src: oliveTreeFull, alt: "شجرة زيتون كاملة" },
  { src: olivesCloseup, alt: "حبّات زيتون عن قرب" },
  { src: oliveOilBottle, alt: "قنينة زيت زيتون" },
  { src: oliveOrchardWide, alt: "بستان زيتون واسع" },
  { src: oliveBlossom, alt: "زهر الزيتون" },
  { src: olivePicking, alt: "قطف الزيتون" },
  { src: oliveLeaves, alt: "أوراق الزيتون" },
  { src: oliveOilPress, alt: "معصرة الزيتون" },
  { src: oliveRoots, alt: "جذور شجرة الزيتون" },
  { src: treeShade, alt: "ظلّ الشجرة" },
  { src: seedling, alt: "شتلة صغيرة" },
];

export default function ImageStreamHeroDemo() {
  return (
    <ImageStreamHero
      images={IMAGES}
      className="h-[560px] w-full rounded-lg border border-border bg-background"
    >
      <div className="relative z-10 flex h-full flex-col items-center justify-between py-12 text-center">
        <div className="px-6">
          <h1 className="text-balance text-4xl font-medium tracking-tight text-foreground sm:text-5xl">
            وحدة الزيتونة
            <br />
            من الجذر إلى الزيت
          </h1>
        </div>
        <p className="max-w-md text-balance px-6 text-sm text-muted-foreground">
          رحلة تعليمية بأحد عشر محطة — تبدأ من الشجرة وتنتهي بالقصّة التي
          يرويها كل طالب بلغته.
        </p>
      </div>
    </ImageStreamHero>
  );
}
