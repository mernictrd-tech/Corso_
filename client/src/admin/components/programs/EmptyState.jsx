import { FolderOpen, Plus } from "lucide-react";

const EmptyState = ({ onAdd }) => {
  return (
    <div
      className="
      flex
      flex-col
      items-center
      justify-center
      rounded-3xl
      border
      border-dashed
      border-slate-300
      bg-white
      py-20
      px-8
      text-center
      shadow-sm
      "
    >
      <div
        className="
        flex
        h-20
        w-20
        items-center
        justify-center
        rounded-full
        bg-sky-100
        "
      >
        <FolderOpen
          size={36}
          className="text-sky-600"
        />
      </div>

      <h2 className="mt-6 text-2xl font-semibold text-slate-900">
        No Programs Found
      </h2>

      <p className="mt-3 max-w-md text-slate-500">
        You haven't created any programs yet.
        Start by creating your first certification program.
      </p>

      <button
        onClick={onAdd}
        className="
        mt-8
        inline-flex
        items-center
        gap-2
        rounded-xl
        bg-sky-600
        px-6
        py-3
        font-medium
        text-white
        transition
        hover:bg-sky-700
        "
      >
        <Plus size={18} />
        Create Program
      </button>
    </div>
  );
};

export default EmptyState;