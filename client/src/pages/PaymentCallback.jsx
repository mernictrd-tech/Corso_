import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Loader2, CheckCircle2, XCircle } from "lucide-react";
import api from "../services/api";
import { trackMetaEvent } from "../utils/metaPixel";
import ResultCard from "../components/assessment/ResultCard.jsx"; // ← adjust path
import Layout from "../components/layout/Layout.jsx";

export default function PaymentCallback() {
  const [params] = useSearchParams();
  const navigate = useNavigate();

  // view.mode: "verifying" | "success" | "failed" | "certificate"
  const [view, setView] = useState({ mode: "verifying" });

  useEffect(() => {
    (async () => {
      const status = params.get("status");

      if (status === "cancelled") {
        navigate("/", { replace: true });
        return;
      }
      if (status === "failed") {
        setView({
          mode: "failed",
          error: params.get("reason") || "Payment failed.",
        });
        return;
      }

      const razorpay_payment_id = params.get("razorpay_payment_id");
      const razorpay_order_id = params.get("razorpay_order_id");
      const razorpay_signature = params.get("razorpay_signature");

      if (!razorpay_payment_id || !razorpay_order_id || !razorpay_signature) {
        setView({ mode: "failed", error: "Missing payment details." });
        return;
      }

      let ctx = null;
      try {
        ctx = JSON.parse(sessionStorage.getItem("pendingPurchase") || "null");
      } catch {}

      try {
        const res = await api.post("/payment/verify", {
          razorpay_payment_id,
          razorpay_order_id,
          razorpay_signature,
          purchaseEventId: ctx?.eventId,
          fbp: ctx?.fbp,
          fbc: ctx?.fbc,
        });

        if (!res.data?.success) {
          throw new Error(res.data?.message || "Payment verification failed.");
        }

        const certificate = res.data?.data?.certificate;
        if (!certificate) {
          throw new Error(
            "Payment succeeded, but certificate details are missing.",
          );
        }

        // Fire Purchase pixel with the same eventId that CAPI used
        if (ctx) {
          trackMetaEvent(
            "Purchase",
            {
              content_name: ctx.programName,
              content_ids: [ctx.programId],
              content_type: "product",
              value: ctx.value,
              currency: ctx.currency,
            },
            ctx.eventId,
          );
        }
        sessionStorage.removeItem("pendingPurchase");

        // 👇 switch to the certificate view; ResultCard handles the rest
        setView({
          mode: "certificate",
          certificate,
          program: ctx?.program, // passed straight through to ResultCard
          courseId: ctx?.programId,
          assessmentId: ctx?.assessmentId,
        });
      } catch (err) {
        setView({
          mode: "failed",
          error:
            err.response?.data?.message ||
            err.message ||
            "Verification failed.",
        });
      }
    })();
  }, []);

  // ── Certificate view: just render ResultCard ─────────────
  if (view.mode === "certificate") {
    return (
      <Layout>
        <div className="min-h-screen bg-slate-950 px-4 py-8">
          <ResultCard
            // ResultCard short-circuits to <CertificateCard /> whenever result.certificate is set
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

  // ── Loading / failed views (same as before) ──────────────
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 text-white p-6">
      <div className="w-full max-w-md rounded-2xl border border-white/10 bg-white/5 p-6 text-center">
        {view.mode === "verifying" && (
          <>
            <Loader2 className="mx-auto mb-4 h-10 w-10 animate-spin text-cyan-400" />
            <h2 className="text-lg font-bold">Verifying your payment…</h2>
            <p className="mt-1 text-sm text-gray-400">
              Please do not close this window.
            </p>
          </>
        )}
        {view.mode === "failed" && (
          <>
            <XCircle className="mx-auto mb-4 h-10 w-10 text-rose-400" />
            <h2 className="text-lg font-bold">Payment failed</h2>
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
