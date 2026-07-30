import { X, Upload, Link2, FileText } from "lucide-react";

const inputClass = `
w-full
rounded-xl
border
border-slate-200
bg-slate-50
px-4
py-3
text-slate-800
placeholder:text-slate-400
outline-none
transition
focus:border-sky-500
focus:bg-white
`;

const ProgramForm = ({ close }) => {
  return (
    <div className="fixed inset-0 z-50">

      {/* Backdrop */}

      <div
        onClick={close}
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
      />

      {/* Drawer */}

      <div
        className="
        absolute
        right-0
        top-0
        h-full
        w-full
        max-w-2xl
        bg-white
        shadow-2xl
        flex
        flex-col
        animate-[slideIn_.25s_ease]
        "
      >

        {/* Header */}

        <div className="flex items-center justify-between border-b border-slate-200 px-8 py-6">

          <div>

            <h2 className="text-2xl font-bold text-slate-900">
              Add Program
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Fill in the details to create a new program.
            </p>

          </div>

          <button
            onClick={close}
            className="rounded-xl p-2 hover:bg-slate-100"
          >
            <X className="text-slate-600" />
          </button>

        </div>

        {/* Body */}

        <div className="flex-1 overflow-y-auto px-8 py-8 space-y-7">

          {/* Basic Information */}

          <div>

            <h3 className="mb-4 text-lg font-semibold text-slate-900">
              Basic Information
            </h3>

            <div className="grid gap-5 md:grid-cols-2">

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-600">
                  Program Name
                </label>

                <input
                  className={inputClass}
                  placeholder="Full Stack Development"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-600">
                  Program Code
                </label>

                <input
                  className={inputClass}
                  placeholder="FSD-001"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-600">
                  Category
                </label>

                <input
                  className={inputClass}
                  placeholder="Programming"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-600">
                  Duration
                </label>

                <input
                  className={inputClass}
                  placeholder="6 Months"
                />
              </div>

            </div>

          </div>

          {/* Thumbnail */}

          <div>

            <h3 className="mb-4 text-lg font-semibold text-slate-900">
              Program Thumbnail
            </h3>

            <label
              className="
              flex
              cursor-pointer
              flex-col
              items-center
              justify-center
              rounded-2xl
              border-2
              border-dashed
              border-slate-300
              bg-slate-50
              p-10
              transition
              hover:border-sky-500
              hover:bg-sky-50
              "
            >

              <Upload className="mb-3 text-slate-500" size={34} />

              <p className="font-medium text-slate-700">
                Upload Thumbnail
              </p>

              <span className="mt-1 text-sm text-slate-500">
                PNG, JPG up to 5MB
              </span>

              <input
                type="file"
                className="hidden"
              />

            </label>

          </div>

          {/* Video */}

          <div>

            <h3 className="mb-4 flex items-center gap-2 text-lg font-semibold text-slate-900">

              <Link2 size={18} />

              Video Link

            </h3>

            <input
              className={inputClass}
              placeholder="https://youtube.com/..."
            />

          </div>

          {/* Description */}

          <div>

            <h3 className="mb-4 flex items-center gap-2 text-lg font-semibold text-slate-900">

              <FileText size={18} />

              Description

            </h3>

            <textarea
              rows={8}
              className={inputClass}
              placeholder="Write detailed program description..."
            />

          </div>

        </div>

        {/* Footer */}

        <div className="flex justify-end gap-3 border-t border-slate-200 bg-white px-8 py-5">

          <button
            onClick={close}
            className="
            rounded-xl
            border
            border-slate-300
            px-5
            py-3
            font-medium
            text-slate-700
            hover:bg-slate-100
            "
          >
            Cancel
          </button>

          <button
            className="
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
            Save Program
          </button>

        </div>

      </div>

      <style>{`
        @keyframes slideIn{
          from{
            transform:translateX(100%);
          }
          to{
            transform:translateX(0);
          }
        }
      `}</style>

    </div>
  );
};

export default ProgramForm;