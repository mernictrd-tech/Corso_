import ProgramRow from "./ProgramRow";

const ProgramTable = ({ programs }) => {
  return (
    <div className="overflow-hidden rounded-2xl bg-white shadow-sm">

      {/* Header */}

      <div className="border-b border-slate-100 px-6 py-4">

        <h2 className="text-lg font-semibold text-slate-800">
          Program List
        </h2>

        <p className="mt-1 text-sm text-slate-500">
          All available certification programs
        </p>

      </div>

      {/* Desktop Table */}

      <div className="hidden overflow-x-auto lg:block">

        <table className="w-full">

          <thead className="bg-slate-50">

            <tr>

              <th className="px-6 py-4 text-left text-sm font-semibold text-slate-500">
                Program
              </th>

              <th className="px-6 py-4 text-left text-sm font-semibold text-slate-500">
                Category
              </th>

              <th className="px-6 py-4 text-left text-sm font-semibold text-slate-500">
                Duration
              </th>

              <th className="px-6 py-4 text-left text-sm font-semibold text-slate-500">
                Status
              </th>

              <th className="px-6 py-4 text-center text-sm font-semibold text-slate-500">
                Action
              </th>

            </tr>

          </thead>

          <tbody>

            {programs.map((program) => (

              <ProgramRow
                key={program.id}
                program={program}
              />

            ))}

          </tbody>

        </table>

      </div>

      {/* Mobile Card */}

      <div className="space-y-4 p-4 lg:hidden">

        {programs.map((program) => (

          <div
            key={program.id}
            className="rounded-xl border border-slate-200 p-4"
          >

            <div className="flex items-center justify-between">

              <div>

                <h3 className="font-semibold text-slate-800">
                  {program.name}
                </h3>

                <p className="text-xs text-slate-500">
                  {program.code}
                </p>

              </div>

              <span
                className={`rounded-full px-3 py-1 text-xs font-medium ${
                  program.status === "Active"
                    ? "bg-green-100 text-green-600"
                    : "bg-red-100 text-red-600"
                }`}
              >
                {program.status}
              </span>

            </div>

            <div className="mt-4 grid grid-cols-2 gap-3 text-sm">

              <div>

                <p className="text-slate-400">
                  Category
                </p>

                <p className="font-medium">
                  {program.category}
                </p>

              </div>

              <div>

                <p className="text-slate-400">
                  Duration
                </p>

                <p className="font-medium">
                  {program.duration}
                </p>

              </div>

            </div>

          </div>

        ))}

      </div>

    </div>
  );
};

export default ProgramTable;