import { Check, ArrowRight } from "lucide-react";
import { topics, benefits } from "./data";
import TopicBadge from "./TopicBadge";

const AssessmentCard = () => {
  return (
    <div className="rounded-[28px] border border-white/10 bg-[#1A1F33] p-5 sm:rounded-[36px] sm:p-8">

      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

        <div>
          <h3 className="text-xl font-bold text-white sm:text-2xl">
            Assessment Topics
          </h3>

          <p className="mt-1 text-sm text-gray-400 sm:text-base">
            What you'll be tested on
          </p>
        </div>

        <span className="w-fit rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs text-gray-300 sm:px-5 sm:text-sm">
          Tailored to this course
        </span>

      </div>

      {/* Topics */}
      <div className="mt-5 flex flex-wrap gap-2 sm:gap-4">

        {topics.map((item) => (
          <TopicBadge key={item} text={item} />
        ))}

      </div>

      {/* Benefits */}
      <div className="mt-6 rounded-3xl border border-white/10 bg-white/5 p-5 sm:p-6">

        <h4 className="mb-4 text-base font-bold text-white">
          What you get after you pass
        </h4>

        <div className="space-y-3">

          {benefits.map((item) => (
            <div
              key={item}
              className="flex items-start gap-2"
            >
              <Check
                className="mt-0.5 shrink-0 text-emerald-400"
                size={19}
              />

              <p className="text-sm leading-5 text-gray-200">
                {item}
              </p>
            </div>
          ))}

        </div>

        {/* CTA */}
        <a
          href="#courses"
          className="mt-8 flex w-full items-center justify-center gap-3 rounded-2xl bg-white px-4 py-4 text-center text-base font-semibold text-black transition-all duration-300 hover:scale-[1.02] hover:bg-gray-100 sm:mt-10 sm:py-5 sm:text-lg"
        >
          Start Test — Get Certified
          <ArrowRight size={20} className="shrink-0" />
        </a>

      </div>

    </div>
  );
};

export default AssessmentCard;