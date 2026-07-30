import {
  FolderKanban,
  CircleCheckBig,
  Layers3,
} from "lucide-react";

const ProgramStats = ({ programs }) => {
  const totalPrograms = programs.length;

  const activePrograms = programs.filter(
    (program) => program.status === "Active"
  ).length;

  const totalCategories = new Set(
    programs.map((program) => program.category)
  ).size;

  const stats = [
    {
      title: "Total Programs",
      value: totalPrograms,
      icon: FolderKanban,
      bg: "bg-sky-100",
      color: "text-sky-600",
    },
    {
      title: "Active Programs",
      value: activePrograms,
      icon: CircleCheckBig,
      bg: "bg-emerald-100",
      color: "text-emerald-600",
    },
    {
      title: "Categories",
      value: totalCategories,
      icon: Layers3,
      bg: "bg-violet-100",
      color: "text-violet-600",
    },
  ];

  return (
    <div className="grid gap-5 md:grid-cols-3">
      {stats.map((item) => {
        const Icon = item.icon;

        return (
          <div
            key={item.title}
            className="
              rounded-2xl
              border
              border-slate-200
              bg-white
              p-6
              shadow-sm
              transition
              hover:shadow-md
            "
          >
            <div className="flex items-center justify-between">

              <div>

                <p className="text-sm text-slate-500">
                  {item.title}
                </p>

                <h2 className="mt-2 text-3xl font-bold text-slate-900">
                  {item.value}
                </h2>

              </div>

              <div
                className={`
                  ${item.bg}
                  rounded-2xl
                  p-4
                `}
              >
                <Icon
                  size={24}
                  className={item.color}
                />
              </div>

            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ProgramStats;