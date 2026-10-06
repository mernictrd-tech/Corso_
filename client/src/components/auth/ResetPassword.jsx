import { useState } from "react";
import { Lock, Eye, EyeOff, CheckCircle, Loader2 } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";

import InputField from "./InputField";
import api from "../../services/api";

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] =
    useState(false);

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!password || !confirmPassword) {
      toast.error("Please enter both passwords.");
      return;
    }

    if (password.length < 8) {
      toast.error(
        "Password must be at least 8 characters long."
      );
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }

    try {
      setLoading(true);

      const response = await api.post(
        `/auth/reset-password/${token}`,
        {
          password,
          confirmPassword,
        }
      );

      toast.success(
        response.data?.message ||
          "Password reset successfully."
      );

      setSuccess(true);
    } catch (error) {
      console.error("Reset password error:", error);

      toast.error(
        error.response?.data?.message ||
          "Unable to reset password."
      );
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#070b1a] px-4">
        <div className="w-full max-w-md rounded-2xl border border-white/10 bg-slate-950 p-8 text-center shadow-2xl">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-500/10">
            <CheckCircle
              size={30}
              className="text-emerald-400"
            />
          </div>

          <h2 className="mt-5 text-2xl font-bold text-white">
            Password Reset Successfully
          </h2>

          <p className="mt-3 text-gray-400">
            Your password has been updated successfully.
            You can now login with your new password.
          </p>

          <button
            type="button"
            onClick={() => navigate("/")}
            className="mt-7 w-full rounded-xl bg-gradient-to-r from-cyan-400 to-emerald-400 py-3 font-semibold text-black transition hover:scale-[1.02]"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#070b1a] px-4">
      <div className="w-full max-w-md rounded-2xl border border-white/10 bg-slate-950 p-6 sm:p-8 shadow-2xl">

        <div className="text-center">
          <h2 className="text-3xl font-bold text-white">
            Reset Password
          </h2>

          <p className="mt-2 text-gray-400">
            Enter your new password below.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="mt-8 space-y-5"
        >
          <InputField
            label="New Password"
            type={showPassword ? "text" : "password"}
            name="password"
            value={password}
            onChange={(e) =>
              setPassword(e.target.value)
            }
            placeholder="Enter new password"
            icon={Lock}
            rightIcon={
              showPassword ? EyeOff : Eye
            }
            onRightIconClick={() =>
              setShowPassword(!showPassword)
            }
          />

          <InputField
            label="Confirm Password"
            type={
              showConfirmPassword
                ? "text"
                : "password"
            }
            name="confirmPassword"
            value={confirmPassword}
            onChange={(e) =>
              setConfirmPassword(e.target.value)
            }
            placeholder="Confirm new password"
            icon={Lock}
            rightIcon={
              showConfirmPassword
                ? EyeOff
                : Eye
            }
            onRightIconClick={() =>
              setShowConfirmPassword(
                !showConfirmPassword
              )
            }
          />

          <p className="text-xs text-gray-500">
            Password must be at least 8 characters long.
          </p>

          <button
            type="submit"
            disabled={loading}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-cyan-400 to-emerald-400 py-3 font-semibold text-black transition hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? (
              <>
                <Loader2
                  size={18}
                  className="animate-spin"
                />
                Resetting...
              </>
            ) : (
              "Reset Password"
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;