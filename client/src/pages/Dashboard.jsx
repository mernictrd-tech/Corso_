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
import CertificateModal from "../components/common/CertificateTemplates/CertificateCourse";
import { useEffect, useState } from "react";

/* ------------------------------------------------------------------ */
/*  Locked state content (reused on mobile card + desktop overlay)     */
/* ------------------------------------------------------------------ */
const LockedDashboardContent = ({ onStartAssessment, variant = "lg" }) => {
  const isCompact = variant === "sm";

  return (
    <div
      className={
        isCompact
          ? "relative px-5 py-7 text-center"
          : "relative mx-4 max-w-lg text-center"
      }
    >
      {/* Glow — desktop only */}
      {!isCompact && (
        <div className="absolute left-1/2 top-1/2 h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full bg-cyan-400/10 blur-[90px]" />
      )}

      <div className="relative">
        {/* Lock Icon */}
        <div
          className={`mx-auto flex items-center justify-center rounded-2xl border border-cyan-400/25 bg-[#0B1625]/90 shadow-[0_0_35px_rgba(34,211,238,0.15)] ${
            isCompact ? "mb-4 h-12 w-12" : "mb-5 h-16 w-16"
          }`}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width={isCompact ? 22 : 28}
            height={isCompact ? 22 : 28}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-cyan-300"
          >
            <rect width="14" height="11" x="5" y="10" rx="2" />
            <path d="M8 10V7a4 4 0 0 1 8 0v3" />
          </svg>
        </div>

        {/* Badge */}
        <div
          className={`mx-auto inline-flex items-center gap-2 rounded-full border border-cyan-400/20 bg-cyan-400/10 font-medium text-cyan-300 ${
            isCompact
              ? "mb-2.5 px-3 py-1 text-[11px]"
              : "mb-3 px-3 py-1.5 text-xs"
          }`}
        >
          <span className="h-1.5 w-1.5 rounded-full bg-cyan-400" />
          Dashboard Locked
        </div>

        {/* Heading */}
        <h3
          className={`font-bold tracking-tight text-white ${
            isCompact ? "text-lg sm:text-xl" : "text-2xl sm:text-3xl"
          }`}
        >
          Complete an Assessment
          <span className="block bg-gradient-to-r from-cyan-300 to-emerald-300 bg-clip-text text-transparent">
            to Unlock Your Certificate
          </span>
        </h3>

        {/* Description */}
        <p
          className={`mx-auto text-gray-400 ${
            isCompact
              ? "mt-2 max-w-xs text-xs leading-5"
              : "mt-3 max-w-md text-sm leading-6"
          }`}
        >
          Complete and pass a suggested assessment to unlock your certificate
          and dashboard achievements.
        </p>

        {/* Button */}
        <button
          type="button"
          onClick={onStartAssessment}
          className={`group inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-cyan-400 to-emerald-400 font-semibold text-black shadow-lg shadow-cyan-400/20 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-cyan-400/30 ${
            isCompact ? "mt-5 px-5 py-2.5 text-sm" : "mt-6 px-6 py-3"
          }`}
        >
          Start Assessment
        </button>
      </div>
    </div>
  );
};

/* ------------------------------------------------------------------ */
/*  Dashboard                                                          */
/* ------------------------------------------------------------------ */
const Dashboard = () => {
  const navigate = useNavigate();

  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedCertificate, setSelectedCertificate] = useState(null);
  const [showCertificateModal, setShowCertificateModal] = useState(false);

  // Get user from localStorage
  const storedUser = localStorage.getItem("user");

  const initialProfile = storedUser ? JSON.parse(storedUser) : null;

  const [profile, setProfile] = useState(initialProfile);

  // Logout
  const handleLogout = async () => {
    try {
      await api.post("/auth/logout", {}, { withCredentials: true });

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

    localStorage.setItem("user", JSON.stringify(updatedProfile));
  };

  const [certificate, setCertificate] = useState(null);
  const [certificateData, setCertificateData] = useState(null);
  const [loading, setLoading] = useState(true);

  const [cardStatus, setCardStatus] = useState({
    certificates: 0,
    assessments: 0,
    passRate: 0,
    skillsVerified: 0,
  });

  const fetchCertificate = async () => {
    try {
      setLoading(true);

      const response = await api.get("/users/my-certificate", {
        withCredentials: true,
      });

      if (response.data?.success && response.data?.data) {
        const data = response.data.data;

        // Store ALL certificate data
        setCertificateData(data);

        // Get all certificates
        const certificates = data?.certificatesWithAssessments || [];

        // Latest certificate/course
        const latestCertificate = certificates[0] || null;

        console.log("Latest Certificate:", latestCertificate);

        // Store latest certificate
        setCertificate(latestCertificate);
      } else {
        setCertificateData(null);
        setCertificate(null);
      }
    } catch (error) {
      console.error("Error fetching certificate:", error);

      setCertificateData(null);
      setCertificate(null);
    } finally {
      setLoading(false);
    }
  };

  const fetchCardStatus = async () => {
    try {
      const response = await api.get("/users/card-status", {
        withCredentials: true,
      });

      if (response.data?.success) {
        setCardStatus(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching card status:", error);
    }
  };

  useEffect(() => {
    fetchCertificate();
    fetchCardStatus();
  }, []);

  // Format certificates for listing
  const userCertificates =
    certificateData?.certificatesWithAssessments?.length > 0
      ? certificateData.certificatesWithAssessments.map((cert) => {
          const payment = cert.payment;

          return {
            _id: cert._id,
            id: cert._id,

            title: cert.program?.name || "Certification",

            score: cert.score ?? cert.assessment?.score ?? 0,

            certificateId: cert.certificateId,

            skiliumId: cert.skiliumId,

            documentIdentifier: cert.documentIdentifier,

            studentName: cert.studentName || profile?.fullName || "Student",

            issuedOn: cert.issueDate
              ? new Date(cert.issueDate).toLocaleDateString("en-US", {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                })
              : "N/A",

            issueDate: cert.issueDate,

            payment: {
              amount:
                payment?.amount !== undefined && payment?.amount !== null
                  ? `₹${payment.amount}`
                  : "N/A",

              status: payment?.status || "N/A",

              transactionId:
                payment?.razorpayPaymentId || payment?.razorpayOrderId || "N/A",

              orderId: payment?.razorpayOrderId || "N/A",

              date: payment?.paidAt
                ? new Date(payment.paidAt).toLocaleDateString("en-US", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                  })
                : "N/A",

              currency: payment?.currency || "INR",
            },

            assessment: cert.assessment || null,

            program: cert.program || null,
          };
        })
      : [];

  const hasCertificate =
    certificateData?.certificatesWithAssessments?.length > 0;

  const handleViewCertificate = (cert) => {
    setSelectedCertificate(cert || certificate);
    setShowCertificateModal(true);
  };

  // Scroll to suggested assessments
  const scrollToAssessments = () => {
    document.getElementById("suggested-assessments")?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  return (
    <>
      <main className="min-h-screen bg-[#070B1A] px-4 py-6 sm:px-6 sm:py-10">
        <div className="mx-auto max-w-7xl">
          {/* ---------------- Hero ---------------- */}
          <div className="relative overflow-hidden rounded-3xl">
            {/* Unlocked → normal hero */}
            {hasCertificate && (
              <DashboardHero
                hero={dashboardData.hero}
                certificate={certificate}
                profile={profile}
                onViewCertificate={handleViewCertificate}
              />
            )}

            {!hasCertificate && (
              <>
                {/* -------- Desktop / large screens: blurred hero + overlay -------- */}
                <div className="pointer-events-none hidden select-none blur-md lg:block">
                  <DashboardHero
                    hero={dashboardData.hero}
                    certificate={certificate}
                    profile={profile}
                    onViewCertificate={handleViewCertificate}
                  />
                </div>

                {/* Desktop overlay */}
                <div className="absolute inset-0 z-10 hidden items-center justify-center bg-[#050914]/45 backdrop-blur-[2px] lg:flex">
                  <LockedDashboardContent
                    variant="lg"
                    onStartAssessment={scrollToAssessments}
                  />
                </div>

                {/* -------- Mobile / tablet: compact locked card -------- */}
                <div className="relative overflow-hidden border border-cyan-400/15 bg-gradient-to-b from-[#0B1625] to-[#070B1A] lg:hidden">
                  {/* Glow */}
                  <div className="pointer-events-none absolute -top-16 left-1/2 h-40 w-40 -translate-x-1/2 rounded-full bg-cyan-400/10 blur-[70px]" />

                  <LockedDashboardContent
                    variant="sm"
                    onStartAssessment={scrollToAssessments}
                  />
                </div>
              </>
            )}
          </div>

          {/* ---------------- Stats ---------------- */}
          {/* <div className="mt-8">
            <StatsGrid cardStatus={cardStatus} />
          </div> */}

          {/* Profile Section */}
          <div className="mt-8 grid gap-6 md:grid-cols-2 md:items-stretch">
            <div id="suggested-assessments" className="min-w-0 scroll-mt-6">
              <SuggestedAssessments
                assessments={dashboardData.suggestedAssessments}
              />
            </div>

            <div className="min-w-0">
              <ProfileCard
                profile={profile}
                onEdit={() => setShowEditModal(true)}
                onLogout={handleLogout}
              />
            </div>
          </div>

          {/* ---------------- Certificates ---------------- */}
          <div className="mt-8">
            <CertificatesSection
              certificates={userCertificates}
              onViewCertificate={handleViewCertificate}
            />
          </div>
        </div>
      </main>

      {/* Edit Profile Modal */}
      {showEditModal && (
        <EditProfileModal
          profile={profile}
          close={() => setShowEditModal(false)}
          onSuccess={handleProfileUpdate}
        />
      )}

      {/* Certificate Modal */}
      {showCertificateModal && (
        <CertificateModal
          isOpen={showCertificateModal}
          onClose={() => {
            setShowCertificateModal(false);
            setSelectedCertificate(null);
          }}
          certificate={selectedCertificate || certificate}
          userProfile={profile}
        />
      )}
    </>
  );
};

export default Dashboard;
