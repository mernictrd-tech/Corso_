import certificate from "../../../assets/images/CertificateHero.png";

const HeroImage = () => {
  return (
    <div className="relative w-full min-w-0">

      {/* Background Glow */}
      <div className="absolute left-1/2 top-1/2 h-[300px] w-[300px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-br from-violet-600/25 via-purple-500/20 to-cyan-500/15 blur-[100px] sm:h-[420px] sm:w-[420px] sm:blur-[120px] lg:h-[520px] lg:w-[520px] lg:blur-[140px]" />

      {/* Main Card */}
      <div className="relative mx-auto w-full max-w-[600px] min-w-0 overflow-hidden rounded-[28px] border border-white/10 bg-white/[0.05] p-4 backdrop-blur-2xl shadow-[0_20px_80px_rgba(0,0,0,0.45)] sm:rounded-[34px] sm:p-6">

        {/* Header */}
        <div className="mb-4 flex min-w-0 items-start justify-between gap-3 sm:mb-5">

          <div className="min-w-0">
            <h3 className="text-[14px] font-bold text-white sm:text-[16px]">
              Unlockable certificate
            </h3>

            <p className="mt-0.5 text-[11px] leading-4 text-gray-400 sm:text-[13px]">
              Complete the 10-question skill check
            </p>
          </div>

          <span className="shrink-0 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-[10px] font-medium text-gray-300 sm:px-5 sm:py-2 sm:text-[13px]">
            Sample Preview
          </span>

        </div>

        {/* Certificate */}
        <div className="mt-4 min-w-0 sm:mt-5">
          <img
            src={certificate}
            alt="Certificate"
            className="block w-full max-w-full rounded-2xl object-contain shadow-[0_20px_50px_rgba(0,0,0,0.35)]"
          />
        </div>

        {/* Bottom Cards */}
        <div className="mt-3 grid min-w-0 grid-cols-2 gap-2 sm:mt-4 sm:gap-4">

          <div className="min-w-0 rounded-2xl border border-white/10 bg-white/[0.04] p-3 backdrop-blur-xl">

            <p className="text-xs text-gray-400 sm:text-sm">
              Quiz format
            </p>

            <h4 className="mt-1.5 text-[13px] font-bold text-white sm:mt-2 sm:text-[15px]">
              10 MCQs
            </h4>

          </div>

          <div className="min-w-0 rounded-2xl border border-white/10 bg-gradient-to-r from-violet-600/20 to-purple-600/20 p-3 backdrop-blur-xl">

            <p className="text-xs text-gray-400 sm:text-sm">
              Certificate
            </p>

            <h4 className="mt-1.5 text-[13px] font-bold text-white sm:mt-2 sm:text-[15px]">
              Instant Download
            </h4>

          </div>

        </div>

      </div>
    </div>
  );
};

export default HeroImage;