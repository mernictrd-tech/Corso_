import { Bell, UserCircle } from "lucide-react";

const Topbar = () => {
  return (
    <header className="flex h-20 items-center justify-between border-b border-slate-800 bg-white px-8">

      <div>

        <h2 className="text-2xl font-bold text-slate-800">
          Dashboard
        </h2>

        <p className="text-sm text-gray-500">
          Welcome back, Admin
        </p>

      </div>

      <div className="flex items-center gap-6">

        <Bell
          className="text-gray-500"
          size={22}
        />

        <div className="flex items-center gap-3">

          <UserCircle
            size={42}
            className="text-cyan-500"
          />

          <div>

            <p className="font-semibold">
              Admin
            </p>

            <p className="text-sm text-gray-500">
              Super Admin
            </p>

          </div>

        </div>

      </div>

    </header>
  );
};

export default Topbar;