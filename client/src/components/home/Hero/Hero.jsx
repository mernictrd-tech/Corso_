import HeroContent from "./HeroContent";
import HeroImage from "./HeroImage";

const Hero = () => {
  return (
    <section
      id="home"
      className="relative overflow-hidden bg-[#070B1A] pt-4 sm:pt-6 lg:pt-6"
    >
      {/* Background Gradient */}
      <div className="absolute inset-0">
        <div className="absolute right-0 top-0 h-[700px] w-[700px] rounded-full bg-violet-700/20 blur-[180px]" />

        <div className="absolute bottom-0 left-0 h-[500px] w-[500px] rounded-full bg-cyan-600/10 blur-[160px]" />
      </div>

      <div className="relative mx-auto w-full max-w-[1500px] px-4 sm:px-8 lg:px-12 xl:px-20">
        <div
          className="
            grid
            min-h-[auto]
            items-center
            gap-8
            py-2
            sm:gap-12
            sm:py-4
            lg:min-h-[calc(100vh-120px)]
            lg:grid-cols-2
            lg:gap-16
            lg:py-0
          "
        >
          <HeroContent />

          <HeroImage />
        </div>
      </div>
    </section>
  );
};

export default Hero;