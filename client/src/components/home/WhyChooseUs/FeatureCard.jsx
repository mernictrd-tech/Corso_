const FeatureCard = ({ title, description }) => {
  return (
    <div className="rounded-3xl border border-white/10 bg-white/5 p-7 transition-all duration-300 hover:border-cyan-500/40 hover:bg-white/10">
      <h6 className="mb-2 text-[18px] font-bold text-white">
        {title}
      </h6>

      <p className="text-[15px] leading-6 text-gray-300">
        {description}
      </p>
    </div>
  );
};

export default FeatureCard;