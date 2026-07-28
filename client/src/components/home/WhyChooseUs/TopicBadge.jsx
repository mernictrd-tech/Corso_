const TopicBadge = ({ text }) => {
  return (
    <div className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2">
      <span className="h-1.5 w-1.5 rounded-full bg-emerald-400"></span>
      <span className="text-[13px] font-medium text-white">
        {text}
      </span>
    </div>
  );
};

export default TopicBadge;