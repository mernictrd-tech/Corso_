import { useEffect, useState } from "react";
import api from "../../../services/api";
import { X, UploadCloud } from "lucide-react";
import { toast } from "react-hot-toast";

const EditProgramModal = ({ close, onSuccess, program }) => {
  const [thumbnail, setThumbnail] = useState(null);
  const [certificateDemo, setCertificateDemo] = useState(null);

  const [preview, setPreview] = useState(null);
  const [certificatePreview, setCertificatePreview] = useState(null);

  const [categories, setCategories] = useState([]);

  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    name: "",
    category: "",
    originalPrice: "",
    sellingPrice: "",
    totalQuestions: "",
    examDuration: "",
    passingQuestions: "",
    description: "",
    status: "Active",
  });

  // ==========================================
  // Fetch Categories
  // ==========================================
  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await api.get("/admin/category/list");

      setCategories(response.data.data || []);
    } catch (error) {
      console.error(error);

      toast.error("Failed to load categories");
    }
  };

  // ==========================================
  // Load Existing Program
  // ==========================================
  useEffect(() => {
    if (!program) return;

    console.log("Selected Program:", program);

    setForm({
      name: program.name || "",

      category:
        typeof program.category === "object"
          ? program.category?._id || ""
          : program.category || "",

      originalPrice: program.originalPrice ?? "",

      sellingPrice: program.sellingPrice ?? "",

      totalQuestions: program.totalQuestions ?? "",

      examDuration: program.examDuration ?? "",

      description: program.description || "",

      passingQuestions: program.passingQuestions || "",

      status: program.isActive ? "Active" : "Inactive",
    });

    // Existing thumbnail
    if (program.thumbnail) {
      setPreview(
        `${import.meta.env.VITE_API_BASE_URL_RESOURCE}${program.thumbnail}`,
      );
    }

    // Existing certificate
    if (program.certificateDemo) {
      setCertificatePreview(
        `${import.meta.env.VITE_API_BASE_URL_RESOURCE}${program.certificateDemo}`,
      );
    }
  }, [program]);

  // ==========================================
  // Handle Input
  // ==========================================
  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  // ==========================================
  // Thumbnail
  // ==========================================
  const handleImage = (e) => {
    const file = e.target.files?.[0];

    if (!file) return;

    setThumbnail(file);

    setPreview(URL.createObjectURL(file));
  };

  // ==========================================
  // Certificate
  // ==========================================
  const handleCertificateImage = (e) => {
    const file = e.target.files?.[0];

    if (!file) return;

    setCertificateDemo(file);

    setCertificatePreview(URL.createObjectURL(file));
  };

  // ==========================================
  // Submit
  // ==========================================
  const handleSubmit = async () => {
    // -----------------------------
    // Validation
    // -----------------------------

    if (!form.name.trim()) {
      toast.error("Program name is required");
      return;
    }

    if (!form.category) {
      toast.error("Please select a category");
      return;
    }

    if (!form.originalPrice) {
      toast.error("Original price is required");
      return;
    }

    if (!form.sellingPrice) {
      toast.error("Selling price is required");
      return;
    }

    if (!form.totalQuestions) {
      toast.error("Number of questions is required");
      return;
    }

    if (!form.examDuration) {
      toast.error("Exam duration is required");
      return;
    }

    if (Number(form.passingQuestions) <= 0) {
      toast.error("No. of Questions to pass is required");
      return;
    }

    if (Number(form.originalPrice) <= 0) {
      toast.error("Original price must be greater than 0");
      return;
    }

    if (Number(form.sellingPrice) <= 0) {
      toast.error("Selling price must be greater than 0");
      return;
    }

    if (Number(form.sellingPrice) > Number(form.originalPrice)) {
      toast.error("Selling price cannot be greater than original price");

      return;
    }

    if (Number(form.totalQuestions) <= 0) {
      toast.error("Number of questions must be greater than 0");

      return;
    }

    if (Number(form.examDuration) <= 0) {
      toast.error("Exam duration must be greater than 0 minutes");

      return;
    }

    try {
      setLoading(true);

      const data = new FormData();

      data.append("name", form.name);

      data.append("category", form.category);

      data.append("originalPrice", Number(form.originalPrice));

      data.append("sellingPrice", Number(form.sellingPrice));

      data.append("totalQuestions", Number(form.totalQuestions));

      data.append("examDuration", Number(form.examDuration));

      data.append("passingQuestions", Number(form.passingQuestions));

      data.append("description", form.description);

      data.append("status", form.status);

      // Only upload if new thumbnail selected
      if (thumbnail) {
        data.append("thumbnail", thumbnail);
      }

      // Only upload if new certificate selected
      if (certificateDemo) {
        data.append("certificateDemo", certificateDemo);
      }

      const response = await api.put(
        `/admin/program/update/${program._id}`,
        data,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        },
      );

      toast.success(response.data?.message || "Program updated successfully");

      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error(error);

      const message =
        error.response?.data?.message ||
        error.response?.data?.error ||
        "Failed to update program";

      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div
        className="w-full max-w-4xl rounded-3xl bg-white shadow-2xl"
        style={{ color: "#1e293b" }}
      >
        {/* ==================================
            Header
        ================================== */}

        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-5">
          <div>
            <h2 className="text-2xl font-bold text-slate-800">Edit Program</h2>

            <p className="mt-1 text-sm text-slate-500">
              Update certification program details
            </p>
          </div>

          <button
            onClick={close}
            className="rounded-xl bg-slate-100 p-2 transition hover:bg-red-100"
          >
            <X size={18} className="text-slate-700" />
          </button>
        </div>

        {/* ==================================
            Body
        ================================== */}

        <div className="grid gap-6 p-6 lg:grid-cols-3">
          {/* ==================================
              Left
          ================================== */}

          <div className="space-y-5 lg:col-span-2">
            {/* Program Name + Category */}

            <div className="grid gap-5 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Program Name
                </label>

                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Full Stack Development"
                  className="h-11 w-full rounded-xl border border-slate-200 bg-white px-4 text-slate-800 placeholder:text-slate-400 outline-none focus:border-sky-500"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Category
                </label>

                <select
                  name="category"
                  value={form.category}
                  onChange={handleChange}
                  className="h-11 w-full rounded-xl border border-slate-200 bg-white px-4 text-slate-800 outline-none focus:border-sky-500"
                >
                  <option value="">Select Category</option>

                  {categories.map((item) => (
                    <option key={item._id} value={item._id}>
                      {item.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Prices */}

            <div className="grid gap-5 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Original Price
                </label>

                <input
                  type="number"
                  name="originalPrice"
                  value={form.originalPrice}
                  onChange={handleChange}
                  placeholder="1999"
                  className="h-11 w-full rounded-xl border border-slate-200 bg-white px-4 text-slate-800 placeholder:text-slate-400 outline-none focus:border-sky-500"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Selling Price
                </label>

                <input
                  type="number"
                  name="sellingPrice"
                  value={form.sellingPrice}
                  onChange={handleChange}
                  placeholder="999"
                  className="h-11 w-full rounded-xl border border-slate-200 bg-white px-4 text-slate-800 placeholder:text-slate-400 outline-none focus:border-sky-500"
                />
              </div>
            </div>

            {/* Questions + Duration */}

            <div className="grid gap-5 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  No. of Questions
                </label>

                <input
                  type="number"
                  min="1"
                  name="totalQuestions"
                  value={form.totalQuestions}
                  onChange={handleChange}
                  placeholder="50"
                  className="h-11 w-full rounded-xl border border-slate-200 bg-white px-4 text-slate-800 placeholder:text-slate-400 outline-none focus:border-sky-500"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Exam Duration
                </label>

                <div className="relative">
                  <input
                    type="number"
                    min="1"
                    name="examDuration"
                    value={form.examDuration}
                    onChange={handleChange}
                    placeholder="60"
                    className="h-11 w-full rounded-xl border border-slate-200 bg-white px-4 pr-16 text-slate-800 placeholder:text-slate-400 outline-none focus:border-sky-500"
                  />

                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-slate-500">
                    min
                  </span>
                </div>
              </div>
            </div>

            <div className="grid gap-5 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  No of Questions To Pass
                </label>

                <input
                  type="number"
                  min="1"
                  name="passingQuestions"
                  value={form.passingQuestions}
                  onChange={handleChange}
                  placeholder="15"
                  className="h-11 w-full rounded-xl border border-slate-200 bg-white px-4 text-slate-800 placeholder:text-slate-400 outline-none focus:border-sky-500"
                />
              </div>
            </div>

            {/* Description */}

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Description
              </label>

              <textarea
                rows={5}
                name="description"
                value={form.description}
                onChange={handleChange}
                placeholder="Write program description..."
                className="w-full resize-none rounded-xl border border-slate-200 bg-white p-4 text-slate-800 placeholder:text-slate-400 outline-none focus:border-sky-500"
              />
            </div>

            {/* Status */}

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Status
              </label>

              <select
                name="status"
                value={form.status}
                onChange={handleChange}
                className="h-11 w-full rounded-xl border border-slate-200 bg-white px-4 text-slate-800 outline-none focus:border-sky-500"
              >
                <option value="Active">Active</option>

                <option value="Inactive">Inactive</option>
              </select>
            </div>
          </div>

          {/* ==================================
              Right
          ================================== */}

          <div>
            {/* Thumbnail */}

            <label className="mb-2 block text-sm font-medium text-slate-700">
              Thumbnail
            </label>

            <label className="flex h-64 cursor-pointer flex-col items-center justify-center overflow-hidden rounded-2xl border-2 border-dashed border-slate-300 bg-slate-50 transition hover:border-sky-400 hover:bg-sky-50">
              {preview ? (
                <img
                  src={preview}
                  alt="Thumbnail"
                  className="h-full w-full object-cover"
                />
              ) : (
                <>
                  <UploadCloud size={40} className="text-sky-500" />

                  <p className="mt-4 text-base font-semibold text-slate-700">
                    Upload Image
                  </p>

                  <span className="mt-1 text-sm text-slate-500">PNG / JPG</span>
                </>
              )}

              <input
                type="file"
                className="hidden"
                accept="image/png,image/jpeg,image/jpg,image/webp"
                onChange={handleImage}
              />
            </label>

            {/* Certificate */}

            <label className="my-3 block text-sm font-medium text-slate-700">
              Certificate Demo
            </label>

            <label className="flex h-48 cursor-pointer flex-col items-center justify-center overflow-hidden rounded-2xl border-2 border-dashed border-slate-300 bg-slate-50 transition hover:border-sky-400 hover:bg-sky-50">
              {certificatePreview ? (
                <img
                  src={certificatePreview}
                  alt="Certificate Demo"
                  className="h-full w-full object-cover"
                />
              ) : (
                <>
                  <UploadCloud size={36} className="text-sky-500" />

                  <p className="mt-3 text-base font-semibold text-slate-700">
                    Upload Certificate
                  </p>

                  <span className="mt-1 text-sm text-slate-500">PNG / JPG</span>
                </>
              )}

              <input
                type="file"
                className="hidden"
                accept="image/png,image/jpeg,image/jpg,image/webp"
                onChange={handleCertificateImage}
              />
            </label>
          </div>
        </div>

        {/* ==================================
            Footer
        ================================== */}

        <div className="flex justify-end gap-3 border-t border-slate-200 px-6 py-5">
          <button
            onClick={close}
            disabled={loading}
            className="rounded-xl border border-slate-300 bg-white px-5 py-2.5 text-slate-700 transition hover:bg-slate-100"
          >
            Cancel
          </button>

          <button
            onClick={handleSubmit}
            disabled={loading}
            className="rounded-xl bg-sky-500 px-6 py-2.5 font-medium text-white shadow-lg transition hover:bg-sky-600 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "Updating..." : "Update Program"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditProgramModal;
