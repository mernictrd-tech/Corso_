import certificate from "../../../assets/images/certificate.png";

const HeroImage = () => {
  return (
    <div className="relative">
      <div className="rounded-3xl border border-white/10 bg-gradient-to-br from-[#1B2240] to-[#35124A] p-6 shadow-2xl">
        <img
          src={certificate}
          alt="Course Certificate"
          className="w-full rounded-2xl"
        />
      </div>
    </div>
  );
};

export default HeroImage;