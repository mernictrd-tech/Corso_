import { useState } from "react";
import { User, Mail, Lock } from "lucide-react";

import InputField from "./InputField";
import GoogleButton from "./GoogleButton";

const SignupForm = ({ onSwitchToLogin }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    agree: false,
  });

  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value, checked, type } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (!formData.agree) {
      setError("Please accept the Terms & Conditions.");
      return;
    }

    setError("");

    console.log("Signup Data:", formData);

    // Backend
    // axios.post("/api/signup", formData);
  };

  const handleGoogleSignup = () => {
    console.log("Google Signup");

    // Backend
    // window.location.href="/api/auth/google";
  };

  return (
    <div>
      <h2 className="text-2xl font-bold text-white">
        Create Your Account
      </h2>

      <p className="mt-1 text-gray-400">
        Join Corso and start validating your skills.
      </p>

      <div className="mt-4">
        <GoogleButton onClick={handleGoogleSignup} />
      </div>

      {/* Divider */}

      <div className="my-4 flex items-center">
        <div className="h-px flex-1 bg-white/10"></div>

        <span className="mx-4 text-sm text-gray-500">
          OR
        </span>

        <div className="h-px flex-1 bg-white/10"></div>
      </div>

      <form
        onSubmit={handleSubmit}
        className="space-y-3.5"
      >
        <InputField
          label="Full Name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Enter your full name"
          icon={User}
        />

        <InputField
          label="Email Address"
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="Enter your email"
          icon={Mail}
        />

        <InputField
          label="Password"
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          placeholder="Create password"
          icon={Lock}
        />

        <InputField
          label="Confirm Password"
          type="password"
          name="confirmPassword"
          value={formData.confirmPassword}
          onChange={handleChange}
          placeholder="Confirm password"
          icon={Lock}
        />

        <label className="flex items-start gap-2 text-sm text-gray-400">
          <input
            type="checkbox"
            name="agree"
            checked={formData.agree}
            onChange={handleChange}
            className="mt-1 accent-cyan-400"
          />

          <span>
            I agree to the{" "}
            <button
              type="button"
              className="text-cyan-400 hover:text-cyan-300"
            >
              Terms & Conditions
            </button>{" "}
            and{" "}
            <button
              type="button"
              className="text-cyan-400 hover:text-cyan-300"
            >
              Privacy Policy
            </button>
          </span>
        </label>

        {error && (
          <p className="text-sm text-red-400">
            {error}
          </p>
        )}

        <button
          type="submit"
className="w-full rounded-xl bg-gradient-to-r from-cyan-400 to-emerald-400 py-2.5 font-semibold text-black transition hover:scale-[1.02]"        >
          Create Account
        </button>
      </form>

      <p className="mt-5 text-center text-gray-400">
        Already have an account?

        <button
          type="button"
          onClick={onSwitchToLogin}
          className="ml-2 font-semibold text-cyan-400 hover:text-cyan-300"
        >
          Login
        </button>
      </p>
    </div>
  );
};

export default SignupForm;