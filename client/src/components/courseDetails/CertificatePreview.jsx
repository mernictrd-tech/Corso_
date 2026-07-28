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
    <section className="bg-[#070B1A] py-24">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">

        {/* Heading */}

        <div className="mx-auto max-w-3xl text-center">
          <span className="rounded-full border border-cyan-400/30 bg-cyan-400/10 px-4 py-2 text-sm font-semibold text-cyan-300">
            Earn Your Certificate
          </span>

          <h2 className="mt-6 text-4xl font-bold text-white lg:text-5xl">
            Showcase Your
            <span className="bg-gradient-to-r from-cyan-400 via-emerald-400 to-blue-400 bg-clip-text text-transparent">
              {" "}Achievement
            </span>
          </h2>

          <p className="mt-6 text-lg leading-8 text-gray-400">
            Successfully complete the assessment and receive an
            industry-recognized digital certificate that validates your
            technical expertise.
          </p>
        </div>

        {/* Content */}

        <div className="mt-16 grid items-center gap-16 lg:grid-cols-2">

          {/* Certificate */}

          <div className="relative">

            <div className="absolute inset-0 rounded-3xl bg-cyan-500/20 blur-3xl" />

            <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl">

              <img
                src={course.certificate.image}
                alt="Certificate"
                className="w-full rounded-2xl shadow-2xl"
              />

            </div>

          </div>

          {/* Details */}

          <div>

            <div className="flex items-center gap-3">
              <Award
                size={34}
                className="text-cyan-400"
              />

              <h3 className="text-3xl font-bold text-white">
                {course.certificate.title}
              </h3>

            </div>

            <p className="mt-6 leading-8 text-gray-400">
              {course.certificate.description}
            </p>

            {/* Benefits */}

            <div className="mt-10 space-y-5">

              <div className="flex items-center gap-4">
                <CheckCircle2 className="text-emerald-400" />
                <span className="text-gray-300">
                  Lifetime Valid Certificate
                </span>
              </div>

              <div className="flex items-center gap-4">
                <BadgeCheck className="text-emerald-400" />
                <span className="text-gray-300">
                  Verified & Secure
                </span>
              </div>

              <div className="flex items-center gap-4">
                <Download className="text-emerald-400" />
                <span className="text-gray-300">
                  Download as PDF
                </span>
              </div>

              <div className="flex items-center gap-4">
  <Share2 className="text-emerald-400" />
  <span className="text-gray-300">
    Share directly on LinkedIn
  </span>
</div>

              <div className="flex items-center gap-4">
                <ShieldCheck className="text-emerald-400" />
                <span className="text-gray-300">
                  Unique Verification ID
                </span>
              </div>

            </div>

            {/* Bottom Card */}

            <div className="mt-10 rounded-3xl border border-cyan-400/20 bg-gradient-to-r from-cyan-500/10 to-emerald-500/10 p-6">

              <h4 className="text-xl font-semibold text-white">
                Why This Certificate Matters
              </h4>

              <p className="mt-4 leading-7 text-gray-300">
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