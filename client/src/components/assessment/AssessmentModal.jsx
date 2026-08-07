import { X, Clock3, HelpCircle, Award, CheckCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";

const AssessmentModal = ({ open, onClose, course }) => {
      const navigate = useNavigate();

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4">

      <div className="w-full max-w-lg rounded-3xl border border-white/10 bg-[#111827] p-8 shadow-2xl">


        {/* Header */}

        <div className="flex items-center justify-between">

          <h2 className="text-2xl font-bold text-white">
            Start Assessment
          </h2>

          <button
            onClick={onClose}
            className="rounded-full bg-white/10 p-2 text-gray-300 hover:bg-white/20"
          >
            <X size={20}/>
          </button>

        </div>


        <p className="mt-4 text-gray-400">
          Test your knowledge and earn your certificate.
        </p>


        {/* Details */}

        <div className="mt-6 space-y-4">


          <div className="flex justify-between rounded-xl bg-white/5 p-4">

            <div className="flex gap-3 text-gray-300">
              <Clock3 className="text-cyan-400"/>
              Duration
            </div>

            <span className="font-semibold text-white">
              {course.duration}
            </span>

          </div>



          <div className="flex justify-between rounded-xl bg-white/5 p-4">

            <div className="flex gap-3 text-gray-300">
              <HelpCircle className="text-cyan-400"/>
              Questions
            </div>

            <span className="font-semibold text-white">
              {course.questions}
            </span>

          </div>



          <div className="flex justify-between rounded-xl bg-white/5 p-4">

            <div className="flex gap-3 text-gray-300">
              <Award className="text-cyan-400"/>
              Certificate
            </div>

            <span className="font-semibold text-emerald-400">
              Yes
            </span>

          </div>


        </div>


        {/* Rules */}

        <div className="mt-6 space-y-3">

          <h3 className="font-semibold text-white">
            Instructions
          </h3>


          <div className="flex gap-2 text-sm text-gray-400">
            <CheckCircle size={18} className="text-emerald-400"/>
            Do not refresh the page during assessment
          </div>


          <div className="flex gap-2 text-sm text-gray-400">
            <CheckCircle size={18} className="text-emerald-400"/>
            Complete the assessment within given time
          </div>


          <div className="flex gap-2 text-sm text-gray-400">
            <CheckCircle size={18} className="text-emerald-400"/>
            Score required for certification
          </div>


        </div>


        {/* Button */}

        <button
        onClick={() => navigate(`/assessment/${course.id}`)}
          className="
          mt-8 w-full rounded-xl 
          bg-gradient-to-r from-cyan-400 to-emerald-400
          py-4 font-semibold text-black
          hover:scale-[1.02] transition
          "
        >
          Start Test
        </button>


      </div>

    </div>
  );
};


export default AssessmentModal;