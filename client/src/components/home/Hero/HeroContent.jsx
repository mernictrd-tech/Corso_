import HeroButton from "./HeroButton";
import HeroFeatures from "./HeroFeatures";

const HeroContent = () => {
  return (
    <div className="w-full max-w-[560px]">

      <span className="mb-4 inline-flex max-w-full rounded-full border border-cyan-500/20 bg-cyan-500/10 px-3 py-2 text-xs text-cyan-400 sm:px-4 sm:text-sm">
        New Certificate Platform
      </span>

      <h1 className="max-w-xl text-[38px] font-extrabold leading-[1.08] text-white sm:text-5xl sm:leading-tight">
        Advance your
        <span className="block bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
          professional skills
        </span>
        and achieve success.
      </h1>

      <p className="mt-4 max-w-lg text-[15px] leading-6 text-gray-400 sm:text-[16px]">
        Complete industry-recognized assessments, earn shareable certificates,
        and showcase your expertise to recruiters.
      </p>

      <div className="mt-8 sm:mt-10">
        <HeroButton />
      </div>

      <HeroFeatures />

    </div>
  );
};

export default HeroContent;