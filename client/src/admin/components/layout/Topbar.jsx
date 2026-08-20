import { useEffect, useRef, useState } from "react";
import {
  Bell,
  Menu,
  UserCircle2,
  ChevronDown,
  Search,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import api from "../../../services/api";

const Topbar = ({ setSidebarOpen }) => {
  const navigate = useNavigate();

  const [search, setSearch] = useState("");
  const [results, setResults] = useState([]);
  const [searching, setSearching] = useState(false);
  const [showResults, setShowResults] = useState(false);

  const searchRef = useRef(null);

  useEffect(() => {
    const delay = setTimeout(() => {
      if (search.trim().length >= 2) {
        searchStudents();
      } else {
        setResults([]);
        setShowResults(false);
      }
    }, 400);

    return () => clearTimeout(delay);
  }, [search]);

  const searchStudents = async () => {
    try {
      setSearching(true);

      const response = await api.get("/admin/students/search", {
        params: {
          search: search.trim(),
        },
      });

      setResults(response.data.data || []);
      setShowResults(true);
    } catch (error) {
      console.error("Student search failed:", error);
      setResults([]);
      setShowResults(true);
    } finally {
      setSearching(false);
    }
  };

  const handleStudentClick = (studentId) => {
    setSearch("");
    setResults([]);
    setShowResults(false);

    navigate(`/admin/students/${studentId}`);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target)
      ) {
        setShowResults(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <header className="sticky top-0 z-30 px-4 pt-4 lg:px-6">
      <div className="flex h-16 items-center justify-between rounded-2xl bg-white px-5 shadow-[0_10px_30px_rgba(15,23,42,0.08)]">

        {/* Left */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setSidebarOpen(true)}
            className="rounded-lg p-2 hover:bg-sky-600 bg-sky-500 lg:hidden"
          >
            <Menu size={22} />
          </button>

          <div>
            <p className="text-sm sm:text-lg font-semibold text-slate-800">
              Admin Panel
            </p>

            <p className="text-xs text-slate-500">
              Welcome back 👋
            </p>
          </div>
        </div>

        {/* Global Search */}
        <div
          ref={searchRef}
          className="relative hidden w-full max-w-md flex-1 md:flex mx-6"
        >
          <Search
            size={18}
            className="absolute left-3 top-1/2 z-10 -translate-y-1/2 text-slate-400"
          />

          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onFocus={() => {
              if (results.length > 0) {
                setShowResults(true);
              }
            }}
            placeholder="Search students..."
            className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-4 text-sm text-slate-700 outline-none transition focus:border-cyan-400 focus:bg-white focus:ring-2 focus:ring-cyan-100"
          />

          {/* Search Results */}
          {showResults && (
            <div className="absolute left-0 right-0 top-full z-50 mt-2 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-lg">

              {searching ? (
                <div className="px-4 py-4 text-center text-sm text-slate-500">
                  Searching...
                </div>
              ) : results.length === 0 ? (
                <div className="px-4 py-4 text-center text-sm text-slate-500">
                  No students found
                </div>
              ) : (
                <div className="max-h-80 overflow-y-auto">
                  {results.map((student) => (
                    <button
                      key={student._id}
                      type="button"
                      onClick={() => handleStudentClick(student._id)}
                      className="flex w-full items-center gap-3 border-b border-slate-100 px-4 py-3 text-left transition last:border-0 hover:bg-slate-50"
                    >
                      {/* Avatar */}
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-full bg-slate-100">
                        {student.avatar ? (
                          <img
                            src={`${import.meta.env.VITE_API_BASE_URL_RESOURCE}${student.avatar}`}
                            alt={student.fullName}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <span className="font-semibold text-slate-500">
                            {student.fullName
                              ?.charAt(0)
                              ?.toUpperCase() || "U"}
                          </span>
                        )}
                      </div>

                      {/* Student Information */}
                      <div className="min-w-0">
                        <p className="truncate text-sm font-semibold text-slate-700">
                          {student.fullName}
                        </p>

                        <p className="truncate text-xs text-slate-400">
                          {student.email}
                        </p>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Right */}
        <div className="flex items-center gap-4">

          {/* Notification */}
          <button className="relative rounded-xl p-2 transition hover:bg-slate-100">
            <Bell
              size={20}
              className="text-slate-600"
            />

            <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-cyan-500" />
          </button>

          {/* Profile */}
          <button className="flex items-center gap-2 rounded-xl px-2 py-1 transition hover:bg-slate-100">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-r from-cyan-500 to-blue-600">
              <UserCircle2
                size={22}
                className="text-white"
              />
            </div>

            <div className="hidden text-left sm:block">
              <p className="text-sm font-semibold text-slate-800">
                Super Admin
              </p>

              <p className="text-xs text-slate-500">
                Administrator
              </p>
            </div>

            <ChevronDown
              size={16}
              className="hidden text-slate-500 sm:block"
            />
          </button>
        </div>
      </div>
    </header>
  );
};

export default Topbar;