import certificate from "../../../assets/images/certificate.png";
import {
  Award,
  BadgeCheck,
  Download,
  ShieldCheck,
  FileCheck,
  ArrowRight,
} from "lucide-react";


const HeroImage = () => {
  return (
    <div className="relative">

      {/* Glow */}
      <div className="absolute -top-8 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-cyan-500/20 blur-[120px]" />

      <div className="relative mt-10 rounded-[36px] border border-white/10 bg-[#111827]/80 pt-8 px-8 pb-0.1 backdrop-blur-xl">        
      {/* Heading */}
        <div className="mb-8 text-center">

          {/* Certificate */}
          <div className="relative">

            <img
              src={certificate}
              alt="Certificate"
              className="w-full rounded-3xl border border-white/10 shadow-[0_25px_60px_rgba(0,0,0,.45)]"
            />

            {/* Floating Badge */}
            <div className="absolute -top-5 right-6 rounded-full bg-gradient-to-r from-cyan-400 to-blue-500 px-5 py-2 text-sm font-semibold text-white shadow-xl">
              Sample Certificate
            </div>
          </div>

          <h2 className="mt-5 text-3xl font-bold text-white">
            Earn an Industry
            <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
              {" "}
              Recognized Certificate
            </span>
          </h2>

          <p className="mt-3 text-gray-400">
            Complete the assessment, prove your skills and instantly download
            your verified certificate.
          </p>
        </div>

      </div>
    </div>
  );
};

export default HeroImage;