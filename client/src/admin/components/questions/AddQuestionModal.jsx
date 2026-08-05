import { useState } from "react";
import { X } from "lucide-react";
import api from "../../../services/api";

const AddQuestionModal = ({ close, programs, onSuccess }) => {
  const [form, setForm] = useState({
    program: "",
    question: "",
    optionA: "",
    optionB: "",
    optionC: "",
    optionD: "",
    answer: "",
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const selected = programs.find((p) => p._id === form.program);

  const handleSubmit = async () => {
    try {
      
      await api.post("/admin/question/create", {
        question: form.question,
        options: [form.optionA, form.optionB, form.optionC, form.optionD],
        correctAnswer: Number(form.answer),
        program: form.program,
        category: selected.category._id,
        marks: form.marks,
      });

      onSuccess();
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div
        className="w-full max-w-2xl rounded-2xl bg-white shadow-2xl"
        style={{ color: "#1e293b" }}
      >
        {/* Header */}

        <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
          <div>
            <h2 className="text-lg font-semibold text-slate-800">
              Add Question
            </h2>

            <p className="mt-1 text-xs text-slate-500">
              Create a new MCQ question
            </p>
          </div>

          <button
            onClick={close}
            className="rounded-lg bg-slate-100 p-2 transition hover:bg-red-100"
          >
            <X size={18} className="text-slate-700" />
          </button>
        </div>

        {/* Body */}

        <div className="space-y-4 p-5">
          {/* Program */}

          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-700">
              Program
            </label>

            <select
              name="program"
              value={form.program}
              onChange={handleChange}
              className="h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-800 outline-none focus:border-sky-500"
            >
              <option value="">Select Program</option>

              {programs.map((program) => (
                <option key={program._id} value={program._id}>
                  {program.name}
                </option>
              ))}
            </select>
          </div>

          {/* Question */}

          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-700">
              Question
            </label>

            <textarea
              rows={3}
              name="question"
              value={form.question}
              onChange={handleChange}
              placeholder="Enter Question"
              className="w-full resize-none rounded-lg border border-slate-200 bg-white p-3 text-sm text-slate-800 placeholder:text-slate-400 outline-none focus:border-sky-500"
            />
          </div>

          {/* Options */}

          <div className="grid gap-3 md:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-700">
                Option A
              </label>

              <input
                type="text"
                name="optionA"
                value={form.optionA}
                onChange={handleChange}
                placeholder="Option A"
                className="h-10 w-full rounded-lg border border-slate-200 px-3 text-sm text-slate-800 outline-none focus:border-sky-500"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-700">
                Option B
              </label>

              <input
                type="text"
                name="optionB"
                value={form.optionB}
                onChange={handleChange}
                placeholder="Option B"
                className="h-10 w-full rounded-lg border border-slate-200 px-3 text-sm text-slate-800 outline-none focus:border-sky-500"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-700">
                Option C
              </label>

              <input
                type="text"
                name="optionC"
                value={form.optionC}
                onChange={handleChange}
                placeholder="Option C"
                className="h-10 w-full rounded-lg border border-slate-200 px-3 text-sm text-slate-800 outline-none focus:border-sky-500"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-700">
                Option D
              </label>

              <input
                type="text"
                name="optionD"
                value={form.optionD}
                onChange={handleChange}
                placeholder="Option D"
                className="h-10 w-full rounded-lg border border-slate-200 px-3 text-sm text-slate-800 outline-none focus:border-sky-500"
              />
            </div>
          </div>

          {/* Correct Answer */}

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Correct Answer
            </label>

            <div className="grid grid-cols-2 gap-2">
              {[
                { label: "Option A", value: 0 },
                { label: "Option B", value: 1 },
                { label: "Option C", value: 2 },
                { label: "Option D", value: 3 },
              ].map((item) => (
                <label
                  key={item.value}
                  className={`flex cursor-pointer items-center gap-2 rounded-lg border px-3 py-2 text-sm transition ${
                    form.answer === item.value
                      ? "border-sky-500 bg-sky-50"
                      : "border-slate-200 hover:border-slate-300"
                  }`}
                >
                  <input
                    type="radio"
                    name="answer"
                    value={item.value}
                    checked={Number(form.answer) === item.value}
                    onChange={handleChange}
                  />

                  <span>Option {item.label}</span>
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}

        <div className="flex justify-end gap-3 border-t border-slate-200 px-5 py-4">
          <button
            onClick={close}
            className="rounded-lg border border-slate-300 px-4 py-2 text-sm text-slate-700 hover:bg-slate-100"
          >
            Cancel
          </button>

          <button
            onClick={handleSubmit}
            className="rounded-lg bg-sky-500 px-5 py-2 text-sm font-medium text-white shadow hover:bg-sky-600"
          >
            Add Question
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddQuestionModal;
