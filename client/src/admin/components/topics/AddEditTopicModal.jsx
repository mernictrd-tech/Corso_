import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { toast } from "react-hot-toast";
import api from "../../../services/api";

const AddTopicModal = ({
  close,
  onSuccess,
  programId,
  topic = null,
}) => {
  const isEdit = Boolean(topic);

  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    name: "",
    description: "",
    isActive: true,
  });

  // Populate form when editing
  useEffect(() => {
    if (topic) {
      setForm({
        name: topic.name || "",
        description: topic.description || "",
        isActive: topic.isActive ?? true,
      });
    } else {
      setForm({
        name: "",
        description: "",
        isActive: true,
      });
    }
  }, [topic]);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // Validation
  const validateForm = () => {
    const topicName = form.name.trim();

    if (!topicName) {
      toast.error("Topic name is required");
      return false;
    }

    if (topicName.length < 2) {
      toast.error("Topic name must be at least 2 characters");
      return false;
    }

    if (topicName.length > 100) {
      toast.error("Topic name cannot exceed 100 characters");
      return false;
    }

    if (form.description.trim().length > 500) {
      toast.error("Description cannot exceed 500 characters");
      return false;
    }

    if (!isEdit && !programId) {
      toast.error("Please select a program");
      return false;
    }

    return true;
  };

  // Submit
  const handleSubmit = async () => {
    if (!validateForm()) return;

    try {
      setLoading(true);

      const data = {
        name: form.name.trim(),
        description: form.description.trim(),
        isActive: form.isActive,
      };

      if (isEdit) {
        await api.put(`/admin/topic/${topic._id}`, data);

        toast.success("Topic updated successfully");
      } else {
        await api.post("/admin/topic/store", {
          ...data,
          program: programId,
        });

        toast.success("Topic created successfully");
      }

      if (onSuccess) {
        onSuccess();
      }

      close();
    } catch (error) {
      console.error("Topic save error:", error);

      const message =
        error.response?.data?.message ||
        error.response?.data?.error ||
        "Failed to save topic";

      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div
        className="w-full max-w-xl rounded-3xl bg-white shadow-2xl"
        style={{ color: "#1e293b" }}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-5">
          <div>
            <h2 className="text-2xl font-bold text-slate-800">
              {isEdit ? "Edit Topic" : "Add Topic"}
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              {isEdit
                ? "Update topic details"
                : "Create a new topic for this program"}
            </p>
          </div>

          <button
            type="button"
            onClick={close}
            disabled={loading}
            className="rounded-xl bg-slate-100 p-2 transition hover:bg-red-100 disabled:opacity-50"
          >
            <X size={18} className="text-slate-700" />
          </button>
        </div>

        {/* Body */}
        <div className="space-y-5 p-6">
          {/* Topic Name */}
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Topic Name <span className="text-red-500">*</span>
            </label>

            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="e.g. Introduction to React"
              maxLength={100}
              disabled={loading}
              className="h-11 w-full rounded-xl border border-slate-200 bg-white px-4 text-slate-800 placeholder:text-slate-400 outline-none focus:border-sky-500 disabled:bg-slate-100"
            />

            <div className="mt-1 text-right text-xs text-slate-400">
              {form.name.length}/100
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Description
            </label>

            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              rows={5}
              maxLength={500}
              disabled={loading}
              placeholder="Write topic description..."
              className="w-full resize-none rounded-xl border border-slate-200 bg-white p-4 text-slate-800 placeholder:text-slate-400 outline-none focus:border-sky-500 disabled:bg-slate-100"
            />

            <div className="mt-1 text-right text-xs text-slate-400">
              {form.description.length}/500
            </div>
          </div>

          {/* Active Status */}
          <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
            <div>
              <p className="text-sm font-medium text-slate-700">
                Active Status
              </p>

              <p className="text-xs text-slate-500">
                Enable this topic for students
              </p>
            </div>

            <label className="relative inline-flex cursor-pointer items-center">
              <input
                type="checkbox"
                name="isActive"
                checked={form.isActive}
                onChange={handleChange}
                disabled={loading}
                className="peer sr-only"
              />

              <div className="h-6 w-11 rounded-full bg-slate-300 transition peer-checked:bg-sky-500 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:bg-white after:transition-all peer-checked:after:translate-x-full" />
            </label>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 border-t border-slate-200 px-6 py-5">
          <button
            type="button"
            onClick={close}
            disabled={loading}
            className="rounded-xl border border-slate-300 bg-white px-5 py-2.5 text-slate-700 transition hover:bg-slate-100 disabled:opacity-50"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={handleSubmit}
            disabled={loading}
            className="rounded-xl bg-sky-500 px-6 py-2.5 font-medium text-white shadow-lg transition hover:bg-sky-600 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading
              ? isEdit
                ? "Updating..."
                : "Saving..."
              : isEdit
                ? "Update Topic"
                : "Save Topic"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddTopicModal;