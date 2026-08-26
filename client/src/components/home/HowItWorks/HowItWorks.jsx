import { ArrowRight } from "lucide-react";
import StepCard from "./StepCard";
import { steps } from "./data";
import Container from "../../layout/Container";

const HowItWorks = () => {
  return (
    <section className="border-b border-white/10 bg-[#070B1A] py-16 sm:py-20 lg:py-28">

      <Container>

        {/* Heading */}
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between lg:gap-8">

          <div>
            <h2 className="text-3xl font-bold text-white sm:text-4xl">
              How it works
            </h2>

            <p className="mt-3 text-base text-gray-300 sm:mt-4 sm:text-[17px]">
              Simple. Fast. Add it to your profile the same day.
            </p>
          </div>

          <a
            href="#courses"
            className="flex w-full items-center justify-center gap-3 rounded-2xl bg-white px-6 py-4 text-base font-semibold text-black transition-all duration-300 hover:scale-[1.02] hover:bg-gray-100 sm:w-fit sm:px-8 sm:py-5 sm:text-lg"
          >
            Start Challenge
            <ArrowRight size={18} className="shrink-0" />
          </a>

        </div>

        {/* Cards */}
        <div className="mt-8 grid grid-cols-1 gap-5 sm:mt-10 sm:gap-6 lg:grid-cols-3 lg:gap-8">

          {steps.map((step) => (
            <StepCard
              key={step.id}
              step={step}
            />
          ))}

        </div>

      </Container>

    </section>
  );
};

export default HowItWorks;