import { useState } from "react";
import AssessmentModal from "../assessment/AssessmentModal";
import {
  ArrowRight,
  Users,
  Clock,
  Award,
  BookOpen,
} from "lucide-react";

const CourseHero = ({ course }) => {
  const [openModal, setOpenModal] = useState(false);

  return (
    <>
      <section className="relative overflow-hidden bg-[#070B1A] py-8 sm:py-10 lg:py-12">

        {/* Background Blur */}
        <div className="pointer-events-none absolute -top-40 left-0 h-80 w-80 rounded-full bg-cyan-500/20 blur-[120px]" />

        <div className="pointer-events-none absolute bottom-0 right-0 h-96 w-96 rounded-full bg-emerald-500/10 blur-[150px]" />

        <div className="relative mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">

          <div className="grid items-center gap-10 sm:gap-12 lg:grid-cols-2 lg:gap-16">

            {/* ================= LEFT SIDE ================= */}
            <div className="min-w-0">

              {/* Category */}
              <span
                className="
                  inline-flex
                  rounded-full
                  border border-cyan-400/30
                  bg-cyan-400/10
                  px-3 py-1.5
                  text-xs
                  font-semibold
                  text-cyan-300
                  sm:px-4 sm:py-2
                  sm:text-sm
                "
              >
                {course.category}
              </span>

              {/* Heading */}
              <h1
                className="
                  mt-5
                  text-3xl
                  font-bold
                  leading-tight
                  text-white
                  sm:mt-6
                  sm:text-4xl
                  lg:text-6xl
                "
              >
                {course.title}

                <span className="block bg-gradient-to-r from-cyan-400 via-emerald-400 to-blue-400 bg-clip-text text-transparent">
                  Assessment
                </span>
              </h1>

              {/* Description */}
              <p
                className="
                  mt-5
                  max-w-xl
                  text-base
                  leading-7
                  text-gray-400
                  sm:mt-6
                  sm:text-lg
                  sm:leading-8
                "
              >
                {course.description}
              </p>

              {/* Stats */}
              <div className="mt-7 flex flex-wrap gap-x-5 gap-y-4 sm:mt-10 sm:gap-6">

                {/* Learners */}
                <div className="flex items-center gap-2 text-sm text-gray-300 sm:text-base">
                  <Users
                    size={18}
                    className="shrink-0 text-cyan-400"
                  />

                  <span>
                    {course.students}+ Learners
                  </span>
                </div>

                {/* Duration */}
                <div className="flex items-center gap-2 text-sm text-gray-300 sm:text-base">
                  <Clock
                    size={18}
                    className="shrink-0 text-cyan-400"
                  />

                  <span>
                    {course.duration}
                  </span>
                </div>

                {/* Certificate */}
                <div className="flex items-center gap-2 text-sm text-gray-300 sm:text-base">
                  <Award
                    size={18}
                    className="shrink-0 text-cyan-400"
                  />

                  <span>
                    Certificate Included
                  </span>
                </div>

              </div>

              {/* Button */}
              <button
                onClick={() => setOpenModal(true)}
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
                  px-6
                  py-4
                  text-sm
                  font-semibold
                  text-black
                  transition-all
                  duration-300
                  hover:-translate-y-1
                  hover:shadow-2xl
                  hover:shadow-cyan-400/30
                  sm:mt-10
                  sm:w-fit
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

            {/* ================= RIGHT CARD ================= */}
            <div
              className="
                min-w-0
                rounded-[28px]
                border border-white/10
                bg-white/5
                p-4
                backdrop-blur-xl
                sm:rounded-3xl
                sm:p-6
                lg:p-8
              "
            >

              <div
                className="
                  rounded-2xl
                  border border-cyan-400/20
                  bg-gradient-to-br
                  from-cyan-400/10
                  to-emerald-400/10
                  p-5
                  sm:p-8
                "
              >

                {/* Icon */}
                <BookOpen
                  size={40}
                  className="mb-5 text-cyan-400 sm:size-12 sm:mb-6"
                />

                {/* Title */}
                <h3 className="text-2xl font-bold text-white sm:text-3xl">
                  Assessment Details
                </h3>

                {/* Details */}
                <div className="mt-6 space-y-4 sm:mt-8 sm:space-y-5">

                  {/* Duration */}
                  <div className="flex items-center justify-between gap-4 border-b border-white/10 pb-3">
                    <span className="text-sm text-gray-400 sm:text-base">
                      Duration
                    </span>

                    <span className="shrink-0 text-sm font-semibold text-white sm:text-base">
                      {course.duration}
                    </span>
                  </div>

                  {/* Questions */}
                  <div className="flex items-center justify-between gap-4 border-b border-white/10 pb-3">
                    <span className="text-sm text-gray-400 sm:text-base">
                      Questions
                    </span>

                    <span className="shrink-0 text-sm font-semibold text-white sm:text-base">
                      {course.questions}
                    </span>
                  </div>

                  {/* Passing Score */}
                  <div className="flex items-center justify-between gap-4 border-b border-white/10 pb-3">
                    <span className="text-sm text-gray-400 sm:text-base">
                      Passing Score
                    </span>

                    <span className="shrink-0 text-sm font-semibold text-white sm:text-base">
                      {course.passingScore}
                    </span>
                  </div>

                  {/* Attempts */}
                  <div className="flex items-center justify-between gap-4">
                    <span className="text-sm text-gray-400 sm:text-base">
                      Attempts
                    </span>

                    <span className="shrink-0 text-sm font-semibold text-white sm:text-base">
                      {course.attempts}
                    </span>
                  </div>

                </div>

                {/* Certificate Message */}
                <div
                  className="
                    mt-6
                    rounded-xl
                    border border-emerald-400/30
                    bg-emerald-400/10
                    p-4
                    sm:mt-8
                  "
                >
                  <p className="text-sm leading-6 text-emerald-300">
                    Pass the assessment and instantly unlock your verified
                    certificate.
                  </p>
                </div>

              </div>

            </div>

          </div>

        </div>
      </section>

      {/* Assessment Modal */}
      <AssessmentModal
        open={openModal}
        onClose={() => setOpenModal(false)}
        course={course}
      />
    </>
  );
};

export default CourseHero;