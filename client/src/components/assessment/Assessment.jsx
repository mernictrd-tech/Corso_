import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../../services/api";
import ResultCard from "./ResultCard";

const Assessment = () => {
  const { courseId } = useParams();

  const [questions, setQuestions] = useState([]);
  const [program, setProgram] = useState(null);

  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selected, setSelected] = useState("");
  const [answers, setAnswers] = useState({});

  const [time, setTime] = useState(600);

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const [result, setResult] = useState(null);

  /*
  |--------------------------------------------------------------------------
  | Load Questions
  |--------------------------------------------------------------------------
  */

  useEffect(() => {
    const loadAssessment = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await api.get(
          `/assessment/${courseId}/questions`
        );

        if (!response.data.success) {
          throw new Error(
            response.data.message || "Failed to load assessment."
          );
        }

        setQuestions(response.data.data);
        setProgram(response.data.program);

        // Use program exam duration if available
        const durationInMinutes =
          Number(response.data.program.examDuration) || 10;

        setTime(durationInMinutes * 60);
      } catch (err) {
        console.error("Assessment loading error:", err);

        setError(
          err.response?.data?.message ||
            err.message ||
            "Unable to load assessment."
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
  | Submit Assessment
  |--------------------------------------------------------------------------
  */

  const submitAssessment = async (finalAnswers = answers) => {
    try {
      setSubmitting(true);
      setError("");

      const response = await api.post(
        `/assessment/${courseId}/submit`,
        {
          answers: finalAnswers,
        }
      );

      if (!response.data.success) {
        throw new Error(
          response.data.message || "Assessment submission failed."
        );
      }

      setResult(response.data.data);
    } catch (err) {
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
    if (loading || result || questions.length === 0) {
      return;
    }

    if (time <= 0) {
      submitAssessment(answers);
      return;
    }

    const timer = setInterval(() => {
      setTime((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }

        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [loading, result, questions.length, time]);

  /*
  |--------------------------------------------------------------------------
  | Loading
  |--------------------------------------------------------------------------
  */

  if (loading) {
    return (
      <div className="min-h-screen bg-[#070B1A] flex items-center justify-center">
        <div className="text-center">
          <div className="text-xl font-semibold text-white">
            Loading assessment...
          </div>

          <p className="mt-2 text-gray-400">
            Please wait while we load your questions.
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
      <div className="min-h-screen bg-[#070B1A] flex items-center justify-center p-6">
        <div className="max-w-lg w-full rounded-2xl border border-red-400/20 bg-red-400/5 p-8 text-center">
          <h2 className="text-2xl font-bold text-red-400">
            Unable to Load Assessment
          </h2>

          <p className="mt-4 text-gray-300">
            {error}
          </p>
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
      <ResultCard
        result={result}
        program={program}
        courseId={courseId}
      />
    );
  }

  /*
  |--------------------------------------------------------------------------
  | No Questions
  |--------------------------------------------------------------------------
  */

  if (!questions.length) {
    return (
      <div className="min-h-screen bg-[#070B1A] flex items-center justify-center">
        <div className="text-xl font-semibold text-white">
          No questions available for this program.
        </div>
      </div>
    );
  }

  const question = questions[currentQuestion];

  /*
  |--------------------------------------------------------------------------
  | Select Answer
  |--------------------------------------------------------------------------
  */

  const handleSelect = (answerIndex) => {
    setSelected(answerIndex);

    setAnswers((prev) => ({
      ...prev,
      [question._id]: answerIndex,
    }));
  };

  /*
  |--------------------------------------------------------------------------
  | Previous
  |--------------------------------------------------------------------------
  */

  const handlePrevious = () => {
    if (currentQuestion === 0) {
      return;
    }

    const previousQuestion = currentQuestion - 1;

    setCurrentQuestion(previousQuestion);

    const previousId = questions[previousQuestion]._id;

    setSelected(
      answers[previousId] !== undefined
        ? answers[previousId]
        : ""
    );
  };

  /*
  |--------------------------------------------------------------------------
  | Next / Submit
  |--------------------------------------------------------------------------
  */

  const handleNext = async () => {
    const updatedAnswers = {
      ...answers,
      [question._id]: selected,
    };

    setAnswers(updatedAnswers);

    if (currentQuestion < questions.length - 1) {
      const nextQuestion = currentQuestion + 1;

      setCurrentQuestion(nextQuestion);

      const nextId = questions[nextQuestion]._id;

      setSelected(
        updatedAnswers[nextId] !== undefined
          ? updatedAnswers[nextId]
          : ""
      );

      return;
    }

    await submitAssessment(updatedAnswers);
  };

  /*
  |--------------------------------------------------------------------------
  | Format Time
  |--------------------------------------------------------------------------
  */

  const minutes = Math.floor(time / 60);

  const seconds = String(time % 60).padStart(2, "0");

  /*
  |--------------------------------------------------------------------------
  | UI
  |--------------------------------------------------------------------------
  */

  return (
    <div className="min-h-screen bg-[#070B1A] p-6 md:p-10">

      <div className="mx-auto max-w-3xl rounded-3xl border border-white/10 bg-white/5 p-6 md:p-8">

        {/* Header */}

        <div className="flex items-center justify-between gap-4">

          <div>

            <p className="text-sm text-gray-400">
              {program?.name}
            </p>

            <h2 className="mt-1 text-xl md:text-2xl font-bold text-white">
              Question {currentQuestion + 1}/{questions.length}
            </h2>

          </div>

          <div className="rounded-lg bg-cyan-400/10 px-4 py-2 font-bold text-cyan-400">
            {minutes}:{seconds}
          </div>

        </div>

        {/* Progress */}

        <div className="mt-6 h-2 w-full overflow-hidden rounded-full bg-white/10">

          <div
            className="h-full bg-gradient-to-r from-cyan-400 to-emerald-400 transition-all"
            style={{
              width: `${((currentQuestion + 1) / questions.length) * 100}%`,
            }}
          />

        </div>

        {/* Question */}

        <h3 className="mt-10 text-xl font-semibold leading-relaxed text-white">
          {question.question}
        </h3>

        {/* Options */}

        <div className="mt-6 space-y-4">

          {question.options.map((option, index) => {

            const isSelected = selected === index;

            return (
              <label
                key={index}
                className={`
                  flex cursor-pointer items-center gap-4
                  rounded-xl border p-4
                  transition
                  ${
                    isSelected
                      ? "border-cyan-400 bg-cyan-400/10 text-white"
                      : "border-white/10 bg-white/5 text-gray-300 hover:bg-white/10"
                  }
                `}
              >

                <input
                  type="radio"
                  name={`question-${question._id}`}
                  checked={isSelected}
                  onChange={() => handleSelect(index)}
                  className="h-4 w-4"
                />

                <span>
                  {option}
                </span>

              </label>
            );
          })}

        </div>

        {/* Error */}

        {error && (
          <div className="mt-5 rounded-lg bg-red-500/10 p-3 text-sm text-red-400">
            {error}
          </div>
        )}

        {/* Buttons */}

        <div className="mt-8 flex gap-4">

          <button
            onClick={handlePrevious}
            disabled={currentQuestion === 0 || submitting}
            className="
              w-1/2 rounded-xl
              border border-slate-700
              bg-slate-800
              py-4 font-bold text-white
              transition hover:bg-slate-700
              disabled:cursor-not-allowed
              disabled:opacity-40
            "
          >
            ← Previous
          </button>

          <button
            onClick={handleNext}
            disabled={submitting}
            className="
              w-1/2 rounded-xl
              bg-gradient-to-r from-cyan-400 to-emerald-400
              py-4 font-bold text-black
              transition hover:scale-[1.02]
              disabled:cursor-not-allowed
              disabled:opacity-50
            "
          >
            {submitting
              ? "Submitting..."
              : currentQuestion === questions.length - 1
              ? "Submit Assessment"
              : "Next Question →"}
          </button>

        </div>

      </div>

    </div>
  );
};

export default Assessment;