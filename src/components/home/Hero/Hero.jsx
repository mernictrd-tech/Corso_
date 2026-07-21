import HeroContent from "./HeroContent";
import HeroImage from "./HeroImage";

const Hero = () => {
  return (
    <section className="bg-[#070B1A]">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="grid min-h-[calc(100vh-80px)] items-center gap-12 lg:grid-cols-2">

          <HeroContent />

          <HeroImage />

        </div>
      </div>
    </section>
  );
};

export default Hero;