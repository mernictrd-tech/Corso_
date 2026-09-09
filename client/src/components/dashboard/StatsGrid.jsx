import {
  Award,
  FileCheck,
  TrendingUp,
  BadgeCheck,
} from "lucide-react";

import StatsCard from "./StatsCard";

const StatsGrid = ({ cardStatus }) => {
  return (
    <section className="mt-8 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
 
      <StatsCard
        title="Certificates"
        value={cardStatus?.certificates || 0}
        icon={Award}
        iconColor="bg-cyan-500"
      />

      <StatsCard
        title="Assessments"
        value={cardStatus?.assessments || 0}
        icon={FileCheck}
        iconColor="bg-emerald-500"
      />

      <StatsCard
        title="Pass Rate"
        value={cardStatus?.passRate || "0%"}
        icon={TrendingUp}
        iconColor="bg-violet-500"
      />

    </section>
  );
};
 
export default StatsGrid;