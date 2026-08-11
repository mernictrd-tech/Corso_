import certificate from "../../../assets/images/CertificateHero.png";

const HeroImage = () => {
  return (
    <div className="relative">

      {/* Background Glow */}
      <div className="absolute left-1/2 top-1/2 h-[520px] w-[520px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-br from-violet-600/25 via-purple-500/20 to-cyan-500/15 blur-[140px]" />

      {/* Main Card */}
      <div className="relative mx-auto w-full max-w-[600px] overflow-hidden rounded-[34px] border border-white/10 bg-white/[0.05] p-6 backdrop-blur-2xl shadow-[0_20px_80px_rgba(0,0,0,0.45)]">
        {/* Header */}
        <div className="mb-5 flex items-start justify-between">
          <div>
            <h3 className="text-[16px] font-bold text-white">
              Unlockable certificate
            </h3>

            <p className="mt-0.5 text-[13px] text-gray-400">
              Complete the 10-question skill check
            </p>
          </div>

          <span className="rounded-full border border-white/10 bg-white/5 px-5 py-2 text-[13px] font-medium text-gray-300">
            Sample Preview
          </span>
        </div>

        {/* Certificate */}
        <div className="mt-5">
          <img
            src={certificate}
            alt="Certificate"
            className="w-full rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.35)]"
          />
        </div>

        {/* Bottom Cards */}
        <div className="mt-4 grid grid-cols-2 gap-4">

          <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-3 backdrop-blur-xl">
            <p className="text-sm text-gray-400">
              Quiz format
            </p>

            <h4 className="mt-2 text-[15px] font-bold text-white">
              10 MCQs
            </h4>
          </div>

          <div className="rounded-2xl border border-white/10 bg-gradient-to-r from-violet-600/20 to-purple-600/20 p-3 backdrop-blur-xl">
            <p className="text-sm text-gray-400">
              Certificate
            </p>

            <h4 className="mt-2 text-[15px] font-bold text-white">
              Instant Download
            </h4>
          </div>

        </div>

      </div>
    </div>
  );
};

export default HeroImage;