import { asset } from "../../utils/asset.js";
import { useState } from "react";
import BigButton from "../ui/BigButton.jsx";

export default function VideoActivity({ activity, onComplete }) {
  const { videoSrc, instruction } = activity.data;
  const [played, setPlayed] = useState(false);

  return (
    <div className="space-y-5 text-center">
      <p className="text-olive-trunk">{instruction}</p>

      <video controls src={asset(videoSrc)} className="w-full rounded-2xl" onPlay={() => setPlayed(true)} />

      <BigButton variant="primary" disabled={!played} onClick={() => onComplete(activity.points, { played })}>
        شاهدت الفيديو 🎬
      </BigButton>
    </div>
  );
}
