import {
  FolderKanban,
  Eye,
  Pencil,
  Trash2,
  Clock3,
  CircleCheck,
} from "lucide-react";

const ProgramCard = ({ program }) => {
  return (
    <div className="rounded-2xl bg-white shadow-sm border border-slate-100 hover:shadow-lg transition-all duration-300">

      <div className="flex items-center justify-between p-5">

        {/* Left */}
        <div className="flex items-center gap-4">

          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-sky-100">
            <FolderKanban
              size={28}
              className="text-sky-600"
            />
          </div>

          <div>

            <h3 className="text-lg font-semibold text-slate-800">
              {program.name}
            </h3>

            <div className="mt-2 flex flex-wrap gap-2">

              <span className="rounded-full bg-sky-50 px-3 py-1 text-xs font-medium text-sky-700">
                {program.category}
              </span>

              <span className="flex items-center gap-1 rounded-full bg-orange-50 px-3 py-1 text-xs font-medium text-orange-600">
                <Clock3 size={12} />
                {program.duration}
              </span>

              <span className="flex items-center gap-1 rounded-full bg-green-50 px-3 py-1 text-xs font-medium text-green-600">
                <CircleCheck size={12} />
                Active
              </span>

            </div>

          </div>

        </div>

        {/* Right */}
        <div className="flex items-center gap-2">

          <button className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 transition hover:bg-sky-100 hover:text-sky-600">
            <Eye size={18} />
          </button>

          <button className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 transition hover:bg-emerald-100 hover:text-emerald-600">
            <Pencil size={18} />
          </button>

          <button className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 transition hover:bg-red-100 hover:text-red-600">
            <Trash2 size={18} />
          </button>

        </div>

      </div>

    </div>
  );
};

export default ProgramCard;
