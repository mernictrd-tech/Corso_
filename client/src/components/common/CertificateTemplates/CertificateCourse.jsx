import { useEffect, useRef, useState } from "react";
import {
  X,
  Download,
  Copy,
  Check,
  Award,
  ShieldCheck,
  Calendar,
  FileText,
  User,
  Sparkles,
} from "lucide-react";
import toast from "react-hot-toast";
import { toPng } from "html-to-image";

const CertificateModal = ({ isOpen, onClose, certificate, userProfile }) => {
  const [copied, setCopied] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const modalRef = useRef(null);
  const certificateRef = useRef(null);

  // Extract certificate fields with robust fallbacks
  const studentName =
    certificate?.studentName ||
    userProfile?.fullName ||
    certificate?.name ||
    "";

  const programName =
    certificate?.program?.name ||
    certificate?.programName ||
    certificate?.title ||
    certificate?.program ||
    "Course Name";

  const certificateId =
    certificate?.certificateId || certificate?.id || "SKLM-2026-001";

  const score = certificate?.score ?? certificate?.assessment?.score ?? 92;

  const totalQuestions = certificate?.assessment?.totalQuestions ?? 10;

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
      return String(rawDate || "29 Jul 2026");
    }
  })();

  // Close on ESC key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  // Prevent background scrolling when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  // Copy Certificate ID
  const handleCopyId = () => {
    navigator.clipboard.writeText(certificateId);
    setCopied(true);
    toast.success("Certificate ID copied to clipboard!");
    setTimeout(() => setCopied(false), 2000);
  };

  // High-Resolution PNG Download using HTML5 Canvas
  const handleDownload = async () => {
    if (downloading || !certificate?.certificateId) return;

    try {
      setDownloading(true);

      const url = `${import.meta.env.VITE_API_BASE_URL}/certificate/${certificate.certificateId}`;

      const response = await fetch(url);

      if (!response.ok) {
        throw new Error("Failed to generate certificate");
      }

      const blob = await response.blob();

      const safeName = String(programName)
        .replace(/[^a-zA-Z0-9]/g, "_")
        .replace(/_+/g, "_");

      const downloadUrl = window.URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = downloadUrl;
      link.download = `Skilium_Certificate_${safeName}_${certificateId}.png`;

      document.body.appendChild(link);
      link.click();
      link.remove();

      window.URL.revokeObjectURL(downloadUrl);

      toast.success("Certificate downloaded successfully!");
    } catch (error) {
      console.error("Certificate download error:", error);
      toast.error("Failed to download certificate.");
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center bg-black/80 p-3 sm:p-6 backdrop-blur-md overflow-y-auto"
      onClick={onClose}
    >
      {/* Modal Container */}
      <div
        ref={modalRef}
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-4xl rounded-2xl sm:rounded-3xl border border-cyan-500/20 bg-slate-950 p-3 sm:p-6 shadow-[0_0_80px_rgba(6,182,212,0.25)] my-4 sm:my-8"
      >
        {/* ── Top Header Bar ─────────────────────────────── */}
        <div className="no-print mb-4 border-b border-white/10 pb-4">
          {/* Row 1: Icon + Title + Close button */}
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="flex h-9 w-9 sm:h-11 sm:w-11 shrink-0 items-center justify-center rounded-xl sm:rounded-2xl bg-cyan-500/20 border border-cyan-400/30 text-cyan-400">
                <Award size={20} />
              </div>
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-1.5">
                  <h2 className="text-sm sm:text-xl font-bold text-white">
                    Official Certificate
                  </h2>
                  <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/20 px-2 py-0.5 text-[10px] font-semibold text-emerald-400 border border-emerald-500/30">
                    <ShieldCheck size={11} />
                    Verified
                  </span>
                </div>
                <p className="text-[10px] sm:text-xs text-gray-400 mt-0.5 truncate">
                  {programName} · Score: {score}/{totalQuestions}
                </p>
              </div>
            </div>

            {/* Close — always top-right, never pushed away */}
            <button
              onClick={onClose}
              title="Close Modal"
              className="shrink-0 flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-gray-400 transition hover:bg-rose-500/20 hover:border-rose-500/40 hover:text-rose-400"
            >
              <X size={16} />
            </button>
          </div>

          {/* Row 2: Action Buttons */}
          <div className="mt-3 flex flex-wrap items-center gap-2">
            {/* Copy Certificate ID */}
            <button
              onClick={handleCopyId}
              title="Copy Certificate ID"
              className="flex h-8 sm:h-9 items-center gap-1.5 rounded-xl border border-white/10 bg-white/5 px-2.5 sm:px-3 text-xs font-medium text-gray-300 transition hover:border-cyan-400 hover:text-cyan-300 hover:bg-white/10"
            >
              {copied ? (
                <Check size={13} className="text-emerald-400" />
              ) : (
                <Copy size={13} />
              )}
              <span>{copied ? "Copied!" : "Copy ID"}</span>
            </button>

            {/* Print / Save PDF */}
            {/* <button
              onClick={handlePrint}
              title="Print / Save PDF"
              className="flex h-8 sm:h-9 items-center gap-1.5 rounded-xl border border-white/10 bg-white/5 px-2.5 sm:px-3 text-xs font-medium text-gray-300 transition hover:border-cyan-400 hover:text-cyan-300 hover:bg-white/10"
            >
              <Printer size={13} />
              <span>Print / PDF</span>
            </button> */}

            {/* Download PNG */}
            <button
              onClick={handleDownload}
              disabled={downloading}
              title="Download PNG Certificate"
              className="flex h-8 sm:h-9 items-center gap-1.5 rounded-xl bg-gradient-to-r from-cyan-400 to-emerald-400 px-3 sm:px-4 text-xs font-semibold text-slate-950 transition hover:opacity-90 hover:scale-[1.02] disabled:opacity-50"
            >
              <Download size={13} />
              <span>{downloading ? "Exporting..." : "Download"}</span>
            </button>
          </div>
        </div>

        {/* ── Certificate Display Area ────────────────── */}
        <div
          ref={certificateRef}
          className="print-certificate-container relative w-full overflow-hidden rounded-xl sm:rounded-2xl border border-white/10 bg-[#070b1a] shadow-2xl"
        >
          <div className="relative w-full aspect-[2000/1414] select-none">
            {/* Background Template */}
            <img
              src={`${import.meta.env.VITE_API_BASE_URL}/certificate/${certificate.certificateId}`}
              alt="Skilium Certificate"
              className="w-full h-full object-contain pointer-events-none"
            />
          </div>
        </div>

        {/* ── Certificate Metadata Footer ─────────────── */}
        <div className="no-print mt-3 sm:mt-4 grid grid-cols-2 gap-2 sm:gap-3 sm:grid-cols-4 rounded-xl sm:rounded-2xl border border-white/10 bg-white/5 p-2.5 sm:p-3.5">
          <div className="flex items-center gap-2">
            <User size={14} className="text-cyan-400 shrink-0" />
            <div className="min-w-0">
              <span className="text-gray-500 block text-[9px] uppercase">
                Learner
              </span>
              <span className="font-medium text-white truncate block text-[10px] sm:text-xs">
                {studentName}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <FileText size={14} className="text-cyan-400 shrink-0" />
            <div className="min-w-0">
              <span className="text-gray-500 block text-[9px] uppercase">
                Document Identifier
              </span>
              <span className="font-mono font-medium text-cyan-300 truncate block text-[10px] sm:text-xs">
                {certificateId}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Calendar size={14} className="text-cyan-400 shrink-0" />
            <div>
              <span className="text-gray-500 block text-[9px] uppercase">
                Issue Date
              </span>
              <span className="font-medium text-white block text-[10px] sm:text-xs">
                {formattedDate}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Sparkles size={14} className="text-emerald-400 shrink-0" />
            <div>
              <span className="text-gray-500 block text-[9px] uppercase">
                Score
              </span>
              <span className="font-bold text-emerald-400 block text-[10px] sm:text-xs">
                {score} / {totalQuestions} · Issued
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CertificateModal;
