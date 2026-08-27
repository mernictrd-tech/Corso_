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
  },
  {
    icon: HelpCircle,
    title: "Questions",
  },
  {
    icon: Trophy,
    title: "Passing Score",
  },
  {
    icon: RotateCcw,
    title: "Attempts",
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
    <section className="bg-[#070B1A] py-16 sm:py-20 lg:py-24">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">

        {/* Heading */}
        <div className="mx-auto max-w-3xl text-center">

          <span className="inline-flex rounded-full border border-cyan-400/30 bg-cyan-400/10 px-3 py-1.5 text-xs font-semibold text-cyan-300 sm:px-4 sm:py-2 sm:text-sm">
            Assessment Details
          </span>

          <h2 className="mt-5 text-3xl font-bold leading-tight text-white sm:mt-6 sm:text-4xl lg:text-5xl">
            Everything You Need
            <span className="bg-gradient-to-r from-cyan-400 via-emerald-400 to-blue-400 bg-clip-text text-transparent">
              {" "}
              To Know
            </span>
          </h2>

          <p className="mt-5 text-base leading-7 text-gray-400 sm:mt-6 sm:text-lg sm:leading-8">
            Before beginning the assessment, review the format, eligibility,
            and important guidelines below.
          </p>

        </div>

        {/* Main Content */}
        <div className="mt-10 grid gap-8 sm:mt-12 lg:mt-16 lg:grid-cols-[1.1fr_0.9fr] lg:gap-10">

          {/* Left Side */}
          <div>

            {/* Stats - 2 x 2 on mobile also */}
            <div className="grid grid-cols-2 gap-3 sm:gap-6">

              {assessmentStats.map((item, index) => {
                const Icon = item.icon;

                return (
                  <div
                    key={index}
                    className="
                      rounded-2xl
                      border border-white/10
                      bg-white/5
                      p-4
                      backdrop-blur-xl
                      transition
                      duration-300
                      hover:-translate-y-1
                      hover:border-cyan-400/30
                      sm:rounded-3xl
                      sm:p-6
                      lg:p-8
                    "
                  >

                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-400/20 to-emerald-400/20 sm:h-14 sm:w-14">
                      <Icon
                        size={22}
                        className="text-cyan-400 sm:h-7 sm:w-7"
                      />
                    </div>

                    <p className="mt-4 text-xs text-gray-400 sm:mt-6 sm:text-base">
                      {item.title}
                    </p>

                    <h3 className="mt-1 text-xl font-bold leading-tight text-white sm:mt-2 sm:text-3xl">
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
            <div className="mt-6 rounded-[28px] border border-emerald-400/20 bg-gradient-to-r from-emerald-500/10 to-cyan-500/10 p-5 sm:mt-8 sm:rounded-3xl sm:p-8">

              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:gap-4">

                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-emerald-400/10 sm:h-auto sm:w-auto sm:bg-transparent">
                  <Award
                    size={30}
                    className="text-emerald-400 sm:h-[42px] sm:w-[42px]"
                  />
                </div>

                <div>

                  <h3 className="text-xl font-bold leading-tight text-white sm:text-2xl">
                    Certificate Eligibility
                  </h3>

                  <p className="mt-3 text-sm leading-6 text-gray-300 sm:mt-4 sm:text-base sm:leading-8">
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
          <div className="rounded-[28px] border border-white/10 bg-white/5 p-5 backdrop-blur-xl sm:rounded-3xl sm:p-8">

            <div className="flex items-start gap-3">

              <ShieldCheck
                size={26}
                className="mt-1 shrink-0 text-cyan-400 sm:h-[30px] sm:w-[30px]"
              />

              <h3 className="text-2xl font-bold leading-tight text-white sm:text-3xl">
                Assessment Guidelines
              </h3>

            </div>

            <div className="mt-7 space-y-5 sm:mt-8 sm:space-y-6">

              {instructions.map((instruction, index) => (
                <div
                  key={index}
                  className="flex items-start gap-3 sm:gap-4"
                >

                  <CircleCheckBig
                    size={20}
                    className="mt-1 shrink-0 text-emerald-400 sm:h-[22px] sm:w-[22px]"
                  />

                  <p className="text-sm leading-6 text-gray-300 sm:text-base sm:leading-7">
                    {instruction}
                  </p>

                </div>
              ))}

            </div>

            {/* Good Luck */}
            <div className="mt-8 rounded-2xl border border-cyan-400/20 bg-cyan-400/10 p-5 sm:mt-10 sm:p-6">

              <h4 className="text-lg font-semibold text-white sm:text-xl">
                Good Luck! 🚀
              </h4>

              <p className="mt-2 text-sm leading-6 text-gray-300 sm:mt-3 sm:text-base sm:leading-7">
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