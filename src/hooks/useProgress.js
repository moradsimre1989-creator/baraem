import { useCallback, useEffect, useState } from "react";

// صور حقيقية للشارات — الرمز التعبيري وحده يبدو لعبة، والصورة تجعل الإنجاز
// ملموساً ومرتبطاً بمضمون المحطة التي نالها الطالب.
import seedlingPhoto from "../assets/photos/seedling.webp";
import oliveBranchesPhoto from "../assets/photos/olive-branches-sunset.webp";
import oliveRootsPhoto from "../assets/photos/olive-roots.webp";
import oliveCountFourPhoto from "../assets/photos/olive-count-four.webp";
import whiteDovePhoto from "../assets/photos/white-dove.webp";
import olivesCloseupPhoto from "../assets/photos/olives-closeup.webp";
import birdOnBranchPhoto from "../assets/photos/bird-on-branch.webp";
import treeShadePhoto from "../assets/photos/tree-shade.webp";
import oliveTreeFullPhoto from "../assets/photos/olive-tree-full.webp";

const STORAGE_KEY = "zaytouna-progress-v1";

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch {
    // ignore corrupt storage
  }
  return { activityResults: {}, summaries: {} };
}

export function useProgress() {
  const [state, setState] = useState(loadState);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  const completeActivity = useCallback((activityId, points, answer) => {
    setState((prev) => ({
      ...prev,
      activityResults: {
        ...prev.activityResults,
        [activityId]: { completed: true, points, answer, at: Date.now() },
      },
    }));
  }, []);

  const isActivityComplete = useCallback(
    (activityId) => Boolean(state.activityResults[activityId]?.completed),
    [state.activityResults]
  );

  const getDomainProgress = useCallback(
    (domain) => {
      const total = domain.activities.length;
      if (total === 0) return { done: 0, total: 0, ratio: 0 };
      const done = domain.activities.filter((a) => isActivityComplete(a.id)).length;
      return { done, total, ratio: done / total };
    },
    [isActivityComplete]
  );

  const totalPoints = Object.values(state.activityResults).reduce(
    (sum, r) => sum + (r.points || 0),
    0
  );

  const getBadges = useCallback(
    (unit) => {
      const isDomainComplete = (domainId) => {
        const domain = unit.domains.find((d) => d.id === domainId);
        if (!domain || domain.activities.length === 0) return false;
        return domain.activities.every((a) => isActivityComplete(a.id));
      };
      const anyComplete = Object.values(state.activityResults).some((r) => r.completed);
      const thinkingCount = unit.domains
        .flatMap((d) => d.activities)
        .filter((a) => a.skill === "تفكير واستنتاج" && isActivityComplete(a.id)).length;
      const allComplete = unit.domains.every(
        (d) => d.activities.length > 0 && d.activities.every((a) => isActivityComplete(a.id))
      );

      return [
        {
          emoji: "🌱",
          label: "مستكشف الزيتونة",
          photo: seedlingPhoto,
          earned: anyComplete,
          hint: "أكمل أي فعالية واحدة في الوحدة.",
          domainId: null,
        },
        {
          emoji: "📖",
          label: "بطل اللغة",
          photo: oliveBranchesPhoto,
          earned: isDomainComplete("arabic"),
          hint: "أكمل كل فعاليات محطة اللغة العربية.",
          domainId: "arabic",
        },
        {
          emoji: "🔬",
          label: "العالم الصغير",
          photo: oliveRootsPhoto,
          earned: isDomainComplete("science"),
          hint: "أكمل كل فعاليات محطة العلوم.",
          domainId: "science",
        },
        {
          emoji: "🔢",
          label: "عبقري الحساب",
          photo: oliveCountFourPhoto,
          earned: isDomainComplete("math"),
          hint: "أكمل كل فعاليات محطة الرياضيات.",
          domainId: "math",
        },
        {
          emoji: "🕊️",
          label: "سفير السلام",
          photo: whiteDovePhoto,
          earned: isDomainComplete("religion"),
          hint: "أكمل كل فعاليات محطة الدين.",
          domainId: "religion",
        },
        {
          emoji: "🎨",
          label: "الفنان",
          photo: olivesCloseupPhoto,
          earned: isDomainComplete("arts"),
          hint: "أكمل كل فعاليات محطة الفنون.",
          domainId: "arts",
        },
        {
          emoji: "🎵",
          label: "الموسيقي",
          photo: birdOnBranchPhoto,
          earned: isDomainComplete("music"),
          hint: "أكمل كل فعاليات محطة الموسيقى.",
          domainId: "music",
        },
        {
          emoji: "🧠",
          label: "المفكر الصغير",
          photo: treeShadePhoto,
          earned: thinkingCount >= 3,
          hint: `أكمل 3 فعاليات من نوع «تفكير واستنتاج» (حالياً: ${thinkingCount}/3).`,
          domainId: null,
        },
        {
          emoji: "🏆",
          label: "خبير الزيتونة",
          photo: oliveTreeFullPhoto,
          earned: allComplete,
          hint: "أكمل كل فعاليات كل المحطات في الوحدة بأكملها.",
          domainId: null,
        },
      ];
    },
    [state.activityResults, isActivityComplete]
  );

  const resetProgress = useCallback(() => {
    setState({ activityResults: {}, summaries: {} });
  }, []);

  const saveSummary = useCallback((domainId, summary) => {
    setState((prev) => ({
      ...prev,
      summaries: { ...prev.summaries, [domainId]: summary },
    }));
  }, []);

  const saveExitTicket = useCallback((exitTicket) => {
    setState((prev) => ({ ...prev, exitTicket }));
  }, []);

  return {
    activityResults: state.activityResults,
    summaries: state.summaries || {},
    exitTicket: state.exitTicket || null,
    completeActivity,
    isActivityComplete,
    getDomainProgress,
    getBadges,
    totalPoints,
    resetProgress,
    saveSummary,
    saveExitTicket,
  };
}
