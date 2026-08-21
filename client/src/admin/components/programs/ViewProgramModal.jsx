import { X, Clock3, FileQuestion, Tag, IndianRupee, CheckCircle2, XCircle, Check } from "lucide-react";

const ViewProgramModal = ({ program, close }) => {
  if (!program) return null;

  const API_URL = import.meta.env.VITE_API_BASE_URL_RESOURCE;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4">
      <div className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-2xl bg-white shadow-2xl">

        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
          <div>
            <h2 className="text-xl font-semibold text-slate-800">
              Program Details
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              View complete program information
            </p>
          </div>

          <button
            onClick={close}
            className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">

          {/* Program Header */}
          <div className="flex flex-col gap-5 rounded-2xl bg-slate-50 p-5 md:flex-row">

            {/* Thumbnail */}
            <div className="h-40 w-full overflow-hidden rounded-xl border border-slate-200 bg-white md:h-40 md:w-56 md:flex-shrink-0">
              {program.thumbnail ? (
                <img
                  src={`${API_URL}${program.thumbnail}`}
                  alt={program.name}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full items-center justify-center text-sm text-slate-400">
                  No Thumbnail
                </div>
              )}
            </div>

            {/* Basic Info */}
            <div className="flex-1">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h3 className="text-2xl font-bold text-slate-800">
                    {program.name}
                  </h3>

                  <p className="mt-1 text-sm text-slate-400">
                    {program.slug || "-"}
                  </p>
                </div>

                <span
                  className={`rounded-full px-3 py-1 text-xs font-semibold ${
                    program.isActive
                      ? "bg-green-100 text-green-600"
                      : "bg-red-100 text-red-600"
                  }`}
                >
                  {program.isActive ? "Active" : "Inactive"}
                </span>
              </div>

              {/* Category */}
              <div className="mt-5 flex items-center gap-2">
                <Tag size={17} className="text-sky-500" />

                <span className="text-sm text-slate-500">
                  Category:
                </span>

                <span className="text-sm font-medium text-slate-700">
                  {program.category?.name || "-"}
                </span>
              </div>
            </div>
          </div>

          {/* Program Statistics */}
          <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">

            {/* Questions */}
            <div className="rounded-xl border border-slate-200 p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-sky-100">
                  <FileQuestion
                    size={20}
                    className="text-sky-600"
                  />
                </div>

                <div>
                  <p className="text-xs text-slate-400">
                    Questions
                  </p>

                  <p className="text-lg font-semibold text-slate-800">
                    {program.totalQuestions || 0}
                  </p>
                </div>
              </div>
            </div>

            {/* Duration */}
            <div className="rounded-xl border border-slate-200 p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-100">
                  <Clock3
                    size={20}
                    className="text-purple-600"
                  />
                </div>

                <div>
                  <p className="text-xs text-slate-400">
                    Duration
                  </p>

                  <p className="text-lg font-semibold text-slate-800">
                    {program.examDuration
                      ? `${program.examDuration} min`
                      : "-"}
                  </p>
                </div>
              </div>
            </div>

            {/* Original Price */}
            <div className="rounded-xl border border-slate-200 p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-orange-100">
                  <IndianRupee
                    size={20}
                    className="text-orange-600"
                  />
                </div>

                <div>
                  <p className="text-xs text-slate-400">
                    Original Price
                  </p>

                  <p className="text-lg font-semibold text-slate-800">
                    ₹{program.originalPrice || 0}
                  </p>
                </div>
              </div>
            </div>

            {/* Selling Price */}
            <div className="rounded-xl border border-slate-200 p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-100">
                  <IndianRupee
                    size={20}
                    className="text-green-600"
                  />
                </div>

                <div>
                  <p className="text-xs text-slate-400">
                    Selling Price
                  </p>

                  <p className="text-lg font-semibold text-slate-800">
                    ₹{program.sellingPrice || 0}
                  </p>
                </div>
              </div>
            </div>

            {/* Passing Question Count */}
            <div className="rounded-xl border border-slate-200 p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-100">
                  <Check
                    size={20}
                    className="text-green-600"
                  />
                </div>

                <div>
                  <p className="text-xs text-slate-400">
                    Passing Question Count
                  </p>

                  <p className="text-lg font-semibold text-slate-800">
                    {program.passingQuestions || 0}
                  </p>
                </div>
              </div>
            </div>

          </div>

          {/* Description */}
          <div className="mt-6">
            <h3 className="text-sm font-semibold text-slate-800">
              Description
            </h3>

            <div className="mt-2 rounded-xl bg-slate-50 p-4">
              <p className="whitespace-pre-line text-sm leading-6 text-slate-600">
                {program.description || "No description available."}
              </p>
            </div>
          </div>

          {/* Certificate */}
          <div className="mt-6">
            <h3 className="text-sm font-semibold text-slate-800">
              Certificate Preview
            </h3>

            <div className="mt-3 overflow-hidden rounded-xl border border-slate-200 bg-slate-50">
              {program.certificateDemo ? (
                <img
                  src={`${API_URL}${program.certificateDemo}`}
                  alt="Certificate Preview"
                  className="max-h-80 w-full object-contain"
                />
              ) : (
                <div className="p-6 text-center text-sm text-slate-400">
                  No certificate preview available.
                </div>
              )}
            </div>
          </div>

          {/* Status */}
          <div className="mt-6 rounded-xl border border-slate-200 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-700">
                  Program Status
                </p>

                <p className="mt-1 text-xs text-slate-400">
                  Current availability of this program
                </p>
              </div>

              <div className="flex items-center gap-2">
                {program.isActive ? (
                  <>
                    <CheckCircle2
                      size={18}
                      className="text-green-500"
                    />

                    <span className="text-sm font-medium text-green-600">
                      Active
                    </span>
                  </>
                ) : (
                  <>
                    <XCircle
                      size={18}
                      className="text-red-500"
                    />

                    <span className="text-sm font-medium text-red-600">
                      Inactive
                    </span>
                  </>
                )}
              </div>
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="flex justify-end border-t border-slate-200 px-6 py-4">
          <button
            onClick={close}
            className="rounded-xl bg-slate-800 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-slate-700"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
};

export default ViewProgramModal;