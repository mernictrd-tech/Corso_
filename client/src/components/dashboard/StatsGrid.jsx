import {
  Award,
  FileCheck,
  TrendingUp,
  BadgeCheck,
} from "lucide-react";

import StatsCard from "./StatsCard";

const StatsGrid = ({ stats }) => {
  return (
    <section className="mt-8 grid gap-6 md:grid-cols-2 xl:grid-cols-4">

      <StatsCard
        title="Certificates"
        value={stats.certificates}
        icon={Award}
        iconColor="bg-cyan-500"
      />

      <StatsCard
        title="Assessments"
        value={stats.assessments}
        icon={FileCheck}
        iconColor="bg-emerald-500"
      />

      <StatsCard
        title="Pass Rate"
        value={stats.passRate}
        icon={TrendingUp}
        iconColor="bg-violet-500"
      />

      <StatsCard
        title="Skills Verified"
        value={stats.skillsVerified}
        icon={BadgeCheck}
        iconColor="bg-orange-500"
      />

    </section>
  );
};

export default StatsGrid;