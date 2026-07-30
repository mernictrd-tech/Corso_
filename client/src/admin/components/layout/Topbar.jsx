import {
  Bell,
  Menu,
  UserCircle2,
  ChevronDown,
} from "lucide-react";

const Topbar = ({ setSidebarOpen }) => {
  return (
    <header className="sticky top-0 z-30 px-4 pt-4 lg:px-6">

      <div className="flex h-16 items-center justify-between rounded-2xl bg-white px-5 shadow-[0_10px_30px_rgba(15,23,42,0.08)]">

        {/* Left */}

        <div className="flex items-center gap-3">

          {/* Mobile Menu */}

          <button
            onClick={() => setSidebarOpen(true)}
            className="rounded-lg p-2 hover:bg-slate-100 lg:hidden"
          >
            <Menu size={22} />
          </button>

          <div>

            <p className="text-lg font-semibold text-slate-800">
              Admin Panel
            </p>

            <p className="text-xs text-slate-500">
              Welcome back 👋
            </p>

          </div>

        </div>

        {/* Right */}

        <div className="flex items-center gap-4">

          {/* Notification */}

          <button className="relative rounded-xl p-2 transition hover:bg-slate-100">

            <Bell
              size={20}
              className="text-slate-600"
            />

            <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-cyan-500"></span>

          </button>

          {/* Profile */}

          <button className="flex items-center gap-2 rounded-xl px-2 py-1 transition hover:bg-slate-100">

            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-r from-cyan-500 to-blue-600">

              <UserCircle2
                size={22}
                className="text-white"
              />

            </div>

            <div className="hidden sm:block text-left">

              <p className="text-sm font-semibold text-slate-800">
                Super Admin
              </p>

              <p className="text-xs text-slate-500">
                Administrator
              </p>

            </div>

            <ChevronDown
              size={16}
              className="hidden sm:block text-slate-500"
            />

          </button>

        </div>

      </div>

    </header>
  );
};

export default Topbar;