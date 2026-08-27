import { ArrowRight } from "lucide-react";
import CTAFeature from "./CTAFeature";
import { features } from "./data";
import Container from "../../layout/Container";

const ReadyToProve = () => {
  return (
    <section className="bg-[#070B1A] py-16 sm:py-20 lg:py-28">

      <Container>
        <div
          className="
            overflow-hidden
            rounded-[28px]
            border border-white/10
            bg-gradient-to-br
            from-[#0878C9]
            via-[#08A6A5]
            to-[#22B84A]
            p-5
            sm:rounded-[34px]
            sm:p-8
            lg:p-16
          "
        >

          <div className="grid items-center gap-8 sm:gap-10 lg:grid-cols-[1.2fr_0.8fr] lg:gap-12">

            {/* Left */}
            <div>

              <h2 className="max-w-xl text-3xl font-bold leading-tight text-white sm:text-4xl lg:text-5xl">
                Are You Ready to Unlock New Opportunities?
              </h2>

              <p className="mt-5 max-w-2xl text-base leading-6 text-white/80 sm:mt-6 sm:text-[17px] sm:leading-7">
                Complete your assessment, demonstrate your technical skills,
                and receive a trusted certification to support your career
                growth.
              </p>

              <div className="mt-7 flex flex-wrap gap-2 sm:mt-10 sm:gap-4">

                {features.map((item) => (
                  <CTAFeature key={item} text={item} />
                ))}

              </div>

            </div>

            {/* Right */}
            <div
              className="
                rounded-[24px]
                border border-white/10
                bg-[#0B1724]/90
                p-5
                backdrop-blur
                sm:rounded-[30px]
                sm:p-8
              "
            >

              <h3 className="text-2xl font-semibold text-white sm:text-3xl">
                Start the assessment
              </h3>

              <p className="mt-4 text-base leading-6 text-gray-300 sm:mt-5 sm:text-[17px] sm:leading-7">
                Click below to begin. After completion, you'll be able to
                download your certificate instantly.
              </p>

              <a
                href="#courses"
                className="
                  mt-6
                  flex
                  w-full
                  items-center
                  justify-center
                  gap-3
                  rounded-2xl
                  bg-white
                  px-4
                  py-4
                  text-base
                  font-semibold
                  text-black
                  transition-all
                  duration-300
                  hover:scale-[1.02]
                  hover:bg-gray-100
                  sm:mt-8
                  sm:py-5
                  sm:text-lg
                "
              >
                Start Challenge
                <ArrowRight size={18} className="shrink-0" />
              </a>

              <p className="mt-5 text-xs leading-5 text-gray-400 sm:mt-6 sm:text-sm">
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