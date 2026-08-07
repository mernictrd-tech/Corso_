import { AlertTriangle } from "lucide-react";

const DeleteConfirmModal = ({
  title = "Delete Question",
  message = "Are you sure you want to delete this question? This action cannot be undone.",
  loading = false,
  onCancel,
  onConfirm,
}) => {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-md rounded-2xl bg-white shadow-xl">
        <div className="p-6">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-red-100">
            <AlertTriangle className="text-red-600" size={28} />
          </div>

          <h2 className="mt-4 text-center text-xl font-semibold text-slate-800">
            {title}
          </h2>

          <p className="mt-2 text-center text-sm text-slate-500">
            {message}
          </p>

          <div className="mt-6 flex justify-end gap-3">
            <button
              onClick={onCancel}
              disabled={loading}
              className="rounded-lg border border-slate-300 px-4 py-2 text-sm hover:bg-slate-50 text-slate-700"
            >
              Cancel
            </button>

            <button
              onClick={onConfirm}
              disabled={loading}
              className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
            >
              {loading ? "Deleting..." : "Delete"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmModal;