import { useState } from "react";
import { Mail, ArrowLeft } from "lucide-react";

import InputField from "./InputField";

const ForgotPassword = ({ onBackToLogin }) => {
  const [email, setEmail] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!email.trim()) return;

    // Backend Integration
    // await axios.post("/api/forgot-password", { email });

    console.log("Reset password for:", email);

    setSuccess(true);
  };

  return (
    <div>
      {/* Heading */}

      <h2 className="text-3xl font-bold text-white">
        Forgot Password?
      </h2>

      <p className="mt-2 text-gray-400">
        Enter your registered email address and we'll send you a password reset
        link.
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
          />

          <button
            type="submit"
            className="w-full rounded-xl bg-gradient-to-r from-cyan-400 to-emerald-400 py-3 font-semibold text-black transition duration-300 hover:scale-[1.02]"
          >
            Send Reset Link
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

          <p className="mt-2 font-semibold text-white">
            {email}
          </p>

          <p className="mt-4 text-sm text-gray-400">
            Didn't receive the email? Check your spam folder or try again in a
            few minutes.
          </p>
        </div>
      )}

      {/* Back */}

      <button
        type="button"
        onClick={onBackToLogin}
        className="mt-8 flex items-center gap-2 text-cyan-400 transition hover:text-cyan-300"
      >
        <ArrowLeft size={18} />
        Back to Login
      </button>
    </div>
  );
};

export default ForgotPassword;