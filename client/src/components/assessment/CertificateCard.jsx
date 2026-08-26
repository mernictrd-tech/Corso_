import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Award,
  Download,
  Eye,
  CheckCircle,
  Copy,
  Check,
  Calendar,
  Sparkles,
  ShieldCheck,
  ArrowRight,
  RotateCcw,
  BookOpen,
} from "lucide-react";
import toast from "react-hot-toast";
import { downloadCertificate } from "../../utils/downloadCertificate";
import CertificateModal from "../common/CertificateTemplates/CertificateCourse";
import certificateTemplate from "../../assets/images/certificate.png";

const CertificateCard = ({ certificate, program, courseId, onViewCertificate }) => {
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [copiedId, setCopiedId] = useState(false);

  // Student Name
  const studentName =
    certificate?.studentName ||
    certificate?.user?.fullName ||
    certificate?.name ||
    "Student";

  // Program / Course Name
  const programName =
    certificate?.program?.name ||
    certificate?.programName ||
    certificate?.title ||
    program?.name ||
    "React.js";

  // Certificate ID
  const certificateId =
    certificate?.certificateId ||
    certificate?.id ||
    `CRS-${String(certificate?._id || "2026").slice(-6).toUpperCase()}`;

  // Corso ID
  const corsoId =
    certificate?.corsoId ||
    `CRSO-${String(certificateId).replace(/[^a-zA-Z0-9]/g, "") || "2026"}`;

  // Document Identifier
  const documentIdentifier =
    certificate?.documentIdentifier ||
    `DOC-${String(certificate?._id || certificateId).slice(-8).toUpperCase() || "9842104"}`;

  // Score
  const score =
    certificate?.score ??
    certificate?.assessment?.score ??
    100;

  // Issue Date
  const rawDate =
    certificate?.issueDate ||
    certificate?.createdAt ||
    certificate?.issuedOn ||
    new Date();

  const formattedDate = (() => {
    try {
      const d = new Date(rawDate);
      if (isNaN(d.getTime())) return String(rawDate);
      return d.toLocaleDateString("en-US", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      });
    } catch {
      return "29 Jul 2026";
    }
  })();

  // Handle Copy ID
  const handleCopyId = () => {
    navigator.clipboard.writeText(certificateId);
    setCopiedId(true);
    toast.success("Certificate ID copied to clipboard!");
    setTimeout(() => setCopiedId(false), 2000);
  };

  // Handle Direct Download
  const handleDownload = async () => {
    if (downloading) return;
    setDownloading(true);
    try {
      await downloadCertificate(
        {
          studentName,
          programName,
          certificateId,
          score,
          issueDate: rawDate,
          corsoId,
          documentIdentifier,
          ...certificate,
        },
        { fullName: studentName }
      );
    } finally {
      setDownloading(false);
    }
  };

  // Handle View
  const handleView = () => {
    if (onViewCertificate) {
      onViewCertificate(certificate);
    } else {
      setShowModal(true);
    }
  };

  return (
    <div className="w-full">
      {/* ── Top Celebration Hero ─────────────────────────────── */}
      <div className="relative overflow-hidden rounded-3xl border border-cyan-400/20 bg-gradient-to-br from-cyan-950/40 via-slate-900 to-emerald-950/30 p-6 sm:p-10 shadow-[0_0_60px_rgba(6,182,212,0.15)]">
        {/* Glow orbs */}
        <div className="absolute -top-24 -right-24 h-64 w-64 rounded-full bg-cyan-400/15 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-20 h-64 w-64 rounded-full bg-emerald-400/15 blur-3xl pointer-events-none" />

        <div className="relative">
          {/* Header pill */}
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-400/30 bg-emerald-500/10 px-4 py-1.5 text-xs sm:text-sm font-semibold text-emerald-400">
              <CheckCircle size={16} />
              <span>Assessment Passed & Verified</span>
            </div>

            <div className="inline-flex items-center gap-1.5 rounded-full border border-cyan-400/20 bg-cyan-500/10 px-3.5 py-1 text-xs font-mono text-cyan-300">
              <ShieldCheck size={14} className="text-cyan-400" />
              <span>ID: {certificateId}</span>
            </div>
          </div>

          {/* Heading */}
          <div className="mt-6">
            <h1 className="text-2xl sm:text-4xl font-bold tracking-tight text-white">
              Official Certification Achieved! 
            </h1>
            <p className="mt-2 text-sm sm:text-base text-gray-300 max-w-2xl">
              Congratulations <span className="font-semibold text-cyan-300">{studentName}</span>! You have successfully demonstrated your technical proficiency in <span className="font-semibold text-white">{programName}</span>. Your certificate has been verified and registered.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="mt-8 flex flex-wrap items-center gap-3 sm:gap-4">
            <button
              onClick={handleDownload}
              disabled={downloading}
              className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-cyan-400 to-emerald-400 px-6 py-3.5 text-sm sm:text-base font-bold text-slate-950 transition-all hover:scale-105 hover:shadow-[0_0_25px_rgba(0,255,255,0.4)] disabled:opacity-60 cursor-pointer"
            >
              <Download size={18} />
              <span>{downloading ? "Preparing PNG..." : "Download Certificate"}</span>
            </button>

            <button
              onClick={handleView}
              className="flex items-center gap-2 rounded-xl border border-white/15 bg-white/5 px-6 py-3.5 text-sm sm:text-base font-semibold text-white transition hover:bg-white/10 hover:border-cyan-400 hover:text-cyan-300 cursor-pointer backdrop-blur-sm"
            >
              <Eye size={18} />
              <span>View & Print / PDF</span>
            </button>

            <button
              onClick={() => navigate("/dashboard")}
              className="flex items-center gap-2 rounded-xl border border-white/10 bg-slate-800/80 px-5 py-3.5 text-sm sm:text-base font-medium text-gray-300 transition hover:bg-slate-700 hover:text-white cursor-pointer"
            >
              <span>My Dashboard</span>
              <ArrowRight size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* ── Main Content Grid: Certificate Preview + Info Cards ── */}
      <div className="mt-8 grid gap-8 lg:grid-cols-12 items-start">
        {/* Left 7 cols: Interactive Certificate Preview */}
        <div className="lg:col-span-7 space-y-4">
          <div className="rounded-3xl border border-white/10 bg-slate-900/60 p-4 sm:p-6 backdrop-blur-xl shadow-xl">
            <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-4">
              <div className="flex items-center gap-2.5">
                <Award className="h-5 w-5 text-cyan-400" />
                <span className="font-semibold text-white text-sm sm:text-base">
                  Live Certificate Preview
                </span>
              </div>
              <button
                onClick={handleView}
                className="text-xs font-semibold text-cyan-400 hover:text-cyan-300 flex items-center gap-1 transition cursor-pointer"
              >
                Full Screen View
                <ArrowRight size={12} />
              </button>
            </div>

            {/* Certificate Template Visual Frame */}
            <div
              onClick={handleView}
              title="Click to zoom / view full certificate"
              className="group relative w-full overflow-hidden rounded-2xl border border-white/15 bg-[#070b1a] shadow-2xl cursor-pointer transition-transform duration-300 hover:scale-[1.01]"
            >
              <div className="relative w-full aspect-[2000/1414] select-none">
                <img
                  src={certificateTemplate}
                  alt="Corso Certificate Preview"
                  className="w-full h-full object-contain"
                />

                {/* Overlay Student Name */}
                <div
                  className="absolute left-1/2 -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none w-[80%]"
                  style={{ top: "45.6%" }}
                >
                  <span className="font-serif font-bold text-cyan-300 tracking-wide drop-shadow-[0_0_12px_rgba(6,182,212,0.6)] text-[8px] sm:text-lg md:text-2xl leading-tight block">
                    {studentName}
                  </span>
                </div>

                {/* Overlay Program Name */}
                <div
                  className="absolute left-1/2 -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none w-[80%]"
                  style={{ top: "64.8%" }}
                >
                  <span className="font-serif font-bold uppercase tracking-[0.1em] text-white text-[6px] sm:text-sm md:text-lg leading-tight block">
                    {programName}
                  </span>
                </div>

                {/* Overlay Corso ID */}
                <div
                  className="absolute font-mono text-[3.5px] sm:text-[9px] md:text-[11px] font-semibold text-slate-300 -translate-y-1/2 pointer-events-none"
                  style={{ top: "86.2%", left: "23.5%" }}
                >
                  {corsoId}
                </div>

                {/* Overlay Document ID */}
                <div
                  className="absolute font-mono text-[3.5px] sm:text-[9px] md:text-[11px] font-semibold text-slate-300 -translate-y-1/2 pointer-events-none"
                  style={{ top: "90.2%", left: "29.5%" }}
                >
                  {documentIdentifier}
                </div>

                {/* Overlay Issue Date */}
                <div
                  className="absolute font-sans text-[3.5px] sm:text-[9px] md:text-[11px] font-semibold text-slate-300 -translate-y-1/2 pointer-events-none"
                  style={{ top: "88.5%", left: "77.5%" }}
                >
                  {formattedDate}
                </div>

                {/* Hover overlay indicator */}
                <div className="absolute inset-0 bg-cyan-500/10 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
                  <span className="inline-flex items-center gap-1.5 rounded-xl bg-slate-950/80 px-4 py-2 text-xs font-semibold text-white backdrop-blur-md border border-cyan-400/40">
                    <Eye size={14} className="text-cyan-400" />
                    Click to Open Full View
                  </span>
                </div>
              </div>
            </div>

            <p className="mt-3 text-center text-xs text-gray-400">
              💡 Tip: You can print this directly to PDF or download as high-resolution PNG.
            </p>
          </div>
        </div>

        {/* Right 5 cols: Certificate Information & Verification */}
        <div className="lg:col-span-5 space-y-5">
          {/* Metadata Card */}
          <div className="rounded-3xl border border-white/10 bg-slate-900/60 p-6 backdrop-blur-xl shadow-xl space-y-4">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <ShieldCheck className="h-5 w-5 text-emerald-400" />
              Certificate Credentials
            </h3>

            <div className="space-y-3 divide-y divide-white/5">
              {/* Program */}
              <div className="pt-2 flex items-center justify-between text-sm">
                <span className="text-gray-400">Program</span>
                <span className="font-semibold text-white text-right truncate max-w-[200px]">
                  {programName}
                </span>
              </div>

              {/* Recipient */}
              <div className="pt-3 flex items-center justify-between text-sm">
                <span className="text-gray-400">Recipient</span>
                <span className="font-semibold text-white">{studentName}</span>
              </div>

              {/* Score */}
              <div className="pt-3 flex items-center justify-between text-sm">
                <span className="text-gray-400">Final Score</span>
                <span className="inline-flex items-center gap-1 font-bold text-emerald-400">
                  <Sparkles size={14} />
                  {score}% (Passed)
                </span>
              </div>

              {/* Certificate ID */}
              <div className="pt-3 flex items-center justify-between text-sm">
                <span className="text-gray-400">Certificate ID</span>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-cyan-300 font-medium text-xs sm:text-sm">
                    {certificateId}
                  </span>
                  <button
                    onClick={handleCopyId}
                    title="Copy Certificate ID"
                    className="rounded-lg bg-white/5 p-1 text-gray-400 hover:text-white transition cursor-pointer"
                  >
                    {copiedId ? (
                      <Check size={14} className="text-emerald-400" />
                    ) : (
                      <Copy size={14} />
                    )}
                  </button>
                </div>
              </div>

              {/* Verification Doc */}
              <div className="pt-3 flex items-center justify-between text-sm">
                <span className="text-gray-400">Document ID</span>
                <span className="font-mono text-gray-300 text-xs sm:text-sm">
                  {documentIdentifier}
                </span>
              </div>

              {/* Issue Date */}
              <div className="pt-3 flex items-center justify-between text-sm">
                <span className="text-gray-400">Issue Date</span>
                <span className="flex items-center gap-1.5 text-gray-200">
                  <Calendar size={14} className="text-cyan-400" />
                  {formattedDate}
                </span>
              </div>

              {/* Status */}
              <div className="pt-3 flex items-center justify-between text-sm">
                <span className="text-gray-400">Verification Status</span>
                <span className="inline-flex items-center gap-1 rounded-md bg-emerald-500/10 px-2 py-0.5 text-xs font-semibold text-emerald-400 border border-emerald-500/20">
                  <CheckCircle size={12} />
                  Verified & Active
                </span>
              </div>
            </div>
          </div>

          {/* Quick Navigations */}
          <div className="rounded-3xl border border-white/10 bg-slate-900/40 p-6 backdrop-blur-xl space-y-3">
            <h4 className="text-sm font-semibold uppercase tracking-wider text-gray-400">
              Next Steps
            </h4>

            <div className="grid gap-3">
              <Link
                to="/#courses"
                className="flex items-center justify-between rounded-xl border border-white/5 bg-white/5 p-3.5 text-sm font-medium text-white transition hover:bg-white/10 hover:border-cyan-400/30"
              >
                <span className="flex items-center gap-2">
                  <BookOpen size={16} className="text-cyan-400" />
                  Explore More Certifications
                </span>
                <ArrowRight size={14} className="text-gray-400" />
              </Link>

              {/* {courseId && (
                <button
                  onClick={() => navigate(`/assessment/${courseId}`)}
                  className="flex items-center justify-between rounded-xl border border-white/5 bg-white/5 p-3.5 text-sm font-medium text-white transition hover:bg-white/10 hover:border-cyan-400/30 w-full text-left cursor-pointer"
                >
                  <span className="flex items-center gap-2">
                    <RotateCcw size={16} className="text-emerald-400" />
                    Retake Assessment for Practice
                  </span>
                  <ArrowRight size={14} className="text-gray-400" />
                </button>
              )} */}
            </div>
          </div>
        </div>
      </div>

      {/* ── Certificate Modal View ─────────────────────────────── */}
      {showModal && (
        <CertificateModal
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          certificate={certificate}
          userProfile={{ fullName: studentName }}
        />
      )}
    </div>
  );
};

export default CertificateCard;
