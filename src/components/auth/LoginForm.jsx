import { useState } from "react";
import { Mail, Lock } from "lucide-react";

import InputField from "./InputField";
import GoogleButton from "./GoogleButton";

const LoginForm = ({
  onSwitchToSignup,
  onForgotPassword,
}) => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    remember: false,
  });

  const handleChange = (e) => {
    const { name, value, checked, type } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]:
        type === "checkbox"
          ? checked
          : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    console.log("Login Data:", formData);

    // Backend Integration
    // await axios.post("/api/login", formData);
  };

  const handleGoogleLogin = () => {
    console.log("Google Login");

    // Backend
    // window.location.href="/api/auth/google";
  };

  return (
    <div>

      <h2 className="text-2xl font-bold text-white">
        Welcome Back 👋
      </h2>

      <p className="mt-1 text-gray-400">
        Login to continue your learning journey.
      </p>

      <div className="mt-5">
        <GoogleButton
          onClick={handleGoogleLogin}
        />
      </div>

      {/* Divider */}

      <div className="my-5 flex items-center">
        <div className="h-px flex-1 bg-white/10"></div>

        <span className="mx-4 text-sm text-gray-500">
          OR
        </span>

        <div className="h-px flex-1 bg-white/10"></div>
      </div>

      <form
  onSubmit={handleSubmit}
  className="space-y-4"
>
        <InputField
          label="Email Address"
          type="email"
          placeholder="Enter your email"
          value={formData.email}
          onChange={handleChange}
          icon={Mail}
          name="email"
        />

        <InputField
          label="Password"
          type="password"
          placeholder="Enter password"
          value={formData.password}
          onChange={handleChange}
          icon={Lock}
          name="password"
        />

        {/* Remember */}

        <div className="flex items-center justify-between">

          <label className="flex items-center gap-2 text-sm text-gray-400">

            <input
              type="checkbox"
              name="remember"
              checked={formData.remember}
              onChange={handleChange}
              className="accent-cyan-400"
            />

            Remember Me

          </label>

          <button
            type="button"
            onClick={onForgotPassword}
            className="text-sm text-cyan-400 hover:text-cyan-300"
          >
            Forgot Password?
          </button>

        </div>

        <button
          type="submit"
className="w-full rounded-xl bg-gradient-to-r from-cyan-400 to-emerald-400 py-2.5 font-semibold text-black transition hover:scale-[1.02]"        >
          Login
        </button>
      </form>

<p className="mt-5 text-center text-gray-400">
        Don't have an account?

        <button
          onClick={onSwitchToSignup}
          className="ml-2 font-semibold text-cyan-400 hover:text-cyan-300"
        >
          Sign Up
        </button>

      </p>

<p className="mt-4 text-center text-xs text-gray-500">        
  By continuing you agree to our Terms &
        Conditions and Privacy Policy.
      </p>

    </div>
  );
};

export default LoginForm;