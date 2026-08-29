import ReadActivity from "./ReadActivity.jsx";
import MemorizeActivity from "./MemorizeActivity.jsx";
import MindmapActivity from "./MindmapActivity.jsx";
import MatchActivity from "./MatchActivity.jsx";
import McqActivity from "./McqActivity.jsx";
import OpenActivity from "./OpenActivity.jsx";
import SortActivity from "./SortActivity.jsx";
import WordBuildActivity from "./WordBuildActivity.jsx";
import OrderActivity from "./OrderActivity.jsx";
import MathActivity from "./MathActivity.jsx";
import TrilingualActivity from "./TrilingualActivity.jsx";
import DrawActivity from "./DrawActivity.jsx";
import OutdoorActivity from "./OutdoorActivity.jsx";
import MemoryActivity from "./MemoryActivity.jsx";
import HotspotActivity from "./HotspotActivity.jsx";
import FactsActivity from "./FactsActivity.jsx";
import ShadowSimActivity from "./ShadowSimActivity.jsx";
import StoryActivity from "./StoryActivity.jsx";
import VideoActivity from "./VideoActivity.jsx";
import FindWordActivity from "./FindWordActivity.jsx";
import RandomPromptActivity from "./RandomPromptActivity.jsx";
import NumberBuildActivity from "./NumberBuildActivity.jsx";
import TrueFalseActivity from "./TrueFalseActivity.jsx";
import DragToBlankActivity from "./DragToBlankActivity.jsx";

// لإضافة نوع فعالية جديد: أنشئ مكوّناً جديداً بنفس الواجهة
// { activity, onComplete(points, answer) } وسجّله هنا تحت نوعه.
const REGISTRY = {
  read: ReadActivity,
  memorize: MemorizeActivity,
  mindmap: MindmapActivity,
  match: MatchActivity,
  mcq: McqActivity,
  open: OpenActivity,
  sort: SortActivity,
  wordBuild: WordBuildActivity,
  order: OrderActivity,
  math: MathActivity,
  trilingual: TrilingualActivity,
  draw: DrawActivity,
  outdoor: OutdoorActivity,
  memory: MemoryActivity,
  hotspot: HotspotActivity,
  facts: FactsActivity,
  shadowSim: ShadowSimActivity,
  story: StoryActivity,
  video: VideoActivity,
  findWord: FindWordActivity,
  randomPrompt: RandomPromptActivity,
  numberBuild: NumberBuildActivity,
  trueFalse: TrueFalseActivity,
  dragToBlank: DragToBlankActivity,
};

export default function ActivityRenderer({ activity, onComplete }) {
  const Component = REGISTRY[activity.type];
  if (!Component) {
    return (
      <div className="rounded-2xl border-2 border-dashed border-olive-trunk/40 p-6 text-center text-olive-trunk">
        نوع الفعالية «{activity.type}» غير مدعوم بعد في هذه المرحلة.
      </div>
    );
  }
  return <Component activity={activity} onComplete={onComplete} />;
}
