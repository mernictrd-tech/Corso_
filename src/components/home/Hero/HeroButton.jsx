import { ArrowRight } from "lucide-react";

const HeroButton = () => {
  return (
    <button className="group flex items-center gap-4 rounded-xl bg-white px-6 py-4 font-semibold text-black transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl">
      Start Skill Check
      <span className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100">

        <ArrowRight
          size={18}
          className="transition-transform group-hover:translate-x-1"
        />

      </span>

    </button>
  );
};

export default HeroButton;