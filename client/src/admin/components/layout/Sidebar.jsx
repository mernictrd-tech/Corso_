import {
  LayoutDashboard,
  Folder,
  BookOpen,
  CircleHelp,
  Users,
  CreditCard,
  Award,
  LogOut,
  X,
} from "lucide-react";
import { NavLink } from "react-router-dom";

const menu = [
  {
    title: "Dashboard",
    path: "/admin/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Categories",
    path: "/admin/categories",
    icon: Folder,
  },
  {
    title: "Program Master",
    path: "/admin/programs",
    icon: BookOpen,
  },
  {
    title: "Questions",
    path: "/admin/questions",
    icon: CircleHelp,
  },
  {
    title: "Students",
    path: "/admin/students",
    icon: Users,
  },
  {
    title: "Payments",
    path: "/admin/payments",
    icon: CreditCard,
  },
  {
    title: "Certificates",
    path: "/admin/certificates",
    icon: Award,
  },
];

const Sidebar = ({ sidebarOpen, setSidebarOpen }) => {
  const handleLogout = () => {
    localStorage.removeItem("admin");
    window.location.href = "/admin/login";
  };

  return (
    <aside
      className={`
      fixed lg:static
      z-50
      flex h-screen w-64 flex-col
      bg-gradient-to-b
      from-[#0B1120]
      via-[#111827]
      to-[#172554]
      text-white
      transition-all
      duration-300
      ${
        sidebarOpen
          ? "translate-x-0"
          : "-translate-x-full lg:translate-x-0"
      }
    `}
    >
      {/* Logo */}

      <div className="flex items-center justify-between border-b border-white/10 p-5">

        <div>

          <h1 className="text-3xl font-bold text-cyan-400">
            CORSO
          </h1>

          <p className="text-xs text-slate-400">
            Admin Panel
          </p>

        </div>

        {/* Mobile Close */}

        <button
          onClick={() => setSidebarOpen(false)}
          className="lg:hidden"
        >
          <X size={22} />
        </button>

      </div>

      {/* Menu */}

      <nav className="flex-1 px-4 py-5">

        <ul className="space-y-2">

          {menu.map((item) => {
            const Icon = item.icon;

            return (
              <li key={item.title}>
                <NavLink
                  to={item.path}
                  onClick={() => setSidebarOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all
                    ${
                      isActive
                        ? "bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg"
                        : "text-slate-300 hover:bg-white/10 hover:text-white"
                    }`
                  }
                >
                  <Icon size={19} />

                  {item.title}
                </NavLink>
              </li>
            );
          })}

        </ul>

      </nav>

      {/* Logout */}

      <div className="border-t border-white/10 p-4">

        <button
          onClick={handleLogout}
          className="flex w-full items-center gap-3 rounded-xl bg-red-500/10 px-4 py-3 text-sm text-red-300 transition hover:bg-red-500 hover:text-white"
        >
          <LogOut size={18} />

          Logout
        </button>

      </div>

    </aside>
  );
};

export default Sidebar;