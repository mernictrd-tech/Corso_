import { ArrowRight, Sparkles } from "lucide-react";
import { useEffect, useState } from "react";
import api from "../../services/api";

const SuggestedAssessments = () => {
  const [programs, setPrograms] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPrograms();
  }, []);

  const fetchPrograms = async () => {
    try {
      const res = await api.get("auth/programs/suggestion");

      setPrograms(res.data.data);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };
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

      <div className="mt-6 space-y-4 max-h-[220px] overflow-y-auto pr-2">
        {programs.map((item) => (
          <div
            key={item._id}
            className="group flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 p-4 transition-all duration-300 hover:border-cyan-400/40 hover:bg-white/10 hover:shadow-lg hover:shadow-cyan-500/10 cursor-pointer"
          >
            <div className="flex items-center gap-4">
              <img
                src={`http://localhost:5000${item.thumbnail}`}
                alt={item.name}
                className="h-16 w-16 rounded-xl object-cover border border-white/10"
              />

              <div>
                <h3 className="font-semibold text-white">{item.name}</h3>

                <p className="mt-1 text-sm text-gray-400">Start Assessment</p>
              </div>
            </div>

            <ArrowRight
              className="text-cyan-400 transition-transform duration-300 group-hover:translate-x-1"
              size={22}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default SuggestedAssessments;
