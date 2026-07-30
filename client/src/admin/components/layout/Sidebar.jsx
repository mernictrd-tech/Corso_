import {
  LayoutDashboard,
  BookOpen,
  CircleHelp,
  Users,
  CreditCard,
  Award,
  LogOut,
} from "lucide-react";

import { NavLink } from "react-router-dom";

const menu = [
  {
    title: "Dashboard",
    path: "/admin/dashboard",
    icon: LayoutDashboard,
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

const Sidebar = () => {

  const handleLogout = () => {
    localStorage.removeItem("admin");
    window.location.href = "/admin/login";
  };

  return (
    <aside className="flex h-full w-72 flex-col border-r border-slate-800 bg-[#0F172A]">

      <div className="border-b border-slate-800 p-6">
        <h1 className="text-3xl font-bold text-cyan-400">
          CORSO
        </h1>

        <p className="mt-1 text-sm text-gray-400">
          Admin Panel
        </p>
      </div>

      <nav className="flex-1 p-5">
        <ul className="space-y-2">
          {menu.map((item) => {
            const Icon = item.icon;

            return (
              <li key={item.title}>
                <NavLink
                  to={item.path}
                  className={({ isActive }) =>
                    `flex items-center gap-4 rounded-xl px-4 py-3 transition ${
                      isActive
                        ? "bg-cyan-500 text-white"
                        : "text-gray-400 hover:bg-slate-800 hover:text-white"
                    }`
                  }
                >
                  <Icon size={20} />
                  {item.title}
                </NavLink>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="border-t border-slate-800 p-5">
        <button
          onClick={handleLogout}
          className="flex w-full items-center gap-4 rounded-xl px-4 py-3 text-gray-400 transition hover:bg-red-500 hover:text-white"
        >
          <LogOut size={20} />
          Logout
        </button>
      </div>

    </aside>
  );
};


export default Sidebar;