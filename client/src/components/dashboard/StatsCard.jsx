const StatsCard = ({
  title,
  value,
  icon: Icon,
  iconColor,
}) => {
  return (
    <div className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl transition-all duration-300 hover:border-cyan-400/30 hover:-translate-y-1">

      <div className="flex items-center justify-between">

        <div>

          <p className="text-sm text-gray-400">
            {title}
          </p>

          <h2 className="mt-3 text-3xl font-bold text-white">
            {value}
          </h2>

        </div>

        <div
          className={`rounded-2xl p-4 ${iconColor}`}
        >
          <Icon className="h-7 w-7 text-white" />
        </div>

      </div>

    </div>
  );
};

export default StatsCard;