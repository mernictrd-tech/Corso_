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

const iconMap = {
  Java: Code2,
  "Spring Boot": Layers3,
  "REST API": Cpu,
  Hibernate: Database,
  MySQL: Database,
  Collections: BookOpen,
  "Exception Handling": ShieldCheck,
  Git: GitBranch,
  OOP: Brain,
  "Problem Solving": Sparkles,
};

const SkillsCovered = ({ course }) => {
  return (
    <section className="bg-[#070B1A] py-24">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        {/* Heading */}
        <div className="max-w-3xl text-center mx-auto">
          <span className="rounded-full border border-cyan-400/30 bg-cyan-400/10 px-4 py-2 text-sm font-semibold text-cyan-300">
            Skills Assessment
          </span>

          <h2 className="mt-6 text-4xl font-bold text-white lg:text-5xl">
            Skills You'll Be
            <span className="bg-gradient-to-r from-cyan-400 via-emerald-400 to-blue-400 bg-clip-text text-transparent">
              {" "}Tested On
            </span>
          </h2>

          <p className="mt-6 text-lg leading-8 text-gray-400">
            Our assessment evaluates both theoretical understanding and
            practical knowledge to ensure you're ready for real-world
            development challenges.
          </p>
        </div>

        {/* Skills Grid */}
        <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
          {/* {course.skills.map((skill, index) => {
            const Icon = iconMap[skill] || CheckCircle2;

            return (
              <div
                key={index}
                className="group rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl transition-all duration-300 hover:-translate-y-2 hover:border-cyan-400/40 hover:bg-white/10"
              >
                <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-500/20 to-emerald-500/20">
                  <Icon
                    size={28}
                    className="text-cyan-400"
                  />
                </div>

                <h3 className="mt-6 text-lg font-semibold text-white">
                  {skill}
                </h3>

                <p className="mt-3 text-sm leading-6 text-gray-400">
                  Questions based on this topic will assess your conceptual
                  understanding and practical implementation skills.
                </p>
              </div>
            );
          })} */}
        </div>

        {/* Bottom CTA */}
        <div className="mt-20 rounded-3xl border border-cyan-400/20 bg-gradient-to-r from-cyan-500/10 via-transparent to-emerald-500/10 p-10">
          <div className="flex flex-col items-center justify-between gap-8 lg:flex-row">
            <div>
              <h3 className="text-3xl font-bold text-white">
                Assessment Coverage
              </h3>

              <p className="mt-4 max-w-2xl text-gray-400 leading-8">
                Every question is carefully designed to evaluate your
                understanding of modern development concepts, coding practices,
                and problem-solving abilities.
              </p>
            </div>

            <div className="flex flex-wrap gap-4">
              <div className="rounded-xl bg-cyan-500/10 px-6 py-4 text-center border border-cyan-400/20">
                <h4 className="text-2xl font-bold text-cyan-400">
                  {/* {course.skills.length} */}
                </h4>

                <p className="text-sm text-gray-400 mt-1">
                  Topics Covered
                </p>
              </div>

              <div className="rounded-xl bg-emerald-500/10 px-6 py-4 text-center border border-emerald-400/20">
                <h4 className="text-2xl font-bold text-emerald-400">
                  100%
                </h4>

                <p className="text-sm text-gray-400 mt-1">
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