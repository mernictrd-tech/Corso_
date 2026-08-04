import { useState } from "react";
import {
  Award,
  Eye,
  Download,
  Receipt,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

const CertificateItem = ({ certificate }) => {
  const [showInvoice, setShowInvoice] = useState(false);

  return (
    <div className="rounded-2xl border border-white/10 bg-[#1A2032] px-6 py-5 transition-all duration-300 hover:border-cyan-500">

      {/* Header */}
      <div className="flex items-start justify-between">

        {/* Left */}
        <div className="flex items-center gap-4">

          <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-cyan-500/15">
            <Award size={26} className="text-cyan-400" />
          </div>

          <div>
            <h3 className="text-[18px] font-semibold text-white">
              {certificate.title}
            </h3>

            <p className="mt-1 text-sm text-gray-400">
              {certificate.certificateId}
            </p>
          </div>

        </div>

        {/* Score */}
        <div className="text-right">

          <h2 className="text-[18px] font-bold text-cyan-400">
            {certificate.score}%
          </h2>

          <p className="text-sm text-gray-400">
            Score
          </p>

        </div>

      </div>

      {/* Divider */}

      <div className="my-4 border-t border-white/10" />

      {/* Bottom */}

      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">

        {/* Date */}

        <div>

          <p className="text-xs uppercase tracking-wide text-gray-500">
            Issued On
          </p>

          <p className="mt-1 text-base font-medium text-white">
            {certificate.issuedOn}
          </p>

        </div>

        {/* Buttons */}

        <div className="flex flex-wrap items-center gap-2">

          {/* View */}

          <button className="flex h-9 items-center gap-2 rounded-lg border border-cyan-500 px-4 text-sm font-medium text-cyan-400 transition hover:bg-cyan-500 hover:text-black">

            <Eye size={15} />

            View

          </button>

          {/* Download */}

          <button className="flex h-9 items-center gap-2 rounded-lg bg-gradient-to-r from-cyan-500 to-emerald-400 px-4 text-sm font-medium text-black transition hover:opacity-90">

            <Download size={15} />

            Download

          </button>

          {/* Invoice */}

          <button
            onClick={() => setShowInvoice(!showInvoice)}
            className="flex h-9 items-center gap-2 rounded-lg border border-emerald-500 px-4 text-sm font-medium text-emerald-400 transition hover:bg-emerald-500 hover:text-black"
          >

            Invoice

            {showInvoice ? (
              <ChevronUp size={15} />
            ) : (
              <ChevronDown size={15} />
            )}

          </button>

        </div>

      </div>

      {/* Invoice */}

      {showInvoice && (

        <div className="mt-5 rounded-xl border border-white/10 bg-[#111827] p-5">

          <div className="mb-5 flex items-center justify-between">

            <h3 className="text-lg font-semibold text-white">
              Payment Details
            </h3>

            <span className="rounded-full bg-emerald-500/20 px-3 py-1 text-xs font-semibold text-emerald-400">
              {certificate.payment.status}
            </span>

          </div>

          <div className="grid gap-4 md:grid-cols-2">

            <div>
              <p className="text-xs uppercase text-gray-500">
                Amount
              </p>

              <p className="mt-1 font-semibold text-white">
                {certificate.payment.amount}
              </p>
            </div>

            <div>
              <p className="text-xs uppercase text-gray-500">
                Payment Date
              </p>

              <p className="mt-1 font-semibold text-white">
                {certificate.payment.date}
              </p>
            </div>

            <div>
              <p className="text-xs uppercase text-gray-500">
                Transaction ID
              </p>

              <p className="mt-1 text-sm font-medium text-white break-all">
                {certificate.payment.transactionId}
              </p>
            </div>

            <div>
              <p className="text-xs uppercase text-gray-500">
                Certificate
              </p>

              <p className="mt-1 font-semibold text-white">
                {certificate.title}
              </p>
            </div>

          </div>

          <button className="mt-6 w-full rounded-lg bg-gradient-to-r from-cyan-500 to-emerald-400 py-2.5 text-sm font-semibold text-black transition hover:opacity-90">

            Download Invoice

          </button>

        </div>

      )}

    </div>
  );
};

export default CertificateItem;