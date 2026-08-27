import {
  Code2,
  Database,
  GitBranch,
  Layers3,
  Brain,
  Cpu,
  ShieldCheck,
  BookOpen,
  CheckCircle2,
  Sparkles,
} from "lucide-react";

const topicIcons = [
  BookOpen,
  Brain,
  Code2,
  Database,
  Layers3,
  Cpu,
  ShieldCheck,
  GitBranch,
  CheckCircle2,
  Sparkles,
];

const SkillsCovered = ({ course }) => {
  return (
    <section className="bg-[#070B1A] py-16 sm:py-20 lg:py-24">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">

        {/* Heading */}
        <div className="mx-auto max-w-3xl text-center">

          <span className="inline-flex rounded-full border border-cyan-400/30 bg-cyan-400/10 px-3 py-1.5 text-xs font-semibold text-cyan-300 sm:px-4 sm:py-2 sm:text-sm">
            Skills Assessment
          </span>

          <h2 className="mt-5 text-3xl font-bold leading-tight text-white sm:mt-6 sm:text-4xl lg:text-5xl">
            Skills You'll Be
            <span className="bg-gradient-to-r from-cyan-400 via-emerald-400 to-blue-400 bg-clip-text text-transparent">
              {" "}
              Tested On
            </span>
          </h2>

          <p className="mt-5 text-base leading-7 text-gray-400 sm:mt-6 sm:text-lg sm:leading-8">
            Our assessment evaluates both theoretical understanding and
            practical knowledge to ensure you're ready for real-world
            development challenges.
          </p>

        </div>

        {/* Skills Grid */}
        <div className="mt-10 grid gap-4 sm:mt-12 sm:gap-5 md:grid-cols-2 lg:grid-cols-3 xl:mt-16 xl:grid-cols-5">

          {course.topics.map((skill, index) => {
            const Icon = topicIcons[index % topicIcons.length];

            return (
              <div
                key={index}
                className="
                  group
                  rounded-2xl
                  border border-white/10
                  bg-white/5
                  p-5
                  backdrop-blur-xl
                  transition-all
                  duration-300
                  hover:-translate-y-2
                  hover:border-cyan-400/40
                  hover:bg-white/10
                  sm:p-6
                "
              >

                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-500/20 to-emerald-500/20 sm:h-14 sm:w-14">
                  <Icon
                    size={24}
                    className="text-cyan-400 sm:h-7 sm:w-7"
                  />
                </div>

                <h3 className="mt-5 text-base font-semibold leading-6 text-white sm:mt-6 sm:text-lg">
                  {skill.name}
                </h3>

                <p className="mt-2 text-sm leading-6 text-gray-400 sm:mt-3">
                  {skill.description}
                </p>

              </div>
            );
          })}

        </div>

        {/* Bottom CTA */}
        <div className="mt-12 rounded-[28px] border border-cyan-400/20 bg-gradient-to-r from-cyan-500/10 via-transparent to-emerald-500/10 p-5 sm:mt-16 sm:rounded-3xl sm:p-8 lg:mt-20 lg:p-10">

          <div className="flex flex-col gap-7 lg:flex-row lg:items-center lg:justify-between lg:gap-8">

            {/* CTA Content */}
            <div>

              <h3 className="text-2xl font-bold leading-tight text-white sm:text-3xl">
                Assessment Coverage
              </h3>

              <p className="mt-3 max-w-2xl text-sm leading-6 text-gray-400 sm:mt-4 sm:text-base sm:leading-8">
                Every question is carefully designed to evaluate your
                understanding of modern development concepts, coding practices,
                and problem-solving abilities.
              </p>

            </div>

            {/* Stats */}
            <div className="grid w-full grid-cols-2 gap-3 sm:gap-4 lg:w-auto">

              <div className="rounded-xl border border-cyan-400/20 bg-cyan-500/10 px-3 py-4 text-center sm:px-6 sm:py-4">
                <h4 className="text-2xl font-bold text-cyan-400">
                  {course.topics.length}
                </h4>

                <p className="mt-1 text-xs text-gray-400 sm:text-sm">
                  Topics Covered
                </p>
              </div>

              <div className="rounded-xl border border-emerald-400/20 bg-emerald-500/10 px-3 py-4 text-center sm:px-6 sm:py-4">
                <h4 className="text-2xl font-bold text-emerald-400">
                  100%
                </h4>

                <p className="mt-1 text-xs text-gray-400 sm:text-sm">
                  Practical Focus
                </p>
              </div>

            </div>

          </div>

        </div>

      </div>
    </section>
  );
};

export default SkillsCovered;