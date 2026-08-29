import { useRef, useState } from "react";
import BigButton from "../ui/BigButton.jsx";

const COLORS = ["#3f6b1f", "#c68a2e", "#6b4a2f", "#2c2a1f", "#8fa24d", "#c1443e"];

export default function DrawActivity({ activity, onComplete }) {
  const canvasRef = useRef(null);
  const drawing = useRef(false);
  const [color, setColor] = useState(COLORS[0]);

  const getPos = (e, canvas) => {
    const rect = canvas.getBoundingClientRect();
    const point = e.touches ? e.touches[0] : e;
    return { x: point.clientX - rect.left, y: point.clientY - rect.top };
  };

  const start = (e) => {
    drawing.current = true;
    draw(e);
  };
  const end = () => {
    drawing.current = false;
    canvasRef.current.getContext("2d").beginPath();
  };
  const draw = (e) => {
    if (!drawing.current && e.type !== "mousedown" && e.type !== "touchstart") return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const { x, y } = getPos(e, canvas);
    ctx.lineWidth = 6;
    ctx.lineCap = "round";
    ctx.strokeStyle = color;
    ctx.lineTo(x, y);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(x, y);
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    canvas.getContext("2d").clearRect(0, 0, canvas.width, canvas.height);
  };

  return (
    <div className="space-y-4">
      <p className="text-olive-trunk">{activity.data.instruction}</p>
      <div className="flex justify-center gap-2">
        {COLORS.map((c) => (
          <button
            key={c}
            onClick={() => setColor(c)}
            className={`w-9 h-9 rounded-full border-2 ${color === c ? "border-olive-ink scale-110" : "border-white"}`}
            style={{ background: c }}
          />
        ))}
      </div>
      <canvas
        ref={canvasRef}
        width={480}
        height={320}
        className="w-full max-w-[480px] mx-auto block rounded-2xl border-2 border-olive-green/30 bg-white touch-none"
        onMouseDown={start}
        onMouseMove={draw}
        onMouseUp={end}
        onMouseLeave={end}
        onTouchStart={start}
        onTouchMove={draw}
        onTouchEnd={end}
      />
      <div className="flex justify-center gap-3">
        <BigButton variant="outline" className="!px-5 !py-2" onClick={clearCanvas}>
          🧹 مسح
        </BigButton>
        <BigButton variant="primary" onClick={() => onComplete(activity.points, { drawn: true })}>
          💾 احفظ رسمتي
        </BigButton>
      </div>
    </div>
  );
}
