import { useEffect, useState } from "react";
import questions from "../../data/questions";
import ResultCard from "./ResultCard";

const Assessment = () => {
  const [showResult, setShowResult] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selected, setSelected] = useState("");
  const [answers, setAnswers] = useState({});
  const [score, setScore] = useState(0);
  const [time, setTime] = useState(600);

  // Timer
  useEffect(() => {
    const timer = setInterval(() => {
      setTime((prev) => {
        if (prev <= 0) {
          clearInterval(timer);

          // Calculate score when time is over
          const finalScore = Object.keys(answers).reduce((total, index) => {
            return answers[index] === questions[index].answer
              ? total + 1
              : total;
          }, 0);

          setScore(finalScore);
          setShowResult(true);

          return 0;
        }

        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [answers]);

  // Show Result
  if (showResult) {
    return (
      <ResultCard
        score={score}
        total={questions.length}
      />
    );
  }

  const question = questions[currentQuestion];

  // Select Answer
  const handleSelect = (answer) => {
    setSelected(answer);

    setAnswers((prev) => ({
      ...prev,
      [currentQuestion]: answer,
    }));
  };

  // Previous Question
  const handlePrevious = () => {
    if (currentQuestion > 0) {
      const previousQuestion = currentQuestion - 1;

      setCurrentQuestion(previousQuestion);

      // Restore previously selected answer
      setSelected(answers[previousQuestion] || "");
    }
  };

  // Next Question / Submit
  const handleNext = () => {
    // Save current answer
    const updatedAnswers = {
      ...answers,
      [currentQuestion]: selected,
    };

    setAnswers(updatedAnswers);

    // Next Question
    if (currentQuestion < questions.length - 1) {
      const nextQuestion = currentQuestion + 1;

      setCurrentQuestion(nextQuestion);

      // Restore answer if already selected
      setSelected(updatedAnswers[nextQuestion] || "");
    } else {
      // Calculate final score
      const finalScore = Object.keys(updatedAnswers).reduce(
        (total, index) => {
          return updatedAnswers[index] === questions[index].answer
            ? total + 1
            : total;
        },
        0
      );

      setScore(finalScore);
      setShowResult(true);
    }
  };

  return (
    <div className="min-h-screen bg-[#070B1A] p-10">
      <div className="mx-auto max-w-3xl rounded-3xl border border-white/10 bg-white/5 p-8">

        {/* Header */}
        <div className="flex justify-between">
          <h2 className="text-2xl font-bold text-white">
            Question {currentQuestion + 1}/{questions.length}
          </h2>

          <div className="font-bold text-cyan-400">
            {Math.floor(time / 60)}:
            {String(time % 60).padStart(2, "0")}
          </div>
        </div>

        {/* Question */}
        <h3 className="mt-10 text-xl text-white">
          {question.question}
        </h3>

        {/* Options */}
        <div className="mt-6 space-y-4">
          {question.options.map((option) => (
            <label
              key={option}
              className="
                flex cursor-pointer gap-3
                rounded-xl bg-white/5
                p-4 text-gray-300
                hover:bg-white/10
              "
            >
              <input
                type="radio"
                name="answer"
                value={option}
                checked={selected === option}
                onChange={() => handleSelect(option)}
              />

              {option}
            </label>
          ))}
        </div>

        {/* Previous + Next Buttons */}
        <div className="mt-8 flex w-full gap-4">

          {/* Previous */}
          <button
            onClick={handlePrevious}
            disabled={currentQuestion === 0}
            className="
              w-1/2 rounded-xl
              border border-slate-700
              bg-slate-800
              py-4 font-bold text-white
              transition
              hover:bg-slate-700
              disabled:cursor-not-allowed
              disabled:opacity-40
            "
          >
            ← Previous
          </button>

          {/* Next / Submit */}
          <button
            onClick={handleNext}
            className="
              w-1/2 rounded-xl
              bg-gradient-to-r from-cyan-400 to-emerald-400
              py-4 font-bold text-black
              transition
              hover:scale-[1.02]
            "
          >
            {currentQuestion === questions.length - 1
              ? "Submit Assessment"
              : "Next Question →"}
          </button>

        </div>
      </div>
    </div>
  );
};

export default Assessment;