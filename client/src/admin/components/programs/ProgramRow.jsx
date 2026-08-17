import { Eye, Pencil, Trash2, Clock3, FolderKanban } from "lucide-react";
import { useState } from "react";
import EditProgramModal from "./EditProgramModal";

const ProgramRow = ({ program, fetchPrograms }) => {
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedProgram, setSelectedProgram] = useState(null);

  const handleEdit = (program) => {
    setSelectedProgram(program);
    setShowEditModal(true);
  };

  return (
    <>
      <tr className="border-b border-slate-100 transition hover:bg-sky-50/40">
        {/* Program */}

        <td className="px-6 py-4">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-sky-100">
              <FolderKanban size={22} className="text-sky-600" />
            </div>

            <div>
              <h3 className="text-sm font-semibold text-slate-800">
                {program.name}
              </h3>

              <p className="mt-1 text-xs text-slate-400">{program.code}</p>
            </div>
          </div>
        </td>

        {/* Category */}

        <td className="px-6 py-4">
          <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-600">
            {program.category?.name || "-"}
          </span>
        </td>

        {/* Question Count */}

        <td className="px-6 py-4">
          <span className="flex items-center gap-2 text-sm text-slate-600">
            {program.totalQuestions}
          </span>
        </td>

        {/* Status */}

        <td className="px-6 py-4">
          <span
            className={`rounded-full px-3 py-1 text-xs font-semibold ${
              program.isActive == true
                ? "bg-green-100 text-green-600"
                : "bg-red-100 text-red-600"
            }`}
          >
            {program.isActive == true ? "Active" : "Inactive"}
          </span>
        </td>

        {/* Actions */}

        <td className="px-6 py-4">
          <div className="flex items-center justify-center gap-2">
            <button
              className="rounded-xl bg-sky-50 p-2 text-sky-600 transition hover:bg-sky-100"
              title="View"
            >
              <Eye size={17} />
            </button>

            <button
              onClick={() => handleEdit(program)}
              className="rounded-xl bg-emerald-50 p-2 text-emerald-600 transition hover:bg-emerald-100"
              title="Edit"
            >
              <Pencil size={17} />
            </button>

            <button
              className="rounded-xl bg-red-50 p-2 text-red-600 transition hover:bg-red-100"
              title="Delete"
            >
              <Trash2 size={17} />
            </button>
          </div>
        </td>
      </tr>

      {showEditModal && selectedProgram && (
        <EditProgramModal
          program={selectedProgram}
          close={() => {
            setShowEditModal(false);
            setSelectedProgram(null);
          }}
          onSuccess={fetchPrograms}
        />
      )}
    </>
  );
};

export default ProgramRow;
