import { footerLinks } from "./footerData";
import Container from "../../layout/Container";
import { Mail, MapPin } from "lucide-react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="border-t border-white/10 bg-[#050816]">
      <div className="mx-auto max-w-7xl px-6 py-10">
        {/* Top Section */}
        <div className="grid gap-12 md:grid-cols-3">
          {/* Brand */}
          <div>
            <h2 className="text-3xl font-bold text-white">
              Corso
              <span className="text-cyan-400">.</span>
            </h2>

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
              href="mailto:info@corso.com"
              className="flex items-center gap-3 text-gray-400 transition hover:text-cyan-400"
            >
              <Mail className="h-5 w-5" />
              info@corso.com
            </a>

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
          <p>© 2026 Corso. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};
export default Footer;