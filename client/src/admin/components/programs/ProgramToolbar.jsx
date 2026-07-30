import { Search, SlidersHorizontal, Plus } from "lucide-react";

const ProgramToolbar = ({ onAdd }) => {
  return (
    <div className="rounded-2xl bg-white p-4 shadow-sm">

      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">

        {/* Search */}

        <div className="relative w-full max-w-md">

          <Search
            size={18}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
          />

          <input
            type="text"
            placeholder="Search programs..."
            className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 pl-11 pr-4 text-sm outline-none transition focus:border-sky-400 focus:bg-white"
          />

        </div>

        {/* Right */}

        <div className="flex items-center gap-3">

          <button
            className="flex h-11 items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
          >
            <SlidersHorizontal size={17} />
            Filter
          </button>

          <button
            onClick={onAdd}
            className="flex h-11 items-center gap-2 rounded-xl bg-sky-500 px-5 text-sm font-medium text-white shadow-sm transition hover:bg-sky-600"
          >
            <Plus size={18} />
            Add Program
          </button>

        </div>

      </div>

    </div>
  );
};

export default ProgramToolbar;