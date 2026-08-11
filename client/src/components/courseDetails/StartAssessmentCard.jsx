import {
  ArrowRight,
  Clock3,
  Award,
  HelpCircle,
} from "lucide-react";

import { useNavigate } from "react-router-dom";

const StartAssessmentCard = ({ course }) => {
  const navigate = useNavigate();

  const handleStartAssessment = () => {
    if (!course?.id) {
      console.error(
        "MongoDB Program ID is missing:",
        course
      );

      alert(
        "Unable to start assessment. Program ID is missing."
      );

      return;
    }

    console.log(
      "Starting assessment with Program ID:",
      course.id
    );

    navigate(`/assessment/${course.id}`);
  };

  return (
    <section className="bg-[#070B1A] pb-24">

      <div className="mx-auto max-w-7xl px-6 lg:px-8">

        <div className="overflow-hidden rounded-[32px] border border-cyan-400/20 bg-gradient-to-r from-cyan-500/10 via-[#111827] to-emerald-500/10 p-10 lg:p-14">

          <div className="grid items-center gap-10 lg:grid-cols-2">

            {/* Left */}

            <div>

              <span className="rounded-full bg-cyan-500/10 px-4 py-2 text-sm font-semibold text-cyan-300">
                Ready to Begin?
              </span>

              <h2 className="mt-6 text-4xl font-bold text-white">
                Start Your Assessment Today
              </h2>

              <p className="mt-6 max-w-xl text-lg leading-8 text-gray-400">
                Test your knowledge, earn your certificate, and showcase your
                skills with confidence.
              </p>

            </div>

            {/* Right */}

            <div className="rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-xl">

              <div className="space-y-5">

                <div className="flex items-center justify-between">

                  <div className="flex items-center gap-3">

                    <Clock3 className="text-cyan-400" />

                    <span className="text-gray-300">
                      Duration
                    </span>

                  </div>

                  <span className="font-semibold text-white">
                    {course?.duration || "10 Minutes"}
                  </span>

                </div>

                <div className="flex items-center justify-between">

                  <div className="flex items-center gap-3">

                    <HelpCircle className="text-cyan-400" />

                    <span className="text-gray-300">
                      Questions
                    </span>

                  </div>

                  <span className="font-semibold text-white">
                    {course?.questions || 0}
                  </span>

                </div>

                <div className="flex items-center justify-between">

                  <div className="flex items-center gap-3">

                    <Award className="text-cyan-400" />

                    <span className="text-gray-300">
                      Certificate
                    </span>

                  </div>

                  <span className="font-semibold text-emerald-400">
                    Included
                  </span>

                </div>

              </div>

              <button
                onClick={handleStartAssessment}
                className="
                  group mt-10 flex w-full
                  items-center justify-center
                  gap-3 rounded-xl
                  bg-gradient-to-r
                  from-cyan-400
                  to-emerald-400
                  px-8 py-4
                  font-semibold
                  text-black
                  transition-all
                  duration-300
                  hover:-translate-y-1
                  hover:shadow-2xl
                  hover:shadow-cyan-500/30
                "
              >

                Start Assessment

                <ArrowRight
                  size={20}
                  className="transition group-hover:translate-x-1"
                />

              </button>

            </div>

          </div>

        </div>

      </div>

    </section>
  );
};

export default StartAssessmentCard;