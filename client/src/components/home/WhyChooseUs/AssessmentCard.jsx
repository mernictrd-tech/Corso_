import { Check } from "lucide-react";
import { ArrowRight } from "lucide-react";
import { topics, benefits } from "./data";
import TopicBadge from "./TopicBadge";

const AssessmentCard = () => {
  return (
    <div className="rounded-[36px] border border-white/10 bg-[#1A1F33] p-8">

      <div className="flex items-center justify-between">

        <div>
          <h3 className="text-2xl font-bold text-white">
            Assessment Topics
          </h3>

          <p className="mt-1 text-gray-400">
            What you'll be tested on
          </p>
        </div>

        <span className="rounded-full border border-white/10 bg-white/5 px-5 py-2 text-sm text-gray-300">
          Tailored to this course
        </span>

      </div>

      <div className="mt-5 flex flex-wrap gap-4">

        {topics.map((item) => (
          <TopicBadge key={item} text={item} />
        ))}

      </div>

      <div className="mt-6 rounded-3xl border border-white/10 bg-white/5 p-6">

        <h4 className="mb-4 text-[16px] font-bold text-white">
          What you get after you pass
        </h4>

        <div className="space-y-2">

          {benefits.map((item) => (
            <div key={item} className="flex gap-2">

              <Check className="text-emerald-400" size={20} />

              <p className="text-[14px] text-gray-200">
                {item}
              </p>

            </div>
          ))}

        </div>

        <a
          href="#courses"
          className="mt-10 flex w-full items-center justify-center gap-3 rounded-2xl bg-white py-5 text-lg font-semibold text-black transition-all duration-300 hover:scale-[1.02] hover:bg-gray-100">
          Start Test — Get Certified
          <ArrowRight size={20} />
        </a>

      </div>

    </div>
  );
};

export default AssessmentCard;