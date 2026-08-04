import { useEffect, useState } from "react";
import api from "../../../services/api";
import { X, UploadCloud } from "lucide-react";

const AddProgramModal = ({ close, onSuccess }) => {
  const [thumbnail, setThumbnail] = useState(null);

  const [categories, setCategories] = useState([]);

  useEffect(() => {
    fetchCategories();
  }, []);

  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    name: "",
    category: "",
    originalPrice: "",
    sellingPrice: "",
    totalQuestions: "",
    description: "",
    status: "Active",
  });

  const [preview, setPreview] = useState(null);

  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleImage = (e) => {
    const file = e.target.files[0];

    if (!file) return;

    setThumbnail(file);

    setPreview(URL.createObjectURL(file));
  };

  const fetchCategories = async () => {
    try {
      const response = await api.get("/admin/category/list");

      setCategories(response.data.data);
    } catch (error) {
      console.log(error);
    }
  };

  const handleSubmit = async () => {
    if (
      !form.name ||
      !form.category ||
      !form.originalPrice ||
      !form.sellingPrice ||
      !form.totalQuestions
    ) {
      alert("Please fill all required fields");
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

      data.append("description", form.description);

      data.append("status", form.status);

      if (thumbnail) {
        data.append("thumbnail", thumbnail);
      }

      const response = await api.post("/admin/program/store", data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      alert("Program created");

      if (onSuccess) {
        onSuccess();
      }
      close();
    } catch (error) {
      console.log(error);
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
        {/* Header */}

        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-5">
          <div>
            <h2 className="text-2xl font-bold text-slate-800">Add Program</h2>

            <p className="mt-1 text-sm text-slate-500">
              Create a new certification program
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

        <div className="grid gap-6 p-6 lg:grid-cols-3">
          {/* Left */}

          <div className="space-y-5 lg:col-span-2">
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

            <div className="grid gap-5 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Original Price
                </label>

                <input
                  type="text"
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
                  type="text"
                  placeholder="999"
                  name="sellingPrice"
                  value={form.sellingPrice}
                  onChange={handleChange}
                  className="h-11 w-full rounded-xl border border-slate-200 bg-white px-4 text-slate-800 placeholder:text-slate-400 outline-none focus:border-sky-500"
                />
              </div>
            </div>

            <div className="grid gap-5 md:grid-cols-1">
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  No. of Questions
                </label>

                <input
                  type="text"
                  name="totalQuestions"
                  value={form.totalQuestions}
                  onChange={handleChange}
                  placeholder="10-50"
                  className="h-11 w-full rounded-xl border border-slate-200 bg-white px-4 text-slate-800 placeholder:text-slate-400 outline-none focus:border-sky-500"
                />
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Description
              </label>

              <textarea
                rows={6}
                name="description"
                value={form.description}
                onChange={handleChange}
                placeholder="Write program description..."
                className="w-full rounded-xl border border-slate-200 bg-white p-4 text-slate-800 placeholder:text-slate-400 outline-none resize-none focus:border-sky-500"
              />
            </div>
          </div>

          {/* Right */}

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Thumbnail
            </label>

            <label className="flex h-64 cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-300 bg-slate-50 transition hover:border-sky-400 hover:bg-sky-50">
              {preview ? (
                <img
                  src={preview}
                  alt="Thumbnail"
                  className="h-full w-full rounded-2xl object-cover"
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

              <input type="file" className="hidden" onChange={handleImage} />
            </label>
          </div>
        </div>

        {/* Footer */}

        <div className="flex justify-end gap-3 border-t border-slate-200 px-6 py-5">
          <button
            onClick={close}
            className="rounded-xl border border-slate-300 bg-white px-5 py-2.5 text-slate-700 transition hover:bg-slate-100"
          >
            Cancel
          </button>

          <button
            onClick={handleSubmit}
            disabled={loading}
            className="rounded-xl bg-sky-500 px-6 py-2.5 font-medium text-white shadow-lg transition hover:bg-sky-600"
          >
            {loading ? "Saving..." : "Save Program"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddProgramModal;
