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
    /*
     * ------------------------------------------------------------
     * 1. Validate course ID
     * ------------------------------------------------------------
     */

    const courseId = course?.id || course?._id;

    if (!courseId) {
      console.error("Course object:", course);

      alert("Program ID is missing.");
      return;
    }

    /*
     * ------------------------------------------------------------
     * 2. Prevent double click
     * ------------------------------------------------------------
     */

    if (starting) {
      return;
    }

    try {
      setStarting(true);

      /*
       * ----------------------------------------------------------
       * 3. Create assessment session
       * ----------------------------------------------------------
       */

      const response = await api.post(
        `/assessment/${courseId}/start`
      );

      console.log(
        "Start assessment response:",
        response.data
      );

      /*
       * ----------------------------------------------------------
       * 4. Validate backend response
       *
       * IMPORTANT:
       * We support both:
       *
       * response.data.sessionId
       *
       * and
       *
       * response.data.data.sessionId
       * ----------------------------------------------------------
       */

      if (!response.data?.success) {
        throw new Error(
          response.data?.message ||
            "Unable to start assessment."
        );
      }

      const sessionId =
        response.data?.sessionId ||
        response.data?.data?.sessionId;

      /*
       * ----------------------------------------------------------
       * 5. Make absolutely sure session ID exists
       * ----------------------------------------------------------
       */

      if (!sessionId) {
        console.error(
          "Backend did not return sessionId:",
          response.data
        );

        throw new Error(
          "Assessment session ID was not returned by the server."
        );
      }

      /*
       * ----------------------------------------------------------
       * 6. Clear old assessment storage
       * ----------------------------------------------------------
       */

      sessionStorage.removeItem(
        "assessmentSessionId"
      );

      sessionStorage.removeItem(
        "assessmentProgramId"
      );

      /*
       * Also clear old answers for this course
       */

      sessionStorage.removeItem(
        `skilium_assessment_${courseId}`
      );

      /*
       * ----------------------------------------------------------
       * 7. Store NEW session ID
       * ----------------------------------------------------------
       */

      sessionStorage.setItem(
        "assessmentSessionId",
        String(sessionId)
      );

      sessionStorage.setItem(
        "assessmentProgramId",
        String(courseId)
      );

      /*
       * ----------------------------------------------------------
       * 8. Verify storage
       * ----------------------------------------------------------
       */

      const storedSessionId =
        sessionStorage.getItem(
          "assessmentSessionId"
        );

      console.log(
        "Created session ID:",
        sessionId
      );

      console.log(
        "Stored session ID:",
        storedSessionId
      );

      /*
       * ----------------------------------------------------------
       * 9. Close modal
       * ----------------------------------------------------------
       */

      onClose();

      /*
       * ----------------------------------------------------------
       * 10. Navigate to assessment
       * ----------------------------------------------------------
       */

      navigate(
        `/assessment/${courseId}`
      );
    } catch (error) {
      console.error(
        "Start assessment error:",
        error
      );

      alert(
        error.response?.data?.message ||
          error.message ||
          "Unable to start assessment."
      );
    } finally {
      setStarting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4">
      <div className="w-full max-w-lg rounded-3xl border border-white/10 bg-[#111827] p-8 shadow-2xl">

        {/* Header */}

        <div className="flex items-center justify-between">

          <h2 className="text-2xl font-bold text-white">
            Start Assessment
          </h2>

          <button
            type="button"
            onClick={onClose}
            disabled={starting}
            className="rounded-full bg-white/10 p-2 text-gray-300 hover:bg-white/20 disabled:opacity-50"
          >
            <X size={20} />
          </button>

        </div>

        <p className="mt-4 text-gray-400">
          Test your knowledge and earn your certificate.
        </p>

        {/* Details */}

        <div className="mt-6 space-y-4">

          {/* Duration */}

          <div className="flex justify-between rounded-xl bg-white/5 p-4">

            <div className="flex items-center gap-3 text-gray-300">
              <Clock3 className="text-cyan-400" />

              <span>
                Duration
              </span>
            </div>

            <span className="font-semibold text-white">
              {course?.duration || "10 Minutes"}
            </span>

          </div>

          {/* Questions */}

          <div className="flex justify-between rounded-xl bg-white/5 p-4">

            <div className="flex items-center gap-3 text-gray-300">
              <HelpCircle className="text-cyan-400" />

              <span>
                Questions
              </span>
            </div>

            <span className="font-semibold text-white">
              {course?.questions ||
                course?.totalQuestions ||
                0}
            </span>

          </div>

          {/* Certificate */}

          <div className="flex justify-between rounded-xl bg-white/5 p-4">

            <div className="flex items-center gap-3 text-gray-300">
              <Award className="text-cyan-400" />

              <span>
                Certificate
              </span>
            </div>

            <span className="font-semibold text-emerald-400">
              Yes
            </span>

          </div>

        </div>

        {/* Instructions */}

        <div className="mt-6 space-y-3">

          <h3 className="font-semibold text-white">
            Instructions
          </h3>

          <div className="flex gap-2 text-sm text-gray-400">

            <CheckCircle
              size={18}
              className="shrink-0 text-emerald-400"
            />

            <span>
              Do not refresh the page during assessment
            </span>

          </div>

          <div className="flex gap-2 text-sm text-gray-400">

            <CheckCircle
              size={18}
              className="shrink-0 text-emerald-400"
            />

            <span>
              Complete the assessment within given time
            </span>

          </div>

          <div className="flex gap-2 text-sm text-gray-400">

            <CheckCircle
              size={18}
              className="shrink-0 text-emerald-400"
            />

            <span>
              Score 70% or above to get the certificate
            </span>

          </div>

        </div>

        {/* Start Button */}

        <button
          type="button"
          onClick={handleStartAssessment}
          disabled={starting}
          className="
            mt-8
            flex
            w-full
            items-center
            justify-center
            gap-2
            rounded-xl
            bg-gradient-to-r
            from-cyan-400
            to-emerald-400
            py-4
            font-semibold
            text-black
            transition
            hover:scale-[1.02]
            disabled:cursor-not-allowed
            disabled:opacity-60
            disabled:hover:scale-100
          "
        >

          {starting ? (
            <>
              <Loader2
                size={18}
                className="animate-spin"
              />

              Starting Assessment...
            </>
          ) : (
            "Start Test"
          )}

        </button>

      </div>
    </div>
  );
};

export default AssessmentModal;