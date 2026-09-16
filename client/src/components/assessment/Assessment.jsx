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
  ShieldAlert,
} from "lucide-react";

import api from "../../services/api";
import toast from "react-hot-toast";
import ResultCard from "./ResultCard";

const Assessment = ()  => {
  const { courseId } = useParams();
  const navigate = useNavigate();

  /*
  |--------------------------------------------------------------------------
  | Storage Keys
  |--------------------------------------------------------------------------
  */

  const storageKey = `skilium_assessment_${courseId}`;

  /*
   * IMPORTANT:
   * Use a course-specific session key.
   */
  const sessionIdStorageKey = `assessmentSessionId_${courseId}`;

  /*
  |--------------------------------------------------------------------------
  | State
  |--------------------------------------------------------------------------
  */

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

  /*
  |--------------------------------------------------------------------------
  | Refs
  |--------------------------------------------------------------------------
  */

  const answersRef = useRef({});

  const hasSubmittedRef = useRef(false);

  const expiryTimeRef = useRef(null);

  const sessionIdRef = useRef(null);

  /*
  |--------------------------------------------------------------------------
  | Save Local Progress
  |--------------------------------------------------------------------------
  */

  const saveProgress = useCallback(
    (updatedAnswers, expiresAt) => {
      try {
        sessionStorage.setItem(
          storageKey,
          JSON.stringify({
            answers: updatedAnswers,
            expiresAt: expiresAt || null,
          }),
        );
      } catch (err) {
        console.error("Failed to save assessment progress:", err);
      }
    },
    [storageKey],
  );

  /*
  |--------------------------------------------------------------------------
  | Get Valid Session ID
  |--------------------------------------------------------------------------
  */

  const getSessionId = useCallback(() => {
    let sessionId = null;

    try {
      /*
       * First try course-specific key.
       */
      sessionId = sessionStorage.getItem(sessionIdStorageKey);

      /*
       * Backward compatibility with your
       * existing global key.
       */
      if (!sessionId || sessionId === "undefined" || sessionId === "null") {
        sessionId = sessionStorage.getItem("assessmentSessionId");
      }
    } catch (err) {
      console.error("Unable to read assessment session:", err);

      return null;
    }

    /*
     * VERY IMPORTANT
     *
     * Do not allow these values to reach
     * the backend:
     *
     * undefined
     * null
     * empty string
     */
    if (
      !sessionId ||
      sessionId === "undefined" ||
      sessionId === "null" ||
      sessionId.trim() === ""
    ) {
      return null;
    }

    return sessionId.trim();
  }, [sessionIdStorageKey]);

  /*
  |--------------------------------------------------------------------------
  | Load Assessment
  |--------------------------------------------------------------------------
  */

  useEffect(() => {
    let mounted = true;

    const loadAssessment = async () => {
      try {
        setLoading(true);
        setError("");

        /*
         * Validate course ID
         */
        if (!courseId || courseId === "undefined" || courseId === "null") {
          throw new Error(
            "Course ID is missing. Please start the assessment again.",
          );
        }

        /*
         * Get session ID
         */
        const sessionId = getSessionId();

        console.log("Assessment courseId:", courseId);

        console.log("Assessment sessionId:", sessionId);

        /*
         * IMPORTANT:
         *
         * Stop here.
         * Do NOT call:
         *
         * /assessment/session/undefined
         */
        if (!sessionId) {
          throw new Error(
            "Assessment session not found. Please start the assessment again.",
          );
        }

        sessionIdRef.current = sessionId;

        /*
         |--------------------------------------------------------------------------
         | STEP 1
         | Get assessment session
         |--------------------------------------------------------------------------
         */

        const sessionResponse = await api.get(
          `/assessment/session/${encodeURIComponent(sessionId)}`,
        );

        if (!sessionResponse.data?.success) {
          throw new Error(
            sessionResponse.data?.message ||
              "Unable to load assessment session.",
          );
        }

        const session = sessionResponse.data.data;

        if (!session) {
          throw new Error("Assessment session data was not found.");
        }

        /*
         |--------------------------------------------------------------------------
         | STEP 2
         | Get questions
         |--------------------------------------------------------------------------
         */

        const questionResponse = await api.get(
          `/assessment/${encodeURIComponent(courseId)}/questions/${encodeURIComponent(sessionId)}`,
        );

        if (!questionResponse.data?.success) {
          throw new Error(
            questionResponse.data?.message ||
              "Unable to load assessment questions.",
          );
        }

        const loadedQuestions = questionResponse.data.data || [];

        /*
         |--------------------------------------------------------------------------
         | STEP 3
         | Set questions
         |--------------------------------------------------------------------------
         */

        if (mounted) {
          setQuestions(loadedQuestions);
        }

        /*
         |--------------------------------------------------------------------------
         | STEP 4
         | Set program
         |--------------------------------------------------------------------------
         */

        if (session.program && mounted) {
          setProgram(session.program);
        }

        /*
         |--------------------------------------------------------------------------
         | STEP 5
         | Restore backend answers
         |--------------------------------------------------------------------------
         */

        let savedAnswers = session.answers || {};

        /*
         |--------------------------------------------------------------------------
         | STEP 6
         | Restore local backup
         |--------------------------------------------------------------------------
         */

        try {
          const localData = sessionStorage.getItem(storageKey);

          if (localData) {
            const parsed = JSON.parse(localData);

            /*
             * Backend is primary.
             *
             * Local backup is used only
             * when backend has no answers.
             */
            if (Object.keys(savedAnswers).length === 0 && parsed?.answers) {
              savedAnswers = parsed.answers;
            }

            /*
             * Restore local expiry
             */
            if (parsed?.expiresAt) {
              expiryTimeRef.current = parsed.expiresAt;
            }
          }
        } catch (storageError) {
          console.error("Unable to restore local assessment:", storageError);
        }

        /*
         |--------------------------------------------------------------------------
         | STEP 7
         | Restore answers
         |--------------------------------------------------------------------------
         */

        if (mounted) {
          setAnswers(savedAnswers);
        }

        answersRef.current = savedAnswers;

        /*
         |--------------------------------------------------------------------------
         | STEP 8
         | Restore backend expiry
         |--------------------------------------------------------------------------
         */

        if (session.expiresAt) {
          const expiresAt = new Date(session.expiresAt).getTime();

          if (!Number.isNaN(expiresAt)) {
            expiryTimeRef.current = expiresAt;
          }
        }

        /*
         |--------------------------------------------------------------------------
         | STEP 9
         | Calculate remaining time
         |--------------------------------------------------------------------------
         */

        if (expiryTimeRef.current) {
          const remaining = Math.max(
            0,
            Math.ceil((expiryTimeRef.current - Date.now()) / 1000),
          );

          if (mounted) {
            setTime(remaining);
          }
        }

        /*
         |--------------------------------------------------------------------------
         | Finish loading
         |--------------------------------------------------------------------------
         */

        if (mounted) {
          setLoading(false);
        }
      } catch (err) {
        console.error("Assessment loading error:", err);

        if (mounted) {
          setError(
            err.response?.data?.message ||
              err.message ||
              "Unable to load assessment.",
          );

          setLoading(false);
        }
      }
    };

    loadAssessment();

    return () => {
      mounted = false;
    };
  }, [courseId, storageKey, getSessionId]);

  /*
  |--------------------------------------------------------------------------
  | Find Unanswered Question
  |--------------------------------------------------------------------------
  */

  const getUnansweredQuestionIndex = useCallback(
    (currentAnswers = answersRef.current) => {
      if (!questions || questions.length === 0) {
        return -1;
      }

      return questions.findIndex((q) => {
        const qId = String(q?._id || q?.id || "");

        const answer = currentAnswers[qId];

        return answer === undefined || answer === "" || answer === null;
      });
    },
    [questions],
  );

  /*
  |--------------------------------------------------------------------------
  | Save Answers To Backend
  |--------------------------------------------------------------------------
  */

  const saveAnswersToBackend = useCallback(
    async (updatedAnswers, forceSubmit = false) => {
      const sessionId = sessionIdRef.current || getSessionId();

      /*
       * NEVER send undefined
       */
      if (!sessionId || sessionId === "undefined" || sessionId === "null") {
        console.error("Assessment session ID is missing.");

        return false;
      }

      try {
        await api.put(
          `/assessment/session/${encodeURIComponent(sessionId)}/answers`,
          {
            answers: updatedAnswers,
            forceSubmit: forceSubmit
          },
        );

        return true;
      } catch (err) {
        console.error("Failed to save answers:", err);

        return false;
      }
    },
    [getSessionId],
  );

  /*
  |--------------------------------------------------------------------------
  | Select Answer
  |--------------------------------------------------------------------------
  */

  const handleSelect = useCallback(
    async (answerIndex) => {
      const question = questions[currentQuestion];

      if (!question) {
        return;
      }

      const qId = String(question._id || question.id || "");

      if (!qId) {
        console.error("Question ID is missing.");

        return;
      }

      setError("");

      /*
       * Update answers immediately
       */
      const updatedAnswers = {
        ...answersRef.current,
        [qId]: answerIndex,
      };

      answersRef.current = updatedAnswers;

      setAnswers(updatedAnswers);

      /*
       * Save locally
       */
      saveProgress(updatedAnswers, expiryTimeRef.current);

      /*
       * Save backend
       */
      await saveAnswersToBackend(updatedAnswers);
    },
    [questions, currentQuestion, saveProgress, saveAnswersToBackend],
  );

  /*
  |--------------------------------------------------------------------------
  | Submit Assessment
  |--------------------------------------------------------------------------
  */

  const submitAssessment = useCallback(
    async (finalAnswers = answersRef.current, forceSubmit = false) => {
      if (hasSubmittedRef.current) {
        return;
      }

      /*
       * Check unanswered questions
       */
      if (!forceSubmit) {
        const unansweredIndex = getUnansweredQuestionIndex(finalAnswers);

        if (unansweredIndex !== -1) {
          setIncompleteIndex(unansweredIndex);

          setShowIncompleteModal(true);

          return;
        }
      }

      /*
       * Prevent double submit
       */
      hasSubmittedRef.current = true;

      try {
        setSubmitting(true);
        setError("");

        /*
         * Get session ID
         */
        const sessionId = sessionIdRef.current || getSessionId();

        /*
         * Validate session ID
         */
        if (!sessionId || sessionId === "undefined" || sessionId === "null") {
          throw new Error(
            "Assessment session has expired. Please start again.",
          );
        }

        /*
           |--------------------------------------------------------------------------
           | STEP 1
           | Save latest answers
           |--------------------------------------------------------------------------
           */

        const saved = await saveAnswersToBackend(finalAnswers, true);

        if (!saved) {
          throw new Error("Unable to save your answers. Please try again.");
        }

        /*
           |--------------------------------------------------------------------------
           | STEP 2
           | Complete assessment
           |--------------------------------------------------------------------------
           */

        const response = await api.post("/assessment/complete", {
          sessionId,
          forceSubmit: forceSubmit,
        });

        if (!response.data?.success) {
          throw new Error(
            response.data?.message || "Assessment completion failed.",
          );
        }

        /*
           |--------------------------------------------------------------------------
           | STEP 3
           | Clear storage
           |--------------------------------------------------------------------------
           */

        try {
          sessionStorage.removeItem(storageKey);

          sessionStorage.removeItem(sessionIdStorageKey);

          /*
           * Remove old key too
           */
          sessionStorage.removeItem("assessmentSessionId");

          sessionStorage.removeItem("assessmentProgramId");
        } catch (storageError) {
          console.error("Failed to clear assessment storage:", storageError);
        }

        /*
           |--------------------------------------------------------------------------
           | STEP 4
           | Show result
           |--------------------------------------------------------------------------
           */

        setResult(response.data.data);
      } catch (err) {
        hasSubmittedRef.current = false;

        console.error("Assessment submit error:", err);

        setError(
          err.response?.data?.message ||
            err.message ||
            "Unable to submit assessment.",
        );
      } finally {
        setSubmitting(false);
      }
    },
    [
      getUnansweredQuestionIndex,
      getSessionId,
      saveAnswersToBackend,
      storageKey,
      sessionIdStorageKey,
    ],
  );

  /*
  |--------------------------------------------------------------------------
  | Timer
  |--------------------------------------------------------------------------
  */

  useEffect(() => {
    if (loading || result || questions.length === 0 || !expiryTimeRef.current) {
      return;
    }

    const updateTimer = () => {
      const remaining = Math.max(
        0,
        Math.ceil((expiryTimeRef.current - Date.now()) / 1000),
      );

      setTime(remaining);

      if (remaining <= 0 && !hasSubmittedRef.current) {
        toast("Time is up! Submitting your assessment...", {
          icon: "⏰",
          id: "time-up-toast",
        });

        submitAssessment(answersRef.current, true);
      }
    };

    updateTimer();

    const timer = setInterval(updateTimer, 1000);

    return () => clearInterval(timer);
  }, [loading, result, questions.length, submitAssessment]);

  /*
  |--------------------------------------------------------------------------
  | Current Question
  |--------------------------------------------------------------------------
  */

  const question = questions[currentQuestion];

  const questionId = question?._id || question?.id;

  const currentAnswer =
    questionId && answers[String(questionId)] !== undefined
      ? answers[String(questionId)]
      : null;

  /*
  |--------------------------------------------------------------------------
  | Previous Question
  |--------------------------------------------------------------------------
  */

  const handlePrevious = () => {
    if (currentQuestion === 0) {
      return;
    }

    setError("");

    setCurrentQuestion((prev) => prev - 1);
  };

  /*
  |--------------------------------------------------------------------------
  | Next Question
  |--------------------------------------------------------------------------
  */

  const handleNext = () => {
    setError("");

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion((prev) => prev + 1);
    }
  };

  /*
  |--------------------------------------------------------------------------
  | Final Submit
  |--------------------------------------------------------------------------
  */

  const handleSubmit = async () => {
    setError("");

    const unansweredIndex = getUnansweredQuestionIndex(answersRef.current);

    if (unansweredIndex !== -1) {
      setIncompleteIndex(unansweredIndex);

      setShowIncompleteModal(true);

      return;
    }

    await submitAssessment(answersRef.current);
  };

  /*
  |--------------------------------------------------------------------------
  | Keyboard Shortcuts
  |--------------------------------------------------------------------------
  */

  const handleKeyDown = useCallback(
    (e) => {
      if (
        loading ||
        result ||
        !question ||
        showExitConfirm ||
        showIncompleteModal
      ) {
        return;
      }

      /*
       * Only allow A, B, C, D for option selection.
       * Ctrl, Alt, Shift, Meta, etc. should NOT select options.
       */
      const key = e.key.toLowerCase();

      const optionKeys = ["a", "b", "c", "d"];

      if (optionKeys.includes(key)) {
        const letterIndex = optionKeys.indexOf(key);

        if (letterIndex < question.options?.length) {
          e.preventDefault();
          handleSelect(letterIndex);
          return;
        }
      }

      /*
       * 1, 2, 3, 4
       */
      const num = parseInt(e.key, 10);

      if (
        !Number.isNaN(num) &&
        num >= 1 &&
        num <= (question.options?.length || 0)
      ) {
        e.preventDefault();
        handleSelect(num - 1);
        return;
      }

      /*
       * Enter
       */
      if (e.key === "Enter") {
        e.preventDefault();

        if (currentQuestion === questions.length - 1) {
          handleSubmit();
        } else {
          handleNext();
        }
      }
    },
    [
      loading,
      result,
      question,
      currentQuestion,
      questions.length,
      showExitConfirm,
      showIncompleteModal,
      handleSelect,
      handleSubmit,
    ],
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
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
    const qId = String(q?._id || q?.id || "");

    return (
      answers[qId] !== undefined && answers[qId] !== "" && answers[qId] !== null
    );
  }).length;

  const progressPercent =
    questions.length > 0 ? ((currentQuestion + 1) / questions.length) * 100 : 0;

  /*
  |--------------------------------------------------------------------------
  | Loading
  |--------------------------------------------------------------------------
  */

  if (loading) {
    return (
      <div className="min-h-screen bg-[#070B1A] flex flex-col items-center justify-center p-6 text-white relative overflow-hidden">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col items-center text-center">
          <Link
            to="/"
            className="mb-8 text-2xl font-black tracking-widest text-white"
          >
            Skilium
          </Link>

          <div className="relative flex h-20 w-20 items-center justify-center rounded-3xl bg-slate-900/80 border border-white/10 shadow-[0_0_40px_rgba(6,182,212,0.2)]">
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
  | Error
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

          <p className="mt-3 text-sm text-slate-300 leading-relaxed">{error}</p>

          <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={() => window.location.reload()}
              className="rounded-xl bg-gradient-to-r from-cyan-400 to-emerald-400 px-6 py-3 font-bold text-slate-950 cursor-pointer"
            >
              Try Again
            </button>

            <Link
              to="/#courses"
              className="rounded-xl border border-white/10 bg-white/5 px-6 py-3 font-semibold text-white"
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
  | Result
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
              className="text-2xl font-black tracking-widest text-white"
            >
              Skilium
            </Link>

            <Link
              to="/#courses"
              className="text-sm font-medium text-slate-400 hover:text-white transition flex items-center gap-1.5"
            >
              <ArrowLeft size={16} />
              <span>Back to Courses</span>
            </Link>
          </div>

          <ResultCard result={result} program={program} courseId={courseId} />
        </div>
      </div>
    );
  }

  /*
  |--------------------------------------------------------------------------
  | No Questions
  |--------------------------------------------------------------------------
  */

  if (!questions.length) {
    return (
      <div className="min-h-screen bg-[#070B1A] flex flex-col items-center justify-center p-6 text-white">
        <div className="relative z-10 max-w-md w-full text-center rounded-3xl border border-white/10 bg-slate-900/80 p-8">
          <HelpCircle className="mx-auto h-12 w-12 text-cyan-400" />

          <h2 className="mt-4 text-2xl font-bold text-white">
            No Questions Available
          </h2>

          <p className="mt-2 text-sm text-slate-400">
            There are currently no assessment questions for this course.
          </p>

          <Link
            to="/#courses"
            className="mt-6 inline-block rounded-xl bg-gradient-to-r from-cyan-400 to-emerald-400 px-6 py-3 font-bold text-slate-950"
          >
            Explore Courses
          </Link>
        </div>
      </div>
    );
  }

  /*
  |--------------------------------------------------------------------------
  | Active Assessment
  |--------------------------------------------------------------------------
  */

  return (
    <div className="min-h-screen sm:h-screen flex flex-col justify-between bg-[#070B1A] text-slate-100 relative overflow-hidden font-sans">
      {/* Background */}

      <div className="absolute -top-40 -left-40 h-[500px] w-[500px] rounded-full bg-cyan-500/10 blur-[150px] pointer-events-none" />

      <div className="absolute -bottom-40 -right-40 h-[500px] w-[500px] rounded-full bg-emerald-500/10 blur-[150px] pointer-events-none" />

      {/* Top Bar */}

      <div className="sticky top-0 z-30 shrink-0 w-full border-b border-white/[0.08] bg-[#070B1A]/95 backdrop-blur-md px-4 sm:px-8 py-3">
        <div className="mx-auto flex max-w-4xl items-center justify-between gap-3">
          <div className="flex items-center gap-2 sm:gap-3 min-w-0">
            <Link
              to="/"
              className="text-lg sm:text-2xl font-black tracking-widest text-white shrink-0"
            >
              Skilium
            </Link>

            <span className="hidden sm:inline-block h-4 w-px bg-white/20" />

            <div className="hidden sm:flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-xs font-medium text-slate-300 truncate max-w-[240px]">
              <Sparkles size={12} className="text-cyan-400 shrink-0" />

              <span className="truncate">
                {program?.name || "Skill Assessment"}
              </span>
            </div>
          </div>

          <div className="hidden md:flex items-center gap-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Question {currentQuestion + 1} of {questions.length}
            </span>

            <div className="h-2 w-28 rounded-full bg-white/10 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-cyan-400 to-emerald-400 transition-all duration-300"
                style={{
                  width: `${progressPercent}%`,
                }}
              />
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            <div
              className={`flex items-center gap-1.5 sm:gap-2 rounded-xl border px-2.5 sm:px-3.5 py-1.5 text-xs sm:text-sm font-mono font-bold ${
                isTimeRunningLow
                  ? "border-rose-500/40 bg-rose-500/10 text-rose-400 animate-pulse"
                  : "border-cyan-400/20 bg-cyan-400/10 text-cyan-300"
              }`}
            >
              <Clock size={14} />

              <span>
                {minutes}:{seconds}
              </span>
            </div>

            <button
              type="button"
              onClick={() => setShowExitConfirm(true)}
              className="flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04] text-slate-400 hover:bg-white/10 hover:text-white cursor-pointer"
            >
              <X size={16} />
            </button>
          </div>
        </div>

        <div className="md:hidden mt-2.5 h-1 w-full rounded-full bg-white/10 overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-cyan-400 to-emerald-400"
            style={{
              width: `${progressPercent}%`,
            }}
          />
        </div>
      </div>

      {/* Main */}

      <main className="relative z-10 flex-1 overflow-y-auto flex flex-col justify-start sm:justify-center max-w-4xl w-full mx-auto px-4 sm:px-6 py-4 sm:py-6">
        <div className="w-full rounded-2xl sm:rounded-3xl border-0 sm:border border-white/[0.08] bg-transparent sm:bg-slate-900/50 p-0 sm:p-8 md:p-10">
          <div className="flex items-center justify-between gap-2 sm:gap-4 mb-4 sm:mb-5 pb-3 sm:pb-4 border-b border-white/[0.06]">
            <div className="inline-flex items-center gap-1.5 sm:gap-2 rounded-lg bg-cyan-500/10 border border-cyan-500/20 px-2.5 sm:px-3 py-1 text-[11px] sm:text-xs font-bold uppercase tracking-wider text-cyan-300">
              <span>Question {currentQuestion + 1}</span>

              <span className="text-cyan-500">•</span>

              <span className="text-slate-400 font-normal">Single Choice</span>
            </div>

            <span className="text-xs font-medium text-slate-400 whitespace-nowrap">
              {answeredCount} of {questions.length} answered
            </span>
          </div>

          <h1 className="text-lg sm:text-2xl lg:text-3xl font-semibold text-white tracking-tight leading-snug sm:leading-relaxed mb-5 sm:mb-8">
            {question.question}
          </h1>

          <div className="space-y-3 sm:space-y-3.5">
            {question.options?.map((option, index) => {
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
                      transition-all duration-150
                      select-none
                      ${
                        isSelected
                          ? "border-cyan-400 bg-cyan-950/40 text-white shadow-[0_0_25px_rgba(6,182,212,0.18)] ring-1 ring-cyan-400/50"
                          : "border-white/[0.08] bg-slate-900/60 text-slate-300 hover:border-white/20 hover:bg-slate-800/70 hover:text-white"
                      }
                    `}
                >
                  <div className="flex items-center gap-3 sm:gap-4 pr-3 sm:pr-4 min-w-0">
                    <div
                      className={`flex h-8 w-8 sm:h-9 sm:w-9 shrink-0 items-center justify-center rounded-xl text-xs sm:text-sm font-bold font-mono ${
                        isSelected
                          ? "bg-cyan-400 text-slate-950"
                          : "border border-white/10 bg-white/[0.04] text-slate-400"
                      }`}
                    >
                      {letter}
                    </div>

                    <span className="text-sm sm:text-base lg:text-lg font-normal leading-snug break-words">
                      {option}
                    </span>
                  </div>

                  <div
                    className={`flex h-5 w-5 sm:h-6 sm:w-6 shrink-0 items-center justify-center rounded-full border ${
                      isSelected
                        ? "border-cyan-400 bg-cyan-400 text-slate-950"
                        : "border-white/20 bg-transparent"
                    }`}
                  >
                    {isSelected && <Check size={14} strokeWidth={3} />}
                  </div>
                </div>
              );
            })}
          </div>

          {error && (
            <div className="mt-4 rounded-xl border border-rose-500/20 bg-rose-500/10 p-3 text-xs sm:text-sm text-rose-400 flex items-center gap-2">
              <AlertCircle size={16} />

              <span>{error}</span>
            </div>
          )}
        </div>
      </main>

      {/* Bottom Navigation */}

      <div className="sticky bottom-0 z-30 shrink-0 w-full border-t border-white/[0.08] bg-[#070B1A]/95 backdrop-blur-xl px-4 sm:px-8 py-3 sm:py-4">
        <div className="mx-auto flex max-w-4xl items-center justify-between gap-2 sm:gap-4">
          <button
            type="button"
            onClick={handlePrevious}
            disabled={currentQuestion === 0 || submitting}
            className="flex items-center gap-1.5 sm:gap-2 rounded-xl border border-white/10 bg-slate-900/60 px-3.5 sm:px-5 py-2.5 sm:py-3 text-xs sm:text-sm font-medium text-slate-300 disabled:opacity-30 cursor-pointer"
          >
            <ArrowLeft size={15} />

            <span className="hidden sm:inline">Previous</span>

            <span className="sm:hidden">Prev</span>
          </button>

          <div className="flex flex-col items-center justify-center text-center px-1">
            <span className="text-xs sm:text-sm font-semibold text-white">
              Question {currentQuestion + 1}
              <span className="text-slate-400 font-normal">
                {" "}
                /{questions.length}
              </span>
            </span>

            <span className="text-[11px] text-slate-400 mt-0.5 hidden sm:block">
              {answeredCount} answered
            </span>
          </div>

          <button
            type="button"
            onClick={
              currentQuestion === questions.length - 1
                ? handleSubmit
                : handleNext
            }
            disabled={submitting}
            className="flex items-center gap-1.5 sm:gap-2 rounded-xl bg-cyan-400 hover:bg-cyan-300 px-4 sm:px-7 py-2.5 sm:py-3 text-xs sm:text-sm font-bold text-slate-950 disabled:opacity-50 cursor-pointer"
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

      {/* Exit Modal */}

      {showExitConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
          <div className="max-w-sm w-full rounded-3xl border border-white/10 bg-slate-900/95 p-6 text-center shadow-2xl">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-500/10 text-amber-400 border border-amber-500/20 mb-4">
              <AlertCircle size={28} />
            </div>

            <h3 className="text-lg font-bold text-white">Exit Assessment?</h3>

            <p className="mt-2 text-sm text-slate-300">
              Your assessment progress will remain saved in this browser tab.
            </p>

            <div className="mt-6 flex gap-3">
              <button
                type="button"
                onClick={() => setShowExitConfirm(false)}
                className="flex-1 rounded-xl border border-white/10 bg-white/5 py-2.5 text-sm font-semibold text-white cursor-pointer"
              >
                Continue Test
              </button>

              <button
                type="button"
                onClick={() => navigate(`/course/${courseId}`)}
                className="flex-1 rounded-xl bg-rose-500/20 border border-rose-500/30 py-2.5 text-sm font-semibold text-rose-300 cursor-pointer"
              >
                Exit
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Incomplete Modal */}

      {showIncompleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md">
          <div className="max-w-md w-full rounded-3xl border border-white/10 bg-slate-900/95 p-6 sm:p-8 text-center shadow-2xl">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-amber-500/10 text-amber-400 border border-amber-500/25 mb-5">
              <ShieldAlert size={32} />
            </div>

            <h3 className="text-xl font-bold text-white">
              Please Select an Answer
            </h3>

            <p className="mt-3 text-sm text-slate-300 leading-relaxed">
              You must select an answer before proceeding or submitting the
              assessment.
            </p>

            <div className="mt-5 rounded-2xl bg-white/[0.04] border border-white/10 p-4 flex items-center justify-between text-xs sm:text-sm">
              <span className="text-slate-400">Total Progress:</span>

              <span className="font-semibold text-cyan-400">
                {answeredCount} of {questions.length} Questions Answered
              </span>
            </div>

            <div className="mt-6">
              <button
                type="button"
                onClick={() => {
                  setShowIncompleteModal(false);

                  setCurrentQuestion(incompleteIndex);
                }}
                className="w-full rounded-xl bg-gradient-to-r from-cyan-400 to-emerald-400 py-3 text-sm font-bold text-slate-950 cursor-pointer"
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
