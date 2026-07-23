import { ArrowRight } from "lucide-react";

const AssessmentCard = () => {
    return (
        <div className="rounded-[34px] border border-white/10 bg-[#111527] p-8">

            <h3 className="text-1xl font-bold text-white">
                Assessment Info
            </h3>

            <div className="mt-4 flex gap-5">
                <div className="w-[260px] rounded-2xl border border-white/10 bg-white/5 px-5 py-4">
                    <p className="text-sm text-gray-400">Level</p>
                    <h4 className="mt-1 text-lg font-semibold text-white">
                        Intermediate
                    </h4>
                </div>

                <div className="w-[320px] rounded-2xl border border-white/10 bg-white/5 px-5 py-4">
                    <p className="text-sm text-gray-400">Category</p>
                    <h4 className="mt-1 text-lg font-semibold text-white">
                        Technical Courses
                    </h4>
                </div>
            </div>

            <h5 className="mt-8 text-lg font-semibold text-white">
                Designed for today's tech industry
            </h5>

            <p className="mt-4 text-[17px] leading-6 text-gray-300">
                Corso evaluates practical technical competencies through focused assessments, 
                helping learners earn recognized certifications that strengthen their career prospects.
            </p>

            <button className="mt-10 flex w-full items-center justify-center gap-3 rounded-2xl bg-white py-5 text-lg font-semibold text-black transition hover:bg-gray-100">

                Start Test — Download Certificate Instantly

                <ArrowRight size={18} />

            </button>

        </div>
    );
};

export default AssessmentCard;