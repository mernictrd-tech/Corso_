import {
  Award,
  Calendar,
  Download,
  Eye,
  Medal,
} from "lucide-react";
import { useState } from "react";
import { downloadCertificate } from "../../utils/downloadCertificate";

const DashboardHero = ({ hero, certificate, profile, onViewCertificate }) => {
  const [downloading, setDownloading] = useState(false);

  // Student name
  const studentName =
    certificate?.studentName ||
    profile?.fullName ||
    hero?.name ||
    "Student";

  // Latest course/program
  const programName =
    certificate?.program?.name ||
    certificate?.programName ||
    certificate?.title ||
    hero?.assessment ||
    "React.js";

  // Latest assessment score
  const score =
    certificate?.score ??
    certificate?.assessment?.score ??
    (typeof hero?.score === "number"
      ? hero.score
      : parseInt(hero?.score, 10) || 92);

  const totalQuestions =
    certificate?.assessment?.totalQuestions ??
    certificate?.totalQuestions ??
    10;

  const scoreDisplay =
    typeof hero?.score === "string" && hero.score.includes("/")
      ? hero.score
      : `${score}/${totalQuestions}`;

  // Certificate ID
  const certificateId =
    certificate?.certificateId || "CRS-2026-001";

  // Certificate issue date
  const issuedDate =
    certificate?.issueDate ||
    certificate?.createdAt ||
    certificate?.issuedOn ||
    null;

  const handleViewCertificate = () => {
    onViewCertificate?.({
      studentName,
      programName,
      certificateId,
      score,
      totalQuestions,
      issueDate: issuedDate,
      corsoId: certificate?.corsoId,
      documentIdentifier: certificate?.documentIdentifier,
      ...certificate,
    });
  };

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
          issueDate: issuedDate,
          corsoId: certificate?.corsoId,
          documentIdentifier: certificate?.documentIdentifier,
          ...certificate,
        },
        profile
      );
    } finally {
      setDownloading(false);
    }
  };

  return (
    <section className="relative overflow-hidden rounded-2xl sm:rounded-[32px] border border-cyan-400/20 bg-gradient-to-br from-cyan-500/20 via-slate-900 to-emerald-500/10 p-5 sm:p-8 shadow-[0_0_60px_rgba(0,255,255,.12)]">
      {/* Glow orbs */}
      <div className="absolute -top-24 -right-24 h-64 w-64 rounded-full bg-cyan-400/20 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -left-20 h-64 w-64 rounded-full bg-emerald-400/20 blur-3xl pointer-events-none" />

      <div className="relative grid items-center gap-8 lg:grid-cols-[2fr_1fr]">
        {/* ── Left ─────────────────────────────── */}
        <div>
          <div className="inline-flex items-center gap-2 rounded-full bg-cyan-400/10 px-4 py-2 text-sm text-cyan-300">
            <Medal size={16} />
            Congratulations
          </div>

          <h1 className="mt-4 text-2xl sm:text-3xl lg:text-4xl font-bold leading-tight text-white">
            {programName}
            <br />
            Certification Completed
          </h1>

          <p className="mt-3 max-w-2xl text-sm sm:text-base text-gray-300 leading-7">
            You successfully completed your assessment and unlocked your
            professional certificate. Download it now or view it anytime from
            your dashboard.
          </p>

          {/* Stats row */}
          <div className="mt-6 flex flex-wrap gap-3 sm:gap-5">
            <div className="rounded-xl sm:rounded-2xl border border-white/10 bg-white/5 px-4 py-3 sm:px-5 sm:py-4">
              <p className="text-xs sm:text-sm text-gray-400">Score</p>
              <h2 className="mt-1 text-2xl sm:text-3xl font-bold text-cyan-300">
                {scoreDisplay}
              </h2>
            </div>

            <div className="rounded-xl sm:rounded-2xl border border-white/10 bg-white/5 px-4 py-3 sm:px-5 sm:py-4">
              <p className="text-xs sm:text-sm text-gray-400">Certificate ID</p>
              <h2 className="mt-1 text-sm sm:text-base font-semibold text-white break-all">
                {certificateId}
              </h2>
            </div>

            <div className="rounded-xl sm:rounded-2xl border border-white/10 bg-white/5 px-4 py-3 sm:px-5 sm:py-4">
              <p className="text-xs sm:text-sm text-gray-400">Issued</p>
              <h2 className="mt-1 flex items-center gap-2 text-sm sm:text-base font-semibold text-white">
                <Calendar size={15} />
                {issuedDate
                  ? new Date(issuedDate).toLocaleDateString("en-US", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                  })
                  : "29 Jul 2026"}
              </h2>
            </div>
          </div>

          {/* Action buttons */}
          <div className="mt-8 flex flex-wrap gap-3">
            {/* Direct download — no modal */}
            <button
              onClick={handleDownload}
              disabled={downloading}
              className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-cyan-400 to-emerald-400 px-5 sm:px-6 py-3 text-sm sm:text-base font-semibold text-black transition hover:scale-105 cursor-pointer shadow-lg shadow-cyan-500/20 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              <Download size={17} />
              {downloading ? "Downloading..." : "Download Certificate"}
            </button>

            {/* View opens the modal */}
            <button
              onClick={handleViewCertificate}
              className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-5 sm:px-6 py-3 text-sm sm:text-base font-semibold text-white transition hover:border-cyan-400 hover:bg-cyan-500/10 cursor-pointer"
            >
              <Eye size={17} />
              View Certificate
            </button>
          </div>
        </div>

        {/* ── Right: Certificate Preview Card ── */}
        <div className="flex justify-center">
          <div className="w-full max-w-xs sm:max-w-sm rounded-[22px] sm:rounded-[28px] border border-white/10 bg-gradient-to-b from-white/10 to-white/5 p-5 sm:p-6 backdrop-blur-xl shadow-2xl">
            <div className="rounded-2xl bg-white p-6 sm:p-8 text-center">
              <Award className="mx-auto text-cyan-500" size={50} />

              <p className="mt-4 text-xs tracking-[5px] text-gray-500">
                CERTIFICATE
              </p>

              <h2 className="mt-4 text-lg sm:text-2xl font-bold text-gray-800 break-words">
                {programName}
              </h2>

              <p className="mt-3 text-gray-600 text-sm">Awarded To</p>

              <h3 className="mt-1 text-base sm:text-xl font-semibold text-gray-900 break-words">
                {studentName}
              </h3>

              <div className="mt-5 h-px bg-gray-300" />

              <p className="mt-5 text-sm text-gray-500">Score</p>

              <h1 className="text-3xl sm:text-4xl font-bold text-cyan-500">
                {scoreDisplay}
              </h1>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DashboardHero;