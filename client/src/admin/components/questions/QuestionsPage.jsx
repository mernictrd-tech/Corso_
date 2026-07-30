import { useState } from "react";
import { Plus, ChevronDown, Check } from "lucide-react";

import AdminLayout from "../layout/AdminLayout";
import QuestionTable from "./QuestionTable";
import AddQuestionModal from "./AddQuestionModal";

const QuestionsPage = () => {
  const [showModal, setShowModal] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(false);

  const programs = [
    "Full Stack Development",
    "Data Analytics",
    "Python Programming",
  ];

  const [selectedProgram, setSelectedProgram] = useState(programs[0]);

  const questions = [
    {
      id: 1,
      program: "Full Stack Development",
      question: "What is React?",
      options: [
        "Database",
        "JavaScript Library",
        "Operating System",
        "Programming Language",
      ],
      answer: "B",
    },
    {
      id: 2,
      program: "Data Analytics",
      question: "Which library is used for data analysis in Python?",
      options: [
        "NumPy",
        "Pandas",
        "React",
        "Express",
      ],
      answer: "B",
    },
  ];

  const filteredQuestions = questions.filter(
    (q) => q.program === selectedProgram
  );

  return (
    <AdminLayout>
      <div className="space-y-5">

        {/* Header */}
        <div className="flex items-start justify-between">

          <div>

            <h1 className="text-[28px] font-semibold text-slate-800">
              Question Bank
            </h1>

            <p className="mt-1 text-sm text-slate-500">
              Create MCQ questions program wise.
            </p>

            {/* Custom Dropdown */}
            <div className="relative mt-5 w-[320px]">

              <label className="mb-2 block text-sm font-medium text-slate-700">
                Select Program
              </label>

              <button
                onClick={() => setOpenDropdown(!openDropdown)}
                className="flex h-11 w-full items-center justify-between rounded-xl border border-slate-200 bg-white px-4 text-sm font-medium text-slate-700 shadow-sm transition hover:border-sky-400"
              >
                {selectedProgram}

                <ChevronDown
                  size={18}
                  className={`transition ${
                    openDropdown ? "rotate-180" : ""
                  }`}
                />
              </button>

              {openDropdown && (
                <div className="absolute z-50 mt-2 w-full overflow-hidden rounded-xl border border-slate-200 bg-white shadow-xl">

                  {programs.map((program) => (
                    <button
                      key={program}
                      onClick={() => {
                        setSelectedProgram(program);
                        setOpenDropdown(false);
                      }}
                      className={`flex w-full items-center justify-between px-4 py-3 text-left text-sm transition
                      ${
                        selectedProgram === program
                          ? "bg-sky-50 text-sky-600"
                          : "hover:bg-slate-50 text-slate-700"
                      }`}
                    >
                      {program}

                      {selectedProgram === program && (
                        <Check
                          size={16}
                          className="text-sky-600"
                        />
                      )}
                    </button>
                  ))}

                </div>
              )}

            </div>

          </div>

          <button
            onClick={() => setShowModal(true)}
            className="flex h-11 items-center gap-2 rounded-xl bg-sky-500 px-5 text-sm font-medium text-white shadow hover:bg-sky-600"
          >
            <Plus size={17} />
            Add Question
          </button>

        </div>

        {/* Questions */}

        <QuestionTable questions={filteredQuestions} />

      </div>

      {showModal && (
        <AddQuestionModal
          programs={programs}
          selectedProgram={selectedProgram}
          close={() => setShowModal(false)}
        />
      )}
    </AdminLayout>
  );
};

export default QuestionsPage;