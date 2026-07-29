import {
  Award,
  Calendar,
  Download,
  Eye,
  Medal,
} from "lucide-react";

const DashboardHero = ({ hero }) => {
  return (
    <section className="relative overflow-hidden rounded-[32px] border border-cyan-400/20 bg-gradient-to-br from-cyan-500/20 via-slate-900 to-emerald-500/10 p-8 shadow-[0_0_60px_rgba(0,255,255,.12)]">

      {/* Glow */}

      <div className="absolute -top-24 -right-24 h-64 w-64 rounded-full bg-cyan-400/20 blur-3xl"></div>

      <div className="absolute -bottom-24 -left-20 h-64 w-64 rounded-full bg-emerald-400/20 blur-3xl"></div>

      <div className="relative grid items-center gap-10 lg:grid-cols-[2fr_1fr]">

        {/* Left */}

        <div>

          <div className="inline-flex items-center gap-2 rounded-full bg-cyan-400/10 px-4 py-2 text-cyan-300">

            <Medal size={18} />

            Congratulations

          </div>

          <h1 className="mt-5 text-4xl font-bold leading-tight text-white">

            {hero.assessment}

            <br />

            Certification Completed 🎉

          </h1>

          <p className="mt-4 max-w-2xl text-gray-300 leading-7">

            You successfully completed your assessment and unlocked your professional certificate.

            Download it now or view it anytime from your dashboard.

          </p>

          <div className="mt-8 flex flex-wrap gap-5">

            <div className="rounded-2xl border border-white/10 bg-white/5 px-5 py-4">

              <p className="text-sm text-gray-400">

                Score

              </p>

              <h2 className="mt-1 text-3xl font-bold text-cyan-300">

                {hero.score}

              </h2>

            </div>

            <div className="rounded-2xl border border-white/10 bg-white/5 px-5 py-4">

              <p className="text-sm text-gray-400">

                Certificate ID

              </p>

              <h2 className="mt-1 font-semibold text-white">

                CRS-2026-001

              </h2>

            </div>

            <div className="rounded-2xl border border-white/10 bg-white/5 px-5 py-4">

              <p className="text-sm text-gray-400">

                Issued

              </p>

              <h2 className="mt-1 flex items-center gap-2 font-semibold text-white">

                <Calendar size={16} />

                29 Jul 2026

              </h2>

            </div>

          </div>

          <div className="mt-10 flex gap-4">

            <button className="group flex items-center gap-2 rounded-xl bg-gradient-to-r from-cyan-400 to-emerald-400 px-6 py-3 font-semibold text-black transition hover:scale-105">

              <Download size={18} />

              Download Certificate

            </button>

            <button className="group flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-6 py-3 font-semibold text-white transition hover:border-cyan-400">

              <Eye size={18} />

              View Certificate

            </button>

          </div>

        </div>

        {/* Right */}

        <div className="flex justify-center">

          <div className="w-full max-w-sm rounded-[28px] border border-white/10 bg-gradient-to-b from-white/10 to-white/5 p-6 backdrop-blur-xl shadow-2xl">

            <div className="rounded-2xl bg-white p-8 text-center">

              <Award
                className="mx-auto text-cyan-500"
                size={55}
              />

              <p className="mt-4 text-xs tracking-[5px] text-gray-500">

                CERTIFICATE

              </p>

              <h2 className="mt-5 text-2xl font-bold text-gray-800">

                React.js

              </h2>

              <p className="mt-3 text-gray-600">

                Awarded To

              </p>

              <h3 className="mt-1 text-xl font-semibold">

                {hero.name}

              </h3>

              <div className="mt-6 h-px bg-gray-300"></div>

              <p className="mt-6 text-sm text-gray-500">

                Score

              </p>

              <h1 className="text-4xl font-bold text-cyan-500">

                {hero.score}

              </h1>

            </div>

          </div>

        </div>

      </div>

    </section>
  );
};

export default DashboardHero;