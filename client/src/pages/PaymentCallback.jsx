import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Loader2, XCircle } from "lucide-react";
import api from "../services/api";
import { trackMetaEvent } from "../utils/metaPixel";
import ResultCard from "../components/assessment/ResultCard.jsx";
import Layout from "../components/layout/Layout.jsx";

export default function PaymentCallback() {
  const [params] = useSearchParams();
  const navigate = useNavigate();

  // view.mode: "verifying" | "failed" | "certificate"
  const [view, setView] = useState({ mode: "verifying" });

  useEffect(() => {
    (async () => {
      const status = params.get("status");
      const paymentId = params.get("paymentId");

      // ---- Hard failures from Indiaactive ----
      if (status === "failed") {
        setView({
          mode: "failed",
          error: params.get("reason") || "Payment failed.",
        });
        return;
      }

      if (status === "unknown") {
        // Callback to MERN failed, but hash was verified on Indiaactive.
        // Give the user a "processing" message rather than "failed".
        setView({
          mode: "failed",
          error:
            "Payment succeeded, but we could not confirm it yet. " +
            "Your certificate will be emailed shortly. If you do not receive it in 10 minutes, contact support.",
        });
        return;
      }

      if (status !== "success" || !paymentId) {
        setView({ mode: "failed", error: "Missing payment details." });
        return;
      }

      // ---- Fetch full details from MERN ----
      let ctx = null;
      try {
        ctx = JSON.parse(sessionStorage.getItem("pendingPurchase") || "null");
      } catch {}

      try {
        const res = await api.get(`/payments/${paymentId}`);

        if (!res.data?.success) {
          throw new Error(res.data?.message || "Could not load payment.");
        }

        const { payment, certificate } = res.data.data;

        if (!certificate) {
          throw new Error(
            "Payment recorded, but certificate is still being generated. " +
            "Please refresh in a minute.",
          );
        }

        // Fire Purchase pixel (dedup with CAPI via eventId)
        if (ctx) {
          trackMetaEvent(
            "Purchase",
            {
              content_name: payment.program?.name,
              content_ids: [String(payment.program?._id)],
              content_type: "product",
              value: payment.amount,
              currency: payment.currency || "INR",
            },
            ctx.eventId,
          );
        }
        sessionStorage.removeItem("pendingPurchase");

        setView({
          mode: "certificate",
          certificate,
          program: payment.program,
          courseId: payment.program?._id,
          assessmentId: payment.assessment?._id,
        });
      } catch (err) {
        setView({
          mode: "failed",
          error:
            err.response?.data?.message ||
            err.message ||
            "Could not load your certificate.",
        });
      }
    })();
  }, []);

  // ── Certificate view ────────────────────────────────────────
  if (view.mode === "certificate") {
    return (
      <Layout>
        <div className="min-h-screen bg-slate-950 px-4 py-8">
          <ResultCard
            result={{
              certificate: view.certificate,
              assessmentId: view.assessmentId,
            }}
            program={view.program}
            courseId={view.courseId}
          />
        </div>
      </Layout>
    );
  }

  // ── Loading / failed views ──────────────────────────────────
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 text-white p-6">
      <div className="w-full max-w-md rounded-2xl border border-white/10 bg-white/5 p-6 text-center">
        {view.mode === "verifying" && (
          <>
            <Loader2 className="mx-auto mb-4 h-10 w-10 animate-spin text-cyan-400" />
            <h2 className="text-lg font-bold">Loading your certificate…</h2>
            <p className="mt-1 text-sm text-gray-400">
              Please do not close this window.
            </p>
          </>
        )}
        {view.mode === "failed" && (
          <>
            <XCircle className="mx-auto mb-4 h-10 w-10 text-rose-400" />
            <h2 className="text-lg font-bold">Something went wrong</h2>
            <p className="mt-1 text-sm text-gray-400">{view.error}</p>
            <button
              onClick={() => navigate("/", { replace: true })}
              className="mt-4 rounded-lg bg-cyan-500 px-4 py-2 text-sm font-semibold text-slate-950"
            >
              Back to home
            </button>
          </>
        )}
      </div>
    </div>
  );
}