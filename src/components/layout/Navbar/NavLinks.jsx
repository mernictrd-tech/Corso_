import { ChevronDown } from "lucide-react";
import { NavLink } from "react-router-dom";

const navLinks = [
  {
    title: "Home",
    sectionId: "home",
  },
 
  {
    title: "About",
    sectionId: "about",
  },

  {
    title: "Assessment Info",
    sectionId: "assessment-info",
  },

  {
    title: "Verify Certificate",
    sectionId: "verify-certificate",
  },

  {
    title: "Contact",
    path: "/contact",
  },
];

const NavLinks = () => {
  const scrollToSection = (sectionId) => {
    document.getElementById(sectionId)?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  return (
   <ul className="flex items-center gap-8">
  {navLinks.map((link) => (
    <li key={link.title}>
      {link.sectionId ? (
        <button
          onClick={() =>
            document.getElementById(link.sectionId)?.scrollIntoView({
              behavior: "smooth",
              block: "start",
            })
          }
          className="flex cursor-pointer items-center gap-1 text-gray-300 transition hover:text-cyan-400"
        >
          {link.title}
        </button>
      ) : (
        <NavLink
          to={link.path}
          className="flex items-center gap-1 text-gray-300 transition hover:text-cyan-400"
        >
          {link.title}
        </NavLink>
      )}
    </li>
  ))}
</ul>
  );
};
export default NavLinks;