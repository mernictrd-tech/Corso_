import {
  X,
  Clock3,
  HelpCircle,
  Award,
  CheckCircle,
  Loader2,
} from "lucide-react";

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";

const AssessmentModal = ({ open, onClose, course }) => {
  const navigate = useNavigate();

  const [starting, setStarting] = useState(false);

  if (!open) return null;

  const handleStartAssessment = async () => {
    const courseId = course?.id || course?._id;

    if (!courseId) {
      console.error("Course object:", course);
      alert("Program ID is missing.");
      return;
    }

    if (starting) return;

    try {
      setStarting(true);

      const response = await api.post(`/assessment/${courseId}/start`);

      console.log("Start assessment response:", response.data);

      if (!response.data?.success) {
        throw new Error(
          response.data?.message || "Unable to start assessment.",
        );
      }

      const sessionId =
        response.data?.sessionId || response.data?.data?.sessionId;

      if (!sessionId) {
        console.error("Backend did not return sessionId:", response.data);
        throw new Error(
          "Assessment session ID was not returned by the server.",
        );
      }

      sessionStorage.removeItem("assessmentSessionId");
      sessionStorage.removeItem("assessmentProgramId");
      sessionStorage.removeItem(`skilium_assessment_${courseId}`);

      sessionStorage.setItem("assessmentSessionId", String(sessionId));
      sessionStorage.setItem("assessmentProgramId", String(courseId));

      const storedSessionId = sessionStorage.getItem("assessmentSessionId");

      console.log("Created session ID:", sessionId);
      console.log("Stored session ID:", storedSessionId);

      onClose();
      navigate(`/assessment/${courseId}`);
    } catch (error) {
      console.error("Start assessment error:", error);
      alert(
        error.response?.data?.message ||
          error.message ||
          "Unable to start assessment.",
      );
    } finally {
      setStarting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/70 backdrop-blur-sm sm:items-center sm:px-4">
      {/* Backdrop tap to close */}
      <div
        className="fixed inset-0"
        onClick={starting ? undefined : onClose}
      />

      {/* Modal / Bottom Sheet */}
      <div
        className="relative z-10 flex w-full flex-col overflow-hidden rounded-t-3xl border border-white/10 bg-[#111827] shadow-2xl
        h-[94dvh] max-h-[94dvh]
        sm:h-auto sm:max-h-[90vh] sm:max-w-lg sm:rounded-3xl
        animate-slideUp sm:animate-scaleIn"
      >
        {/* Mobile pull handle */}
        <div className="mx-auto mt-2.5 h-1.5 w-12 shrink-0 rounded-full bg-white/20 sm:hidden" />

        {/* ═══════ HEADER (fixed) ═══════ */}
        <div className="shrink-0 px-6 pt-3 pb-3 sm:px-8 sm:pt-6 sm:pb-4">
          <div className="flex items-start justify-between gap-3 border-b border-white/10 pb-3 sm:pb-4">
            <div className="min-w-0">
              <h2 className="text-xl font-bold text-white sm:text-2xl">
                Start Assessment
              </h2>
              <p className="mt-1 text-sm text-gray-400 sm:text-base">
                Test your knowledge and earn your certificate.
              </p>
            </div>

            <button
              type="button"
              onClick={onClose}
              disabled={starting}
              className="shrink-0 cursor-pointer rounded-full bg-white/10 p-2 text-gray-300 transition hover:bg-white/20 disabled:opacity-50"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* ═══════ SCROLLABLE BODY ═══════ */}
        <div className="flex-1 min-h-0 space-y-4 overflow-y-auto overscroll-contain px-6 pb-4 sm:px-8 sm:pb-6">
          {/* Details */}
          <div className="space-y-3">
            {/* Duration */}
            <div className="flex items-center justify-between rounded-xl border border-cyan-400/15 bg-white/[0.04] p-3.5 sm:p-4">
              <div className="flex items-center gap-3 text-gray-300">
                <Clock3 size={18} className="shrink-0 text-cyan-400" />
                <span className="text-sm sm:text-base">Duration</span>
              </div>
              <span className="text-sm font-semibold text-white sm:text-base">
                {course?.duration || "10 Minutes"}
              </span>
            </div>

            {/* Questions */}
            <div className="flex items-center justify-between rounded-xl border border-cyan-400/15 bg-white/[0.04] p-3.5 sm:p-4">
              <div className="flex items-center gap-3 text-gray-300">
                <HelpCircle size={18} className="shrink-0 text-cyan-400" />
                <span className="text-sm sm:text-base">Questions</span>
              </div>
              <span className="text-sm font-semibold text-white sm:text-base">
                {course?.questions || course?.totalQuestions || 0}
              </span>
            </div>

            {/* Certificate */}
            <div className="flex items-center justify-between rounded-xl border border-emerald-400/15 bg-white/[0.04] p-3.5 sm:p-4">
              <div className="flex items-center gap-3 text-gray-300">
                <Award size={18} className="shrink-0 text-cyan-400" />
                <span className="text-sm sm:text-base">Certificate</span>
              </div>
              <span className="text-sm font-semibold text-emerald-400 sm:text-base">
                Yes
              </span>
            </div>
          </div>

          {/* Instructions */}
          <div className="space-y-2.5 pt-1">
            <h3 className="text-sm font-semibold text-white sm:text-base">
              Instructions
            </h3>

            <div className="flex gap-2.5 text-xs text-gray-400 sm:text-sm">
              <CheckCircle
                size={16}
                className="mt-0.5 shrink-0 text-emerald-400"
              />
              <span>Do not refresh the page during assessment</span>
            </div>

            <div className="flex gap-2.5 text-xs text-gray-400 sm:text-sm">
              <CheckCircle
                size={16}
                className="mt-0.5 shrink-0 text-emerald-400"
              />
              <span>Complete the assessment within given time</span>
            </div>

            <div className="flex gap-2.5 text-xs text-gray-400 sm:text-sm">
              <CheckCircle
                size={16}
                className="mt-0.5 shrink-0 text-emerald-400"
              />
              <span>Score 70% or above to get the certificate</span>
            </div>
          </div>
        </div>

        {/* ═══════ STICKY FOOTER (always visible) ═══════ */}
        <div className="shrink-0 border-t border-white/10 bg-[#111827]/95 px-6 pb-[calc(1rem+env(safe-area-inset-bottom))] pt-3 backdrop-blur sm:px-8 sm:pb-6 sm:pt-4">
          <button
            type="button"
            onClick={handleStartAssessment}
            disabled={starting}
            className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-cyan-400 to-emerald-400 py-3.5 text-sm font-bold text-black transition-all hover:scale-[1.02] hover:shadow-[0_0_25px_rgba(0,255,255,0.35)] disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:scale-100 sm:py-4 sm:text-base"
          >
            {starting ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                <span>Starting Assessment…</span>
              </>
            ) : (
              <span>Start Test</span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AssessmentModal;