// import { useEffect, useState } from "react";
// import { useParams } from "react-router-dom";
// import api from "../../services/api";
// import ResultCard from "./ResultCard";

// const Assessment = () => {
//   const { courseId } = useParams();

//   const [questions, setQuestions] = useState([]);
//   const [program, setProgram] = useState(null);

//   const [currentQuestion, setCurrentQuestion] = useState(0);
//   const [selected, setSelected] = useState("");
//   const [answers, setAnswers] = useState({});

//   const [time, setTime] = useState(600);

//   const [loading, setLoading] = useState(true);
//   const [submitting, setSubmitting] = useState(false);
//   const [error, setError] = useState("");

//   const [result, setResult] = useState(null);

//   /*
//   |--------------------------------------------------------------------------
//   | Load Questions
//   |--------------------------------------------------------------------------
//   */

//   useEffect(() => {
//     const loadAssessment = async () => {
//       try {
//         setLoading(true);
//         setError("");

//         const response = await api.get(
//           `/assessment/${courseId}/questions`
//         );

//         if (!response.data.success) {
//           throw new Error(
//             response.data.message || "Failed to load assessment."
//           );
//         }

//         setQuestions(response.data.data);
//         setProgram(response.data.program);

//         // Use program exam duration if available
//         const durationInMinutes =
//           Number(response.data.program.examDuration) || 10;

//         setTime(durationInMinutes * 60);
//       } catch (err) {
//         console.error("Assessment loading error:", err);

//         setError(
//           err.response?.data?.message ||
//             err.message ||
//             "Unable to load assessment."
//         );
//       } finally {
//         setLoading(false);
//       }
//     };

//     if (courseId) {
//       loadAssessment();
//     }
//   }, [courseId]);

//   /*
//   |--------------------------------------------------------------------------
//   | Submit Assessment
//   |--------------------------------------------------------------------------
//   */

//   const submitAssessment = async (finalAnswers = answers) => {
//     try {
//       setSubmitting(true);
//       setError("");

//       const response = await api.post(
//         `/assessment/${courseId}/submit`,
//         {
//           answers: finalAnswers,
//         }
//       );

//       if (!response.data.success) {
//         throw new Error(
//           response.data.message || "Assessment submission failed."
//         );
//       }

//       setResult(response.data.data);
//     } catch (err) {
//       console.error("Assessment submit error:", err);

//       setError(
//         err.response?.data?.message ||
//           err.message ||
//           "Unable to submit assessment."
//       );
//     } finally {
//       setSubmitting(false);
//     }
//   };

//   /*
//   |--------------------------------------------------------------------------
//   | Timer
//   |--------------------------------------------------------------------------
//   */

//   useEffect(() => {
//     if (loading || result || questions.length === 0) {
//       return;
//     }

//     if (time <= 0) {
//       submitAssessment(answers);
//       return;
//     }

//     const timer = setInterval(() => {
//       setTime((prev) => {
//         if (prev <= 1) {
//           clearInterval(timer);
//           return 0;
//         }

//         return prev - 1;
//       });
//     }, 1000);

//     return () => clearInterval(timer);
//   }, [loading, result, questions.length, time]);

//   /*
//   |--------------------------------------------------------------------------
//   | Loading
//   |--------------------------------------------------------------------------
//   */

//   if (loading) {
//     return (
//       <div className="min-h-screen bg-[#070B1A] flex items-center justify-center">
//         <div className="text-center">
//           <div className="text-xl font-semibold text-white">
//             Loading assessment...
//           </div>

//           <p className="mt-2 text-gray-400">
//             Please wait while we load your questions.
//           </p>
//         </div>
//       </div>
//     );
//   }

//   /*
//   |--------------------------------------------------------------------------
//   | Error
//   |--------------------------------------------------------------------------
//   */

//   if (error && questions.length === 0) {
//     return (
//       <div className="min-h-screen bg-[#070B1A] flex items-center justify-center p-6">
//         <div className="max-w-lg w-full rounded-2xl border border-red-400/20 bg-red-400/5 p-8 text-center">
//           <h2 className="text-2xl font-bold text-red-400">
//             Unable to Load Assessment
//           </h2>

//           <p className="mt-4 text-gray-300">
//             {error}
//           </p>
//         </div>
//       </div>
//     );
//   }

//   /*
//   |--------------------------------------------------------------------------
//   | Result
//   |--------------------------------------------------------------------------
//   */

//   if (result) {
//     return (
//       <ResultCard
//         result={result}
//         program={program}
//         courseId={courseId}
//       />
//     );
//   }

//   /*
//   |--------------------------------------------------------------------------
//   | No Questions
//   |--------------------------------------------------------------------------
//   */

//   if (!questions.length) {
//     return (
//       <div className="min-h-screen bg-[#070B1A] flex items-center justify-center">
//         <div className="text-xl font-semibold text-white">
//           No questions available for this program.
//         </div>
//       </div>
//     );
//   }

//   const question = questions[currentQuestion];

//   /*
//   |--------------------------------------------------------------------------
//   | Select Answer
//   |--------------------------------------------------------------------------
//   */

//   const handleSelect = (answerIndex) => {
//     setSelected(answerIndex);

//     setAnswers((prev) => ({
//       ...prev,
//       [question._id]: answerIndex,
//     }));
//   };

//   /*
//   |--------------------------------------------------------------------------
//   | Previous
//   |--------------------------------------------------------------------------
//   */

//   const handlePrevious = () => {
//     if (currentQuestion === 0) {
//       return;
//     }

//     const previousQuestion = currentQuestion - 1;

//     setCurrentQuestion(previousQuestion);

//     const previousId = questions[previousQuestion]._id;

//     setSelected(
//       answers[previousId] !== undefined
//         ? answers[previousId]
//         : ""
//     );
//   };

//   /*
//   |--------------------------------------------------------------------------
//   | Next / Submit
//   |--------------------------------------------------------------------------
//   */

//   const handleNext = async () => {
//     const updatedAnswers = {
//       ...answers,
//       [question._id]: selected,
//     };

//     setAnswers(updatedAnswers);

//     if (currentQuestion < questions.length - 1) {
//       const nextQuestion = currentQuestion + 1;

//       setCurrentQuestion(nextQuestion);

//       const nextId = questions[nextQuestion]._id;

//       setSelected(
//         updatedAnswers[nextId] !== undefined
//           ? updatedAnswers[nextId]
//           : ""
//       );

//       return;
//     }

//     await submitAssessment(updatedAnswers);
//   };

//   /*
//   |--------------------------------------------------------------------------
//   | Format Time
//   |--------------------------------------------------------------------------
//   */

//   const minutes = Math.floor(time / 60);

//   const seconds = String(time % 60).padStart(2, "0");

//   /*
//   |--------------------------------------------------------------------------
//   | UI
//   |--------------------------------------------------------------------------
//   */

//   return (
//     <div className="min-h-screen bg-[#070B1A] p-6 md:p-10">

//       <div className="mx-auto max-w-3xl rounded-3xl border border-white/10 bg-white/5 p-6 md:p-8">

//         {/* Header */}

//         <div className="flex items-center justify-between gap-4">

//           <div>

//             <p className="text-sm text-gray-400">
//               {program?.name}
//             </p>

//             <h2 className="mt-1 text-xl md:text-2xl font-bold text-white">
//               Question {currentQuestion + 1}/{questions.length}
//             </h2>

//           </div>

//           <div className="rounded-lg bg-cyan-400/10 px-4 py-2 font-bold text-cyan-400">
//             {minutes}:{seconds}
//           </div>

//         </div>

//         {/* Progress */}

//         <div className="mt-6 h-2 w-full overflow-hidden rounded-full bg-white/10">

//           <div
//             className="h-full bg-gradient-to-r from-cyan-400 to-emerald-400 transition-all"
//             style={{
//               width: `${((currentQuestion + 1) / questions.length) * 100}%`,
//             }}
//           />

//         </div>

//         {/* Question */}

//         <h3 className="mt-10 text-xl font-semibold leading-relaxed text-white">
//           {question.question}
//         </h3>

//         {/* Options */}

//         <div className="mt-6 space-y-4">

//           {question.options.map((option, index) => {

//             const isSelected = selected === index;

//             return (
//               <label
//                 key={index}
//                 className={`
//                   flex cursor-pointer items-center gap-4
//                   rounded-xl border p-4
//                   transition
//                   ${
//                     isSelected
//                       ? "border-cyan-400 bg-cyan-400/10 text-white"
//                       : "border-white/10 bg-white/5 text-gray-300 hover:bg-white/10"
//                   }
//                 `}
//               >

//                 <input
//                   type="radio"
//                   name={`question-${question._id}`}
//                   checked={isSelected}
//                   onChange={() => handleSelect(index)}
//                   className="h-4 w-4"
//                 />

//                 <span>
//                   {option}
//                 </span>

//               </label>
//             );
//           })}

//         </div>

//         {/* Error */}

//         {error && (
//           <div className="mt-5 rounded-lg bg-red-500/10 p-3 text-sm text-red-400">
//             {error}
//           </div>
//         )}

//         {/* Buttons */}

//         <div className="mt-8 flex gap-4">

//           <button
//             onClick={handlePrevious}
//             disabled={currentQuestion === 0 || submitting}
//             className="
//               w-1/2 rounded-xl
//               border border-slate-700
//               bg-slate-800
//               py-4 font-bold text-white
//               transition hover:bg-slate-700
//               disabled:cursor-not-allowed
//               disabled:opacity-40
//             "
//           >
//             ← Previous
//           </button>

//           <button
//             onClick={handleNext}
//             disabled={submitting}
//             className="
//               w-1/2 rounded-xl
//               bg-gradient-to-r from-cyan-400 to-emerald-400
//               py-4 font-bold text-black
//               transition hover:scale-[1.02]
//               disabled:cursor-not-allowed
//               disabled:opacity-50
//             "
//           >
//             {submitting
//               ? "Submitting..."
//               : currentQuestion === questions.length - 1
//               ? "Submit Assessment"
//               : "Next Question →"}
//           </button>

//         </div>

//       </div>

//     </div>
//   );
// };

// export default Assessment;

import { useEffect, useState, useCallback, useRef } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import {
  Clock,
  ArrowLeft,
  ArrowRight,
  HelpCircle,
  AlertCircle,
  Loader2,
  CheckCircle2,
  Check,
  X,
  Sparkles,
  Award,
  ShieldAlert,
} from "lucide-react";
import api from "../../services/api";
import toast from "react-hot-toast";
import ResultCard from "./ResultCard";

const Assessment = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();

  const [questions, setQuestions] = useState([]);
  const [program, setProgram] = useState(null);

  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});

  const [time, setTime] = useState(600);

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const [result, setResult] = useState(null);
  const [showExitConfirm, setShowExitConfirm] = useState(false);
  const [showIncompleteModal, setShowIncompleteModal] = useState(false);
  const [incompleteIndex, setIncompleteIndex] = useState(0);

  // References to prevent stale closures and duplicate submission triggers
  const answersRef = useRef(answers);
  const hasSubmittedRef = useRef(false);

  useEffect(() => {
    answersRef.current = answers;
  }, [answers]);

  /*
  |--------------------------------------------------------------------------
  | Load Questions & Restore Cached Answers
  |--------------------------------------------------------------------------
  */
  useEffect(() => {
    const loadAssessment = async () => {
      try {
        setLoading(true);
        setError("");
        hasSubmittedRef.current = false;

        const response = await api.get(`/assessment/${courseId}/questions`);

        if (!response.data.success) {
          throw new Error(
            response.data.message || "Failed to load assessment questions."
          );
        }

        // If the user already completed the assessment and earned a certificate
        if (response.data.alreadyCertified || response.data.data?.certificate) {
          setResult(response.data.data);
          setProgram(response.data.program || null);
          return;
        }

        const loadedQuestions = response.data.data || [];
        setQuestions(loadedQuestions);
        setProgram(response.data.program || null);

        // Restore saved answers from sessionStorage if available
        try {
          const cached = sessionStorage.getItem(`corso_assessment_${courseId}`);
          if (cached) {
            const parsed = JSON.parse(cached);
            if (parsed && typeof parsed === "object") {
              setAnswers(parsed);
              answersRef.current = parsed;
            }
          }
        } catch {
          // ignore parsing error
        }

        const durationInMinutes =
          Number(response.data.program?.examDuration) || 10;
        setTime(durationInMinutes * 60);
      } catch (err) {
        console.error("Assessment loading error:", err);
        setError(
          err.response?.data?.message ||
            err.message ||
            "Unable to load assessment questions."
        );
      } finally {
        setLoading(false);
      }
    };

    if (courseId) {
      loadAssessment();
    }
  }, [courseId]);

  /*
  |--------------------------------------------------------------------------
  | Check Unanswered Questions Helper
  |--------------------------------------------------------------------------
  */
  const getUnansweredQuestionIndex = (currentAnswers = answers) => {
    if (!questions || questions.length === 0) return -1;
    return questions.findIndex((q) => {
      const qId = String(q?._id || q?.id || "");
      const ans = currentAnswers[qId];
      return ans === undefined || ans === "" || ans === null;
    });
  };

  /*
  |--------------------------------------------------------------------------
  | Submit Assessment
  |--------------------------------------------------------------------------
  */
  const submitAssessment = async (finalAnswers = answersRef.current) => {
    if (hasSubmittedRef.current) return;

    // Strict validation: Verify ALL questions have selected answers
    const unansweredIdx = getUnansweredQuestionIndex(finalAnswers);
    if (unansweredIdx !== -1) {
      setIncompleteIndex(unansweredIdx);
      setShowIncompleteModal(true);
      return;
    }

    hasSubmittedRef.current = true;

    try {
      setSubmitting(true);
      setError("");

      const response = await api.post(`/assessment/${courseId}/submit`, {
        answers: finalAnswers,
      });

      if (!response.data.success) {
        hasSubmittedRef.current = false;
        throw new Error(
          response.data.message || "Assessment submission failed."
        );
      }

      // Clear cached answers on successful submission
      try {
        sessionStorage.removeItem(`corso_assessment_${courseId}`);
      } catch {
        // ignore
      }

      setResult(response.data.data);
    } catch (err) {
      hasSubmittedRef.current = false;
      console.error("Assessment submit error:", err);
      setError(
        err.response?.data?.message ||
          err.message ||
          "Unable to submit assessment."
      );
    } finally {
      setSubmitting(false);
    }
  };

  /*
  |--------------------------------------------------------------------------
  | Timer
  |--------------------------------------------------------------------------
  */
  useEffect(() => {
    if (loading || result || questions.length === 0) return;

    const timer = setInterval(() => {
      setTime((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          // Auto-submit when time expires
          if (!hasSubmittedRef.current) {
            toast("Time is up! Submitting your assessment...", {
              icon: "⏰",
              id: "time-up-toast",
            });
            submitAssessment(answersRef.current);
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [loading, result, questions.length]);

  const question = questions[currentQuestion];
  const questionId = question?._id || question?.id;
  const currentAnswer =
    questionId && answers[questionId] !== undefined
      ? answers[questionId]
      : null;

  /*
  |--------------------------------------------------------------------------
  | Select Answer
  |--------------------------------------------------------------------------
  */
  const handleSelect = (answerIndex) => {
    if (!question) return;
    const qId = String(question._id || question.id || "");
    setError("");
    setAnswers((prev) => {
      const updated = {
        ...prev,
        [qId]: answerIndex,
      };
      try {
        sessionStorage.setItem(
          `corso_assessment_${courseId}`,
          JSON.stringify(updated)
        );
      } catch {
        // ignore
      }
      return updated;
    });
  };

  /*
  |--------------------------------------------------------------------------
  | Question Navigation Handlers
  |--------------------------------------------------------------------------
  */
  const handlePrevious = () => {
    if (currentQuestion === 0) return;
    setError("");
    setCurrentQuestion((prev) => prev - 1);
  };

  const handleNext = () => {
    setError("");
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion((prev) => prev + 1);
    }
  };

  const handleSubmit = async () => {
    setError("");

    // Strict validation ONLY on final submission: check all questions
    const unansweredIndex = getUnansweredQuestionIndex(answers);

    if (unansweredIndex !== -1) {
      setIncompleteIndex(unansweredIndex);
      setShowIncompleteModal(true);
      return;
    }

    await submitAssessment(answers);
  };

  /*
  |--------------------------------------------------------------------------
  | Keyboard Shortcuts (A, B, C, D / 1, 2, 3, 4 / Enter)
  |--------------------------------------------------------------------------
  */
  const handleKeyDown = useCallback(
    (e) => {
      if (loading || result || !question) return;

      const key = e.key.toUpperCase();
      const optionsCount = question.options?.length || 0;

      // Letter keys A, B, C, D
      const letterIndex = key.charCodeAt(0) - 65;
      if (letterIndex >= 0 && letterIndex < optionsCount) {
        handleSelect(letterIndex);
        return;
      }

      // Number keys 1, 2, 3, 4
      const num = parseInt(e.key, 10);
      if (!isNaN(num) && num >= 1 && num <= optionsCount) {
        handleSelect(num - 1);
        return;
      }

      // Enter to advance or submit
      if (e.key === "Enter") {
        e.preventDefault();
        if (currentQuestion === questions.length - 1) {
          handleSubmit();
        } else {
          handleNext();
        }
      }
    },
    [loading, result, question, currentQuestion, questions.length, answers]
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  /*
  |--------------------------------------------------------------------------
  | Helper Values
  |--------------------------------------------------------------------------
  */
  const minutes = Math.floor(time / 60);
  const seconds = String(time % 60).padStart(2, "0");
  const isTimeRunningLow = time < 120;
  const answeredCount = questions.filter((q) => {
    const qId = q?._id || q?.id;
    return (
      answers[qId] !== undefined &&
      answers[qId] !== "" &&
      answers[qId] !== null
    );
  }).length;
  const progressPercent =
    questions.length > 0
      ? ((currentQuestion + 1) / questions.length) * 100
      : 0;

  /*
  |--------------------------------------------------------------------------
  | Loading State
  |--------------------------------------------------------------------------
  */
  if (loading) {
    return (
      <div className="min-h-screen bg-[#070B1A] flex flex-col items-center justify-center p-6 text-white relative overflow-hidden">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col items-center text-center">
          <Link
            to="/"
            className="mb-8 text-2xl font-black tracking-widest text-white transition hover:opacity-90"
          >
            CORSO<span className="text-cyan-400">.</span>
          </Link>

          <div className="relative flex h-20 w-20 items-center justify-center rounded-3xl bg-slate-900/80 border border-white/10 shadow-[0_0_40px_rgba(6,182,212,0.2)] backdrop-blur-xl">
            <Loader2 className="h-10 w-10 animate-spin text-cyan-400" />
          </div>

          <h2 className="mt-6 text-2xl font-bold tracking-tight text-white">
            Loading Assessment
          </h2>
          <p className="mt-2 text-sm text-slate-400 max-w-sm">
            We are preparing your questions and configuring your timed session.
          </p>
        </div>
      </div>
    );
  }

  /*
  |--------------------------------------------------------------------------
  | Error State
  |--------------------------------------------------------------------------
  */
  if (error && questions.length === 0) {
    return (
      <div className="min-h-screen bg-[#070B1A] flex flex-col items-center justify-center p-6 text-white relative overflow-hidden">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-rose-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-md w-full rounded-3xl border border-rose-500/20 bg-slate-900/80 p-8 text-center backdrop-blur-2xl shadow-2xl">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-rose-500/10 text-rose-400 border border-rose-500/20">
            <AlertCircle size={32} />
          </div>

          <h2 className="mt-5 text-2xl font-bold text-white">
            Unable to Load Assessment
          </h2>
          <p className="mt-3 text-sm text-slate-300 leading-relaxed">
            {error}
          </p>

          <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={() => window.location.reload()}
              className="rounded-xl bg-gradient-to-r from-cyan-400 to-emerald-400 px-6 py-3 font-bold text-slate-950 transition hover:opacity-90 shadow-lg shadow-cyan-500/20 cursor-pointer"
            >
              Try Again
            </button>
            <Link
              to="/#courses"
              className="rounded-xl border border-white/10 bg-white/5 px-6 py-3 font-semibold text-white transition hover:bg-white/10"
            >
              Browse Courses
            </Link>
          </div>
        </div>
      </div>
    );
  }

  /*
  |--------------------------------------------------------------------------
  | Result State
  |--------------------------------------------------------------------------
  */
  if (result) {
    return (
      <div className="min-h-screen bg-[#070B1A] flex flex-col items-center justify-center px-4 py-12 sm:px-6 relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-5xl h-96 bg-cyan-500/10 rounded-full blur-[130px] pointer-events-none" />

        <div className="relative z-10 w-full max-w-6xl">
          <div className="mb-8 flex items-center justify-between">
            <Link
              to="/"
              className="text-2xl font-black tracking-widest text-white transition hover:opacity-90"
            >
              CORSO<span className="text-cyan-400">.</span>
            </Link>
            <Link
              to="/#courses"
              className="text-sm font-medium text-slate-400 hover:text-white transition flex items-center gap-1.5"
            >
              <ArrowLeft size={16} />
              <span>Back to Courses</span>
            </Link>
          </div>

          <ResultCard
            result={result}
            program={program}
            courseId={courseId}
          />
        </div>
      </div>
    );
  }

  /*
  |--------------------------------------------------------------------------
  | Empty Questions State
  |--------------------------------------------------------------------------
  */
  if (!questions.length) {
    return (
      <div className="min-h-screen bg-[#070B1A] flex flex-col items-center justify-center p-6 text-white relative overflow-hidden">
        <div className="relative z-10 max-w-md w-full text-center rounded-3xl border border-white/10 bg-slate-900/80 p-8 backdrop-blur-2xl shadow-2xl">
          <HelpCircle className="mx-auto h-12 w-12 text-cyan-400" />
          <h2 className="mt-4 text-2xl font-bold text-white">
            No Questions Available
          </h2>
          <p className="mt-2 text-sm text-slate-400">
            There are currently no assessment questions for this course.
          </p>
          <Link
            to="/#courses"
            className="mt-6 inline-block rounded-xl bg-gradient-to-r from-cyan-400 to-emerald-400 px-6 py-3 font-bold text-slate-950 transition hover:opacity-90"
          >
            Explore Courses
          </Link>
        </div>
      </div>
    );
  }

  /*
  |--------------------------------------------------------------------------
  | Active Exam View
  |--------------------------------------------------------------------------
  */
  return (
    <div className="min-h-screen sm:h-screen flex flex-col justify-between bg-[#070B1A] text-slate-100 relative overflow-hidden font-sans selection:bg-cyan-500/30 selection:text-cyan-200">
      {/* Background Ambient Glows */}
      <div className="absolute -top-40 -left-40 h-[500px] w-[500px] rounded-full bg-cyan-500/10 blur-[150px] pointer-events-none" />
      <div className="absolute -bottom-40 -right-40 h-[500px] w-[500px] rounded-full bg-emerald-500/10 blur-[150px] pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[600px] w-full max-w-5xl rounded-full bg-blue-600/[0.03] blur-[180px] pointer-events-none" />

      {/* Top Bar (Sticky, Clean & Compact) */}
      <div className="sticky top-0 z-30 shrink-0 w-full border-b border-white/[0.08] bg-[#070B1A]/95 backdrop-blur-md px-4 sm:px-8 py-3">
        <div className="mx-auto flex max-w-4xl items-center justify-between gap-3">
          {/* Brand & Program Title */}
          <div className="flex items-center gap-2 sm:gap-3 min-w-0">
            <Link
              to="/"
              className="text-lg sm:text-2xl font-black tracking-widest text-white transition hover:opacity-90 shrink-0"
            >
              CORSO<span className="text-cyan-400">.</span>
            </Link>

            <span className="hidden sm:inline-block h-4 w-px bg-white/20" />

            <div className="hidden sm:flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-xs font-medium text-slate-300 truncate max-w-[240px]">
              <Sparkles size={12} className="text-cyan-400 shrink-0" />
              <span className="truncate">{program?.name || "Skill Assessment"}</span>
            </div>
          </div>

          {/* Progress Indicator (Middle - Desktop) */}
          <div className="hidden md:flex items-center gap-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Question {currentQuestion + 1} of {questions.length}
            </span>
            <div className="h-2 w-28 rounded-full bg-white/10 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-cyan-400 to-emerald-400 transition-all duration-300 ease-out"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          {/* Timer & Exit */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            {/* Timer Badge */}
            <div
              className={`flex items-center gap-1.5 sm:gap-2 rounded-xl border px-2.5 sm:px-3.5 py-1.5 text-xs sm:text-sm font-mono font-bold transition-all shadow-sm ${
                isTimeRunningLow
                  ? "border-rose-500/40 bg-rose-500/10 text-rose-400 animate-pulse shadow-rose-500/10"
                  : "border-cyan-400/20 bg-cyan-400/10 text-cyan-300"
              }`}
            >
              <Clock size={14} className={isTimeRunningLow ? "text-rose-400" : "text-cyan-400"} />
              <span>
                {minutes}:{seconds}
              </span>
            </div>

            {/* Exit Button */}
            <button
              type="button"
              onClick={() => setShowExitConfirm(true)}
              title="Exit Assessment"
              className="flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04] text-slate-400 transition hover:border-white/20 hover:bg-white/10 hover:text-white cursor-pointer"
            >
              <X size={16} />
            </button>
          </div>
        </div>

        {/* Mobile-only Progress Bar */}
        <div className="md:hidden mt-2.5 h-1 w-full rounded-full bg-white/10 overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-cyan-400 to-emerald-400 transition-all duration-300 ease-out"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Main Assessment Canvas (Scrollable area) */}
      <main className="relative z-10 flex-1 overflow-y-auto flex flex-col justify-start sm:justify-center max-w-4xl w-full mx-auto px-4 sm:px-6 py-4 sm:py-6">
        <div className="w-full rounded-2xl sm:rounded-3xl border-0 sm:border border-white/[0.08] bg-transparent sm:bg-slate-900/50 p-0 sm:p-8 md:p-10 sm:backdrop-blur-2xl sm:shadow-[0_0_50px_rgba(0,0,0,0.4)]">
          {/* Question Header & Meta */}
          <div className="flex items-center justify-between gap-2 sm:gap-4 mb-4 sm:mb-5 pb-3 sm:pb-4 border-b border-white/[0.06]">
            <div className="inline-flex items-center gap-1.5 sm:gap-2 rounded-lg bg-cyan-500/10 border border-cyan-500/20 px-2.5 sm:px-3 py-1 text-[11px] sm:text-xs font-bold uppercase tracking-wider text-cyan-300 whitespace-nowrap">
              <span>Question {currentQuestion + 1}</span>
              <span className="text-cyan-500">•</span>
              <span className="text-slate-400 font-normal">Single Choice</span>
            </div>

            <span className="text-xs font-medium text-slate-400 whitespace-nowrap">
              {answeredCount} of {questions.length} answered
            </span>
          </div>

          {/* Question Prompt */}
          <h1 className="text-lg sm:text-2xl lg:text-3xl font-semibold text-white tracking-tight leading-snug sm:leading-relaxed mb-5 sm:mb-8">
            {question.question}
          </h1>

          {/* Options List */}
          <div className="space-y-3 sm:space-y-3.5">
            {question.options.map((option, index) => {
              const isSelected = currentAnswer === index;
              const letter = String.fromCharCode(65 + index);

              return (
                <div
                  key={index}
                  onClick={() => handleSelect(index)}
                  role="button"
                  tabIndex={0}
                  className={`
                    group relative flex cursor-pointer items-center justify-between
                    rounded-2xl border p-3.5 sm:p-4.5
                    transition-all duration-150 ease-out select-none active:scale-[0.99]
                    ${
                      isSelected
                        ? "border-cyan-400 bg-cyan-950/40 text-white shadow-[0_0_25px_rgba(6,182,212,0.18)] ring-1 ring-cyan-400/50 sm:scale-[1.008]"
                        : "border-white/[0.08] bg-slate-900/60 sm:bg-slate-950/40 text-slate-300 hover:border-white/20 hover:bg-slate-800/70 hover:text-white"
                    }
                  `}
                >
                  <div className="flex items-center gap-3 sm:gap-4 pr-3 sm:pr-4 min-w-0">
                    {/* Option Badge (A, B, C, D) */}
                    <div
                      className={`flex h-8 w-8 sm:h-9 sm:w-9 shrink-0 items-center justify-center rounded-xl text-xs sm:text-sm font-bold font-mono transition-all ${
                        isSelected
                          ? "bg-cyan-400 text-slate-950 shadow-md shadow-cyan-400/30"
                          : "border border-white/10 bg-white/[0.04] text-slate-400 group-hover:border-white/20 group-hover:text-white"
                      }`}
                    >
                      {letter}
                    </div>

                    {/* Option Text */}
                    <span className="text-sm sm:text-base lg:text-lg font-normal leading-snug break-words">
                      {option}
                    </span>
                  </div>

                  {/* Check / Radio Status */}
                  <div
                    className={`flex h-5 w-5 sm:h-6 sm:w-6 shrink-0 items-center justify-center rounded-full border transition-all ${
                      isSelected
                        ? "border-cyan-400 bg-cyan-400 text-slate-950"
                        : "border-white/20 bg-transparent group-hover:border-white/40"
                    }`}
                  >
                    {isSelected && <Check size={14} strokeWidth={3} />}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Error message */}
          {error && (
            <div className="mt-4 rounded-xl border border-rose-500/20 bg-rose-500/10 p-3 text-xs sm:text-sm text-rose-400 flex items-center gap-2">
              <AlertCircle size={16} className="shrink-0" />
              <span>{error}</span>
            </div>
          )}
        </div>
      </main>

      {/* Bottom Navigation Dock (Sticky & Responsive) */}
      <div className="sticky bottom-0 z-30 shrink-0 w-full border-t border-white/[0.08] bg-[#070B1A]/95 backdrop-blur-xl px-4 sm:px-8 py-3 sm:py-4">
        <div className="mx-auto flex max-w-4xl items-center justify-between gap-2 sm:gap-4">
          {/* Previous Button */}
          <button
            type="button"
            onClick={handlePrevious}
            disabled={currentQuestion === 0 || submitting}
            className="
              flex items-center gap-1.5 sm:gap-2 rounded-xl
              border border-white/10 bg-slate-900/60
              px-3.5 sm:px-5 py-2.5 sm:py-3 text-xs sm:text-sm font-medium text-slate-300
              transition-all duration-150 whitespace-nowrap
              hover:bg-slate-800 hover:text-white hover:border-white/20
              disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:bg-slate-900/60 disabled:hover:text-slate-300
              cursor-pointer shrink-0
            "
          >
            <ArrowLeft size={15} />
            <span className="hidden sm:inline">Previous</span>
            <span className="sm:hidden">Prev</span>
          </button>

          {/* Center Info: Question Count & Answered status */}
          <div className="flex flex-col items-center justify-center text-center px-1">
            <span className="text-xs sm:text-sm font-semibold text-white whitespace-nowrap">
              Question {currentQuestion + 1}
              <span className="text-slate-400 font-normal hidden sm:inline">
                {" "}of {questions.length}
              </span>
              <span className="text-slate-400 font-normal sm:hidden">
                /{questions.length}
              </span>
            </span>
            <span className="text-[11px] text-slate-400 mt-0.5 hidden sm:block whitespace-nowrap">
              {answeredCount} answered
            </span>
          </div>

          {/* Next / Submit Button */}
          <button
            type="button"
            onClick={
              currentQuestion === questions.length - 1
                ? handleSubmit
                : handleNext
            }
            disabled={submitting}
            className="
              flex items-center gap-1.5 sm:gap-2 rounded-xl
              bg-cyan-400 hover:bg-cyan-300
              px-4 sm:px-7 py-2.5 sm:py-3 text-xs sm:text-sm font-bold text-slate-950
              shadow-[0_0_20px_rgba(6,182,212,0.25)]
              transition-all duration-150 whitespace-nowrap
              hover:shadow-[0_0_30px_rgba(6,182,212,0.4)] hover:scale-[1.02]
              disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:scale-100
              cursor-pointer shrink-0
            "
          >
            {submitting ? (
              <>
                <Loader2 size={15} className="animate-spin" />
                <span>Submitting...</span>
              </>
            ) : currentQuestion === questions.length - 1 ? (
              <>
                <span className="hidden sm:inline">Submit Assessment</span>
                <span className="sm:hidden">Submit</span>
                <CheckCircle2 size={15} />
              </>
            ) : (
              <>
                <span className="hidden sm:inline">Next Question</span>
                <span className="sm:hidden">Next</span>
                <ArrowRight size={15} />
              </>
            )}
          </button>
        </div>
      </div>

      {/* Exit Confirmation Modal */}
      {showExitConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="max-w-sm w-full rounded-3xl border border-white/10 bg-slate-900/95 p-6 text-center shadow-2xl backdrop-blur-2xl animate-in zoom-in-95 duration-150">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-500/10 text-amber-400 border border-amber-500/20 mb-4 shadow-[0_0_20px_rgba(245,158,11,0.15)]">
              <AlertCircle size={28} />
            </div>

            <h3 className="text-lg font-bold text-white">Exit Assessment?</h3>
            <p className="mt-2 text-sm text-slate-300">
              Your test is currently in progress. If you leave now, any unsubmitted progress will be lost.
            </p>

            <div className="mt-6 flex gap-3">
              <button
                type="button"
                onClick={() => setShowExitConfirm(false)}
                className="flex-1 rounded-xl border border-white/10 bg-white/5 py-2.5 text-sm font-semibold text-white hover:bg-white/10 transition cursor-pointer"
              >
                Continue Test
              </button>
              <button
                type="button"
                onClick={() => navigate(`/course/${courseId}`)}
                className="flex-1 rounded-xl bg-rose-500/20 border border-rose-500/30 py-2.5 text-sm font-semibold text-rose-300 hover:bg-rose-500/30 transition cursor-pointer"
              >
                Exit
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Answer Required / Incomplete Modal */}
      {showIncompleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-in fade-in duration-200">
          <div className="max-w-md w-full rounded-3xl border border-white/10 bg-slate-900/95 p-6 sm:p-8 text-center shadow-2xl backdrop-blur-2xl animate-in zoom-in-95 duration-200">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-amber-500/10 text-amber-400 border border-amber-500/25 mb-5 shadow-[0_0_25px_rgba(245,158,11,0.15)]">
              <ShieldAlert size={32} />
            </div>

            <h3 className="text-xl font-bold text-white">
              Please Select an Answer
            </h3>

            <p className="mt-3 text-sm text-slate-300 leading-relaxed">
              You must select an answer before proceeding or submitting the assessment.
            </p>

            <div className="mt-5 rounded-2xl bg-white/[0.04] border border-white/10 p-4 flex items-center justify-between text-xs sm:text-sm">
              <span className="text-slate-400">Total Progress:</span>
              <span className="font-semibold text-cyan-400">
                {answeredCount} of {questions.length} Questions Answered
              </span>
            </div>

            <div className="mt-6 flex flex-col sm:flex-row gap-3">
              <button
                type="button"
                onClick={() => {
                  setShowIncompleteModal(false);
                  setCurrentQuestion(incompleteIndex);
                }}
                className="w-full rounded-xl bg-gradient-to-r from-cyan-400 to-emerald-400 py-3 text-sm font-bold text-slate-950 hover:shadow-[0_0_20px_rgba(6,182,212,0.35)] transition cursor-pointer"
              >
                Go to Question {incompleteIndex + 1}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Assessment;