import {
  Eye,
  Pencil,
  Trash2,
  Clock3,
  Layers3,
} from "lucide-react";

const ProgramCard = ({
  program,
  onDelete,
  onEdit,
  onView,
}) => {
  return (
    <div
      className="
      group
      rounded-2xl
      border
      border-slate-200
      bg-white
      p-6
      shadow-sm
      transition-all
      duration-200
      hover:-translate-y-0.5
      hover:shadow-lg
      "
    >
      <div className="flex items-start justify-between">

        {/* Left */}

        <div className="flex gap-5">

          {/* Thumbnail */}

          <div
            className="
            flex
            h-20
            w-20
            items-center
            justify-center
            rounded-2xl
            bg-gradient-to-br
            from-sky-100
            to-blue-50
            "
          >
            <Layers3
              size={28}
              className="text-sky-600"
            />
          </div>

          {/* Content */}

          <div>

            <h3 className="text-lg font-semibold text-slate-900">
              {program.name}
            </h3>

            <div className="mt-2 flex flex-wrap gap-2">

              <span
                className="
                rounded-full
                bg-slate-100
                px-3
                py-1
                text-xs
                font-medium
                text-slate-600
                "
              >
                {program.category}
              </span>

              <span
                className="
                flex
                items-center
                gap-1
                rounded-full
                bg-blue-50
                px-3
                py-1
                text-xs
                font-medium
                text-blue-600
                "
              >
                <Clock3 size={12} />
                {program.duration}
              </span>

              <span
                className="
                rounded-full
                bg-emerald-50
                px-3
                py-1
                text-xs
                font-semibold
                text-emerald-700
                "
              >
                ● {program.status}
              </span>

            </div>

          </div>

        </div>

        {/* Right */}

        <div className="flex gap-2">

          <button
            onClick={onView}
            className="
            rounded-xl
            p-2.5
            text-slate-500
            transition
            hover:bg-slate-100
            "
          >
            <Eye size={18} />
          </button>

          <button
            onClick={onEdit}
            className="
            rounded-xl
            p-2.5
            text-sky-600
            transition
            hover:bg-sky-50
            "
          >
            <Pencil size={18} />
          </button>

          <button
            onClick={() => onDelete(program.id)}
            className="
            rounded-xl
            p-2.5
            text-red-500
            transition
            hover:bg-red-50
            "
          >
            <Trash2 size={18} />
          </button>

        </div>

      </div>
    </div>
  );
};

export default ProgramCard;