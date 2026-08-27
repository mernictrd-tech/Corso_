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
    <section className="bg-[#070B1A] py-16 sm:py-20 lg:py-24">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">

        {/* Heading */}
        <div className="max-w-3xl">

          <span className="inline-flex rounded-full border border-cyan-400/30 bg-cyan-400/10 px-3 py-1.5 text-xs font-semibold text-cyan-300 sm:px-4 sm:py-2 sm:text-sm">
            About Assessment
          </span>

          <h2 className="mt-5 text-3xl font-bold leading-tight text-white sm:mt-6 sm:text-4xl lg:text-5xl">
            Why Take This
            <span className="bg-gradient-to-r from-cyan-400 via-emerald-400 to-blue-400 bg-clip-text text-transparent">
              {" "}
              Assessment?
            </span>
          </h2>

          <p className="mt-5 text-base leading-7 text-gray-400 sm:mt-6 sm:text-lg sm:leading-8">
            {course.description}
          </p>

        </div>

        {/* Feature Cards */}
        <div className="mt-10 grid grid-cols-2 gap-3 sm:mt-12 sm:gap-6 xl:mt-16 xl:grid-cols-4">

          {features.map((item, index) => {
            const Icon = item.icon;

            return (
              <div
                key={index}
                className="
                  min-w-0
                  group
                  rounded-2xl
                  border border-white/10
                  bg-white/5
                  p-3
                  backdrop-blur-xl
                  transition
                  duration-300
                  hover:-translate-y-2
                  hover:border-cyan-400/40
                  hover:bg-white/10
                  sm:rounded-3xl
                  sm:p-6
                  lg:p-8
                "
              >

                {/* Icon */}
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-400/20 to-emerald-400/20 sm:h-16 sm:w-16 sm:rounded-2xl">
                  <Icon
                    size={21}
                    className="text-cyan-400 sm:h-[30px] sm:w-[30px]"
                  />
                </div>

                {/* Title */}
                <h3 className="mt-3 text-[14px] font-semibold leading-5 text-white sm:mt-6 sm:text-xl sm:leading-normal">
                  {item.title}
                </h3>

                {/* Description */}
                <p className="mt-2 text-[11px] leading-4 text-gray-400 sm:mt-4 sm:text-base sm:leading-7">
                  {item.description}
                </p>

              </div>
            );
          })}

        </div>

        {/* Bottom Banner */}
        <div className="mt-12 overflow-hidden rounded-[28px] border border-cyan-400/20 bg-gradient-to-r from-cyan-500/10 via-transparent to-emerald-500/10 p-5 sm:mt-16 sm:rounded-3xl sm:p-8 lg:mt-20 lg:p-10">

          <div className="grid items-center gap-8 lg:grid-cols-2 lg:gap-10">

            {/* Banner Content */}
            <div className="min-w-0">

              <h3 className="text-2xl font-bold leading-tight text-white sm:text-3xl">
                Ready to prove your knowledge?
              </h3>

              <p className="mt-4 text-sm leading-6 text-gray-400 sm:text-base sm:leading-8">
                This assessment is designed to evaluate your understanding of
                core concepts and practical problem-solving skills. Whether
                you're preparing for interviews or validating your expertise,
                this assessment provides an industry-recognized benchmark.
              </p>

            </div>

            {/* Stats - Always 2 x 2 */}
            <div className="grid min-w-0 grid-cols-2 gap-3 sm:gap-5">

              {/* Questions */}
              <div className="min-w-0 rounded-2xl border border-white/10 bg-white/5 p-3 text-center sm:p-6">

                <h4 className="min-w-0 break-words text-2xl font-bold leading-tight text-cyan-400 sm:text-4xl">
                  {course.questions}
                </h4>

                <p className="mt-1.5 text-xs text-gray-400 sm:mt-2 sm:text-sm">
                  Questions
                </p>

              </div>

              {/* Duration */}
              <div className="min-w-0 rounded-2xl border border-white/10 bg-white/5 p-3 text-center sm:p-6">

                <h4 className="min-w-0 break-words text-[20px] font-bold leading-tight text-cyan-400 sm:text-4xl">
                  {course.duration}
                </h4>

                <p className="mt-1.5 text-xs text-gray-400 sm:mt-2 sm:text-sm">
                  Duration
                </p>

              </div>

              {/* Passing Score */}
              <div className="min-w-0 rounded-2xl border border-white/10 bg-white/5 p-3 text-center sm:p-6">

                <h4 className="min-w-0 break-words text-2xl font-bold leading-tight text-cyan-400 sm:text-4xl">
                  {course.passingScore}
                </h4>

                <p className="mt-1.5 text-xs text-gray-400 sm:mt-2 sm:text-sm">
                  Passing Score
                </p>

              </div>

              {/* Learners */}
              <div className="min-w-0 rounded-2xl border border-white/10 bg-white/5 p-3 text-center sm:p-6">

                <h4 className="min-w-0 break-words text-2xl font-bold leading-tight text-cyan-400 sm:text-4xl">
                  {course.students}+
                </h4>

                <p className="mt-1.5 text-xs text-gray-400 sm:mt-2 sm:text-sm">
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