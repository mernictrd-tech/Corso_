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
      console.error("MongoDB Program ID is missing:", course);

      alert("Unable to start assessment. Program ID is missing.");

      return;
    }

    console.log(
      "Starting assessment with Program ID:",
      course.id
    );

    navigate(`/assessment/${course.id}`);
  };

  return (
    <section className="bg-[#070B1A] pb-16 sm:pb-20 lg:pb-24">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">

        {/* Main Banner */}
        <div
          className="
            overflow-hidden
            rounded-[28px]
            border border-cyan-400/20
            bg-gradient-to-r
            from-cyan-500/10
            via-[#111827]
            to-emerald-500/10
            p-5
            sm:rounded-[32px]
            sm:p-8
            lg:p-14
          "
        >
          <div className="grid items-center gap-8 lg:grid-cols-2 lg:gap-10">

            {/* Left Content */}
            <div>
              <span
                className="
                  inline-flex
                  rounded-full
                  border border-cyan-400/20
                  bg-cyan-500/10
                  px-3 py-1.5
                  text-xs
                  font-semibold
                  text-cyan-300
                  sm:px-4 sm:py-2
                  sm:text-sm
                "
              >
                Ready to Begin?
              </span>

              <h2
                className="
                  mt-5
                  text-3xl
                  font-bold
                  leading-tight
                  text-white
                  sm:mt-6
                  sm:text-4xl
                "
              >
                Start Your Assessment Today
              </h2>

              <p
                className="
                  mt-4
                  max-w-xl
                  text-base
                  leading-7
                  text-gray-400
                  sm:mt-6
                  sm:text-lg
                  sm:leading-8
                "
              >
                Test your knowledge, earn your certificate, and showcase your
                skills with confidence.
              </p>
            </div>

            {/* Right Assessment Card */}
            <div
              className="
                rounded-[24px]
                border border-white/10
                bg-white/5
                p-5
                backdrop-blur-xl
                sm:rounded-3xl
                sm:p-8
              "
            >
              <div className="space-y-5">

                {/* Duration */}
                <div className="flex items-center justify-between gap-4">
                  <div className="flex min-w-0 items-center gap-3">
                    <Clock3
                      size={21}
                      className="shrink-0 text-cyan-400"
                    />

                    <span className="text-sm text-gray-300 sm:text-base">
                      Duration
                    </span>
                  </div>

                  <span className="shrink-0 text-sm font-semibold text-white sm:text-base">
                    {course?.duration || "10 Minutes"}
                  </span>
                </div>

                {/* Questions */}
                <div className="flex items-center justify-between gap-4">
                  <div className="flex min-w-0 items-center gap-3">
                    <HelpCircle
                      size={21}
                      className="shrink-0 text-cyan-400"
                    />

                    <span className="text-sm text-gray-300 sm:text-base">
                      Questions
                    </span>
                  </div>

                  <span className="shrink-0 text-sm font-semibold text-white sm:text-base">
                    {course?.questions || 0}
                  </span>
                </div>

                {/* Certificate */}
                <div className="flex items-center justify-between gap-4">
                  <div className="flex min-w-0 items-center gap-3">
                    <Award
                      size={21}
                      className="shrink-0 text-cyan-400"
                    />

                    <span className="text-sm text-gray-300 sm:text-base">
                      Certificate
                    </span>
                  </div>

                  <span className="shrink-0 text-sm font-semibold text-emerald-400 sm:text-base">
                    Included
                  </span>
                </div>

              </div>

              {/* Start Button */}
              <button
                onClick={handleStartAssessment}
                className="
                  group
                  mt-8
                  flex
                  w-full
                  items-center
                  justify-center
                  gap-3
                  rounded-xl
                  bg-gradient-to-r
                  from-cyan-400
                  to-emerald-400
                  px-5
                  py-4
                  text-sm
                  font-semibold
                  text-black
                  transition-all
                  duration-300
                  hover:-translate-y-1
                  hover:shadow-2xl
                  hover:shadow-cyan-500/30
                  sm:mt-10
                  sm:px-8
                  sm:text-base
                "
              >
                Start Assessment

                <ArrowRight
                  size={20}
                  className="shrink-0 transition group-hover:translate-x-1"
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