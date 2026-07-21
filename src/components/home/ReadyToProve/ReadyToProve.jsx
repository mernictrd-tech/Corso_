import { ArrowRight } from "lucide-react";
import CTAFeature from "./CTAFeature";
import { features } from "./data";
import Container from "../../layout/Container";

const ReadyToProve = () => {
  return (
    <section className="bg-[#070B1A] py-28">

      <Container>
        <div className="overflow-hidden rounded-[34px] border border-white/10 bg-gradient-to-r from-[#24245C] via-[#40134E] to-[#4B3816] p-16">

          <div className="grid items-center gap-12 lg:grid-cols-[1.2fr_0.8fr]">

            {/* Left */}

            <div>

              <h2 className="max-w-xl text-5xl font-bold leading-tight text-white">
                Ready to prove your skills?
              </h2>

              <p className="mt-6 max-w-2xl text-[21px] leading-9 text-gray-300">
                Start your tailored quiz now and unlock your certificate.
                It's the fastest way to add a strong proof point to your
                profile.
              </p>

              <div className="mt-10 flex flex-wrap gap-4">

                {features.map((item) => (
                  <CTAFeature key={item} text={item} />
                ))}

              </div>

            </div>

            {/* Right */}

            <div className="rounded-[30px] border border-white/10 bg-[#231D2A]/95 p-8 backdrop-blur">

              <h3 className="text-3xl font-semibold text-white">
                Start the assessment
              </h3>

              <p className="mt-5 text-[17px] leading-8 text-gray-300">
                Click below to begin. After completion, you'll be able to
                download your certificate instantly.
              </p>

              <button className="mt-8 flex w-full items-center justify-center gap-3 rounded-2xl bg-white py-5 text-lg font-semibold text-black transition-all duration-300 hover:scale-[1.02] hover:bg-gray-100">

                Start Challenge

                <ArrowRight size={18} />

              </button>

              <p className="mt-6 text-sm text-gray-400">
                Tip: Share your certificate on LinkedIn for maximum visibility.
              </p>

            </div>

          </div>

        </div>

      </Container>

    </section>
  );
};

export default ReadyToProve;