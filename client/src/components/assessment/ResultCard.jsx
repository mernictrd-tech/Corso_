import { useState } from "react";
import { useNavigate } from "react-router-dom";
import PaymentPopup from "./PaymentPopup";
import CertificateCard from "./CertificateCard";

const ResultCard = ({
  result,
  program,
  courseId,
}) => {
  const [showPayment, setShowPayment] = useState(false);
  const [certificate, setCertificate] = useState(null);

  const navigate = useNavigate();

  // ---------------------------------------------------------
  // Get score safely
  // ---------------------------------------------------------

  const score = Number(
    result?.score ?? 0
  );

  // ---------------------------------------------------------
  // Get total questions / marks safely
  // ---------------------------------------------------------

  const totalQuestions = Number(
    result?.totalQuestions ??
      result?.totalMarks ??
      result?.total ??
      0
  );

  // ---------------------------------------------------------
  // Get percentage
  // ---------------------------------------------------------

  let percentage = Number(
    result?.percentage
  );

  if (!Number.isFinite(percentage)) {
    percentage =
      totalQuestions > 0
        ? Math.round(
            (score / totalQuestions) * 100
          )
        : 0;
  }

  // Make sure percentage is valid
  if (!Number.isFinite(percentage)) {
    percentage = 0;
  }

  // ---------------------------------------------------------
  // Passed
  // ---------------------------------------------------------

  const passed =
    result?.passed !== undefined
      ? Boolean(result.passed)
      : percentage >= 70;

  // ---------------------------------------------------------
  // Retake
  // ---------------------------------------------------------

  const handleRetake = () => {
    navigate(`/assessment/${courseId}`);
  };

  // ---------------------------------------------------------
  // Certificate generated
  // ---------------------------------------------------------

  if (certificate) {
    return (
      <CertificateCard
        certificate={certificate}
      />
    );
  }

  // ---------------------------------------------------------
  // Result UI
  // ---------------------------------------------------------

  return (
    <div className="min-h-screen bg-[#070B1A] flex items-center justify-center p-6">

      <div className="max-w-3xl w-full rounded-3xl border border-white/10 bg-white/5 p-10 text-center">

        {passed ? (
          <>
            {/* SUCCESS */}

            <h1 className="text-4xl font-bold text-emerald-400">
              Congratulations
            </h1>

            <p className="mt-5 text-white text-xl">
              You have passed the assessment
            </p>

            {program?.name && (
              <p className="mt-3 text-gray-400">
                {program.name}
              </p>
            )}

            <h2 className="mt-6 text-6xl font-bold text-white">
              {percentage}%
            </h2>

            <p className="mt-3 text-gray-400">
              Minimum passing score: 70%
            </p>

            {/* PAYMENT BUTTON */}

            {!showPayment && (
              <button
                type="button"
                onClick={() =>
                  setShowPayment(true)
                }
                className="
                  mt-8
                  w-full
                  rounded-xl
                  bg-gradient-to-r
                  from-cyan-400
                  to-emerald-400
                  py-4
                  font-bold
                  text-black
                  transition
                  hover:scale-[1.01]
                "
              >
                Pay ₹249 For Certificate
              </button>
            )}

            {/* PAYMENT POPUP */}

            {showPayment && (
              <PaymentPopup
                assessmentId={
                  result?.assessmentId
                }
                programId={
                  courseId
                }
                programName={
                  program?.name
                }
                onClose={() =>
                  setShowPayment(false)
                }
                onCertificateGenerated={(
                  generatedCertificate
                ) => {
                  setCertificate(
                    generatedCertificate
                  );

                  setShowPayment(false);
                }}
              />
            )}
          </>
        ) : (
          <>
            {/* FAILED */}

            <h1 className="text-4xl font-bold text-red-400">
              Try Again
            </h1>

            <p className="mt-5 text-white text-lg">
              You need minimum 70% score to pass.
            </p>

            <h2 className="mt-6 text-6xl font-bold text-white">
              {percentage}%
            </h2>

            <button
              type="button"
              onClick={handleRetake}
              className="
                mt-8
                w-full
                rounded-xl
                bg-red-500
                py-4
                font-bold
                text-white
                hover:bg-red-600
              "
            >
              Retake Assessment
            </button>
          </>
        )}

      </div>
    </div>
  );
};

export default ResultCard;