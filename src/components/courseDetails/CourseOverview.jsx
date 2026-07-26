import {
  Target,
  BadgeCheck,
  Trophy,
  Briefcase,
} from "lucide-react";

const features = [
  {
    icon: Target,
    title: "Validate Your Skills",
    description:
      "Measure your technical knowledge through a structured assessment designed around real-world industry requirements.",
  },
  {
    icon: BadgeCheck,
    title: "Industry Standards",
    description:
      "Questions are curated to evaluate practical concepts that employers expect from skilled professionals.",
  },
  {
    icon: Trophy,
    title: "Earn a Certificate",
    description:
      "Successfully complete the assessment and receive a verified certificate to strengthen your portfolio.",
  },
  {
    icon: Briefcase,
    title: "Career Ready",
    description:
      "Demonstrate your expertise and increase your confidence before interviews and professional opportunities.",
  },
];

const CourseOverview = ({ course }) => {
  return (
    <section className="bg-[#070B1A] py-24">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        {/* Heading */}
        <div className="max-w-3xl">
          <span className="rounded-full border border-cyan-400/30 bg-cyan-400/10 px-4 py-2 text-sm font-semibold text-cyan-300">
            About Assessment
          </span>

          <h2 className="mt-6 text-4xl font-bold text-white lg:text-5xl">
            Why Take This
            <span className="bg-gradient-to-r from-cyan-400 via-emerald-400 to-blue-400 bg-clip-text text-transparent">
              {" "}
              Assessment?
            </span>
          </h2>

          <p className="mt-6 text-lg leading-8 text-gray-400">
            {course.description}
          </p>
        </div>

        {/* Feature Cards */}
        <div className="mt-16 grid gap-8 md:grid-cols-2 xl:grid-cols-4">
          {features.map((item, index) => {
            const Icon = item.icon;

            return (
              <div
                key={index}
                className="group rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-xl transition duration-300 hover:-translate-y-2 hover:border-cyan-400/40 hover:bg-white/10"
              >
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-400/20 to-emerald-400/20">
                  <Icon
                    size={30}
                    className="text-cyan-400"
                  />
                </div>

                <h3 className="mt-6 text-xl font-semibold text-white">
                  {item.title}
                </h3>

                <p className="mt-4 leading-7 text-gray-400">
                  {item.description}
                </p>
              </div>
            );
          })}
        </div>

        {/* Bottom Banner */}
        <div className="mt-20 overflow-hidden rounded-3xl border border-cyan-400/20 bg-gradient-to-r from-cyan-500/10 via-transparent to-emerald-500/10 p-10">
          <div className="grid items-center gap-8 lg:grid-cols-2">
            <div>
              <h3 className="text-3xl font-bold text-white">
                Ready to prove your knowledge?
              </h3>

              <p className="mt-4 text-gray-400 leading-8">
                This assessment is designed to evaluate your understanding of
                core concepts and practical problem-solving skills. Whether
                you're preparing for interviews or validating your expertise,
                this assessment provides an industry-recognized benchmark.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div className="rounded-2xl border border-white/10 bg-white/5 p-6 text-center">
                <h4 className="text-4xl font-bold text-cyan-400">
                  {course.questions}
                </h4>

                <p className="mt-2 text-gray-400">
                  Questions
                </p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/5 p-6 text-center">
                <h4 className="text-4xl font-bold text-cyan-400">
                  {course.duration}
                </h4>

                <p className="mt-2 text-gray-400">
                  Duration
                </p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/5 p-6 text-center">
                <h4 className="text-4xl font-bold text-cyan-400">
                  {course.passingScore}
                </h4>

                <p className="mt-2 text-gray-400">
                  Passing Score
                </p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/5 p-6 text-center">
                <h4 className="text-4xl font-bold text-cyan-400">
                  {course.students}+
                </h4>

                <p className="mt-2 text-gray-400">
                  Learners
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CourseOverview;