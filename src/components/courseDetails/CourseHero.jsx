import { Link } from "react-router-dom";
import {
  ArrowRight,
  Star,
  Users,
  Clock,
  Award,
  BookOpen,
} from "lucide-react";

const CourseHero = ({ course }) => {
  return (
    <section className="relative overflow-hidden bg-[#070B1A] pt-32 pb-20">
      {/* Background Blur */}
      <div className="absolute -top-40 left-0 h-80 w-80 rounded-full bg-cyan-500/20 blur-[120px]" />
      <div className="absolute bottom-0 right-0 h-96 w-96 rounded-full bg-emerald-500/10 blur-[150px]" />

      <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
        {/* Breadcrumb */}
        <div className="mb-8 flex items-center gap-2 text-sm text-gray-400">
          <Link
            to="/"
            className="transition hover:text-cyan-400"
          >
            Home
          </Link>

          <span>/</span>

          <Link
            to="/"
            className="transition hover:text-cyan-400"
          >
            Courses
          </Link>

          <span>/</span>

          <span className="text-white">
            {course.title}
          </span>
        </div>

        <div className="grid items-center gap-16 lg:grid-cols-2">
          {/* Left Side */}
          <div>
            <span className="rounded-full border border-cyan-400/30 bg-cyan-400/10 px-4 py-2 text-sm font-semibold text-cyan-300">
              {course.category}
            </span>

            <h1 className="mt-6 text-5xl font-bold leading-tight text-white lg:text-6xl">
              {course.title}
              <span className="block bg-gradient-to-r from-cyan-400 via-emerald-400 to-blue-400 bg-clip-text text-transparent">
                Assessment
              </span>
            </h1>

            <p className="mt-6 max-w-xl text-lg leading-8 text-gray-400">
              {course.description}
            </p>

            {/* Stats */}
            <div className="mt-10 flex flex-wrap gap-6">
              <div className="flex items-center gap-2 text-gray-300">
                <Star
                  size={18}
                  className="fill-yellow-400 text-yellow-400"
                />
                <span>{course.rating}</span>
              </div>

              <div className="flex items-center gap-2 text-gray-300">
                <Users
                  size={18}
                  className="text-cyan-400"
                />
                <span>{course.students}+ Learners</span>
              </div>

              <div className="flex items-center gap-2 text-gray-300">
                <Clock
                  size={18}
                  className="text-cyan-400"
                />
                <span>{course.duration}</span>
              </div>

              <div className="flex items-center gap-2 text-gray-300">
                <Award
                  size={18}
                  className="text-cyan-400"
                />
                <span>Certificate Included</span>
              </div>
            </div>

            {/* Button */}
            <button className="group mt-10 flex items-center gap-3 rounded-xl bg-gradient-to-r from-cyan-400 to-emerald-400 px-8 py-4 font-semibold text-black transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-cyan-400/30">
              Start Assessment

              <ArrowRight
                size={20}
                className="transition group-hover:translate-x-1"
              />
            </button>
          </div>

          {/* Right Card */}
          <div className="rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-xl">
            <div className="rounded-2xl border border-cyan-400/20 bg-gradient-to-br from-cyan-400/10 to-emerald-400/10 p-8">
              <BookOpen
                size={48}
                className="mb-6 text-cyan-400"
              />

              <h3 className="text-3xl font-bold text-white">
                Assessment Details
              </h3>

              <div className="mt-8 space-y-5">
                <div className="flex items-center justify-between border-b border-white/10 pb-3">
                  <span className="text-gray-400">
                    Duration
                  </span>

                  <span className="font-semibold text-white">
                    {course.duration}
                  </span>
                </div>

                <div className="flex items-center justify-between border-b border-white/10 pb-3">
                  <span className="text-gray-400">
                    Questions
                  </span>

                  <span className="font-semibold text-white">
                    {course.questions}
                  </span>
                </div>

                <div className="flex items-center justify-between border-b border-white/10 pb-3">
                  <span className="text-gray-400">
                    Passing Score
                  </span>

                  <span className="font-semibold text-white">
                    {course.passingScore}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-gray-400">
                    Attempts
                  </span>

                  <span className="font-semibold text-white">
                    {course.attempts}
                  </span>
                </div>
              </div>

              <div className="mt-8 rounded-xl border border-emerald-400/30 bg-emerald-400/10 p-4">
                <p className="text-sm text-emerald-300">
                  🎉 Pass the assessment and instantly unlock your verified
                  certificate.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CourseHero;