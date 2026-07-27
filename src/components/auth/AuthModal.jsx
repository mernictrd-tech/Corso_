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
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/70 backdrop-blur-sm px-4"
    >
      <div
        onClick={(e) => e.stopPropagation()}
className="relative w-full max-w-md rounded-2xl border border-white/10 bg-[#0B1220] p-5 shadow-[0_20px_80px_rgba(0,0,0,0.6)] animate-[fadeIn_.25s_ease]"      >
        {/* Close */}

        <button
          onClick={onClose}
          className="absolute right-5 top-5 rounded-full p-2 text-gray-400 transition hover:bg-white/10 hover:text-white"
        >
          <X size={20} />
        </button>

        {screen === "login" && (
          <LoginForm
            onSwitchToSignup={() =>
              setScreen("signup")
            }
            onForgotPassword={() =>
              setScreen("forgot")
            }
          />
        )}

        {screen === "signup" && (
          <SignupForm
            onSwitchToLogin={() =>
              setScreen("login")
            }
          />
        )}

        {screen === "forgot" && (
          <ForgotPassword
            onBackToLogin={() =>
              setScreen("login")
            }
          />
        )}
      </div>
    </div>
  );
};

export default AuthModal;