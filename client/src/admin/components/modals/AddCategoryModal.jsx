import { useState } from "react";
import api from "../../../services/api";
import { X } from "lucide-react";
import toast from "react-hot-toast";

const AddCategoryModal = ({ category, close, onSuccess }) => {
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    name: "",
    isActive: "true",
  });

  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async () => {
    const name = form.name.trim();

    if (!name) {
      toast.error("Category name is required.");
      return;
    }

    if (name.length < 2) {
      toast.error("Category name must be at least 2 characters.");
      return;
    }

    try {
      setLoading(true);

      const { data } = await api.post(
        "/admin/category/store",
        {
          name,
          isActive: form.isActive === "true",
        },
        {
          withCredentials: true,
        }
      );

      toast.success(
        data.message || "Category created successfully."
      );

      onSuccess?.();
      close();
    } catch (error) {
      console.error("Create category error:", error);

      toast.error(
        error.response?.data?.message ||
          "Failed to create category."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-md rounded-3xl bg-white shadow-2xl">

        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-5">
          <div>
            <h2 className="text-2xl font-bold text-slate-800">
              Add Category
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Create a new category
            </p>
          </div>

          <button
            onClick={close}
            className="rounded-xl bg-slate-100 p-2 transition hover:bg-red-100"
          >
            <X size={18} className="text-slate-700" />
          </button>
        </div>

        {/* Body */}
        <div className="space-y-5 p-6">

          {/* Category Name */}
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Category Name
            </label>

            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              maxLength={50}
              placeholder="Programming/Finance"
              className="h-11 w-full rounded-xl border border-slate-200 bg-white px-4 text-slate-800 placeholder:text-slate-400 outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500"
            />
          </div>

          {/* Status */}
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Status
            </label>

            <select
              name="isActive"
              value={form.isActive}
              onChange={handleChange}
              className="h-11 w-full rounded-xl border border-slate-200 bg-white px-4 text-slate-800 outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500"
            >
              <option value="true">Active</option>
              <option value="false">Inactive</option>
            </select>
          </div>

        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 border-t border-slate-200 px-6 py-5">

          <button
            onClick={close}
            disabled={loading}
            className="rounded-xl border border-slate-300 bg-white px-5 py-2.5 text-slate-700 transition hover:bg-slate-100 disabled:opacity-50"
          >
            Cancel
          </button>

          <button
            onClick={handleSubmit}
            disabled={loading}
            className="rounded-xl bg-sky-500 px-6 py-2.5 font-medium text-white shadow-lg transition hover:bg-sky-600 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? "Saving..." : "Save Category"}
          </button>

        </div>
      </div>
    </div>
  );
};

export default AddCategoryModal;