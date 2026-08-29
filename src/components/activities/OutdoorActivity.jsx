import { useState } from "react";
import BigButton from "../ui/BigButton.jsx";

export default function OutdoorActivity({ activity, onComplete }) {
  const { instruction } = activity.data;
  const [photoUrl, setPhotoUrl] = useState(null);

  const onPhoto = (e) => {
    const file = e.target.files?.[0];
    if (file) setPhotoUrl(URL.createObjectURL(file));
  };

  return (
    <div className="space-y-5 text-center">
      <div className="text-5xl">🌳🏃</div>
      <p className="text-xl font-bold leading-relaxed">{instruction}</p>
      <p className="text-olive-trunk">اطلب من معلّمتك مرافقتك إلى الساحة، وبعد العودة وثّق ما فعلت (اختياري).</p>

      <label className="inline-block cursor-pointer rounded-2xl border-2 border-dashed border-olive-green/40 px-6 py-4 text-olive-trunk">
        📷 أرفق صورة توثيق (اختياري)
        <input type="file" accept="image/*" capture="environment" className="hidden" onChange={onPhoto} />
      </label>
      {photoUrl && <img src={photoUrl} alt="صورة التقطها الطالب لتوثيق تنفيذ المهمة" loading="lazy" decoding="async" className="max-w-xs mx-auto rounded-2xl border-2 border-olive-green/20" />}

      <BigButton variant="primary" onClick={() => onComplete(activity.points, { photoAttached: Boolean(photoUrl) })}>
        أنجزت المهمة ✅
      </BigButton>
    </div>
  );
}
