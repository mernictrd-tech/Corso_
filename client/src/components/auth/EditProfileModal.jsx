import { useEffect, useRef, useState } from "react";
import { X, User, Mail, Save, Camera } from "lucide-react";
import api from "../../services/api";
import toast from "react-hot-toast";

const EditProfileModal = ({ profile, close, onSuccess }) => {
  const fileInputRef = useRef(null);

  const [form, setForm] = useState({
    name: "",
    email: "",
    profileImage: null,
  });

  const [preview, setPreview] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (profile) {
      setForm({
        name: profile.fullName || "",
        email: profile.email || "",
        profileImage: null,
      });

      setPreview(profile.avatar || "");
    }
  }, [profile]);

  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];

    if (!file) return;

    // Validate file type
    const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

    if (!allowedTypes.includes(file.type)) {
      alert("Please select a JPG, PNG or WEBP image.");
      e.target.value = "";
      return;
    }

    // Validate file size - 2MB
    if (file.size > 2 * 1024 * 1024) {
      alert("Profile image must be less than 2MB.");
      e.target.value = "";
      return;
    }

    setForm((prev) => ({
      ...prev,
      profileImage: file,
    }));

    // Create preview
    const imageUrl = URL.createObjectURL(file);
    setPreview(imageUrl);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Name validation
    const trimmedName = form.name.trim();

    if (!trimmedName) {
      alert("Name is required.");
      return;
    }

    if (trimmedName.length < 2) {
      alert("Name must be at least 2 characters.");
      return;
    }

    if (trimmedName.length > 50) {
      alert("Name cannot exceed 50 characters.");
      return;
    }

    // Email validation
    const trimmedEmail = form.email.trim();

    if (!trimmedEmail) {
      alert("Email is required.");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(trimmedEmail)) {
      alert("Please enter a valid email address.");
      return;
    }

    try {
      setLoading(true);

      const formData = new FormData();

      formData.append("name", trimmedName);
      formData.append("email", trimmedEmail);

      // Image is optional
      if (form.profileImage) {
        formData.append("profileImage", form.profileImage);
      }

      const { data } = await api.put("/auth/profile", formData, {
        withCredentials: true,
      });

      onSuccess?.(data.data);
      toast.success(data.message || "Profile updated successfully!");

      close();
    } catch (error) {
      console.error("Update profile failed:", error);

      alert(error.response?.data?.message || "Failed to update profile.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4 backdrop-blur-sm"
      onClick={close}
    >
      <div
        className="w-full max-w-md rounded-2xl border border-gray-800 bg-gray-900 p-6 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-xl font-semibold text-white">Edit Profile</h2>

            <p className="mt-1 text-sm text-gray-400">
              Update your account information
            </p>
          </div>

          <button
            type="button"
            onClick={close}
            className="rounded-lg p-2 text-gray-400 transition hover:bg-gray-800 hover:text-cyan-400"
          >
            <X size={20} />
          </button>
        </div>

        {/* Profile Image */}
        <div className="mt-6 flex flex-col items-center">
          <div className="relative">
            {preview ? (
              <img
                src={`${import.meta.env.VITE_API_BASE_URL_RESOURCE}${preview}`}
                alt="Profile"
                className="h-24 w-24 rounded-full border-2 border-cyan-500 object-cover"
              />
            ) : (
              <div className="flex h-24 w-24 items-center justify-center rounded-full bg-cyan-500 text-3xl font-bold text-black">
                {form.name?.charAt(0)?.toUpperCase() || "U"}
              </div>
            )}

            {/* Camera Button */}
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="absolute bottom-0 right-0 flex h-9 w-9 items-center justify-center rounded-full border-2 border-gray-900 bg-cyan-500 text-black transition hover:bg-cyan-400"
            >
              <Camera size={17} />
            </button>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/png,image/jpeg,image/jpg,image/webp"
              onChange={handleImageChange}
              className="hidden"
            />
          </div>

          <p className="mt-3 text-xs text-gray-500">
            JPG, PNG or WEBP · Max 2MB
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="mt-6 space-y-5">
          {/* Name */}
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-300">
              Name
            </label>

            <div className="relative">
              <User
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-cyan-400"
              />

              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                required
                maxLength={50}
                className="w-full rounded-xl border border-gray-700 bg-gray-950 py-3 pl-10 pr-4 text-sm text-white outline-none transition placeholder:text-gray-600 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500"
                placeholder="Enter your name"
              />
            </div>
          </div>

          {/* Email */}
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-300">
              Email
            </label>

            <div className="relative">
              <Mail
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-cyan-400"
              />

              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                required
                className="w-full rounded-xl border border-gray-700 bg-gray-950 py-3 pl-10 pr-4 text-sm text-white outline-none transition placeholder:text-gray-600 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500"
                placeholder="Enter your email"
              />
            </div>
          </div>

          {/* Buttons */}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={close}
              disabled={loading}
              className="flex-1 rounded-xl border border-gray-700 px-4 py-3 text-sm font-medium text-gray-300 transition hover:bg-gray-800 disabled:opacity-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading}
              className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-cyan-500 px-4 py-3 text-sm font-semibold text-black transition hover:bg-cyan-400 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Save size={17} />

              {loading ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProfileModal;
