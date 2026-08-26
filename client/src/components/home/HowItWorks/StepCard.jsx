const StepCard = ({ step }) => {
  return (
    <div className="rounded-[26px] border border-white/10 bg-[#171B2D] p-5 transition-all duration-300 hover:-translate-y-1 hover:border-cyan-500/40 sm:rounded-[30px] sm:p-8">

      <div className="flex items-center gap-3 sm:gap-4">

        <div
          className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl text-lg font-bold sm:h-12 sm:w-12 sm:text-xl ${step.badgeColor}`}
        >
          {step.id}
        </div>

        <h3 className="text-lg font-semibold text-white sm:text-[20px]">
          {step.title}
        </h3>

      </div>

      <p className="mt-5 text-base leading-6 text-gray-300 sm:mt-6 sm:text-[17px] sm:leading-7">
        {step.description}
      </p>

    </div>
  );
};

export default StepCard;