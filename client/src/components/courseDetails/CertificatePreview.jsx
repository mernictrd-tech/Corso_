import {
  Award,
  BadgeCheck,
  Download,
  ShieldCheck,
  CheckCircle2,
  Share2,
} from "lucide-react";

const CertificatePreview = ({ course }) => {
  return (
    <section className="bg-[#070B1A] py-16 sm:py-20 lg:py-24">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">

        {/* Heading */}
        <div className="mx-auto max-w-3xl text-center">

          <span
            className="
              inline-flex
              rounded-full
              border border-cyan-400/30
              bg-cyan-400/10
              px-3 py-1.5
              text-xs
              font-semibold
              text-cyan-300
              sm:px-4 sm:py-2
              sm:text-sm
            "
          >
            Earn Your Certificate
          </span>

          <h2
            className="
              mt-5
              text-3xl
              font-bold
              leading-tight
              text-white
              sm:mt-6
              sm:text-4xl
              lg:text-5xl
            "
          >
            Showcase Your
            <span className="bg-gradient-to-r from-cyan-400 via-emerald-400 to-blue-400 bg-clip-text text-transparent">
              {" "}Achievement
            </span>
          </h2>

          <p
            className="
              mt-5
              text-base
              leading-7
              text-gray-400
              sm:mt-6
              sm:text-lg
              sm:leading-8
            "
          >
            Successfully complete the assessment and receive an
            industry-recognized digital certificate that validates your
            technical expertise.
          </p>

        </div>

        {/* Content */}
        <div
          className="
            mt-10
            grid
            items-center
            gap-10
            sm:mt-12
            sm:gap-12
            lg:mt-16
            lg:grid-cols-2
            lg:gap-16
          "
        >

          {/* Certificate */}
          <div className="relative min-w-0">

            {/* Glow */}
            <div className="absolute inset-0 rounded-[28px] bg-cyan-500/20 blur-3xl sm:rounded-3xl" />

            {/* Certificate Card */}
            <div
              className="
                relative
                overflow-hidden
                rounded-[28px]
                border border-white/10
                bg-white/5
                p-4
                backdrop-blur-xl
                sm:rounded-3xl
                sm:p-6
              "
            >
              <img
                src={course.certificate.image}
                alt="Certificate"
                className="block w-full rounded-2xl shadow-2xl"
              />
            </div>

          </div>

          {/* Details */}
          <div className="min-w-0">

            {/* Title */}
            <div className="flex items-start gap-3 sm:items-center sm:gap-4">

              <Award
                size={30}
                className="mt-1 shrink-0 text-cyan-400 sm:mt-0 sm:h-[34px] sm:w-[34px]"
              />

              <h3
                className="
                  text-2xl
                  font-bold
                  leading-tight
                  text-white
                  sm:text-3xl
                "
              >
                {course.certificate.title}
              </h3>

            </div>

            {/* Description */}
            <p
              className="
                mt-5
                text-sm
                leading-7
                text-gray-400
                sm:mt-6
                sm:text-base
                sm:leading-8
              "
            >
              {course.certificate.description}
            </p>

            {/* Benefits */}
            <div className="mt-8 space-y-4 sm:mt-10 sm:space-y-5">

              {/* Lifetime Valid */}
              <div className="flex items-start gap-3 sm:gap-4">
                <CheckCircle2
                  size={22}
                  className="mt-0.5 shrink-0 text-emerald-400"
                />

                <span className="text-sm leading-6 text-gray-300 sm:text-base">
                  Lifetime Valid Certificate
                </span>
              </div>

              {/* Verified */}
              <div className="flex items-start gap-3 sm:gap-4">
                <BadgeCheck
                  size={22}
                  className="mt-0.5 shrink-0 text-emerald-400"
                />

                <span className="text-sm leading-6 text-gray-300 sm:text-base">
                  Verified & Secure
                </span>
              </div>

              {/* PDF */}
              <div className="flex items-start gap-3 sm:gap-4">
                <Download
                  size={22}
                  className="mt-0.5 shrink-0 text-emerald-400"
                />

                <span className="text-sm leading-6 text-gray-300 sm:text-base">
                  Download as PDF
                </span>
              </div>

              {/* LinkedIn */}
              <div className="flex items-start gap-3 sm:gap-4">
                <Share2
                  size={22}
                  className="mt-0.5 shrink-0 text-emerald-400"
                />

                <span className="text-sm leading-6 text-gray-300 sm:text-base">
                  Share directly on LinkedIn
                </span>
              </div>

              {/* Verification ID */}
              <div className="flex items-start gap-3 sm:gap-4">
                <ShieldCheck
                  size={22}
                  className="mt-0.5 shrink-0 text-emerald-400"
                />

                <span className="text-sm leading-6 text-gray-300 sm:text-base">
                  Unique Verification ID
                </span>
              </div>

            </div>

            {/* Bottom Card */}
            <div
              className="
                mt-8
                rounded-[28px]
                border border-cyan-400/20
                bg-gradient-to-r
                from-cyan-500/10
                to-emerald-500/10
                p-5
                sm:mt-10
                sm:rounded-3xl
                sm:p-6
              "
            >

              <h4 className="text-lg font-semibold text-white sm:text-xl">
                Why This Certificate Matters
              </h4>

              <p
                className="
                  mt-3
                  text-sm
                  leading-6
                  text-gray-300
                  sm:mt-4
                  sm:text-base
                  sm:leading-7
                "
              >
                Add credibility to your resume, strengthen your LinkedIn
                profile, and demonstrate your practical skills to recruiters
                and employers.
              </p>

            </div>

          </div>

        </div>

      </div>
    </section>
  );
};

export default CertificatePreview;