import FeatureCard from "./FeatureCard";
import AssessmentCard from "./AssessmentCard";
import { features } from "./data";
import Container from "../../layout/Container";


const WhyChooseUs = () => {
  return (
    <section id="about" className="bg-[#070B1A] py-28">

      <Container>

        <div className="grid gap-16 lg:grid-cols-2">

          <div>

            <h2 className="max-w-xl text-4xl font-bold leading-tight text-white">
              Certifications that open{" "}
              <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                Career Opportunities
              </span>{" "}
              <span className="text-white">for you.</span>
            </h2>

            <p className="mt-5 mb-7 max-w-lg text-[17px] leading-6 text-gray-400">

              Corso assessments are built to measure practical skills, helping you earn trusted certifications and stand out with confidence.            </p>

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