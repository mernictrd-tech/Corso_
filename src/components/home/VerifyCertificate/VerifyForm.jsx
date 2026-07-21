const VerifyForm = () => {
  return (
    <div className="flex flex-col gap-4 lg:flex-row lg:items-center">

      <input
        type="text"
        placeholder="Enter Certificate ID (e.g. SM-2025-XXXX)"
        className="h-16 w-full rounded-2xl border border-white/10 bg-[#0F1323] px-6 text-base text-white placeholder:text-gray-500 outline-none transition focus:border-cyan-400"
      />

      <button
        className="h-16 rounded-2xl bg-white px-10 text-lg font-semibold text-black transition hover:bg-gray-100"
      >
        Verify
      </button>

    </div>
  );
};

export default VerifyForm;