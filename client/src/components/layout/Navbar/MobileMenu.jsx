    import React, { useEffect, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { User, LogIn, Award, Sparkles, BookOpen, HelpCircle, ShieldCheck, Home } from "lucide-react";

const navLinks = [
  {
    title: "Home",
    sectionId: "home",
    icon: Home,
  },
  {
    title: "About",
    sectionId: "about",
    icon: HelpCircle,
  },
  {
    title: "Courses",
    sectionId: "courses",
    icon: BookOpen,
  },
  {
    title: "Assessment Info",
    sectionId: "assessment-info",
    icon: Award,
  },
  {
    title: "Verify Certificate",
    sectionId: "verify-certificate",
    icon: ShieldCheck,
  },
];

const MobileMenu = ({ isOpen, onClose, user, onOpenAuth }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const menuRef = useRef(null);

  // Close on Escape key and route change
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  // Close on outside click (anywhere outside the menu container)
  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (event) => {
      // If clicking inside menu container, do nothing
      if (menuRef.current && menuRef.current.contains(event.target)) {
        return;
      }
      // If clicking the toggle hamburger button (in header), let the button's own onClick handle it
      if (event.target.closest('button[aria-label="Menu"]')) {
        return;
      }
      onClose();
    };

    // Use mousedown or pointerdown
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("touchstart", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleNavigation = (sectionId) => {
    onClose();
    if (location.pathname === "/") {
      const el = document.getElementById(sectionId);
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    } else {
      navigate(`/#${sectionId}`);
    }
  };

  return (
    <>
      {/* Backdrop overlay */}
      <div
        className="fixed inset-0 top-20 z-30 bg-black/65 backdrop-blur-sm transition-all lg:hidden animate-backdrop-fade"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Mobile Menu Panel */}
      <div
        ref={menuRef}
        className="fixed inset-x-0 top-20 z-40 max-h-[calc(100vh-5rem)] overflow-y-auto border-b border-white/10 bg-[#0d1424]/98 px-6 py-6 shadow-[0_20px_50px_rgba(0,0,0,0.8)] backdrop-blur-2xl transition-all duration-300 lg:hidden animate-menu-slide-down"
      >
        <div className="mx-auto flex max-w-7xl flex-col gap-4">
          {/* Navigation links */}
          <nav className="flex flex-col gap-1.5">
            {navLinks.map((link, idx) => {
              const Icon = link.icon;
              return (
                <button
                  key={link.title}
                  type="button"
                  onClick={() => handleNavigation(link.sectionId)}
                  style={{ animationDelay: `${idx * 40}ms` }}
                  className="group flex items-center gap-3.5 rounded-xl border border-transparent px-4 py-3 text-left font-medium text-gray-200 transition-all duration-200 hover:border-cyan-400/20 hover:bg-cyan-500/10 hover:text-cyan-400 active:scale-[0.98]"
                >
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/5 text-cyan-400 border border-white/5 transition-all duration-200 group-hover:scale-110 group-hover:border-cyan-400/30 group-hover:bg-cyan-500/20">
                    <Icon size={18} />
                  </div>
                  <span className="text-sm font-semibold">{link.title}</span>
                </button>
              );
            })}
          </nav>

          {/* Divider */}
          <div className="my-1 h-px w-full bg-gradient-to-r from-transparent via-white/15 to-transparent" />

          {/* Actions */}
          <div className="flex flex-col gap-3 pt-1">
            {user ? (
              <Link
                to="/dashboard"
                onClick={onClose}
                className="flex items-center justify-between rounded-xl border border-cyan-500/30 bg-cyan-500/10 px-4 py-3 font-semibold text-cyan-300 shadow-[0_0_20px_rgba(6,182,212,0.1)] transition-all duration-200 hover:bg-cyan-500/20 hover:border-cyan-400/50 hover:shadow-[0_0_25px_rgba(6,182,212,0.2)] active:scale-[0.98]"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-cyan-500/20 text-cyan-400">
                    <User size={18} />
                  </div>
                  <span className="text-sm">{user.fullName || "Dashboard"}</span>
                </div>
                <span className="rounded-md bg-cyan-500/20 px-2.5 py-1 text-xs font-semibold text-cyan-300">
                  Dashboard
                </span>
              </Link>
            ) : (
              <button
                type="button"
                onClick={onOpenAuth}
                className="flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 py-3 text-sm font-medium text-white transition-all duration-200 hover:border-cyan-400/40 hover:bg-white/10 active:scale-[0.98]"
              >
                <LogIn size={18} className="text-cyan-400" />
                <span>Login / Sign Up</span>
              </button>
            )}

            <button
              type="button"
              onClick={() => handleNavigation("courses")}
              className="flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-cyan-500 to-cyan-400 py-3 text-sm font-bold text-slate-950 shadow-[0_0_25px_rgba(6,182,212,0.3)] transition-all duration-200 hover:from-cyan-400 hover:to-cyan-300 hover:shadow-[0_0_30px_rgba(6,182,212,0.5)] active:scale-[0.98]"
            >
              <Sparkles size={18} />
              <span>Explore Courses</span>
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default MobileMenu;