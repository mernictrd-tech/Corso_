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

  /* =====================================================
     CLOSE MOBILE SEARCH
  ===================================================== */

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

  /* =====================================================
     CHECK USER
  ===================================================== */

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

    return () => {
      window.removeEventListener("storage", checkUser);
    };
  }, []);

  /* =====================================================
     FETCH PROGRAM LIST
  ===================================================== */

  const fetchProgramList = async () => {
    try {
      const res = await api.get("/program/list");
      return res.data?.data || [];
    } catch {
      return [];
    }
  };

  /* =====================================================
     SEARCH SELECT
  ===================================================== */

  const handleCourseSelect = (course) => {
    navigate(`/course/${course.slug || course._id}`);
  };

  return (
    <>
      <header
        className="
          sticky
          top-0
          z-50
          w-full
          max-w-full
          overflow-visible
          border-b
          border-white/10
          bg-[#111827]/95
          backdrop-blur-xl
        "
      >
        {/* =================================================
            MAIN NAVBAR
        ================================================= */}

        <div
          className="
            mx-auto
            flex
            h-30
            w-full
            max-w-7xl
            min-w-0
            items-center
            justify-between
            px-4
            sm:px-6
          "
        >
          {/* =================================================
              LOGO
          ================================================= */}

          <Link
            to="/"
            className="
              shrink-0
              w-32
              sm:w-36
              md:w-40
              lg:w-52
              xl:w-60
            "
          >
            <img
              src="/assets/skilium-logo-without-bg-DARK.png"
              alt="skilium-logo"
              className="block w-full"
            />
          </Link>

          {/* =================================================
              TABLET NAV LINKS
              768px - 1023px
          ================================================= */}

          <div
            className="
              hidden
              min-w-0
              flex-1
              items-center
              justify-center
              px-2
              md:flex
              lg:hidden
            "
          >
            <div className="min-w-0 max-w-full overflow-hidden">
              <NavLinks />
            </div>
          </div>

          {/* =================================================
              DESKTOP NAV LINKS
              1024px+
          ================================================= */}

          <div
            className="
              hidden
              min-w-0
              flex-1
              items-center
              justify-center
              lg:flex
            "
          >
            <div className="min-w-0 max-w-full">
              <NavLinks />
            </div>
          </div>

          {/* =================================================
              DESKTOP RIGHT SIDE
              1024px+
          ================================================= */}

          <div
            className="
              hidden
              shrink-0
              items-center
              gap-2
              lg:flex
              xl:gap-3
            "
          >
            {/* SEARCH */}

            <SearchComponent
              variant="expandable"
              size="md"
              width="w-52"
              placeholder="Search courses, skills, or topics..."
              fetchResults={fetchProgramList}
              onSelect={handleCourseSelect}
              onSearch={() => navigate("/#courses")}
            />

            {/* LOGIN / DASHBOARD */}

            {user ? (
              <Link
                to="/dashboard"
                className="
                  flex
                  h-10
                  shrink-0
                  items-center
                  gap-2
                  rounded-xl
                  border
                  border-cyan-400/30
                  bg-cyan-500/10
                  px-3
                  text-sm
                  font-semibold
                  text-cyan-300
                  transition
                  hover:bg-cyan-500/20
                "
              >
                <User size={16} />

                <span className="max-w-[100px] truncate">
                  {user.fullName || "Dashboard"}
                </span>
              </Link>
            ) : (
              <button
                type="button"
                onClick={() => setIsAuthModalOpen(true)}
                className="
                  flex
                  h-10
                  shrink-0
                  items-center
                  px-1
                  text-sm
                  font-medium
                  text-gray-300
                  transition
                  hover:text-white
                "
              >
                Login
              </button>
            )}

            {/* EXPLORE */}

            <HashLink
              smooth
              to="/#courses"
              className="
                inline-flex
                h-10
                shrink-0
                items-center
                justify-center
                rounded-xl
                bg-white
                px-4
                text-sm
                font-semibold
                leading-none
                text-slate-900
                transition-all
                duration-300
                hover:bg-slate-100
                xl:px-5
              "
            >
              Explore Courses
            </HashLink>
          </div>

          {/* =================================================
              TABLET RIGHT SIDE
              768px - 1023px
          ================================================= */}

          <div
            className="
              hidden
              shrink-0
              items-center
              gap-1
              md:flex
              lg:hidden
            "
          >
            {/* TABLET SEARCH */}

            <button
              ref={mobileSearchBtnRef}
              type="button"
              onClick={() => {
                setIsMobileSearchOpen((prev) => !prev);
                setIsMobileMenuOpen(false);
              }}
              className="
                shrink-0
                p-2
                text-gray-300
                transition
                hover:text-white
              "
              aria-label="Search"
            >
              <Search size={21} />
            </button>

            {/* TABLET MENU */}

            <button
              type="button"
              onClick={() => {
                setIsMobileMenuOpen((prev) => !prev);
                setIsMobileSearchOpen(false);
              }}
              className="
                shrink-0
                p-2
                text-white
              "
              aria-label="Menu"
            >
              {isMobileMenuOpen ? (
                <X size={25} />
              ) : (
                <Menu size={25} />
              )}
            </button>
          </div>

          {/* =================================================
              MOBILE BUTTONS
              Below 768px
          ================================================= */}

          <div
            className="
              flex
              shrink-0
              items-center
              gap-1
              md:hidden
            "
          >
            {/* MOBILE SEARCH */}

            <button
              ref={mobileSearchBtnRef}
              type="button"
              onClick={() => {
                setIsMobileSearchOpen((prev) => !prev);
                setIsMobileMenuOpen(false);
              }}
              className="
                shrink-0
                p-2
                text-gray-300
                transition
                hover:text-white
              "
              aria-label="Search"
            >
              <Search size={22} />
            </button>

            {/* MOBILE MENU */}

            <button
              type="button"
              onClick={() => {
                setIsMobileMenuOpen((prev) => !prev);
                setIsMobileSearchOpen(false);
              }}
              className="
                shrink-0
                p-2
                text-white
              "
              aria-label="Menu"
            >
              {isMobileMenuOpen ? (
                <X size={26} />
              ) : (
                <Menu size={26} />
              )}
            </button>
          </div>
        </div>

        {/* =================================================
            MOBILE / TABLET SEARCH
        ================================================= */}

        {isMobileSearchOpen && (
          <>
            {/* BACKDROP */}

            <div
              className="
                fixed
                inset-0
                top-20
                z-30
                bg-black/60
                backdrop-blur-sm
                animate-backdrop-fade
              "
              onClick={() => setIsMobileSearchOpen(false)}
              aria-hidden="true"
            />

            {/* SEARCH ROW */}

            <div
              ref={mobileSearchRef}
              className="
                relative
                z-40
                w-full
                max-w-full
                overflow-visible
                border-t
                border-white/10
                bg-[#0d1424]/98
                px-4
                py-3
                shadow-2xl
                backdrop-blur-2xl
                animate-search-slide-down
              "
            >
              <SearchComponent
                variant="inline"
                size="md"
                className="w-full max-w-full"
                autoFocus
                placeholder="Search courses, skills, or topics..."
                fetchResults={fetchProgramList}
                onSelect={(course) => {
                  setIsMobileSearchOpen(false);
                  handleCourseSelect(course);
                }}
                onSearch={() => {
                  setIsMobileSearchOpen(false);
                  navigate("/#courses");
                }}
              />
            </div>
          </>
        )}

        {/* =================================================
            MOBILE / TABLET MENU
        ================================================= */}

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

      {/* =================================================
          AUTH MODAL
      ================================================= */}

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
      />
    </>
  );
};

export default Navbar;