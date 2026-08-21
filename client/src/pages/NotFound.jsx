import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, Home, SearchX } from "lucide-react";

const NotFound = ({ admin = false }) => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#0b1120] flex items-center justify-center px-5 py-12">

      <div className="w-full max-w-4xl">

        <div className="relative overflow-hidden rounded-3xl border border-slate-800 bg-[#111827] shadow-2xl">

          {/* Background Glow */}
          <div className="pointer-events-none absolute -right-32 -top-32 h-80 w-80 rounded-full bg-indigo-600/10 blur-3xl" />

          <div className="pointer-events-none absolute -bottom-32 -left-32 h-80 w-80 rounded-full bg-purple-600/10 blur-3xl" />

          <div className="relative px-6 py-14 sm:px-12 sm:py-20">

            {/* Icon */}
            <div className="mx-auto mb-7 flex h-16 w-16 items-center justify-center rounded-2xl border border-indigo-500/20 bg-indigo-500/10">
              <SearchX
                size={30}
                strokeWidth={1.8}
                className="text-indigo-400"
              />
            </div>

            <div className="text-center">

              {/* 404 */}
              <h1 className="select-none text-[110px] font-extrabold leading-none tracking-[-0.06em] text-slate-800 sm:text-[150px]">
                404
              </h1>

              <div className="-mt-5 sm:-mt-8">

                <h2 className="text-2xl font-bold text-white sm:text-3xl">
                  Oops! Page not found
                </h2>

                <p className="mx-auto mt-4 max-w-lg text-sm leading-7 text-slate-400 sm:text-base">
                  The page you're looking for doesn't exist, has been moved,
                  or the link you followed may be incorrect.
                </p>

              </div>

              {/* Buttons */}
              <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">

                <Link
                  to={admin ? "/admin/dashboard" : "/"}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-600/20 transition-all duration-200 hover:bg-indigo-500 hover:shadow-indigo-500/30 sm:w-auto"
                >
                  <Home size={17} />

                  {admin ? "Back to Dashboard" : "Back to Home"}
                </Link>

                <button
                  type="button"
                  onClick={() => navigate(-1)}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-slate-700 bg-slate-800/50 px-6 py-3 text-sm font-semibold text-slate-300 transition-all duration-200 hover:border-slate-600 hover:bg-slate-800 hover:text-white sm:w-auto"
                >
                  <ArrowLeft size={17} />

                  Go Back
                </button>

              </div>

              {/* Footer */}
              <div className="mt-10 flex items-center justify-center gap-2 text-xs text-slate-500">

                <span className="h-1.5 w-1.5 rounded-full bg-indigo-500" />

                <span>Corso</span>

                <span className="text-slate-700">•</span>

                <span>Error 404</span>

              </div>

            </div>
          </div>
        </div>

        <p className="mt-5 text-center text-xs text-slate-600">
          If you believe this is an error, please try refreshing the page.
        </p>

      </div>
    </div>
  );
};

export default NotFound;