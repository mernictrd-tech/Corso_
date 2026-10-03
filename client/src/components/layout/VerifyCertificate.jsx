import { useCallback, useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import api from "../../services/api";

/* ================================================================
   Icons
================================================================ */

const ICON_PATHS = {
  shield:
    "M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.291 9 11.622C17.176 19.291 21 14.591 21 9c0-1.042-.133-2.052-.382-3.016z",
  check: "M5 13l4 4L19 7",
  copy: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2",
  book: "M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253",
  document:
    "M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h6l4 4v12a2 2 0 01-2 2z",
  user: "M16 7a4 4 0 11-8 0 4 4 0 018 0zM5 21a7 7 0 0114 0",
  calendar:
    "M8 7V3m8 4V3M4 10h16M5 21h14a1 1 0 001-1V6a1 1 0 00-1-1H5a1 1 0 00-1 1v14a1 1 0 001 1z",
  chart: "M4 19V5m0 14h16M8 16v-4m4 4V8m4 8v-7",
  link: "M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1",
  alert:
    "M12 9v4m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z",
  arrowRight: "M13 7l5 5m0 0l-5 5m5-5H6",
  refresh:
    "M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15",
};

const Icon = ({ name, className = "h-5 w-5", strokeWidth = 1.8 }) => (
  <svg
    className={className}
    fill="none"
    stroke="currentColor"
    strokeWidth={strokeWidth}
    viewBox="0 0 24 24"
    aria-hidden="true"
  >
    <path strokeLinecap="round" strokeLinejoin="round" d={ICON_PATHS[name]} />
  </svg>
);

/* ================================================================
   Copy button
================================================================ */

const CopyButton = ({
  value,
  label = "Copy",
  className = "",
  compact = false,
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(async () => {
    if (!value) return;

    try {
      if (!navigator.clipboard?.writeText) throw new Error("unsupported");
      await navigator.clipboard.writeText(value);
    } catch {
      const el = document.createElement("textarea");
      el.value = value;
      el.setAttribute("readonly", "");
      el.style.position = "fixed";
      el.style.opacity = "0";
      document.body.appendChild(el);
      el.select();
      try {
        document.execCommand("copy");
      } catch {
        /* noop */
      }
      document.body.removeChild(el);
    }

    setCopied(true);
  }, [value]);

  useEffect(() => {
    if (!copied) return undefined;
    const timer = setTimeout(() => setCopied(false), 1800);
    return () => clearTimeout(timer);
  }, [copied]);

  return (
    <button
      type="button"
      onClick={handleCopy}
      aria-label={copied ? "Copied to clipboard" : `Copy ${label}`}
      className={`inline-flex shrink-0 items-center gap-2 rounded-lg border-2 px-3 py-2 text-sm font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400/60 focus-visible:ring-offset-2 focus-visible:ring-offset-[#060A16] ${
        copied
          ? "border-emerald-400/50 bg-emerald-400/15 text-emerald-200"
          : "border-cyan-400/30 bg-cyan-400/[0.06] text-cyan-100 hover:border-cyan-400/60 hover:bg-cyan-400/[0.14] hover:text-white"
      } ${className}`}
    >
      <Icon
        name={copied ? "check" : "copy"}
        className="h-4 w-4"
        strokeWidth={2}
      />
      {!compact && <span>{copied ? "Copied" : label}</span>}
    </button>
  );
};

/* ================================================================
   Detail card
================================================================ */

const DetailCard = ({ icon, label, value, mono = false, copyable = false }) => (
  <div className="group relative flex items-start gap-3 rounded-2xl border-2 border-cyan-400/20 bg-white/[0.03] p-4 transition-colors duration-200 hover:border-emerald-400/50 hover:bg-white/[0.055] sm:p-5">
    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border-2 border-cyan-400/25 bg-cyan-400/[0.08] text-cyan-300 transition-colors group-hover:border-emerald-400/50 group-hover:text-emerald-300">
      <Icon name={icon} className="h-5 w-5" />
    </span>

    <div className="min-w-0 flex-1">
      <p className="text-xs font-bold uppercase tracking-[0.14em] text-cyan-300">
        {label}
      </p>
      <p
        className={`mt-2 break-words ${
          mono
            ? "font-mono text-sm leading-6 text-white"
            : "text-base font-semibold leading-6 text-white"
        }`}
      >
        {value}
      </p>
    </div>

    {copyable && value && value !== "—" && (
      <CopyButton value={value} label={label} compact />
    )}
  </div>
);

/* ================================================================
   Summary row
================================================================ */

const SummaryRow = ({ label, value, valueClass = "text-white" }) => (
  <div className="flex items-center justify-between gap-4 py-3">
    <span className="text-sm font-medium text-cyan-200">{label}</span>
    <span className={`text-right text-sm font-bold ${valueClass}`}>
      {value}
    </span>
  </div>
);

/* ================================================================
   Score ring
================================================================ */

const ScoreRing = ({ percent }) => {
  const radius = 42;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference * (1 - percent / 100);

  return (
    <div className="relative h-[112px] w-[112px] shrink-0">
      <svg viewBox="0 0 100 100" className="h-full w-full -rotate-90">
        <circle
          cx="50"
          cy="50"
          r={radius}
          fill="none"
          strokeWidth="8"
          className="stroke-cyan-400/15"
        />
        <circle
          cx="50"
          cy="50"
          r={radius}
          fill="none"
          strokeWidth="8"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className="stroke-emerald-400 transition-[stroke-dashoffset] duration-1000 ease-out"
        />
      </svg>

      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-2xl font-bold tracking-tight text-white">
          {percent}%
        </span>
        <span className="text-[11px] font-bold uppercase tracking-[0.14em] text-cyan-300">
          Score
        </span>
      </div>
    </div>
  );
};

/* ================================================================
   Main component
================================================================ */

const VerifyCertificate = () => {
  const { certificateId } = useParams();

  const [certificate, setCertificate] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  // const [verifiedAt] = useState(() => new Date());

  useEffect(() => {
    if (!certificateId) {
      setLoading(false);
      setError("No certificate ID was provided in this link.");
      return undefined;
    }

    let cancelled = false;

    const verifyCertificate = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await api.get(`/certificate/verify/${certificateId}`);

        if (cancelled) return;

        if (response.data?.success) {
          setCertificate(response.data.data);
        } else {
          setError(
            response.data?.message || "Certificate could not be verified.",
          );
        }
      } catch (err) {
        if (cancelled) return;
        setError(
          err.response?.data?.message || "Certificate could not be verified.",
        );
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    verifyCertificate();

    return () => {
      cancelled = true;
    };
  }, [certificateId]);

  /* ------------------------------------------------------------
     Derived data (must run before any early return)
  ------------------------------------------------------------ */
  const details = useMemo(() => {
    if (!certificate) return null;

    const issueDate = certificate.issueDate
      ? new Date(certificate.issueDate).toLocaleDateString("en-IN", {
          day: "2-digit",
          month: "long",
          year: "numeric",
        })
      : "—";

    const courseName =
      certificate.courseName ||
      certificate.program?.name ||
      certificate.programName ||
      "—";

    const rawScore = certificate.score;
    const hasScore =
      rawScore !== undefined &&
      rawScore !== null &&
      !Number.isNaN(Number(rawScore));

    const scorePercent = hasScore
      ? Math.max(0, Math.min(100, Math.round(Number(rawScore) * 10)))
      : null;

    const verifyUrl = certificate.certificateId
      ? `https://skilium.in/verify-certificate/${certificate.certificateId}`
      : "";

    return { issueDate, courseName, hasScore, scorePercent, verifyUrl };
  }, [certificate]);

  // const verifiedOnLabel = useMemo(
  //   () =>
  //     verifiedAt.toLocaleString("en-IN", {
  //       day: "2-digit",
  //       month: "short",
  //       year: "numeric",
  //       hour: "2-digit",
  //       minute: "2-digit",
  //     }),
  //   [verifiedAt]
  // );

  /* ------------------------------------------------------------
     Loading
  ------------------------------------------------------------ */
  if (loading) {
    return (
      <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#060A16] px-4">
        <div className="pointer-events-none absolute left-1/2 top-1/2 h-[420px] w-[420px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-cyan-500/10 blur-[130px]" />

        <div
          className="relative flex flex-col items-center text-center"
          role="status"
          aria-live="polite"
        >
          <div className="relative flex h-24 w-24 items-center justify-center">
            <svg
              className="absolute inset-0 h-24 w-24 -rotate-90 animate-spin"
              viewBox="0 0 96 96"
              fill="none"
              aria-hidden="true"
            >
              <circle
                cx="48"
                cy="48"
                r="46"
                stroke="currentColor"
                strokeWidth="2"
                className="text-cyan-400/20"
              />
              <circle
                cx="48"
                cy="48"
                r="46"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeDasharray="289"
                strokeDashoffset="216"
                className="text-cyan-400"
              />
            </svg>

            <span className="flex h-14 w-14 items-center justify-center rounded-full border-2 border-cyan-400/40 bg-cyan-400/[0.1]">
              <Icon name="shield" className="h-6 w-6 text-cyan-300" />
            </span>
          </div>

          <p className="mt-6 text-lg font-semibold text-white">
            Verifying certificate
          </p>

          <p className="mt-2 max-w-sm text-sm leading-6 text-cyan-100">
            Checking this certificate against the Skilium registry. This only
            takes a moment.
          </p>

          <div className="mt-6 w-56 space-y-2" aria-hidden="true">
            <div className="h-2 animate-pulse rounded-full bg-cyan-400/15" />
            <div className="mx-auto h-2 w-2/3 animate-pulse rounded-full bg-emerald-400/15" />
          </div>
        </div>
      </div>
    );
  }

  /* ------------------------------------------------------------
     Error
  ------------------------------------------------------------ */
  if (error || !certificate) {
    return (
      <div className="relative min-h-screen overflow-x-hidden bg-[#060A16] px-4 py-10 text-white sm:px-6">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 overflow-hidden"
        >
          <div className="absolute -left-40 -top-40 h-[450px] w-[450px] rounded-full bg-red-500/[0.08] blur-[130px]" />
          <div className="absolute -bottom-40 -right-40 h-[450px] w-[450px] rounded-full bg-cyan-500/[0.08] blur-[130px]" />
        </div>

        <div className="relative mx-auto flex min-h-[85vh] max-w-lg items-center justify-center">
          <div className="w-full overflow-hidden rounded-3xl border-2 border-cyan-400/25 bg-[#0B1122] shadow-2xl">
            <div className="h-1.5 w-full bg-gradient-to-r from-cyan-400 via-emerald-400 to-cyan-400" />

            <div className="p-7 text-center sm:p-10">
              <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full border-2 border-red-400/40 bg-red-500/[0.12]">
                <div className="flex h-12 w-12 items-center justify-center rounded-full border-2 border-red-400/50">
                  <Icon name="alert" className="h-6 w-6 text-red-300" />
                </div>
              </div>

              <p className="mt-6 text-sm font-bold uppercase tracking-[0.2em] text-red-300">
                Verification failed
              </p>

              <h1 className="mt-2 text-3xl font-bold tracking-tight text-white sm:text-4xl">
                Certificate not verified
              </h1>

              <p
                className="mx-auto mt-4 max-w-md text-base leading-7 text-cyan-100"
                role="alert"
              >
                {error ||
                  "We could not find a valid certificate matching the provided certificate ID."}
              </p>

              {certificateId && (
                <div className="mt-7 rounded-2xl border-2 border-cyan-400/25 bg-[#070C19] p-4 text-left">
                  <p className="text-xs font-bold uppercase tracking-[0.16em] text-cyan-300">
                    Certificate ID
                  </p>
                  <p className="mt-2 break-all font-mono text-base font-medium text-white">
                    {certificateId}
                  </p>
                </div>
              )}

              <div className="mt-7 flex flex-col items-stretch justify-center gap-3 sm:flex-row sm:items-center">
                <button
                  type="button"
                  onClick={() => window.location.reload()}
                  className="inline-flex items-center justify-center gap-2 rounded-xl border-2 border-cyan-400/35 bg-cyan-400/[0.07] px-5 py-3 text-base font-semibold text-cyan-100 transition hover:border-cyan-400/70 hover:bg-cyan-400/[0.15] hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400/60 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0B1122]"
                >
                  <Icon name="refresh" className="h-5 w-5" />
                  Try again
                </button>

                <Link
                  to="/"
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-cyan-400 px-6 py-3 text-base font-bold text-[#06101B] shadow-lg shadow-cyan-400/20 transition hover:bg-cyan-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400/60 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0B1122]"
                >
                  Go to Skilium
                  <Icon
                    name="arrowRight"
                    className="h-5 w-5"
                    strokeWidth={2.2}
                  />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  /* ------------------------------------------------------------
     Verified
  ------------------------------------------------------------ */
  return (
    <div className="relative min-h-screen overflow-x-hidden bg-[#060A16] text-white">
      {/* Background decoration */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 overflow-hidden"
      >
        <div className="absolute left-1/2 top-[-220px] h-[520px] w-[820px] -translate-x-1/2 rounded-full bg-cyan-500/[0.1] blur-[150px]" />
        <div className="absolute -left-40 bottom-[-220px] h-[460px] w-[460px] rounded-full bg-emerald-500/[0.07] blur-[140px]" />
        <div className="absolute -right-40 top-1/3 h-[420px] w-[420px] rounded-full bg-cyan-500/[0.07] blur-[140px]" />
      </div>

      <div className="relative mx-auto w-full max-w-6xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
        {/* ======================================================
            Top bar
        ====================================================== */}
        <header className="flex flex-wrap items-center justify-between gap-4">
          <Link
            to="/"
            className="group inline-flex items-center rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400/60 focus-visible:ring-offset-2 focus-visible:ring-offset-[#060A16]"
          >
            <img
              src="/assets/skilium-logo-without-bg-DARK.png"
              alt="Skilium"
              className="h-10 w-auto transition-opacity group-hover:opacity-80"
            />
          </Link>

          <div className="inline-flex items-center gap-2.5 rounded-full border-2 border-emerald-400/35 bg-emerald-400/[0.08] px-4 py-2 backdrop-blur">
            <span className="relative flex h-2.5 w-2.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400/60" />
              <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-400" />
            </span>
            <span className="text-sm font-semibold text-emerald-100">
              Official Verification Portal
            </span>
          </div>
        </header>

        <main className="mt-6 lg:mt-8">
          {/* ====================================================
              Hero — verified certificate
          ==================================================== */}
          <section className="relative overflow-hidden rounded-3xl border-2 border-emerald-400/30 bg-[#0A1020]/95 shadow-[0_25px_80px_rgba(0,0,0,0.4)] backdrop-blur-xl">
            <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-cyan-400/40 via-emerald-400 to-cyan-400/40" />

            <div
              aria-hidden="true"
              className="pointer-events-none absolute -right-24 -top-24 h-64 w-64 rounded-full bg-emerald-500/[0.12] blur-[90px]"
            />

            <div className="relative p-6 sm:p-8">
              <div className="flex items-start gap-4 sm:gap-5">
                <div className="relative flex h-14 w-14 shrink-0 items-center justify-center sm:h-16 sm:w-16">
                  <span className="absolute inset-0 rounded-2xl bg-emerald-400/20 blur-lg" />
                  <span className="relative flex h-full w-full items-center justify-center rounded-2xl border-2 border-emerald-400/50 bg-emerald-400/[0.14]">
                    <Icon
                      name="check"
                      className="h-7 w-7 text-emerald-300 sm:h-8 sm:w-8"
                      strokeWidth={2.4}
                    />
                  </span>
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
                    <span className="inline-flex items-center gap-2 rounded-full border-2 border-emerald-400/45 bg-emerald-400/[0.14] px-3 py-1.5 text-xs font-bold uppercase tracking-[0.14em] text-emerald-200">
                      <span className="h-2 w-2 rounded-full bg-emerald-400" />
                      Verified
                    </span>
                    <span className="text-xs font-bold uppercase tracking-[0.14em] text-cyan-300">
                      Skilium Certificate Registry
                    </span>
                  </div>

                  <h1 className="mt-3 break-words text-3xl font-bold tracking-tight text-white sm:text-4xl sm:leading-tight">
                    {certificate.studentName || "Certificate holder"}
                  </h1>

                  <p className="mt-3 text-base leading-7 text-cyan-100">
                    Certificate issued for{" "}
                    <span className="font-semibold text-white">
                      {details.courseName}
                    </span>
                  </p>
                </div>
              </div>

              {/* Certificate ID strip */}
              <div className="mt-6 flex flex-col gap-3 rounded-2xl border-2 border-cyan-400/30 bg-[#070C19] p-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="min-w-0">
                  <p className="text-xs font-bold uppercase tracking-[0.16em] text-cyan-300">
                    Certificate ID
                  </p>
                  <p className="mt-2 break-all font-mono text-base font-medium text-white sm:text-lg">
                    {certificate.certificateId || "—"}
                  </p>
                </div>

                {certificate.certificateId && (
                  <CopyButton
                    value={certificate.certificateId}
                    label="Copy ID"
                    className="self-start sm:self-auto"
                  />
                )}
              </div>
            </div>
          </section>

          {/* ====================================================
              Two column body
          ==================================================== */}
          <div className="mt-5 grid gap-5 lg:grid-cols-[minmax(0,1fr)_360px] lg:items-start">
            {/* ---------------- Left column ---------------- */}
            <div className="space-y-5">
              <section className="rounded-3xl border-2 border-cyan-400/25 bg-[#0A1020]/85 p-5 backdrop-blur sm:p-6">
                <div className="mb-5 flex items-center gap-2.5">
                  <Icon name="document" className="h-5 w-5 text-cyan-300" />
                  <h2 className="text-lg font-bold text-white">
                    Certificate details
                  </h2>
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  <DetailCard
                    icon="book"
                    label="Program / Course"
                    value={details.courseName}
                  />

                  {/* <DetailCard
                    icon="calendar"
                    label="Date of Issue"
                    value={details.issueDate}
                  /> */}

                  {/* <DetailCard
                    icon="document"
                    label="Document Identifier"
                    value={certificate.documentIdentifier || "—"}
                    mono
                    copyable
                  /> */}

                  <DetailCard
                    icon="user"
                    label="Candidate TID"
                    value={certificate.tid || "—"}
                    mono
                    copyable
                  />
                </div>
              </section>

              {/* Trust note */}
              <section className="flex items-start gap-4 rounded-2xl border-2 border-emerald-400/30 bg-emerald-400/[0.05] p-5">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border-2 border-emerald-400/40 bg-emerald-400/[0.1]">
                  <Icon name="shield" className="h-5 w-5 text-emerald-300" />
                </span>

                <div>
                  <p className="text-base font-bold text-white">
                    Verified certificate record
                  </p>
                  <p className="mt-2 text-sm leading-6 text-emerald-100">
                    The information displayed above matches a certificate
                    officially issued through Skilium.
                  </p>
                </div>
              </section>

              {/* CTA */}
              <Link
                to="/"
                className="group flex w-full items-center justify-center gap-2 rounded-2xl bg-cyan-400 px-5 py-4 text-base font-bold text-[#06101B] shadow-lg shadow-cyan-400/20 transition hover:bg-cyan-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400/60 focus-visible:ring-offset-2 focus-visible:ring-offset-[#060A16]"
              >
                Visit Skilium
                <Icon
                  name="arrowRight"
                  className="h-5 w-5 transition-transform group-hover:translate-x-0.5"
                  strokeWidth={2.2}
                />
              </Link>
            </div>

            {/* ---------------- Right column ---------------- */}
            <aside className="space-y-5 lg:sticky lg:top-8">
              {/* Verification summary */}
              <section className="overflow-hidden rounded-3xl border-2 border-cyan-400/25 bg-[#0A1020]/85 backdrop-blur">
                <div className="border-b-2 border-cyan-400/20 px-5 py-4">
                  <div className="flex items-center gap-2.5">
                    <Icon name="shield" className="h-5 w-5 text-cyan-300" />
                    <h2 className="text-lg font-bold text-white">
                      Verification summary
                    </h2>
                  </div>
                </div>

                <div className="divide-y divide-cyan-400/15 px-5">
                  <SummaryRow
                    label="Status"
                    value={
                      <span className="inline-flex items-center gap-2">
                        <span className="h-2 w-2 rounded-full bg-emerald-400" />
                        <span className="text-emerald-300">
                          {certificate.status || "Authentic"}
                        </span>
                      </span>
                    }
                  />
                  <SummaryRow label="Issuer" value="Skilium" />
                  <SummaryRow label="Issue Date" value={details.issueDate} />
                  {/* <SummaryRow
                    label="Verified on"
                    value={verifiedOnLabel}
                  /> */}
                </div>

                {details.verifyUrl && (
                  <div className="border-t-2 border-cyan-400/20 px-5 py-4">
                    <div className="flex items-center gap-2">
                      <Icon name="link" className="h-4 w-4 text-cyan-300" />
                      <p className="text-xs font-bold uppercase tracking-[0.14em] text-cyan-300">
                        Verification link
                      </p>
                    </div>

                    <p className="mt-2 break-all font-mono text-sm leading-6 text-cyan-100">
                      {details.verifyUrl}
                    </p>

                    <CopyButton
                      value={details.verifyUrl}
                      label="Copy link"
                      className="mt-3 w-full justify-center"
                    />
                  </div>
                )}
              </section>

              {/* Score */}
              {details.hasScore && (
                <section className="rounded-3xl border-2 border-emerald-400/30 bg-[#0A1020]/85 p-5 backdrop-blur">
                  <div className="mb-5 flex items-center gap-2.5">
                    <Icon name="chart" className="h-5 w-5 text-emerald-300" />
                    <h2 className="text-lg font-bold text-white">
                      Assessment score
                    </h2>
                  </div>

                  <div className="flex items-center gap-5">
                    <ScoreRing percent={details.scorePercent} />

                    <div className="min-w-0">
                      <p className="text-base font-bold text-white">
                        {details.scorePercent >= 50 ? "Passed" : "Completed"}
                      </p>
                      <p className="mt-2 text-sm leading-6 text-emerald-100">
                        Final assessment result recorded at the time of
                        issuance.
                      </p>
                    </div>
                  </div>
                </section>
              )}
            </aside>
          </div>
        </main>

        {/* ======================================================
            Page footer
        ====================================================== */}
        <footer className="mx-auto mt-8 max-w-2xl pb-4 text-center">
          <p className="text-sm leading-6 text-cyan-200">
            Skilium is not able to verify certificates that have been altered,
            revoked, or issued outside of its registry.
          </p>
        </footer>
      </div>
    </div>
  );
};

export default VerifyCertificate;
