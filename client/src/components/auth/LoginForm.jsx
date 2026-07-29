import { useState } from "react";
import { Mail, Lock } from "lucide-react";
import { googleLogin, loginUser } from "../../services/authService";
import InputField from "./InputField";
import GoogleButton from "./GoogleButton";
import { useNavigate } from "react-router-dom";




const LoginForm = ({

  onSwitchToSignup,
  onForgotPassword,
}) => {

  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

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

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      setError("");

      const res = await loginUser({
        email: formData.email,
        password: formData.password,
      });

      console.log(res);

      localStorage.setItem(
        "user",
        JSON.stringify(res.data)
      );

      navigate("/dashboard");

    } catch (error) {
      if (
        error.response?.data?.errors &&
        error.response.data.errors.length > 0
      ) {
        setError(error.response.data.errors[0].message);
      } else {
        setError(
          error.response?.data?.message ||
          "Login failed."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async (
    accessToken
  ) => {
    try {
      const res = await googleLogin(
        accessToken
      );

      console.log(res);

      localStorage.setItem(
        "user",
        JSON.stringify(res.data)
      );

      navigate("/dashboard");
    } catch (error) {
      console.log(error);
    }
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
          onSuccess={handleGoogleLogin}
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

        {error && (
          <p className="text-sm text-red-400">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-xl bg-gradient-to-r from-cyan-400 to-emerald-400 py-2.5 font-semibold text-black transition hover:scale-[1.02] disabled:opacity-60"
        >
          {loading ? "Logging In..." : "Login"}
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