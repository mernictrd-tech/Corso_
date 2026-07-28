const RoleCard = ({ title, description }) => {
  return (
    <div className="rounded-3xl border border-white/10 bg-white/5 p-4 transition-all duration-300 hover:border-cyan-500/40 hover:bg-white/10">

      <h4 className="text-[16px] font-semibold text-white">
        {title}
      </h4>

      <p className="mt-0.2 text-[14px] leading-7 text-gray-300">
        {description}
      </p>

    </div>
  );
};

export default RoleCard;