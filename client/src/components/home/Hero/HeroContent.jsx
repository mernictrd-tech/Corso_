import HeroButton from "./HeroButton";
import HeroFeatures from "./HeroFeatures";

const HeroContent = () => {
  return (
    <div className="max-w-[560px]">

      <span className="mb-4 inline-flex rounded-full border border-cyan-500/20 bg-cyan-500/10 px-4 py-2 text-sm text-cyan-400">
        New Certificate Platform
      </span>

      <h1 className="max-w-xl text-5xl font-extrabold leading-tight text-white">
        Advance your
        <span className="block bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
          professional skills
        </span>
        and achieve success.
      </h1>

      <p className="mt-4 max-w-lg text-[16px] leading-6 text-gray-400">

        Complete industry-recognized assessments,
        earn shareable certificates, and showcase
        your expertise to recruiters.

      </p>

      <div className="mt-10">

        <HeroButton />

      </div>

      <HeroFeatures />

    </div>
  );
};

export default HeroContent;