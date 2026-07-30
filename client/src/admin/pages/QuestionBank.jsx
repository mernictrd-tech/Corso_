import { useState } from "react";
import AdminLayout from "../components/layout/AdminLayout";

import QuestionToolbar from "../components/questions/QuestionToolbar";
import QuestionList from "../components/questions/QuestionList";
import AddQuestionModal from "../components/questions/AddQuestionModal";

const QuestionBank = () => {

  const [showModal, setShowModal] = useState(false);

  const [selectedProgram, setSelectedProgram] = useState("");

  // Dummy Data
  const questions = [
    {
      id: 1,
      question: "What is React?",
      options: [
        "Angular",
        "Java",
        "React",
        "PHP",
      ],
      answer: "C",
    },
    {
      id: 2,
      question: "React is developed by?",
      options: [
        "Google",
        "Microsoft",
        "Meta",
        "Amazon",
      ],
      answer: "C",
    },
  ];

  return (

    <AdminLayout>

      <div className="space-y-6">

        {/* Heading */}

        <div>

          <h1 className="text-2xl font-bold text-slate-800">
            Question Bank
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            Manage MCQ questions for every program.
          </p>

        </div>

        {/* Toolbar */}

        <QuestionToolbar
          selectedProgram={selectedProgram}
          setSelectedProgram={setSelectedProgram}
          onAdd={() => setShowModal(true)}
        />

        {/* Question List */}

        <QuestionList
          questions={questions}
        />

      </div>

      {showModal && (

        <AddQuestionModal
          close={() => setShowModal(false)}
        />

      )}

    </AdminLayout>

  );

};

export default QuestionBank;