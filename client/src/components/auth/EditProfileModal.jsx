import { useEffect, useRef, useState } from "react";
import { X, User, Mail, Save, Camera, PhoneCall } from "lucide-react";

import {
  X,
  User,
  Mail,
  Save,
  Camera,
  Lock,
  Eye,
  EyeOff,
} from "lucide-react";

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

  // ================= CHANGE PASSWORD STATES =================

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [passwordLoading, setPasswordLoading] = useState(false);

  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // ================= LOAD PROFILE =================

  useEffect(() => {
    if (profile) {
      setForm({
        name: profile.fullName || "",
        email: profile.email || "",
        phone: profile.phone || "",
        profileImage: null,
      });

      setPreview(profile.avatar || "");
    }
  }, [profile]);

  // ================= PROFILE CHANGE =================

  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  // ================= IMAGE CHANGE =================

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];

    if (!file) return;

    const allowedTypes = [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/webp",
    ];

    if (!allowedTypes.includes(file.type)) {
      alert("Please select a JPG, PNG or WEBP image.");
      e.target.value = "";
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      alert("Profile image must be less than 2MB.");
      e.target.value = "";
      return;
    }

    setForm((prev) => ({
      ...prev,
      profileImage: file,
    }));

    const imageUrl = URL.createObjectURL(file);
    setPreview(imageUrl);
  };

  const getImageUrl = (image) => {
    if (!image) return "";

    if (
      image.startsWith("blob:") ||
      image.startsWith("http://") ||
      image.startsWith("https://")
    ) {
      return image;
    }

    return `${import.meta.env.VITE_API_BASE_URL_RESOURCE}${image}`;
  };
  // ================= PROFILE SUBMIT =================

  const handleSubmit = async (e) => {
    e.preventDefault();

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

    // phone validation
    const trimmedPhone = form.phone.trim();

    if (!trimmedPhone) {
      alert("Phone is required.");
      return;
    }

    try {
      setLoading(true);

      const formData = new FormData();

      formData.append("name", trimmedName);
      formData.append("email", trimmedEmail);
      formData.append("phone", trimmedPhone);

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

      toast.error(
        error.response?.data?.message || "Failed to update profile."
      );
    } finally {
      setLoading(false);
    }
  };

  // ================= PASSWORD INPUT CHANGE =================

  const handlePasswordChange = (e) => {
    setPasswordForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  // ================= CHANGE PASSWORD =================

  const handleChangePassword = async (e) => {
    e.preventDefault();

    const { currentPassword, newPassword, confirmPassword } = passwordForm;

    if (!currentPassword) {
      toast.error("Current password is required.");
      return;
    }

    if (!newPassword) {
      toast.error("New password is required.");
      return;
    }

    if (newPassword.length < 6) {
      toast.error("New password must be at least 6 characters long.");
      return;
    }

    if (newPassword === currentPassword) {
      toast.error(
        "New password must be different from your current password."
      );
      return;
    }

    if (!confirmPassword) {
      toast.error("Please confirm your new password.");
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error("New password and confirm password do not match.");
      return;
    }

    try {
      setPasswordLoading(true);

      const { data } = await api.put(
        "/auth/change-password",
        {
          currentPassword,
          newPassword,
        },
        {
          withCredentials: true,
        }
      );

      toast.success(
        data.message || "Password changed successfully."
      );

      setPasswordForm({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (error) {
      console.error("Change password failed:", error);

      toast.error(
        error.response?.data?.message ||
          "Failed to change password."
      );
    } finally {
      setPasswordLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4 backdrop-blur-sm"
      onClick={close}
    >
      <div
        className="max-h-[90vh] w-full max-w-md overflow-y-auto rounded-2xl border border-gray-800 bg-gray-900 p-6 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* ================= HEADER ================= */}

        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-xl font-semibold text-white">
              Edit Profile
            </h2>

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

        {/* ================= PROFILE IMAGE ================= */}

        <div className="mt-6 flex flex-col items-center">
          <div className="relative">
            {preview ? (
              <img
                src={getImageUrl(preview)}
                alt="Profile"
                className="h-24 w-24 rounded-full border-2 border-cyan-500 object-cover"
              />
            ) : (
              <div className="flex h-24 w-24 items-center justify-center rounded-full bg-cyan-500 text-3xl font-bold text-black">
                {form.name?.charAt(0)?.toUpperCase() || "U"}
              </div>
            )}

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

        {/* ================= PROFILE FORM ================= */}

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

          {/* Phone */}
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-300">
              Phone
            </label>

            <div className="relative">
              <PhoneCall
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-cyan-400"
              />

              <input
                type="phone"
                name="phone"
                value={form.phone}
                onChange={handleChange}
                required
                className="w-full rounded-xl border border-gray-700 bg-gray-950 py-3 pl-10 pr-4 text-sm text-white outline-none transition placeholder:text-gray-600 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500"
                placeholder="Enter your email"
              />
            </div>
          </div>

          {/* Buttons */}
          {/* Profile Buttons */}

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={close}
              disabled={loading || passwordLoading}
              className="flex-1 rounded-xl border border-gray-700 px-4 py-3 text-sm font-medium text-gray-300 transition hover:bg-gray-800 disabled:opacity-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading || passwordLoading}
              className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-cyan-500 px-4 py-3 text-sm font-semibold text-black transition hover:bg-cyan-400 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Save size={17} />

              {loading ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>

        {/* ================= DIVIDER ================= */}

        <div className="my-7 border-t border-gray-800" />

        {/* ================= CHANGE PASSWORD ================= */}

        <div>
          <div className="mb-5">
            <h3 className="text-lg font-semibold text-white">
              Change Password
            </h3>

            <p className="mt-1 text-sm text-gray-400">
              Update your account password
            </p>
          </div>

          <form
            onSubmit={handleChangePassword}
            className="space-y-4"
          >
            {/* Current Password */}

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-300">
                Current Password
              </label>

              <div className="relative">
                <Lock
                  size={18}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-cyan-400"
                />

                <input
                  type={showCurrentPassword ? "text" : "password"}
                  name="currentPassword"
                  value={passwordForm.currentPassword}
                  onChange={handlePasswordChange}
                  className="w-full rounded-xl border border-gray-700 bg-gray-950 py-3 pl-10 pr-11 text-sm text-white outline-none transition placeholder:text-gray-600 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500"
                  placeholder="Enter current password"
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowCurrentPassword((prev) => !prev)
                  }
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 transition hover:text-cyan-400"
                >
                  {showCurrentPassword ? (
                    <EyeOff size={18} />
                  ) : (
                    <Eye size={18} />
                  )}
                </button>
              </div>
            </div>

            {/* New Password */}

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-300">
                New Password
              </label>

              <div className="relative">
                <Lock
                  size={18}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-cyan-400"
                />

                <input
                  type={showNewPassword ? "text" : "password"}
                  name="newPassword"
                  value={passwordForm.newPassword}
                  onChange={handlePasswordChange}
                  className="w-full rounded-xl border border-gray-700 bg-gray-950 py-3 pl-10 pr-11 text-sm text-white outline-none transition placeholder:text-gray-600 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500"
                  placeholder="Enter new password"
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowNewPassword((prev) => !prev)
                  }
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 transition hover:text-cyan-400"
                >
                  {showNewPassword ? (
                    <EyeOff size={18} />
                  ) : (
                    <Eye size={18} />
                  )}
                </button>
              </div>

              <p className="mt-1.5 text-xs text-gray-500">
                Password must be at least 6 characters.
              </p>
            </div>

            {/* Confirm Password */}

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-300">
                Confirm New Password
              </label>

              <div className="relative">
                <Lock
                  size={18}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-cyan-400"
                />

                <input
                  type={
                    showConfirmPassword ? "text" : "password"
                  }
                  name="confirmPassword"
                  value={passwordForm.confirmPassword}
                  onChange={handlePasswordChange}
                  className="w-full rounded-xl border border-gray-700 bg-gray-950 py-3 pl-10 pr-11 text-sm text-white outline-none transition placeholder:text-gray-600 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500"
                  placeholder="Confirm new password"
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowConfirmPassword((prev) => !prev)
                  }
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 transition hover:text-cyan-400"
                >
                  {showConfirmPassword ? (
                    <EyeOff size={18} />
                  ) : (
                    <Eye size={18} />
                  )}
                </button>
              </div>
            </div>

            {/* Change Password Button */}

            <button
              type="submit"
              disabled={passwordLoading}
              className="flex w-full items-center justify-center gap-2 rounded-xl border border-cyan-500 bg-cyan-500/10 px-4 py-3 text-sm font-semibold text-cyan-400 transition hover:bg-cyan-500 hover:text-black disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Lock size={17} />

              {passwordLoading
                ? "Changing Password..."
                : "Change Password"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditProfileModal;