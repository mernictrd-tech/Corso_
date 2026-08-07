import { useEffect, useState } from "react";
import { Plus, ChevronDown, Check } from "lucide-react";

import AdminLayout from "../layout/AdminLayout";
import QuestionTable from "./QuestionTable";
import AddQuestionModal from "./AddQuestionModal";
import api from "../../../services/api";
import EditQuestionModal from "./EditQuestionModal";
import DeleteConfirmModal from "../common/DeleteConfirmModal";

const QuestionsPage = () => {
  const [showModal, setShowModal] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(false);

  const [programs, setPrograms] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [selectedProgram, setSelectedProgram] = useState("");
  const [loading, setLoading] = useState(true);
  const [editQuestion, setEditQuestion] = useState(null);

  const [deleteQuestion, setDeleteQuestion] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  useEffect(() => {
    fetchPrograms();
  }, []);

  useEffect(() => {
    if (selectedProgram) {
      fetchQuestions();
    }
  }, [selectedProgram]);

  const fetchPrograms = async () => {
    try {
      const res = await api.get("/admin/program/list");

      setPrograms(res.data.data);

      if (res.data.data.length > 0) {
        setSelectedProgram(res.data.data[0]._id);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const fetchQuestions = async () => {
    try {
      setLoading(true);

      const res = await api.get(`/admin/program/${selectedProgram}/questions`);

      setQuestions(res.data.data);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      setDeleteLoading(true);

      await api.delete(`/admin/question/delete/${deleteQuestion._id}`);

      fetchQuestions();
      setDeleteQuestion(null);
    } catch (err) {
      console.log(err);
    } finally {
      setDeleteLoading(false);
    }
  };

  // const filteredQuestions = questions.filter(
  //   (q) => q.program === selectedProgram,
  // );

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
                {programs.find((p) => p._id === selectedProgram)?.name ||
                  "Select Program"}

                <ChevronDown
                  size={18}
                  className={`transition ${openDropdown ? "rotate-180" : ""}`}
                />
              </button>

              {openDropdown && (
                <div className="absolute z-50 mt-2 w-full overflow-hidden rounded-xl border border-slate-200 bg-white shadow-xl">
                  {programs.map((program) => (
                    <button
                      key={program._id}
                      onClick={() => {
                        setSelectedProgram(program._id);
                        setOpenDropdown(false);
                      }}
                      className={`flex w-full items-center justify-between px-4 py-3 text-left text-sm transition ${
                        selectedProgram === program._id
                          ? "bg-sky-50 text-sky-600"
                          : "hover:bg-slate-50 text-slate-700"
                      }`}
                    >
                      {program.name}

                      {selectedProgram === program._id && (
                        <Check size={16} className="text-sky-600" />
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

        <QuestionTable
          questions={questions}
          onEdit={setEditQuestion}
          onDelete={setDeleteQuestion}
        />
      </div>

      {showModal && (
        <AddQuestionModal
          close={() => setShowModal(false)}
          programs={programs}
          onSuccess={() => {
            fetchQuestions();
            setShowModal(false);
          }}
        />
      )}

      {editQuestion && (
        <EditQuestionModal
          question={editQuestion}
          programs={programs}
          close={() => setEditQuestion(null)}
          onSuccess={() => {
            fetchQuestions();
            setEditQuestion(null);
          }}
        />
      )}

      {deleteQuestion && (
        <DeleteConfirmModal
          title="Delete Question"
          message={`Are you sure you want to delete "${deleteQuestion.question}"? This action cannot be undone.`}
          loading={deleteLoading}
          onCancel={() => setDeleteQuestion(null)}
          onConfirm={handleDelete}
        />
      )}
    </AdminLayout>
  );
};

export default QuestionsPage;
