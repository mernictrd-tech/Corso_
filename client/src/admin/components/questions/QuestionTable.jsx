import { Pencil, Trash2, CheckCircle2 } from "lucide-react";

const QuestionTable = ({ questions, onEdit }) => {
  if (questions.length === 0) {
    return (
      <div className="rounded-xl border border-slate-200 bg-white py-10 text-center shadow-sm">
        <p className="text-sm text-slate-500">
          No questions added for this program.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
      {questions.map((item, index) => (
        <div
          key={item._id}
          className={`p-4 ${
            index !== questions.length - 1 ? "border-b border-slate-200" : ""
          }`}
        >
          {/* Header */}

          <div className="flex items-start justify-between">
            <h3 className="pr-4 text-sm font-semibold text-slate-800">
              Q{index + 1}. {item.question}
            </h3>

            <div className="flex gap-2">
              <button
                onClick={() => onEdit(item)}
                className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-50"
              >
                <Pencil size={15} />
              </button>

              <button className="flex h-8 w-8 items-center justify-center rounded-lg border border-red-100 text-red-500 hover:bg-red-50">
                <Trash2 size={15} />
              </button>
            </div>
          </div>

          {/* Options */}

          <div className="mt-3 space-y-2">
            {item.options.map((option, i) => {
              const letter = ["A", "B", "C", "D"][i];
              const correct = letter === item.answer;

              return (
                <div
                  key={i}
                  className={`flex items-center justify-between rounded-lg px-3 py-2 text-sm ${
                    correct
                      ? "bg-green-50 text-green-700"
                      : "bg-slate-50 text-slate-700"
                  }`}
                >
                  <span>
                    <b>{letter}.</b> {option}
                  </span>

                  {correct && (
                    <CheckCircle2 size={15} className="text-green-600" />
                  )}
                </div>
              );
            })}
          </div>

          <div className="mt-3 text-xs text-slate-500">
            Correct Answer :
            <span className="ml-2 rounded bg-green-100 px-2 py-1 font-semibold text-green-700">
              {["A", "B", "C", "D"][item.correctAnswer]}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default QuestionTable;
