import { useCallback, useEffect, useState } from "react";

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
          earned: anyComplete,
          hint: "أكمل أي فعالية واحدة في الوحدة.",
          domainId: null,
        },
        {
          emoji: "📖",
          label: "بطل اللغة",
          earned: isDomainComplete("arabic"),
          hint: "أكمل كل فعاليات محطة اللغة العربية.",
          domainId: "arabic",
        },
        {
          emoji: "🔬",
          label: "العالم الصغير",
          earned: isDomainComplete("science"),
          hint: "أكمل كل فعاليات محطة العلوم.",
          domainId: "science",
        },
        {
          emoji: "🔢",
          label: "عبقري الحساب",
          earned: isDomainComplete("math"),
          hint: "أكمل كل فعاليات محطة الرياضيات.",
          domainId: "math",
        },
        {
          emoji: "🕊️",
          label: "سفير السلام",
          earned: isDomainComplete("religion"),
          hint: "أكمل كل فعاليات محطة الدين.",
          domainId: "religion",
        },
        {
          emoji: "🎨",
          label: "الفنان",
          earned: isDomainComplete("arts"),
          hint: "أكمل كل فعاليات محطة الفنون.",
          domainId: "arts",
        },
        {
          emoji: "🎵",
          label: "الموسيقي",
          earned: isDomainComplete("music"),
          hint: "أكمل كل فعاليات محطة الموسيقى.",
          domainId: "music",
        },
        {
          emoji: "🧠",
          label: "المفكر الصغير",
          earned: thinkingCount >= 3,
          hint: `أكمل 3 فعاليات من نوع «تفكير واستنتاج» (حالياً: ${thinkingCount}/3).`,
          domainId: null,
        },
        {
          emoji: "🏆",
          label: "خبير الزيتونة",
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
