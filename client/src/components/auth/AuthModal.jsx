import { useEffect, useState } from "react";
import { X } from "lucide-react";

import LoginForm from "./LoginForm";
import SignupForm from "./SignupForm";
import ForgotPassword from "./ForgotPassword";

const AuthModal = ({ isOpen, onClose }) => {
  const [screen, setScreen] = useState("login");

  useEffect(() => {
    if (!isOpen) {
      setScreen("login");
    }
  }, [isOpen]);

  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("keydown", handleEsc);

    return () =>
      document.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  if (!isOpen) return null;

  return (
    <div
      onClick={onClose}
      className="
        fixed inset-0 z-[9999]
        flex items-start justify-center
        bg-black/70 backdrop-blur-sm
        px-3 py-3
        sm:items-center sm:px-4 sm:py-6
      "
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="
          relative
          w-full max-w-md
          max-h-[calc(100dvh-1.5rem)]
          overflow-y-auto overscroll-contain
          rounded-2xl
          border border-white/10
          bg-[#0B1220]
          p-5 sm:p-6
          shadow-[0_20px_80px_rgba(0,0,0,0.6)]
          animate-[fadeIn_.25s_ease]
        "
      >
        {/* Close Button */}

        <button
          onClick={onClose}
          className="
            absolute right-4 top-4 z-10
            rounded-full p-2
            text-gray-400
            transition hover:bg-white/10 hover:text-white
          "
        >
          <X size={20} />
        </button>

        {/* Login */}

        {screen === "login" && (
          <LoginForm
            onSwitchToSignup={() => setScreen("signup")}
            onForgotPassword={() => setScreen("forgot")}
          />
        )}

        {/* Signup */}

        {screen === "signup" && (
          <SignupForm
            onSwitchToLogin={() => setScreen("login")}
          />
        )}

        {/* Forgot Password */}

        {screen === "forgot" && (
          <ForgotPassword
            onBackToLogin={() => setScreen("login")}
          />
        )}
      </div>
    </div>
  );
};

export default AuthModal;