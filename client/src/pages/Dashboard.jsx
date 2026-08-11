import dashboardData from "../data/dashboardData";

import {
  DashboardHero,
  StatsGrid,
  CertificatesSection,
  SuggestedAssessments,
  ProfileCard,
} from "../components/dashboard";

import api from "../services/api";
import { useNavigate } from "react-router-dom";
import EditProfileModal from "../components/auth/EditProfileModal";
import { useState } from "react";

const Dashboard = () => {
  const navigate = useNavigate();

  const [showEditModal, setShowEditModal] = useState(false);

  // Get user from localStorage
  const storedUser = localStorage.getItem("user");

  const initialProfile = storedUser
    ? JSON.parse(storedUser)
    : null;

  const [profile, setProfile] = useState(initialProfile);

  // Logout
  const handleLogout = async () => {
    try {
      await api.post(
        "/auth/logout",
        {},
        {
          withCredentials: true,
        }
      );

      localStorage.removeItem("user");

      navigate("/");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  // Profile updated
  const handleProfileUpdate = (updatedProfile) => {
    console.log("UPDATED PROFILE:", updatedProfile);

    setProfile(updatedProfile);

    localStorage.setItem(
      "user",
      JSON.stringify(updatedProfile)
    );
  };

  return (
    <>
      <main className="min-h-screen bg-[#070B1A] px-6 py-10">
        <div className="mx-auto max-w-7xl">
          {/* Hero */}
          <DashboardHero hero={dashboardData.hero} />

          {/* Stats */}
          <div className="mt-8">
            <StatsGrid stats={dashboardData.stats} />
          </div>

          {/* Profile Section */}
          <div className="mt-8 grid gap-6 lg:grid-cols-2">
            <SuggestedAssessments
              assessments={
                dashboardData.suggestedAssessments
              }
            />

            <ProfileCard
              profile={profile}
              onEdit={() =>
                setShowEditModal(true)
              }
              onLogout={handleLogout}
            />
          </div>

          {/* Certificates */}
          <div className="mt-8">
            <CertificatesSection
              certificates={
                dashboardData.certificates
              }
            />
          </div>
        </div>
      </main>

      {/* Edit Profile Modal */}
      {showEditModal && (
        <EditProfileModal
          profile={profile}
          close={() =>
            setShowEditModal(false)
          }
          onSuccess={handleProfileUpdate}
        />
      )}
    </>
  );
};

export default Dashboard;