import { footerLinks } from "./footerData";
import Container from "../../layout/Container";
import { Mail, MapPin } from "lucide-react";
import { FaInstagram, FaLinkedinIn } from "react-icons/fa";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="border-t border-white/10 bg-[#050816]">
      <div className="mx-auto max-w-7xl px-6 py-10">
        {/* Top Section */}
        <div className="grid gap-12 md:grid-cols-3">
          {/* Brand */}
          <div>
            <img
              src="/assets/skilium-logo-without-bg-DARK.png"
              alt="Skilium"
              className="w-60 h-auto"
            />

            <p className="mt-3 max-w-sm text-gray-400">
              Validate your skills through industry-focused assessments and earn
              certifications that help you stand out.
            </p>

            <div className="mt-6 flex items-start gap-3 text-gray-400">
              <MapPin className="mt-1 h-5 w-5 text-cyan-400" />
              <p>
                Plot No. 72, Shahakar Layout,
                <br />
                Trimurti Nagar, Bhamti,
                <br />
                Nagpur - 440022
              </p>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="mb-5 text-lg font-semibold text-white">
              Quick Links
            </h3>

            <ul className="space-y-4 text-gray-400">
              <li>
                <Link
                  to="/privacy-policy"
                  className="transition duration-300 hover:text-cyan-400"
                >
                  Privacy Policy
                </Link>
              </li>

              <li>
                <Link
                  to="/terms-and-conditions"
                  className="transition duration-300 hover:text-cyan-400"
                >
                  Terms & Conditions
                </Link>
              </li>

              <li>
                <Link
                  to="/refund-policy"
                  className="transition duration-300 hover:text-cyan-400"
                >
                  Refund Policy
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="mb-5 text-lg font-semibold text-white">
              Contact
            </h3>

            <a
              href="mailto:info@skilium.in"
              className="flex items-center gap-3 text-gray-400 transition hover:text-cyan-400"
            >
              <Mail className="h-5 w-5" />
              info@skilium.in
            </a>

            <div className="mt-5 flex items-center gap-3">
              {/* LinkedIn */}
              <a
                href="https://www.linkedin.com/company/skilium-certifications/home/?viewAsMember=true"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-[#0A66C2] text-white transition duration-300 hover:scale-105"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="h-5 w-5"
                >
                  <path d="M20.45 20.45h-3.56v-5.57c0-1.33-.03-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.95v5.66H9.34V9h3.42v1.56h.05c.48-.9 1.64-1.85 3.38-1.85 3.61 0 4.28 2.38 4.28 5.48v6.26zM5.32 7.43a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12zM3.54 20.45h3.57V9H3.54v11.45z" />
                </svg>
              </a>

              {/* Instagram */}
              <a
                href="https://www.instagram.com/skiliumofficial/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-gradient-to-tr from-[#F58529] via-[#DD2A7B] to-[#515BD4] text-white transition duration-300 hover:scale-105"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  className="h-5 w-5"
                >
                  <rect width="20" height="20" x="2" y="2" rx="5" />
                  <circle cx="12" cy="12" r="4" />
                  <circle cx="17.5" cy="6.5" r=".5" fill="currentColor" />
                </svg>
              </a>
            </div>

            <div className="mt-8 rounded-2xl border border-cyan-500/20 bg-cyan-500/5 p-5">
              <p className="text-sm leading-7 text-gray-300">
                Empowering professionals with trusted assessments and
                certifications that validate real-world technical skills.
              </p>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-10 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-2 text-sm text-gray-500 md:flex-row">
          <p>© 2026 Skilium. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};
export default Footer;