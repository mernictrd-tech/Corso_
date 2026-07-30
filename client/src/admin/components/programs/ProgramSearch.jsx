import { Search, SlidersHorizontal } from "lucide-react";

const ProgramSearch = ({
  search,
  setSearch,
}) => {
  return (
    <div
      className="
      rounded-2xl
      border
      border-slate-200
      bg-white
      p-5
      shadow-sm
      "
    >
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">

        {/* Search */}

        <div className="relative w-full max-w-lg">

          <Search
            size={18}
            className="
            absolute
            left-4
            top-1/2
            -translate-y-1/2
            text-slate-400
            "
          />

          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search program..."
            className="
            w-full
            rounded-xl
            border
            border-slate-200
            bg-slate-50
            py-3
            pl-11
            pr-4
            text-slate-900
            placeholder:text-slate-400
            outline-none
            transition
            focus:border-sky-500
            focus:bg-white
            "
          />

        </div>

        {/* Right */}

        <button
          className="
          inline-flex
          items-center
          gap-2
          rounded-xl
          border
          border-slate-200
          bg-white
          px-4
          py-3
          text-sm
          font-medium
          text-slate-700
          transition
          hover:bg-slate-50
          "
        >
          <SlidersHorizontal size={18} />
          Filters
        </button>

      </div>
    </div>
  );
};

export default ProgramSearch;