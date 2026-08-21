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

const Dashboard = () => {
  const navigate = useNavigate();

  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedCertificate, setSelectedCertificate] = useState(null);
  const [showCertificateModal, setShowCertificateModal] = useState(false);

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
  // const userCertificates =
  //   certificateData?.certificatesWithAssessments?.length > 0
  //     ? certificateData.certificatesWithAssessments.map((cert) => ({
  //         _id: cert._id,
  //         id: cert._id,
  //         title: cert.program?.name || "Certification",
  //         score: cert.score || cert.assessment?.score || 92,
  //         certificateId: cert.certificateId || "CRS-2026-001",
  //         corsoId: cert.corsoId,
  //         documentIdentifier: cert.documentIdentifier,
  //         studentName: cert.studentName || profile?.fullName || "Student",
  //         issuedOn: cert.issueDate
  //           ? new Date(cert.issueDate).toLocaleDateString("en-US", {
  //               day: "2-digit",
  //               month: "short",
  //               year: "numeric",
  //             })
  //           : "29 Jul 2026",
  //         issueDate: cert.issueDate,
  //         payment: {
  //           amount: "₹249",
  //           status: "Paid",
  //           transactionId: cert.documentIdentifier || "TXN78451236",
  //           date: cert.issueDate
  //             ? new Date(cert.issueDate).toLocaleDateString("en-US", {
  //                 day: "2-digit",
  //                 month: "short",
  //                 year: "numeric",
  //               })
  //             : "29 Jul 2026",
  //         },
  //         program: cert.program,
  //       }))
  //     : dashboardData.certificates.map((cert) => ({
  //         ...cert,
  //         studentName: profile?.fullName || "Student",
  //       }));
  // Format certificates for listing
const userCertificates =
  certificateData?.certificatesWithAssessments?.length > 0
    ? certificateData.certificatesWithAssessments.map((cert) => {
        // Get payment for this certificate
        const payment = cert.payment;

        return {
          _id: cert._id,
          id: cert._id,

          title: cert.program?.name || "Certification",

          score:
            cert.score ??
            cert.assessment?.score ??
            92,

          certificateId:
            cert.certificateId || "CRS-2026-001",

          corsoId: cert.corsoId,

          documentIdentifier: cert.documentIdentifier,

          studentName:
            cert.studentName ||
            profile?.fullName ||
            "Student",

          issuedOn: cert.issueDate
            ? new Date(cert.issueDate).toLocaleDateString("en-US", {
                day: "2-digit",
                month: "short",
                year: "numeric",
              })
            : "N/A",

          issueDate: cert.issueDate,

          // Actual payment data from MongoDB
          payment: {
            amount:
              payment?.amount !== undefined &&
              payment?.amount !== null
                ? `₹${payment.amount}`
                : "N/A",

            status:
              payment?.status || "N/A",

            transactionId:
              payment?.razorpayPaymentId ||
              payment?.razorpayOrderId ||
              "N/A",

            orderId:
              payment?.razorpayOrderId || "N/A",

            date: payment?.paidAt
              ? new Date(payment.paidAt).toLocaleDateString("en-US", {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                })
              : "N/A",

            currency:
              payment?.currency || "INR",
          },

          // Keep assessment/program data
          assessment: cert.assessment || null,

          program: cert.program || null,
        };
      })
    : dashboardData.certificates.map((cert) => ({
        ...cert,
        studentName: profile?.fullName || "Student",
      }));

  const handleViewCertificate = (cert) => {
    setSelectedCertificate(cert || certificate);
    setShowCertificateModal(true);
  };
  
  

  return (
    <>
      <main className="min-h-screen bg-[#070B1A] px-4 py-6 sm:px-6 sm:py-10">
        <div className="mx-auto max-w-7xl">
          {/* Hero */}
          <DashboardHero
            hero={dashboardData.hero}
            certificate={certificate}
            profile={profile}
            onViewCertificate={handleViewCertificate}
          />

          {/* Stats */}
          <div className="mt-8">
            {/* <StatsGrid stats={dashboardData.stats} /> */}
             <StatsGrid cardStatus={cardStatus} />
          </div>

          {/* Profile Section */}
          <div className="mt-8 grid gap-6 md:grid-cols-2">
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
          close={() =>
            setShowEditModal(false)
          }
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
