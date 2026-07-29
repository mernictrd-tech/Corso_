import {
  ArrowRight,
  Sparkles,
} from "lucide-react";

const SuggestedAssessments = ({
  assessments,
}) => {
  return (
    <div className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl">

      <div className="flex items-center gap-3">

        <div className="rounded-xl bg-violet-500/20 p-3">
          <Sparkles className="h-6 w-6 text-violet-400" />
        </div>

        <h2 className="text-xl font-semibold text-white">
          Suggested Assessments
        </h2>

      </div>

      <div className="mt-6 space-y-4">

        {assessments.map((item) => (
          <div
            key={item.id}
            className="flex items-center justify-between rounded-xl bg-white/5 px-4 py-3"
          >
            <span className="text-white">
              {item.title}
            </span>

            <ArrowRight
              className="text-cyan-400"
              size={18}
            />
          </div>
        ))}

      </div>

    </div>
  );
};

export default SuggestedAssessments;