import { ArrowRight } from "lucide-react";

const AssessmentCard = () => {
  return (
    <div className="rounded-[34px] border border-white/10 bg-[#111527] p-5 sm:p-8">

      <h3 className="text-1xl font-bold text-white">
        Assessment Info
      </h3>

      <div className="mt-4 flex flex-col gap-4 sm:flex-row sm:gap-5">

        <div className="w-full rounded-2xl border border-white/10 bg-white/5 px-5 py-4 sm:w-[260px]">
          <p className="text-sm text-gray-400">Level</p>
          <h4 className="mt-1 text-lg font-semibold text-white">
            Intermediate
          </h4>
        </div>

        <div className="w-full rounded-2xl border border-white/10 bg-white/5 px-5 py-4 sm:w-[320px]">
          <p className="text-sm text-gray-400">Category</p>
          <h4 className="mt-1 text-lg font-semibold text-white">
            Technical/Non-Technical Courses
          </h4>
        </div>

      </div>

      <h5 className="mt-8 text-lg font-semibold text-white">
        Designed for today's tech industry
      </h5>

      <p className="mt-4 text-[17px] leading-6 text-gray-300">
        Skilium is a skill assessment and certification platform offering a diverse range of
        technical and non-technical courses designed to support continuous learning and professional development.
        Through focused assessments and structured learning opportunities, Skilium helps learners build relevant knowledge,
        validate their skills, and earn recognized certifications. From technology and programming to business, management,
        communication, and other professional domains, Skilium provides learners with opportunities to strengthen their capabilities
        and demonstrate their expertise with confidence. Our assessments are designed to provide a structured way to evaluate knowledge and competency across different domains.
        Whether you are a student, working professional, or an individual looking to upskill, Skilium offers flexible opportunities for continuous growth.
        Through learning, assessment, and certification, Skilium aims to help learners build confidence and showcase their skills in today's competitive environment.
      </p>

      <a
        href="#courses"
        className="mt-10 flex w-full items-center justify-center gap-3 rounded-2xl bg-white px-4 py-4 text-center text-base font-semibold text-black transition-all duration-300 hover:scale-[1.02] hover:bg-gray-100 sm:py-5 sm:text-lg"
      >
        Start Test — Download Certificate Instantly
        <ArrowRight size={20} className="shrink-0" />
      </a>

    </div>
  );
};

export default AssessmentCard;