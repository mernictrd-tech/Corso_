import { User, Eye, Pencil, Trash2 } from "lucide-react";

const StudentsTable = ({ students, onDelete }) => {
  if (students.length === 0) {
    return (
      <div className="rounded-xl border border-slate-200 bg-white py-10 text-center shadow-sm">
        <p className="text-sm text-slate-500">
          Student Not Found.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-slate-50">
            <tr className="text-left text-sm font-semibold text-slate-600">
              <th className="px-5 py-3">Student</th>
              <th className="px-5 py-3">Program Count</th>
              <th className="px-5 py-3 text-center">Action</th>
            </tr>
          </thead>

          <tbody>
            {students.map((student) => (
              <tr
                key={student.id}
                className="border-t border-slate-100 hover:bg-slate-50 transition"
              >
                {/* Student */}

                <td className="px-5 py-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-sky-100">
                      <User size={20} className="text-sky-600" />
                    </div>

                    <div>
                      <h3 className="text-[15px] font-semibold text-slate-800">
                        {student.fullName}
                      </h3>

                      <p className="text-xs text-slate-500">{student.email}</p>
                    </div>
                  </div>
                </td>

                {/* Program */}

                <td className="px-5 py-4">
                  <span className="rounded-full bg-sky-100 px-3 py-1 text-xs font-medium text-sky-700">
                    {student.assessmentCount}
                  </span>
                </td>

                {/* Action */}

                <td className="px-5 py-4">
                  <div className="flex justify-center gap-2">
                    <button className="flex h-9 w-9 items-center justify-center rounded-lg bg-sky-50 text-sky-600 transition hover:bg-sky-100">
                      <Eye size={16} />
                    </button>

                    <button className="flex h-9 w-9 items-center justify-center rounded-lg bg-green-50 text-green-600 transition hover:bg-green-100">
                      <Pencil size={16} />
                    </button>

                    <button
                       onClick={() => onDelete(student)}
                       className="flex h-9 w-9 items-center justify-center rounded-lg bg-red-50 text-red-600 transition hover:bg-red-100">
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default StudentsTable;
