const StepCard = ({ step }) => {
  return (
    <div className="rounded-[30px] border border-white/10 bg-[#171B2D] p-8 transition-all duration-300 hover:border-cyan-500/40 hover:-translate-y-1">

      <div className="flex items-center gap-4">

        <div
          className={`flex h-12 w-12 items-center justify-center rounded-2xl font-bold text-xl ${step.badgeColor}`}
        >
          {step.id}
        </div>

        <h3 className="text-[22px] font-semibold text-white">
          {step.title}
        </h3>

      </div>

      <p className="mt-6 text-[17px] leading-8 text-gray-300">
        {step.description}
      </p>

    </div>
  );
};

export default StepCard;