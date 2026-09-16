// import { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import PaymentPopup from "./PaymentPopup";
// import CertificateCard from "./CertificateCard";

// const ResultCard = ({
//   result,
//   program,
//   courseId,
// }) => {
//   const [showPayment, setShowPayment] = useState(false);
//   const [certificate, setCertificate] = useState(null);

//   const navigate = useNavigate();

//   // ---------------------------------------------------------
//   // Get score safely
//   // ---------------------------------------------------------

//   const score = Number(
//     result?.score ?? 0
//   );

//   // ---------------------------------------------------------
//   // Get total questions / marks safely
//   // ---------------------------------------------------------

//   const totalQuestions = Number(
//     result?.totalQuestions ??
//       result?.totalMarks ??
//       result?.total ??
//       0
//   );

//   // ---------------------------------------------------------
//   // Get percentage
//   // ---------------------------------------------------------

//   let percentage = Number(
//     result?.percentage
//   );

//   if (!Number.isFinite(percentage)) {
//     percentage =
//       totalQuestions > 0
//         ? Math.round(
//             (score / totalQuestions) * 100
//           )
//         : 0;
//   }

//   // Make sure percentage is valid
//   if (!Number.isFinite(percentage)) {
//     percentage = 0;
//   }

//   // ---------------------------------------------------------
//   // Passed
//   // ---------------------------------------------------------

//   const passed =
//     result?.passed !== undefined
//       ? Boolean(result.passed)
//       : percentage >= 70;

//   // ---------------------------------------------------------
//   // Retake
//   // ---------------------------------------------------------

//   const handleRetake = () => {
//     navigate(`/assessment/${courseId}`);
//   };

//   // ---------------------------------------------------------
//   // Certificate generated
//   // ---------------------------------------------------------

//   if (certificate) {
//     return (
//       <CertificateCard
//         certificate={certificate}
//       />
//     );
//   }

//   // ---------------------------------------------------------
//   // Result UI
//   // ---------------------------------------------------------

//   return (
//     <div className="min-h-screen bg-[#070B1A] flex items-center justify-center p-6">

//       <div className="max-w-3xl w-full rounded-3xl border border-white/10 bg-white/5 p-10 text-center">

//         {passed ? (
//           <>
//             {/* SUCCESS */}

//             <h1 className="text-4xl font-bold text-emerald-400">
//               Congratulations
//             </h1>

//             <p className="mt-5 text-white text-xl">
//               You have passed the assessment
//             </p>

//             {program?.name && (
//               <p className="mt-3 text-gray-400">
//                 {program.name}
//               </p>
//             )}

//             <h2 className="mt-6 text-6xl font-bold text-white">
//               {percentage}%
//             </h2>

//             <p className="mt-3 text-gray-400">
//               Minimum passing score: 70%
//             </p>

//             {/* PAYMENT BUTTON */}

//             {!showPayment && (
//               <button
//                 type="button"
//                 onClick={() =>
//                   setShowPayment(true)
//                 }
//                 className="
//                   mt-8
//                   w-full
//                   rounded-xl
//                   bg-gradient-to-r
//                   from-cyan-400
//                   to-emerald-400
//                   py-4
//                   font-bold
//                   text-black
//                   transition
//                   hover:scale-[1.01]
//                 "
//               >
//                 Pay ₹249 For Certificate
//               </button>
//             )}

//             {/* PAYMENT POPUP */}

//             {showPayment && (
//               <PaymentPopup
//                 assessmentId={
//                   result?.assessmentId
//                 }
//                 programId={
//                   courseId
//                 }
//                 programName={
//                   program?.name
//                 }
//                 onClose={() =>
//                   setShowPayment(false)
//                 }
//                 onCertificateGenerated={(
//                   generatedCertificate
//                 ) => {
//                   setCertificate(
//                     generatedCertificate
//                   );

//                   setShowPayment(false);
//                 }}
//               />
//             )}
//           </>
//         ) : (
//           <>
//             {/* FAILED */}

//             <h1 className="text-4xl font-bold text-red-400">
//               Try Again
//             </h1>

//             <p className="mt-5 text-white text-lg">
//               You need minimum 70% score to pass.
//             </p>

//             <h2 className="mt-6 text-6xl font-bold text-white">
//               {percentage}%
//             </h2>

//             <button
//               type="button"
//               onClick={handleRetake}
//               className="
//                 mt-8
//                 w-full
//                 rounded-xl
//                 bg-red-500
//                 py-4
//                 font-bold
//                 text-white
//                 hover:bg-red-600
//               "
//             >
//               Retake Assessment
//             </button>
//           </>
//         )}

//       </div>
//     </div>
//   );
// };

// export default ResultCard;

import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  Trophy,
  Award,
  CheckCircle2,
  XCircle,
  Sparkles,
  ArrowRight,
  RotateCcw,
  ShieldCheck,
  Check,
  Zap,
  BookOpen,
} from "lucide-react";
import PaymentPopup from "./PaymentPopup";
import CertificateCard from "./CertificateCard";

const ResultCard = ({ result, program, courseId }) => {
  const [showPayment, setShowPayment] = useState(false);
  const [certificate, setCertificate] = useState(result?.certificate || null);
  const navigate = useNavigate();

  // ---------------------------------------------------------
  // Get score safely
  // ---------------------------------------------------------
  const score = Number(result?.score ?? 0);

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
  let percentage = Number(result?.percentage);

  if (!Number.isFinite(percentage)) {
    percentage =
      totalQuestions > 0
        ? Math.round((score / totalQuestions) * 100)
        : 0;
  }

  if (!Number.isFinite(percentage)) {
    percentage = 0;
  }

  // ---------------------------------------------------------
  // Passed check (70% passing threshold)
  // ---------------------------------------------------------
  const passed =
    result?.passed !== undefined
      ? Boolean(result.passed)
      : percentage >= 70;

  // ---------------------------------------------------------
  // Retake
  // ---------------------------------------------------------

  const handleRetake = () => {
    navigate(`/course/${program.slug}`);
    window.location.reload();
  };

  // ---------------------------------------------------------
  // Certificate generated / unlocked
  // ---------------------------------------------------------
  if (certificate) {
    return (
      <CertificateCard
        certificate={certificate}
        program={program}
        courseId={courseId}
      />
    );
  }

  // ---------------------------------------------------------
  // Assessment Result View
  // ---------------------------------------------------------
  return (
    <div className="w-full max-w-6xl mx-auto">
      {passed ? (
        /* =======================================================
           SUCCESS STATE (PASSED) - LEFT & RIGHT LAYOUT
        ======================================================= */
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-stretch">
            {/* ── LEFT SIDE: Score & Performance Summary ────────── */}
            <div className="lg:col-span-5 flex flex-col justify-between relative overflow-hidden rounded-3xl border border-emerald-500/30 bg-gradient-to-b from-emerald-950/40 via-slate-900/90 to-slate-950 p-6 sm:p-8 shadow-[0_0_60px_rgba(16,185,129,0.12)] backdrop-blur-xl">
              {/* Glow Orbs */}
              <div className="absolute -top-20 -left-20 h-48 w-48 rounded-full bg-emerald-400/15 blur-3xl pointer-events-none" />
              <div className="absolute -bottom-20 -right-20 h-48 w-48 rounded-full bg-cyan-400/10 blur-3xl pointer-events-none" />

              <div className="relative z-10">
                {/* Badge */}
                <div className="flex items-center justify-between gap-2">
                  <div className="inline-flex items-center gap-2 rounded-full border border-emerald-400/40 bg-emerald-500/15 px-4 py-1.5 text-xs sm:text-sm font-bold text-emerald-400 shadow-inner">
                    <Trophy size={16} className="text-emerald-400 animate-bounce" />
                    <span>Assessment Passed</span>
                  </div>
                  <span className="text-xs font-semibold uppercase tracking-wider text-emerald-400/80 bg-emerald-950/50 border border-emerald-500/20 px-2.5 py-1 rounded-full">
                    Verified
                  </span>
                </div>

                {/* Title */}
                <h1 className="mt-6 text-2xl sm:text-3xl font-extrabold tracking-tight text-white leading-tight">
                  Congratulations! 🎉
                </h1>

                <p className="mt-2 text-sm text-gray-300 leading-relaxed">
                  You successfully passed the{" "}
                  <span className="font-semibold text-cyan-300">
                    {program?.name || "technical"}
                  </span>{" "}
                  assessment. You are now eligible for your industry-recognized certificate.
                </p>

                {/* Score Display Circle */}
                <div className="my-8 flex flex-col items-center justify-center">
                  <div className="relative flex h-36 w-36 sm:h-40 sm:w-40 items-center justify-center rounded-full border-4 border-emerald-400 bg-emerald-500/10 shadow-[0_0_35px_rgba(16,185,129,0.25)]">
                    <div className="text-center">
                      <span className="text-3xl sm:text-4xl font-black text-white">
                        {percentage}%
                      </span>
                      <span className="block text-[11px] font-bold uppercase tracking-wider text-emerald-400 mt-0.5">
                        Final Score
                      </span>
                    </div>
                  </div>

                  {totalQuestions > 0 && (
                    <p className="mt-4 text-xs sm:text-sm text-gray-300 font-medium text-center">
                      Correct Answers:{" "}
                      <span className="text-emerald-400 font-bold">{score}</span> of{" "}
                      <span className="text-white font-semibold">{totalQuestions}</span>{" "}
                      questions
                    </p>
                  )}
                </div>

                {/* Performance Stats Box */}
                <div className="grid grid-cols-2 gap-2.5 rounded-2xl border border-white/10 bg-white/5 p-3.5 text-center">
                  <div className="p-2">
                    <span className="block text-[11px] uppercase tracking-wider text-gray-400">
                      Result Status
                    </span>
                    <span className="text-sm font-bold text-emerald-400 flex items-center justify-center gap-1 mt-0.5">
                      <CheckCircle2 size={14} /> Passed
                    </span>
                  </div>
                  <div className="border-l border-white/10 p-2">
                    <span className="block text-[11px] uppercase tracking-wider text-gray-400">
                      Certificate
                    </span>
                    <span className="text-sm font-bold text-cyan-300 flex items-center justify-center gap-1 mt-0.5">
                      <Sparkles size={14} /> Unlocked
                    </span>
                  </div>
                </div>
              </div>

              {/* Optional Retake Link at the bottom */}
              {courseId && (
                <div className="relative z-10 mt-6 pt-4 border-t border-white/10 flex items-center justify-between">
                  <span className="text-xs text-gray-400">Want to practice again?</span>
                  <button
                    type="button"
                    onClick={handleRetake}
                    className="text-xs font-semibold text-gray-300 hover:text-white flex items-center gap-1 transition cursor-pointer"
                  >
                    <RotateCcw size={13} />
                    Retake Test
                  </button>
                </div>
              )}
            </div>

            {/* ── RIGHT SIDE: Claim Verified Certificate & Payment ── */}
            <div className="lg:col-span-7 flex flex-col justify-between relative overflow-hidden rounded-3xl border border-cyan-400/30 bg-gradient-to-br from-cyan-950/40 via-slate-900/90 to-slate-950 p-6 sm:p-8 shadow-[0_0_60px_rgba(6,182,212,0.15)] backdrop-blur-xl">
              {/* Glow Orbs */}
              <div className="absolute -top-20 -right-20 h-48 w-48 rounded-full bg-cyan-400/15 blur-3xl pointer-events-none" />
              <div className="absolute -bottom-20 -left-20 h-48 w-48 rounded-full bg-emerald-400/10 blur-3xl pointer-events-none" />

              <div className="relative z-10 space-y-6">
                {/* Badge & Heading */}
                <div>
                  <div className="inline-flex items-center gap-1.5 rounded-full border border-cyan-400/30 bg-cyan-400/10 px-3.5 py-1 text-xs font-semibold text-cyan-300">
                    <Award size={14} />
                    <span>Official Credential</span>
                  </div>

                  <h2 className="mt-4 text-2xl sm:text-3xl font-bold text-white leading-snug">
                    Claim Your Verified Certificate
                  </h2>

                  <p className="mt-2 text-xs sm:text-sm text-gray-300 leading-relaxed">
                    Get your official Skilium certificate with a verifiable ID, permanent ledger verification, and downloadable high-res assets for your resume and LinkedIn.
                  </p>
                </div>

                {/* Certificate Features */}
                <div className="space-y-2.5 rounded-2xl border border-white/10 bg-white/5 p-4 sm:p-5">
                  <span className="block text-xs font-semibold uppercase tracking-wider text-cyan-300 mb-2">
                    What's included in your credential:
                  </span>
                  {[
                    "Industry-recognized verified certificate",
                    "Unique Certificate ID & verification URL",
                    "One-click LinkedIn & resume shareable",
                    "Instant PNG & PDF high-resolution downloads",
                  ].map((feat, idx) => (
                    <div key={idx} className="flex items-center gap-2.5 text-xs sm:text-sm text-gray-200">
                      <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400">
                        <Check size={12} />
                      </div>
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>

                {/* Pricing & CTA Card */}
                <div className="rounded-2xl border border-cyan-400/20 bg-slate-950/60 p-5 sm:p-6 backdrop-blur-md">
                  <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-white/10">
                    <div>
                      <span className="text-xs uppercase tracking-widest text-gray-400 block">
                        Certification Fee
                      </span>
                      <div className="mt-1 flex items-baseline gap-2">
                        <span className="text-3xl sm:text-4xl font-black text-white">
                          ₹249
                        </span>
                        <span className="text-sm text-gray-400 line-through">₹999</span>
                      </div>
                    </div>

                    <span className="inline-block rounded-full bg-emerald-500/15 border border-emerald-400/30 px-3 py-1 text-xs text-emerald-400 font-semibold">
                      75% Limited Discount
                    </span>
                  </div>

                  {/* Fast Payment Methods Pill (Mobile Friendly) */}
                  <div className="mt-4 flex flex-wrap items-center justify-between gap-2 rounded-xl bg-white/5 px-3 py-2 border border-white/5 text-[11px] text-gray-300">
                    <span className="flex items-center gap-1.5 text-cyan-300 font-medium">
                      <Zap size={13} className="fill-cyan-300" /> Fast UPI & Cards:
                    </span>
                    <span className="font-semibold text-white/90">
                      GPay • PhonePe • Paytm • UPI • Cards
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => setShowPayment(true)}
                    className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-cyan-400 to-emerald-400 py-3.5 sm:py-4 font-bold text-slate-950 transition-all hover:scale-[1.02] hover:shadow-[0_0_25px_rgba(0,255,255,0.4)] cursor-pointer text-sm sm:text-base"
                  >
                    <Zap size={18} className="fill-slate-950" />
                    <span>Pay ₹249 & Get Instant Certificate</span>
                  </button>

                  <p className="mt-3 text-center text-[11px] text-gray-400 flex items-center justify-center gap-1.5">
                    <ShieldCheck size={13} className="text-cyan-400" />
                    Secure 1-tap checkout powered by Razorpay
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* ── MOBILE STICKY FAST PAY ACTION BAR ────────────────── */}
          <div className="fixed bottom-0 left-0 right-0 z-40 lg:hidden border-t border-cyan-400/30 bg-slate-950/95 p-3.5 backdrop-blur-2xl shadow-[0_-10px_35px_rgba(0,0,0,0.6)]">
            <div className="mx-auto flex max-w-md items-center justify-between gap-3">
              <div>
                <div className="flex items-baseline gap-1.5">
                  <span className="text-xl font-black text-white">₹249</span>
                  <span className="text-xs text-gray-400 line-through">₹999</span>
                </div>
                <span className="text-[10px] font-bold uppercase text-emerald-400">
                  ⚡ 75% OFF • Fast UPI
                </span>
              </div>

              <button
                type="button"
                onClick={() => setShowPayment(true)}
                className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-cyan-400 to-emerald-400 py-3 px-4 text-xs sm:text-sm font-bold text-slate-950 shadow-lg shadow-cyan-500/20 active:scale-95 transition-all cursor-pointer"
              >
                <Zap size={16} className="fill-slate-950 shrink-0" />
                <span>Fast Pay & Claim</span>
              </button>
            </div>
          </div>

          {/* Payment Popup Modal */}
          {showPayment && (
            <PaymentPopup
              assessmentId={result?.assessmentId}
              programId={courseId}
              programName={program?.name}
              onClose={() => setShowPayment(false)}
              onCertificateGenerated={(generatedCert) => {
                setCertificate(generatedCert);
                setShowPayment(false);
              }}
            />
          )}
        </div>
      ) : (
        /* =======================================================
           FAILED / RETAKE STATE (SCORE < 70%)
        ======================================================= */
        <div className="relative overflow-hidden rounded-3xl border border-rose-500/30 bg-gradient-to-b from-rose-950/30 via-slate-900 to-slate-950 p-8 sm:p-12 text-center shadow-[0_0_80px_rgba(244,63,94,0.1)]">
          <div className="relative z-10 max-w-xl mx-auto">
            {/* Status Icon */}
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl border border-rose-500/30 bg-rose-500/10 text-rose-400">
              <XCircle size={40} />
            </div>

            <h1 className="mt-6 text-3xl sm:text-4xl font-extrabold text-white">
              Keep Practicing!
            </h1>

            <p className="mt-3 text-gray-300">
              You scored <span className="font-bold text-rose-400">{percentage}%</span>. You need a minimum score of <span className="font-bold text-white">70%</span> to earn the verified certificate.
            </p>

            {/* Score Pill */}
            <div className="my-8 inline-flex items-center gap-4 rounded-2xl border border-white/10 bg-white/5 px-6 py-4">
              <div className="text-left">
                <span className="block text-xs uppercase text-gray-400">Your Score</span>
                <span className="text-2xl font-bold text-rose-400">{percentage}%</span>
              </div>
              <div className="h-8 w-px bg-white/10" />
              <div className="text-left">
                <span className="block text-xs uppercase text-gray-400">Required</span>
                <span className="text-2xl font-bold text-emerald-400">70%</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button
                type="button"
                onClick={handleRetake}
                className="flex w-full sm:w-auto items-center justify-center gap-2 rounded-xl bg-rose-500 px-8 py-4 font-bold text-white transition hover:bg-rose-600 hover:scale-105 cursor-pointer shadow-lg shadow-rose-500/20"
              >
                <RotateCcw size={18} />
                <span>Retake Assessment</span>
              </button>

              {/* <Link
                to={`/course/${courseId}`}
                className="flex w-full sm:w-auto items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 px-8 py-4 font-semibold text-gray-200 transition hover:bg-white/10 hover:text-white"
              >
                <BookOpen size={18} />
                <span>Review Course Details</span>
              </Link> */}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ResultCard;