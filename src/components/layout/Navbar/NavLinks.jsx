import { ChevronDown } from "lucide-react";

const navLinks = [
  {
    title: "Home",
    path: "/",
  },
  {
    title: "Courses",
    path: "/courses",
    dropdown: true,
  },
  {
    title: "For Business",
    path: "/business",
  },
  {
    title: "About",
    path: "/about",
  },
  {
    title: "Contact",
    path: "/contact",
  },
];

const NavLinks = () => {
  return (
    <ul className="flex items-center gap-10">

      {navLinks.map((item) => (

        <li key={item.title}>

          <a
            href={item.path}
            className="group flex items-center gap-1 text-[15px] font-medium text-gray-300 transition hover:text-white"
          >

            {item.title}

            {item.dropdown && (
              <ChevronDown
                size={17}
                className="transition group-hover:rotate-180"
              />
            )}

          </a>

        </li>

      ))}

    </ul>
  );
};

export default NavLinks;