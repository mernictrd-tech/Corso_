import { ChevronDown } from "lucide-react";
import { NavLink } from "react-router-dom";
import { useNavigate, useLocation } from "react-router-dom";

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
];

const NavLinks = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleNavigation = (sectionId) => {
    if (location.pathname === "/") {
      // Already on Home → just scroll
      document.getElementById(sectionId)?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    } else {
      // Navigate to Home with the hash
      navigate(`/#${sectionId}`);
    }
  };

  return (
    <ul className="flex items-center gap-8">
      {navLinks.map((link) => (
        <li key={link.title}>
          <button
            onClick={() => handleNavigation(link.sectionId)}
            className="flex cursor-pointer items-center gap-1 text-gray-300 transition hover:text-cyan-400"
          >
            {link.title}
          </button>
        </li>
      ))}
    </ul>
  );
};

export default NavLinks;