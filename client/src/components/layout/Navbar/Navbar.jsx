import { useState, useEffect, useRef } from "react";
import { Search, Menu, X, User } from "lucide-react";
import { HashLink } from "react-router-hash-link";
import { Link, useNavigate } from "react-router-dom";

import NavLinks from "./NavLinks";
import MobileMenu from "./MobileMenu";
import AuthModal from "../../auth/AuthModal";
import SearchComponent from "../../common/Search/SearchComponent";
import api from "../../../services/api";

const Navbar = () => {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [user, setUser] = useState(null);

  const mobileSearchRef = useRef(null);
  const mobileSearchBtnRef = useRef(null);

  const navigate = useNavigate();

  // Close mobile search on outside click or Escape
  useEffect(() => {
    if (!isMobileSearchOpen) return;

    const handleClickOutside = (e) => {
      if (
        mobileSearchRef.current &&
        !mobileSearchRef.current.contains(e.target) &&
        mobileSearchBtnRef.current &&
        !mobileSearchBtnRef.current.contains(e.target)
      ) {
        setIsMobileSearchOpen(false);
      }
    };

    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        setIsMobileSearchOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("touchstart", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isMobileSearchOpen]);

  // Check logged-in user
  useEffect(() => {
    const checkUser = () => {
      const stored = localStorage.getItem("user");
      if (stored) {
        try {
          setUser(JSON.parse(stored));
        } catch {
          setUser(null);
        }
      } else {
        setUser(null);
      }
    };
    checkUser();
    window.addEventListener("storage", checkUser);
    return () => window.removeEventListener("storage", checkUser);
  }, []);

  // Fetch course list for search
  const fetchProgramList = async () => {
    try {
      const res = await api.get("/program/list");
      return res.data?.data || [];
    } catch {
      return [];
    }
  };

  return (
    <>
      <header className="sticky top-0 z-50 border-b border-white/10 bg-[#111827]/95 backdrop-blur-xl">
        <div className="mx-auto flex h-30 max-w-7xl items-center justify-between px-6">
          {/* Logo */}
          <Link to="/" className="text-2xl font-bold tracking-widest text-white w-70">
            <img src="/assets/skilium-logo-without-bg-DARK.png" alt="akilium-logo" />
          </Link>

          {/* Desktop Menu */}
          <div className="hidden lg:block">
            <NavLinks />
          </div>

          {/* Desktop Right Side */}
          <div className="hidden items-center gap-4 lg:flex">
            <SearchComponent
              variant="expandable"
              size="md"
              placeholder="Search courses, skills, or topics..."
              fetchResults={fetchProgramList}
              onSelect={(course) => {
                navigate(`/course/${course.slug || course._id}`);
              }}
              onSearch={() => navigate("/#courses")}
            />

            {user ? (
              <Link
                to="/dashboard"
                className="flex items-center gap-2 rounded-xl border border-cyan-400/30 bg-cyan-500/10 px-3.5 py-1.5 text-sm font-semibold text-cyan-300 transition hover:bg-cyan-500/20"
              >
                <User size={16} />
                <span>{user.fullName || "Dashboard"}</span>
              </Link>
            ) : (
              <button
                onClick={() => setIsAuthModalOpen(true)}
                className="font-medium text-gray-300 transition hover:text-white"
              >
                Login
              </button>
            )}

            <HashLink
              smooth
              to="/#courses"
              className="inline-flex h-9 cursor-pointer items-center justify-center rounded-xl bg-white px-5 text-sm font-semibold text-slate-900 transition-all duration-300 hover:bg-slate-100"
            >
              Explore Courses
            </HashLink>
          </div>

          {/* Mobile Buttons */}
          <div className="flex items-center gap-3 lg:hidden">
            <button
              ref={mobileSearchBtnRef}
              type="button"
              onClick={() => {
                setIsMobileSearchOpen((prev) => !prev);
                setIsMobileMenuOpen(false);
              }}
              className="p-2 text-gray-300 hover:text-white transition"
              aria-label="Search"
            >
              <Search size={22} />
            </button>

            <button
              type="button"
              onClick={() => {
                setIsMobileMenuOpen((prev) => !prev);
                setIsMobileSearchOpen(false);
              }}
              className="text-white p-2"
              aria-label="Menu"
            >
              {isMobileMenuOpen ? <X size={26} /> : <Menu size={26} />}
            </button>
          </div>
        </div>

        {/* Mobile Search Row */}
        {isMobileSearchOpen && (
          <>
            <div
              className="fixed inset-0 top-20 z-30 bg-black/60 backdrop-blur-sm lg:hidden animate-backdrop-fade"
              onClick={() => setIsMobileSearchOpen(false)}
              aria-hidden="true"
            />
            <div
              ref={mobileSearchRef}
              className="relative z-40 border-t border-white/10 bg-[#0d1424]/98 px-4 py-3 shadow-2xl backdrop-blur-2xl lg:hidden animate-search-slide-down"
            >
              <SearchComponent
                variant="inline"
                size="md"
                className="w-full"
                autoFocus
                placeholder="Search courses, skills, or topics..."
                fetchResults={fetchProgramList}
                onSelect={(course) => {
                  setIsMobileSearchOpen(false);
                  navigate(`/course/${course.slug || course._id}`);
                }}
                onSearch={() => {
                  setIsMobileSearchOpen(false);
                  navigate("/#courses");
                }}
              />
            </div>
          </>
        )}

        {/* Mobile Menu Dropdown */}
        <MobileMenu
          isOpen={isMobileMenuOpen}
          onClose={() => setIsMobileMenuOpen(false)}
          user={user}
          onOpenAuth={() => {
            setIsMobileMenuOpen(false);
            setIsAuthModalOpen(true);
          }}
        />
      </header>

      {/* Auth Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
      />
    </>
  );
};

export default Navbar;
