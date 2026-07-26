
import {
  Clock3,
  HelpCircle,
  Trophy,
  RotateCcw,
  Award,
  ShieldCheck,
  CircleCheckBig,
} from "lucide-react";

const assessmentStats = [
  {
    icon: Clock3,
    title: "Duration",
    value: "60 Minutes",
  },
  {
    icon: HelpCircle,
    title: "Questions",
    value: "50 MCQs",
  },
  {
    icon: Trophy,
    title: "Passing Score",
    value: "70%",
  },
  {
    icon: RotateCcw,
    title: "Attempts",
    value: "Unlimited",
  },
];

const instructions = [
  "Read every question carefully before answering.",
  "Once submitted, answers cannot be changed.",
  "Ensure a stable internet connection throughout the assessment.",
  "Use of unfair means may lead to disqualification.",
  "Complete the assessment within the allotted time.",
  "Score 70% or above to unlock your certificate.",
];

const AssessmentDetails = ({ course }) => {
  return (
    <section className="bg-[#070B1A] py-24">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        {/* Heading */}
        <div className="text-center max-w-3xl mx-auto">
          <span className="rounded-full border border-cyan-400/30 bg-cyan-400/10 px-4 py-2 text-sm font-semibold text-cyan-300">
            Assessment Details
          </span>

          <h2 className="mt-6 text-4xl font-bold text-white lg:text-5xl">
            Everything You Need
            <span className="bg-gradient-to-r from-cyan-400 via-emerald-400 to-blue-400 bg-clip-text text-transparent">
              {" "}
              To Know
            </span>
          </h2>

          <p className="mt-6 text-lg text-gray-400 leading-8">
            Before beginning the assessment, review the format, eligibility,
            and important guidelines below.
          </p>
        </div>

        <div className="mt-16 grid gap-12 lg:grid-cols-[1.1fr_0.9fr]">
          {/* Left Side */}
          <div>
            <div className="grid gap-6 sm:grid-cols-2">
              {assessmentStats.map((item, index) => {
                const Icon = item.icon;

                return (
                  <div
                    key={index}
                    className="rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-xl transition duration-300 hover:border-cyan-400/30 hover:-translate-y-1"
                  >
                    <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-400/20 to-emerald-400/20">
                      <Icon
                        size={28}
                        className="text-cyan-400"
                      />
                    </div>

                    <p className="mt-6 text-gray-400">
                      {item.title}
                    </p>

                    <h3 className="mt-2 text-3xl font-bold text-white">
                      {item.title === "Duration"
                        ? course.duration
                        : item.title === "Questions"
                        ? `${course.questions} MCQs`
                        : item.title === "Passing Score"
                        ? course.passingScore
                        : course.attempts}
                    </h3>
                  </div>
                );
              })}
            </div>

            {/* Certificate Eligibility */}
            <div className="mt-8 rounded-3xl border border-emerald-400/20 bg-gradient-to-r from-emerald-500/10 to-cyan-500/10 p-8">
              <div className="flex items-start gap-4">
                <Award
                  size={42}
                  className="text-emerald-400"
                />

                <div>
                  <h3 className="text-2xl font-bold text-white">
                    Certificate Eligibility
                  </h3>

                  <p className="mt-4 leading-8 text-gray-300">
                    Successfully score{" "}
                    <span className="font-semibold text-cyan-400">
                      {course.passingScore}
                    </span>{" "}
                    or higher to receive your verified digital certificate.
                    Download it instantly and showcase your achievement on
                    LinkedIn and your professional portfolio.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side */}
          <div className="rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-xl">
            <div className="flex items-center gap-3">
              <ShieldCheck
                size={30}
                className="text-cyan-400"
              />

              <h3 className="text-3xl font-bold text-white">
                Assessment Guidelines
              </h3>
            </div>

            <div className="mt-8 space-y-6">
              {instructions.map((instruction, index) => (
                <div
                  key={index}
                  className="flex items-start gap-4"
                >
                  <CircleCheckBig
                    size={22}
                    className="mt-1 text-emerald-400"
                  />

                  <p className="leading-7 text-gray-300">
                    {instruction}
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-10 rounded-2xl border border-cyan-400/20 bg-cyan-400/10 p-6">
              <h4 className="text-xl font-semibold text-white">
                Good Luck! 🚀
              </h4>

              <p className="mt-3 text-gray-300 leading-7">
                Stay focused, manage your time wisely, and answer every
                question carefully. This assessment is designed to evaluate
                your practical knowledge and prepare you for real-world
                opportunities.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AssessmentDetails;