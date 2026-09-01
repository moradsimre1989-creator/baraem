import { useEffect, useState } from "react";
import AppShell from "./components/AppShell.jsx";
import PlatformHome from "./components/PlatformHome.jsx";
import StationScreen from "./components/StationScreen.jsx";
import ArabicJourneyScreen from "./components/ArabicJourneyScreen.jsx";
import MathJourneyScreen from "./components/MathJourneyScreen.jsx";
import ScienceLabScreen from "./components/ScienceLabScreen.jsx";
import GroupJourneyScreen from "./components/GroupJourneyScreen.jsx";
import ActivityScreen from "./components/ActivityScreen.jsx";
import SummaryScreen from "./components/SummaryScreen.jsx";
import PedagogicalMapScreen from "./components/PedagogicalMapScreen.jsx";
import DiscussionScreen from "./components/DiscussionScreen.jsx";
import TeacherModeScreen from "./components/TeacherModeScreen.jsx";
import SpeedChallengeScreen from "./components/SpeedChallengeScreen.jsx";
import ExitTicketScreen from "./components/ExitTicketScreen.jsx";
import CertificateScreen from "./components/CertificateScreen.jsx";
import TeacherAssistant from "./components/TeacherAssistant.jsx";
import GradePicker from "./components/GradePicker.jsx";
import ZaytounaPathScreen from "./components/ZaytounaPathScreen.jsx";
import PathStationScreen from "./components/PathStationScreen.jsx";
import { useProgress } from "./hooks/useProgress.js";
import { useGrade } from "./context/GradeContext.jsx";
import { platform } from "./data/platform.js";
import { zaytounaPath } from "./data/units/zaytounaPath.js";

const HOME_NAV = { screen: "home" };
const defaultSubject = platform.subjects[0];
const defaultUnit = defaultSubject?.units[0];

/**
 * يفكّ التنقّل إلى كائناته، ويصفّي الأنشطة المعروضة بحسب الصف المختار.
 * النشاط المفتوح مباشرة يُبحث عنه في القائمة غير المصفّاة، حتى لا ينكسر رابط
 * محفوظ لنشاط خاص بالصف الآخر.
 */
function resolveNav(nav, filterActivities) {
  const subject = nav.subjectId ? platform.subjects.find((s) => s.id === nav.subjectId) : null;
  const rawUnit = nav.unitId ? subject?.units.find((u) => u.id === nav.unitId) : null;
  const unit = rawUnit
    ? {
        ...rawUnit,
        domains: rawUnit.domains.map((d) => ({ ...d, activities: filterActivities(d.activities) })),
      }
    : null;
  const rawDomain = nav.domainId ? rawUnit?.domains.find((d) => d.id === nav.domainId) : null;
  const domain = nav.domainId ? unit?.domains.find((d) => d.id === nav.domainId) : null;
  const activity = nav.activityId ? rawDomain?.activities.find((a) => a.id === nav.activityId) : null;
  return { subject, unit, rawUnit, domain, activity };
}

export default function App() {
  const progress = useProgress();
  const { hasChosen, filterActivities } = useGrade();
  const [nav, setNav] = useState(HOME_NAV);

  // يجعل زر الرجوع الفعلي في المتصفح (وإيماءة الرجوع على الهاتف) يتنقّل داخل التطبيق
  // بدل الخروج منه، عبر مزامنة كل خطوة تنقّل مع History API.
  useEffect(() => {
    window.history.replaceState(HOME_NAV, "");
    const onPopState = (e) => setNav(e.state || HOME_NAV);
    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, []);

  const navigate = (nextNav) => {
    window.history.pushState(nextNav, "");
    setNav(nextNav);
  };

  const goToHome = () => navigate(HOME_NAV);
  // الرجوع من نشاط يعيد الطالب إلى المكان الذي فتحه منه: محطة المسار الموضوعي
  // إن جاء من هناك، وإلا محطة المادة كالسابق.
  const goToStation = () =>
    nav.pathStationId
      ? navigate({
          screen: "pathStation",
          subjectId: nav.subjectId,
          unitId: nav.unitId,
          pathStationId: nav.pathStationId,
        })
      : navigate({
          screen: "station",
          subjectId: nav.subjectId,
          unitId: nav.unitId,
          domainId: nav.domainId,
          groupId: nav.groupId,
          mathGrade: nav.mathGrade,
        });

  const goToPath = () =>
    navigate({ screen: "path", subjectId: nav.subjectId ?? defaultSubject.id, unitId: nav.unitId ?? defaultUnit.id });

  const handleShellNav = (key) => {
    if (key === "home") return goToHome();
    if (key === "path" || key === "map")
      return navigate({ screen: "path", subjectId: defaultSubject.id, unitId: defaultUnit.id });
    if (key === "challenge")
      return navigate({ screen: "challenge", subjectId: defaultSubject.id, unitId: defaultUnit.id });
    if (key === "achievements")
      return navigate({ screen: "certificate", subjectId: defaultSubject.id, unitId: defaultUnit.id });
  };

  const activeShellKey =
    nav.screen === "home"
      ? "home"
      : nav.screen === "path" || nav.screen === "pathStation"
        ? "path"
        : nav.screen === "challenge"
          ? "challenge"
          : nav.screen === "certificate"
            ? "achievements"
            : "path";

  const {
    unit: activeUnit,
    rawUnit: activeRawUnit,
    domain: activeDomain,
    activity: activeActivity,
  } = resolveNav(nav, filterActivities);

  const pathStation = nav.pathStationId
    ? zaytounaPath.stations.find((s) => s.id === nav.pathStationId)
    : null;

  let content;
  let topBarProps = { backLabel: null, onBack: null };

  if (nav.screen === "path" && activeRawUnit && activeUnit) {
    topBarProps = {
      backLabel: "الرئيسية",
      onBack: goToHome,
      totalPoints: progress.totalPoints,
      onResetProgress: progress.resetProgress,
      onOpenPedagogy: () => navigate({ ...nav, screen: "pedagogy" }),
      onOpenDiscussion: () => navigate({ ...nav, screen: "discussion" }),
      onOpenTeacherMode: () => navigate({ ...nav, screen: "teacherMode" }),
      onOpenChallenge: () => navigate({ ...nav, screen: "challenge" }),
      onOpenExitTicket: () => navigate({ ...nav, screen: "exitTicket" }),
      onOpenCertificate: () => navigate({ ...nav, screen: "certificate" }),
    };
    content = (
      <ZaytounaPathScreen
        unit={activeRawUnit}
        isActivityComplete={progress.isActivityComplete}
        badges={progress.getBadges(activeUnit)}
        onOpenDomainById={(domainId) => navigate({ ...nav, screen: "path", filterDomainId: domainId })}
        onOpenStation={(station, filterDomainId) =>
          navigate({ ...nav, screen: "pathStation", pathStationId: station.id, filterDomainId })
        }
      />
    );
  } else if (nav.screen === "pathStation" && activeRawUnit && pathStation) {
    const index = zaytounaPath.stations.findIndex((s) => s.id === pathStation.id);
    topBarProps = {
      backLabel: "مسار الزيتونة",
      onBack: goToPath,
      totalPoints: progress.totalPoints,
    };
    content = (
      <PathStationScreen
        unit={activeRawUnit}
        station={pathStation}
        filterDomainId={nav.filterDomainId}
        nextStation={zaytounaPath.stations[index + 1] ?? null}
        isActivityComplete={progress.isActivityComplete}
        onOpenActivity={(domain, activity) =>
          navigate({
            ...nav,
            screen: "activity",
            domainId: domain.id,
            activityId: activity.id,
            pathStationId: pathStation.id,
          })
        }
        onNextStation={(station) => navigate({ ...nav, pathStationId: station.id })}
      />
    );
  } else if (nav.screen === "station" && activeDomain && activeDomain.id === "arabic" && !nav.groupId) {
    topBarProps = { backLabel: "المسار", onBack: goToPath, totalPoints: progress.totalPoints };
    content = (
      <ArabicJourneyScreen
        domain={activeDomain}
        isActivityComplete={progress.isActivityComplete}
        onOpenGroup={(group) => navigate({ ...nav, groupId: group.id })}
        onOpenCertificate={() => navigate({ screen: "certificate", subjectId: nav.subjectId, unitId: nav.unitId })}
      />
    );
  } else if (nav.screen === "station" && activeDomain && activeDomain.id === "arabic" && nav.groupId) {
    const group = activeDomain.groups.find((g) => g.id === nav.groupId);
    const groupDomain = {
      ...activeDomain,
      title: group.title,
      icon: group.icon,
      objectives: [group.description],
      activities: group.activities.map((id) => activeDomain.activities.find((a) => a.id === id)),
    };
    topBarProps = {
      backLabel: activeDomain.title,
      onBack: () => navigate({ screen: "station", subjectId: nav.subjectId, unitId: nav.unitId, domainId: nav.domainId }),
      totalPoints: progress.totalPoints,
    };
    content = (
      <StationScreen
        domain={groupDomain}
        isActivityComplete={progress.isActivityComplete}
        onOpenActivity={(activity) => navigate({ ...nav, screen: "activity", activityId: activity.id })}
        onOpenSummary={() => navigate({ ...nav, screen: "summary" })}
      />
    );
  } else if (nav.screen === "station" && activeDomain && activeDomain.id === "math" && !nav.groupId) {
    topBarProps = { backLabel: "المسار", onBack: goToPath, totalPoints: progress.totalPoints };
    content = (
      <MathJourneyScreen
        domain={activeDomain}
        isActivityComplete={progress.isActivityComplete}
        onOpenGroup={(group, grade) => navigate({ ...nav, groupId: group.id, mathGrade: grade })}
        onOpenCertificate={() => navigate({ screen: "certificate", subjectId: nav.subjectId, unitId: nav.unitId })}
      />
    );
  } else if (nav.screen === "station" && activeDomain && activeDomain.id === "math" && nav.groupId) {
    const grade = nav.mathGrade || 2;
    const group = activeDomain.groups.find((g) => g.id === nav.groupId);
    const groupDomain = {
      ...activeDomain,
      title: `${group.title} — ${grade === 2 ? "الصف الثاني" : "الصف الثالث"}`,
      icon: group.icon,
      objectives: [group.description],
      activities: group.activities
        .map((id) => activeDomain.activities.find((a) => a.id === id))
        .filter((a) => a && (!a.grade || a.grade === grade)),
    };
    topBarProps = {
      backLabel: activeDomain.title,
      onBack: () =>
        navigate({ screen: "station", subjectId: nav.subjectId, unitId: nav.unitId, domainId: nav.domainId }),
      totalPoints: progress.totalPoints,
    };
    content = (
      <StationScreen
        domain={groupDomain}
        isActivityComplete={progress.isActivityComplete}
        onOpenActivity={(activity) => navigate({ ...nav, screen: "activity", activityId: activity.id })}
        onOpenSummary={() => navigate({ ...nav, screen: "summary" })}
      />
    );
  } else if (nav.screen === "station" && activeDomain && activeDomain.id === "science" && !nav.groupId) {
    topBarProps = { backLabel: "المسار", onBack: goToPath, totalPoints: progress.totalPoints };
    content = (
      <ScienceLabScreen
        domain={activeDomain}
        isActivityComplete={progress.isActivityComplete}
        onOpenGroup={(group) => navigate({ ...nav, groupId: group.id })}
        onOpenCertificate={() => navigate({ screen: "certificate", subjectId: nav.subjectId, unitId: nav.unitId })}
      />
    );
  } else if (nav.screen === "station" && activeDomain && activeDomain.id === "science" && nav.groupId) {
    const group = activeDomain.groups.find((g) => g.id === nav.groupId);
    const groupDomain = {
      ...activeDomain,
      title: group.title,
      icon: group.icon,
      objectives: [group.description],
      activities: group.activities.map((id) => activeDomain.activities.find((a) => a.id === id)),
    };
    topBarProps = {
      backLabel: activeDomain.title,
      onBack: () => navigate({ screen: "station", subjectId: nav.subjectId, unitId: nav.unitId, domainId: nav.domainId }),
      totalPoints: progress.totalPoints,
    };
    content = (
      <StationScreen
        domain={groupDomain}
        isActivityComplete={progress.isActivityComplete}
        onOpenActivity={(activity) => navigate({ ...nav, screen: "activity", activityId: activity.id })}
        onOpenSummary={() => navigate({ ...nav, screen: "summary" })}
      />
    );
  } else if (nav.screen === "station" && activeDomain && activeDomain.groups && !nav.groupId) {
    topBarProps = { backLabel: "المسار", onBack: goToPath, totalPoints: progress.totalPoints };
    content = (
      <GroupJourneyScreen
        domain={activeDomain}
        subtitle={activeDomain.objectives?.[0]}
        isActivityComplete={progress.isActivityComplete}
        onOpenGroup={(group) => navigate({ ...nav, groupId: group.id })}
        onOpenCertificate={() => navigate({ screen: "certificate", subjectId: nav.subjectId, unitId: nav.unitId })}
      />
    );
  } else if (nav.screen === "station" && activeDomain && activeDomain.groups && nav.groupId) {
    const group = activeDomain.groups.find((g) => g.id === nav.groupId);
    const groupDomain = {
      ...activeDomain,
      title: group.title,
      icon: group.icon,
      objectives: [group.description],
      activities: group.activities.map((id) => activeDomain.activities.find((a) => a.id === id)),
    };
    topBarProps = {
      backLabel: activeDomain.title,
      onBack: () => navigate({ screen: "station", subjectId: nav.subjectId, unitId: nav.unitId, domainId: nav.domainId }),
      totalPoints: progress.totalPoints,
    };
    content = (
      <StationScreen
        domain={groupDomain}
        isActivityComplete={progress.isActivityComplete}
        onOpenActivity={(activity) => navigate({ ...nav, screen: "activity", activityId: activity.id })}
        onOpenSummary={() => navigate({ ...nav, screen: "summary" })}
      />
    );
  } else if (nav.screen === "station" && activeDomain) {
    topBarProps = { backLabel: "المسار", onBack: goToPath, totalPoints: progress.totalPoints };
    content = (
      <StationScreen
        domain={activeDomain}
        isActivityComplete={progress.isActivityComplete}
        onOpenActivity={(activity) => navigate({ ...nav, screen: "activity", activityId: activity.id })}
        onOpenSummary={() => navigate({ ...nav, screen: "summary" })}
      />
    );
  } else if (nav.screen === "activity" && activeActivity && activeDomain) {
    topBarProps = {
      backLabel: pathStation ? pathStation.title : activeDomain.title,
      onBack: goToStation,
      totalPoints: progress.totalPoints,
    };
    content = (
      <ActivityScreen
        activity={activeActivity}
        domain={activeDomain}
        isComplete={progress.isActivityComplete(activeActivity.id)}
        onComplete={(points, answer) => progress.completeActivity(activeActivity.id, points, answer)}
        onBack={goToStation}
      />
    );
  } else if (nav.screen === "summary" && activeDomain) {
    topBarProps = { backLabel: activeDomain.title, onBack: goToStation, totalPoints: progress.totalPoints };
    content = (
      <SummaryScreen
        domain={activeDomain}
        existing={progress.summaries[activeDomain.id]}
        onSave={(summary) => progress.saveSummary(activeDomain.id, summary)}
      />
    );
  } else if (nav.screen === "pedagogy") {
    topBarProps = { backLabel: "المسار", onBack: goToPath, totalPoints: progress.totalPoints };
    content = <PedagogicalMapScreen />;
  } else if (nav.screen === "discussion") {
    topBarProps = { backLabel: "المسار", onBack: goToPath, totalPoints: progress.totalPoints };
    content = <DiscussionScreen />;
  } else if (nav.screen === "teacherMode") {
    topBarProps = { backLabel: "المسار", onBack: goToPath, totalPoints: progress.totalPoints };
    content = <TeacherModeScreen />;
  } else if (nav.screen === "challenge") {
    topBarProps = { backLabel: "المسار", onBack: goToPath, totalPoints: progress.totalPoints };
    content = <SpeedChallengeScreen />;
  } else if (nav.screen === "exitTicket") {
    topBarProps = { backLabel: "المسار", onBack: goToPath, totalPoints: progress.totalPoints };
    content = <ExitTicketScreen existing={progress.exitTicket} onSave={progress.saveExitTicket} />;
  } else if (nav.screen === "certificate" && activeUnit) {
    topBarProps = { backLabel: "المسار", onBack: goToPath, totalPoints: progress.totalPoints };
    content = <CertificateScreen unit={activeUnit} totalPoints={progress.totalPoints} />;
  } else {
    content = (
      <PlatformHome
        unit={defaultUnit}
        progress={progress}
        onOpenMap={() => navigate({ screen: "path", subjectId: defaultSubject.id, unitId: defaultUnit.id })}
        onOpenActivity={(domain, activity) =>
          navigate({
            screen: "activity",
            subjectId: defaultSubject.id,
            unitId: defaultUnit.id,
            domainId: domain.id,
            activityId: activity.id,
          })
        }
      />
    );
  }

  // بوابة اختيار الصف: تُعرض مرة واحدة في أول زيارة، ثم يُحفظ الاختيار محلياً.
  if (!hasChosen) {
    return <GradePicker onChosen={() => setNav(HOME_NAV)} />;
  }

  return (
    <AppShell activeKey={activeShellKey} onNavigate={handleShellNav} {...topBarProps}>
      {content}
      <TeacherAssistant />
    </AppShell>
  );
}
