import { Search, Menu, ArrowRight } from "lucide-react";
import NavLinks from "./NavLinks";

const Navbar = () => {
  return (
    <header className="sticky top-0 z-50 border-white/10 bg-[#111827] backdrop-blur-xl">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6">

        {/* Logo */}
        <h1 className="text-2xl font-bold tracking-widest text-white">
          COURSE<span className="text-cyan-400">.</span>
        </h1>

        {/* Desktop Menu */}
        <div className="hidden lg:block">
          <NavLinks />
        </div>

        {/* Right Side */}
        <div className="hidden items-center gap-5 lg:flex">

          <button className="text-gray-300 transition hover:text-cyan-400">
            <Search size={20} />
          </button>

          <button className="font-medium text-gray-300 transition hover:text-white">
            Login
          </button>

          <button className="inline-flex h-8 items-center justify-center rounded-xl bg-white px-5 text-sm font-semibold text-slate-900 transition-all duration-300 hover:bg-slate-100">
            Explore Courses
          </button>

        </div>

        {/* Mobile */}
        <button className="text-white lg:hidden">
          <Menu size={30} />
        </button>

      </div>
    </header>
  );
};

export default Navbar;