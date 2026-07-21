import { footerLinks } from "./footerData";
import Container from "../../layout/Container";

const Footer = () => {
  return (
    <footer className="border-t border-white/10 bg-[#070B1A]">

      <div className="py-16">  

      <Container>

        {/* Top */}

        <div className="flex flex-col gap-10 lg:flex-row lg:items-start lg:justify-between">

          {/* Left */}

          <div>

            <p className="text-[14px] leading-4 text-gray-300">
              © 2026 Skillsmint Educational Services. All rights reserved.
            </p>

            <p className="mt-1 text-[14px] leading-9 text-gray-300">
              B-1214 Tower B, Ithum Tower, Sector 62, Noida, Uttar Pradesh,
              221108
            </p>

          </div>

          {/* Right */}

          <div className="flex flex-wrap items-center gap-x-8 gap-y-4">

            {footerLinks.map((item) => (
              <a
                key={item}
                href="/"
                className="text-[18px] text-gray-300 transition hover:text-white"
              >
                {item}
              </a>
            ))}

          </div>

        </div>

        {/* Divider */}

        <div className="my-10 h-px bg-white/10"></div>

        {/* Bottom */}

        <p className="max-w-full text-[15px] leading-6 text-gray-500">

          Disclaimer: This certificate is a privately issued knowledge
          proof-based assessment certificate provided solely by SkillsMint. It
          is not affiliated with, approved by, endorsed by, accredited by, or
          issued in collaboration with any government authority, private
          company, educational institution, regulatory body, or third-party
          organization. It does not represent a government-recognized degree,
          diploma, license, or statutory qualification.

        </p>

      </Container>

      </div>

    </footer>
  );
};

export default Footer;