import { ArrowRight } from "lucide-react";
import StepCard from "./StepCard";
import { steps } from "./data";
import Container from "../../layout/Container";

const HowItWorks = () => {
  return (
    <section className="bg-[#070B1A] py-28 border-b border-white/10">

      <Container>

        {/* Heading */}

        <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">

          <div>

            <h2 className="text-4xl font-bold text-white">
              How it works
            </h2>

            <p className="mt-4 text-[17px] text-gray-300">
              Simple. Fast. Add it to your profile the same day.
            </p>

          </div>

          <button className="flex items-center justify-center gap-3 rounded-2xl bg-white px-8 py-5 text-lg font-semibold text-black transition hover:bg-gray-100">

            Start Challenge

            <ArrowRight size={18} />

          </button>

        </div>

        {/* Cards */}

        <div className="mt-10 grid gap-8 lg:grid-cols-3">

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