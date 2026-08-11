import HeroContent from "./HeroContent";
import HeroImage from "./HeroImage";

const Hero = () => {
  return (
    <section
      id="home"
      className="relative overflow-hidden bg-[#070B1A] pt-24 lg:pt-6"
    >
      {/* Background Gradient */}
      <div className="absolute inset-0">
        <div className="absolute right-0 top-0 h-[700px] w-[700px] rounded-full bg-violet-700/20 blur-[180px]" />
        <div className="absolute left-0 bottom-0 h-[500px] w-[500px] rounded-full bg-cyan-600/10 blur-[160px]" />
      </div>

      <div className="relative mx-auto max-w-[1500px] px-12 xl:px-20">
        <div className="grid min-h-[calc(100vh-120px)] items-center gap-16 lg:grid-cols-2">
          <HeroContent />
          <HeroImage />
        </div>
      </div>
    </section>
  );
};

export default Hero;