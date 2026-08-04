import dashboardData from "../data/dashboardData";

import {
  DashboardHero,
  StatsGrid,
  CertificatesSection,
  SuggestedAssessments,
  ProfileCard,
} from "../components/dashboard";

const Dashboard = () => {
  return (
    <main className="min-h-screen bg-[#070B1A] px-6 py-10">
      <div className="mx-auto max-w-7xl">

        {/* Hero */}
        <DashboardHero hero={dashboardData.hero} />

        {/* Stats */}
        <div className="mt-8">
          <StatsGrid stats={dashboardData.stats} />
        </div>

        {/* Full Width Certificates */}
        <div className="mt-8">
          <CertificatesSection
            certificates={dashboardData.certificates}
          />
        </div>

        {/* Bottom Section */}
        <div className="mt-8 grid gap-6 lg:grid-cols-2">

          <SuggestedAssessments
            assessments={dashboardData.suggestedAssessments}
          />

          <ProfileCard
            profile={dashboardData.profile}
          />

        </div>

      </div>
    </main>
  );
};

export default Dashboard;