import FeatureCard from "./FeatureCard";
import AssessmentCard from "./AssessmentCard";
import { features } from "./data";
import Container from "../../layout/Container";


const WhyChooseUs = () => {
  return (
    <section className="bg-[#070B1A] py-28">

       <Container>

        <div className="grid gap-16 lg:grid-cols-2">

          <div>

            <h2 className="max-w-xl text-4xl font-bold leading-tight text-white">

              Certificates that actually{" "}

              <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                help you
              </span>

              <br />

              get noticed

            </h2>

            <p className="mt-4 max-w-xl text-xl leading-9 text-gray-300">

              Skillsmint assessments are designed for quick proof-of-skill:
              short, focused, and easy to showcase.

            </p>

            <div className="mt-4 grid gap-6 md:grid-cols-2">

              {features.map((item) => (
                <FeatureCard
                  key={item.title}
                  {...item}
                />
              ))}

            </div>

          </div>

          <AssessmentCard />

        </div>

      </Container>

    </section>
  );
};

export default WhyChooseUs;