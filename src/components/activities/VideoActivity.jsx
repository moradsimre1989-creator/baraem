import { asset } from "../../utils/asset.js";
import { useState } from "react";
import BigButton from "../ui/BigButton.jsx";

/*
  نشاط الفيديو
  =============
  يقبل شكلين:
  - `videoSrc`: فيديو واحد — الشكل القديم، وكل الأنشطة القائمة تستعمله.
  - `videos`: قائمة، كل عنصر إمّا `src` من مجلد public أو `youtubeId`.

  القائمة أُضيفت ولم تستبدل الشكل القديم، فلا ينكسر نشاط قائم.

  الطولي والعرضي لا يُعرضان بالقياس نفسه: الفيديو الطولي (576×1024) بعرض
  كامل يملأ الشاشة ارتفاعاً ويدفع كل ما بعده خارج النظر. حقل `aspect` يحدّده
  فيُقيَّد بأقصى ارتفاع ويُتوسَّط.

  ترتيب العرض يبدأ بالملفات المحلية لأنها تعمل بلا إنترنت، ويوتيوب يحتاج
  اتصالاً — وهذا مكتوب للطالب تحت عنوان الفيديو لا مخفيًّا عنه.
*/

function YouTubeFrame({ id, title }) {
  return (
    <div
      className="relative w-full overflow-hidden rounded-2xl bg-black"
      style={{ aspectRatio: "16 / 9" }}
    >
      {/* youtube-nocookie: لا يضع كوكيز تتبّع قبل التشغيل — الميزة لأطفال */}
      <iframe
        src={`https://www.youtube-nocookie.com/embed/${id}`}
        title={title}
        loading="lazy"
        allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        referrerPolicy="strict-origin-when-cross-origin"
        className="absolute inset-0 h-full w-full border-0"
      />
    </div>
  );
}

function VideoItem({ item, onPlayed }) {
  const portrait = item.aspect === "portrait";
  return (
    <figure
      className="rounded-3xl border border-border bg-surface p-4"
      style={{ boxShadow: "var(--shadow-card)" }}
    >
      <figcaption className="mb-3">
        <h3 className="text-xl font-black text-olive-ink">{item.title}</h3>
        {item.description && <p className="text-olive-trunk mt-0.5">{item.description}</p>}
        {item.youtubeId && (
          <p className="mt-1 text-sm text-olive-trunk">
            🌐 هذا الفيديو من يوتيوب ويحتاج اتصالاً بالإنترنت.
          </p>
        )}
      </figcaption>

      {item.youtubeId ? (
        <YouTubeFrame id={item.youtubeId} title={item.title} />
      ) : (
        <video
          controls
          preload="metadata"
          src={asset(item.src)}
          onPlay={onPlayed}
          className={
            portrait ? "mx-auto max-h-[70vh] rounded-2xl bg-black" : "w-full rounded-2xl bg-black"
          }
        />
      )}
    </figure>
  );
}

export default function VideoActivity({ activity, onComplete }) {
  const { videoSrc, videos, instruction } = activity.data;
  const [played, setPlayed] = useState(false);

  const list = videos ?? [];
  // إطار يوتيوب معزول فلا نعرف أنه شُغّل. لو كانت كل الفيديوهات من يوتيوب
  // واشترطنا التشغيل لعَلِق الطالب بلا زرّ إنهاء.
  const hasLocal = Boolean(videoSrc) || list.some((v) => !v.youtubeId);

  return (
    <div className="space-y-5">
      {instruction && <p className="text-olive-trunk text-center">{instruction}</p>}

      {videoSrc && (
        <video
          controls
          src={asset(videoSrc)}
          className="w-full rounded-2xl bg-black"
          onPlay={() => setPlayed(true)}
        />
      )}

      {list.map((item) => (
        <VideoItem
          key={item.youtubeId ?? item.src}
          item={item}
          onPlayed={() => setPlayed(true)}
        />
      ))}

      <div className="text-center">
        <BigButton
          variant="primary"
          disabled={hasLocal && !played}
          onClick={() => onComplete(activity.points, { played })}
        >
          شاهدت الفيديو 🎬
        </BigButton>
      </div>
    </div>
  );
}
