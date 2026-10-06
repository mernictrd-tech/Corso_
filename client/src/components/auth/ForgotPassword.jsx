import { useState } from "react";
import { Mail, ArrowLeft, Loader2 } from "lucide-react";
import toast from "react-hot-toast";

import InputField from "./InputField";
import api from "../../services/api";

const ForgotPassword = ({ onBackToLogin }) => {
  const [email, setEmail] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const trimmedEmail = email.trim();

    if (!trimmedEmail) {
      toast.error("Please enter your email address.");
      return;
    }

    try {
      setLoading(true);

      const response = await api.post("/auth/forgot-password", {
        email: trimmedEmail,
      });

      toast.success(
        response.data?.message || "Password reset link sent."
      );

      setSuccess(true);
    } catch (error) {
      console.error("Forgot password error:", error);

      toast.error(
        error.response?.data?.message ||
          "Unable to process your request. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2 className="text-3xl font-bold text-white">
        Forgot Password?
      </h2>

      <p className="mt-2 text-gray-400">
        Enter your registered email address and we'll send you a password
        reset link.
      </p>

      {!success ? (
        <form
          onSubmit={handleSubmit}
          className="mt-8 space-y-6"
        >
          <InputField
            label="Email Address"
            type="email"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            icon={Mail}
            disabled={loading}
          />

          <button
            type="submit"
            disabled={loading}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-cyan-400 to-emerald-400 py-3 font-semibold text-black transition duration-300 hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                Sending...
              </>
            ) : (
              "Send Reset Link"
            )}
          </button>
        </form>
      ) : (
        <div className="mt-8 rounded-2xl border border-emerald-500/20 bg-emerald-500/10 p-6 text-center">
          <h3 className="text-xl font-semibold text-emerald-300">
            Check your email 📧
          </h3>

          <p className="mt-3 text-gray-300">
            We've sent a password reset link to
          </p>

          <p className="mt-2 break-all font-semibold text-white">
            {email}
          </p>

          <p className="mt-4 text-sm text-gray-400">
            Didn't receive the email? Check your spam folder or try again
            in a few minutes.
          </p>
        </div>
      )}

      <button
        type="button"
        onClick={onBackToLogin}
        disabled={loading}
        className="mt-8 flex items-center gap-2 text-cyan-400 transition hover:text-cyan-300"
      >
        <ArrowLeft size={18} />
        Back to Login
      </button>
    </div>
  );
};

export default ForgotPassword;