import { useState } from "react";
import {
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Loader2,
  X,
  Copy,
  Check,
  Calendar,
  Award,
  ExternalLink,
  Sparkles,
} from "lucide-react";
import api from "../../../services/api";
import toast from "react-hot-toast";

const VerifyForm = () => {
  const [certificateId, setCertificateId] = useState("");
  const [loading, setLoading] = useState(false);
  const [verifiedCert, setVerifiedCert] = useState(null);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  const handleVerify = async (e) => {
    if (e) e.preventDefault();

    const cleanId = certificateId.trim();
    if (!cleanId) {
      setError("Please enter a valid Certificate ID.");
      toast.error("Please enter a Certificate ID");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const response = await api.get(
        `/certificate/verify/${encodeURIComponent(cleanId)}`
      );

      if (response.data.success && response.data.data) {
        setVerifiedCert(response.data.data);
        toast.success("Certificate verified successfully! 🎉");
      } else {
        throw new Error(
          response.data.message || "Certificate verification failed."
        );
      }
    } catch (err) {
      console.error("Verification error:", err);
      const errMsg =
        err.response?.data?.message ||
        err.message ||
        "No matching certificate found.";
      setError(errMsg);
      setVerifiedCert(null);
      toast.error(errMsg);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = (id) => {
    if (!id) return;
    navigator.clipboard.writeText(id);
    setCopied(true);
    toast.success("Certificate ID copied to clipboard!");
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="w-full">
      <form
        onSubmit={handleVerify}
        className="flex flex-col gap-3 sm:flex-row sm:items-center"
      >
        <div className="relative flex-1">
          <input
            type="text"
            value={certificateId}
            onChange={(e) => {
              setCertificateId(e.target.value);
              if (error) setError("");
            }}
            placeholder="Enter Certificate ID (e.g. CRSO-2026-XXXX)"
            className="h-14 sm:h-16 w-full rounded-2xl border border-white/10 bg-[#0F1323] px-5 sm:px-6 text-sm sm:text-base text-white placeholder:text-gray-500 outline-none transition focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400/50"
          />
          {certificateId && (
            <button
              type="button"
              onClick={() => {
                setCertificateId("");
                setError("");
              }}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
            >
              <X size={16} />
            </button>
          )}
        </div>

        <button
          type="submit"
          disabled={loading}
          className="flex h-14 sm:h-16 items-center justify-center gap-2 rounded-2xl bg-white px-8 sm:px-10 text-base sm:text-lg font-bold text-slate-950 transition hover:bg-gray-100 disabled:opacity-70 cursor-pointer shadow-lg shadow-white/10 shrink-0"
        >
          {loading ? (
            <>
              <Loader2 size={18} className="animate-spin text-slate-950" />
              <span>Verifying...</span>
            </>
          ) : (
            <>
              <ShieldCheck size={20} className="text-emerald-600" />
              <span>Verify</span>
            </>
          )}
        </button>
      </form>

      {/* Inline Error Notice */}
      {error && (
        <div className="mt-3.5 flex items-center gap-2 rounded-xl border border-rose-500/20 bg-rose-500/10 px-4 py-2.5 text-xs sm:text-sm text-rose-400 animate-in fade-in duration-200">
          <AlertCircle size={16} className="shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Verification Result Modal */}
      {verifiedCert && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="relative max-w-lg w-full rounded-3xl border border-emerald-500/30 bg-[#0B0F1F] p-6 sm:p-8 text-left shadow-2xl backdrop-blur-2xl animate-in zoom-in-95 duration-200">
            {/* Close button */}
            <button
              type="button"
              onClick={() => setVerifiedCert(null)}
              className="absolute right-5 top-5 flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white transition cursor-pointer"
            >
              <X size={18} />
            </button>

            {/* Header Badge */}
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3.5 py-1.5 text-xs font-bold text-emerald-400 mb-4">
              <CheckCircle2 size={14} />
              <span>Official Verified Credential</span>
            </div>

            <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              Certificate Verified
            </h3>
            <p className="mt-1 text-xs sm:text-sm text-gray-400">
              This credential has been authenticated against the Skilium registry.
            </p>

            {/* Certificate Details Card */}
            <div className="mt-6 rounded-2xl border border-white/10 bg-white/[0.03] p-5 space-y-4 text-xs sm:text-sm">
              {/* Recipient */}
              <div className="flex items-center justify-between border-b border-white/5 pb-3">
                <span className="text-gray-400">Recipient Name</span>
                <span className="font-bold text-white text-sm sm:text-base">
                  {verifiedCert.studentName}
                </span>
              </div>

              {/* Course */}
              <div className="flex items-center justify-between border-b border-white/5 pb-3">
                <span className="text-gray-400">Course / Program</span>
                <span className="font-semibold text-cyan-300">
                  {verifiedCert.courseName}
                </span>
              </div>

              {/* Score / Grade */}
              <div className="flex items-center justify-between border-b border-white/5 pb-3">
                <span className="text-gray-400">Assessment Score</span>
                <span className="font-bold text-emerald-400">
                  {verifiedCert.score} / {verifiedCert.totalQuestions} (Passed)
                </span>
              </div>

              {/* Certificate ID */}
              <div className="flex items-center justify-between border-b border-white/5 pb-3">
                <span className="text-gray-400">Certificate ID</span>
                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold text-white text-xs">
                    {verifiedCert.certificateId}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleCopy(verifiedCert.certificateId)}
                    title="Copy Certificate ID"
                    className="flex h-6 w-6 items-center justify-center rounded-md border border-white/10 bg-white/5 text-gray-400 hover:text-white transition cursor-pointer"
                  >
                    {copied ? (
                      <Check size={12} className="text-emerald-400" />
                    ) : (
                      <Copy size={12} />
                    )}
                  </button>
                </div>
              </div>

              {/* Issue Date */}
              <div className="flex items-center justify-between">
                <span className="text-gray-400">Issue Date</span>
                <span className="text-gray-200">
                  {new Date(verifiedCert.issueDate).toLocaleDateString(
                    undefined,
                    {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    }
                  )}
                </span>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="mt-6 flex gap-3">
              <button
                type="button"
                onClick={() => setVerifiedCert(null)}
                className="w-full rounded-xl bg-white/10 hover:bg-white/15 py-3 text-sm font-semibold text-white transition cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VerifyForm;