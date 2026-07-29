import dashboardData from "../data/dashboardData";

import {
  DashboardHero,
  StatsGrid,
  CertificateCard,
  PaymentCard,
  SuggestedAssessments,
  ProfileCard,
} from "../components/dashboard";

const Dashboard = () => {
  return (
    <main className="min-h-screen bg-[#070B1A] px-6 py-10">
      <div className="mx-auto max-w-7xl">

        <DashboardHero hero={dashboardData.hero} />

        <StatsGrid stats={dashboardData.stats} />

        <div className="mt-8 grid gap-6 lg:grid-cols-2">

          <CertificateCard
            certificate={dashboardData.certificate}
          />

          <PaymentCard
            payment={dashboardData.payment}
          />

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