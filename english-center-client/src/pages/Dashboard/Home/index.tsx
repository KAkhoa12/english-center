import {
  ActivityFeed,
  AssignmentsPanel,
  CourseProgress,
  DashboardHero,
  StatsOverview,
  TodaySchedule,
} from "@/pages/Dashboard/Home/components";

export const DashboardHomePage = () => {
  return (
    <div className="space-y-6">
      <DashboardHero />
      <StatsOverview />
      <div className="grid gap-6 xl:grid-cols-[1.35fr_0.9fr]">
        <TodaySchedule />
        <CourseProgress />
      </div>
      <div className="grid gap-6 xl:grid-cols-2">
        <AssignmentsPanel />
        <ActivityFeed />
      </div>
    </div>
  );
};

export default DashboardHomePage;
