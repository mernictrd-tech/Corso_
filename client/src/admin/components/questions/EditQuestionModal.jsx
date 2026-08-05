import { useEffect, useState } from "react";
import { X } from "lucide-react";
import api from "../../../services/api";

const EditQuestionModal = ({
  question,
  programs,
  close,
  onSuccess,
}) => {
  const [form, setForm] = useState({
    program: "",
    question: "",
    optionA: "",
    optionB: "",
    optionC: "",
    optionD: "",
    answer: 0,
  });

  useEffect(() => {
    if (question) {
      setForm({
        program: question.program?._id || question.program,
        question: question.question,
        optionA: question.options[0] || "",
        optionB: question.options[1] || "",
        optionC: question.options[2] || "",
        optionD: question.options[3] || "",
        answer: question.correctAnswer,
      });
    }
  }, [question]);

  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async () => {
    try {
      await api.put(
        `/admin/question/update/${question._id}`,
        {
          question: form.question,
          options: [
            form.optionA,
            form.optionB,
            form.optionC,
            form.optionD,
          ],
          correctAnswer: Number(form.answer),
          program: form.program,
        }
      );

      onSuccess();
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-2xl rounded-2xl bg-white shadow-xl">

        {/* Header */}

        <div className="flex items-center justify-between border-b p-5">
          <h2 className="text-lg font-semibold text-slate-700">
            Edit Question
          </h2>

          <button onClick={close}>
            <X />
          </button>
        </div>

        {/* Program */}

        <div className="space-y-4 p-5">

          <select
            name="program"
            value={form.program}
            onChange={handleChange}
            className="w-full rounded-lg border p-2 text-slate-700"
          >
            {programs.map((program) => (
              <option
                key={program._id}
                value={program._id}
              >
                {program.name}
              </option>
            ))}
          </select>

          <textarea
            rows={3}
            name="question"
            value={form.question}
            onChange={handleChange}
            className="w-full rounded-lg border p-3 text-slate-700 border-slate-200"
          />

          <input
            name="optionA"
            value={form.optionA}
            onChange={handleChange}
            placeholder="Option A"
            className="w-full rounded-lg border p-2 text-slate-700 border-slate-200"
          />

          <input
            name="optionB"
            value={form.optionB}
            onChange={handleChange}
            placeholder="Option B"
            className="w-full rounded-lg border p-2 text-slate-700 border-slate-200"
          />

          <input
            name="optionC"
            value={form.optionC}
            onChange={handleChange}
            placeholder="Option C"
            className="w-full rounded-lg border p-2 text-slate-700 border-slate-200"
          />

          <input
            name="optionD"
            value={form.optionD}
            onChange={handleChange}
            placeholder="Option D"
            className="w-full rounded-lg border p-2 text-slate-700 border-slate-200"
          />

          <div className="grid grid-cols-2 gap-2">
            {[
              { label: "Option A", value: 0 },
              { label: "Option B", value: 1 },
              { label: "Option C", value: 2 },
              { label: "Option D", value: 3 },
            ].map((item) => (
              <label
                key={item.value}
                className={`rounded-lg border p-3 cursor-pointer text-slate-700 border-slate-200 ${
                  Number(form.answer) === item.value
                    ? "border-sky-500 bg-sky-50"
                    : ""
                }`}
              >
                <input
                  type="radio"
                  name="answer"
                  value={item.value}
                  checked={
                    Number(form.answer) === item.value
                  }
                  onChange={handleChange}
                />

                <span className="ml-2 text-slate-700">
                  {item.label}
                </span>
              </label>
            ))}
          </div>

        </div>

        {/* Footer */}

        <div className="flex justify-end gap-3 border-t p-5">

          <button
            onClick={close}
            className="rounded-lg border px-4 py-2 text-slate-700"
          >
            Cancel
          </button>

          <button
            onClick={handleSubmit}
            className="rounded-lg bg-sky-500 px-5 py-2 text-white"
          >
            Update Question
          </button>

        </div>

      </div>
    </div>
  );
};

export default EditQuestionModal;