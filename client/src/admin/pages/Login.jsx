import { useState } from "react";
import { Eye, EyeOff, Lock, Mail } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { adminLogin } from "../services/adminService";

const Login = () => {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

      console.log("FORM DATA:", formData);
      console.log("EMAIL LENGTH:", formData.email.length);

    try {
      setLoading(true);

      setError("");

      const res = await adminLogin(formData);

      localStorage.setItem( 
        "admin",
        JSON.stringify(res.data)
      );

      navigate("/admin/dashboard");
    } catch (err) {
      setError(
        err.response?.data?.message ||
        "Login failed."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#070B1A] px-5">

      <div className="w-full max-w-md rounded-3xl border border-white/10 bg-[#111827] p-8 shadow-2xl">

        <h1 className="text-3xl font-bold text-white">
          Admin Login
        </h1>

        <p className="mt-2 text-gray-400">
          Login to manage Corso.
        </p>

        <form
          onSubmit={handleSubmit}
          className="mt-8 space-y-5"
        >

          <div>

            <label className="mb-2 block text-sm text-gray-300">
              Email
            </label>

            <div className="flex items-center rounded-xl border border-white/10 bg-[#1B2333] px-4">

              <Mail
                size={20}
                className="text-gray-400"
              />

              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter email"
                className="w-full bg-transparent px-3 py-4 text-white outline-none"
              />

            </div>

          </div>

          <div>

            <label className="mb-2 block text-sm text-gray-300">
              Password
            </label>

            <div className="flex items-center rounded-xl border border-white/10 bg-[#1B2333] px-4">

              <Lock
                size={20}
                className="text-gray-400"
              />

              <input
                type={
                  showPassword
                    ? "text"
                    : "password"
                }
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter password"
                className="w-full bg-transparent px-3 py-4 text-white outline-none"
              />

              <button
                type="button"
                onClick={() =>
                  setShowPassword(!showPassword)
                }
              >
                {showPassword ? (
                  <EyeOff
                    className="text-gray-400"
                    size={20}
                  />
                ) : (
                  <Eye
                    className="text-gray-400"
                    size={20}
                  />
                )

                }
              </button>

            </div>

            {error && (
              <p className="mt-2 text-sm text-red-500">
                {error}
              </p>
            )}

          </div>

          <button
            type="submit"
            className="w-full rounded-xl bg-cyan-500 py-4 font-semibold text-white transition hover:bg-cyan-600"
          >
            {
              loading ? "Logging in..." : "Login"
            }
          </button>

        </form>

      </div>

    </div>
  );
};

export default Login;