import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Loader2, CheckCircle2, XCircle } from "lucide-react";
import api from "../services/api";
import { trackMetaEvent } from "../utils/metaPixel";

export default function PaymentCallback() {
  const [params]  = useSearchParams();
  const navigate  = useNavigate();
  const [state, setState] = useState("verifying");
  const [error, setError] = useState("");

  useEffect(() => {
    (async () => {
      const status = params.get("status");

      if (status === "cancelled") { navigate("/", { replace: true }); return; }
      if (status === "failed") {
        setState("failed");
        setError(params.get("reason") || "Payment failed.");
        return;
      }

      const razorpay_payment_id = params.get("razorpay_payment_id");
      const razorpay_order_id   = params.get("razorpay_order_id");
      const razorpay_signature  = params.get("razorpay_signature");

      if (!razorpay_payment_id || !razorpay_order_id || !razorpay_signature) {
        setState("failed");
        setError("Missing payment details.");
        return;
      }

      let ctx = null;
      try { ctx = JSON.parse(sessionStorage.getItem("pendingPurchase") || "null"); } catch {}

      try {
        setState("verifying");
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

        if (ctx) {
          trackMetaEvent("Purchase", {
            content_name: ctx.programName,
            content_ids:  [ctx.programId],
            content_type: "product",
            value:        ctx.value,
            currency:     ctx.currency,
          }, ctx.eventId);
        }
        sessionStorage.removeItem("pendingPurchase");

        setState("success");
        const cert = res.data?.data?.certificate;
        setTimeout(() => {
          navigate(cert ? `/certificate/${cert.id}` : "/", { replace: true });
        }, 1500);
      } catch (err) {
        setState("failed");
        setError(err.response?.data?.message || err.message || "Verification failed.");
      }
    })();
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 text-white p-6">
      <div className="w-full max-w-md rounded-2xl border border-white/10 bg-white/5 p-6 text-center">
        {state === "verifying" && (
          <>
            <Loader2 className="mx-auto mb-4 h-10 w-10 animate-spin text-cyan-400" />
            <h2 className="text-lg font-bold">Verifying your payment…</h2>
            <p className="mt-1 text-sm text-gray-400">Please do not close this window.</p>
          </>
        )}
        {state === "success" && (
          <>
            <CheckCircle2 className="mx-auto mb-4 h-10 w-10 text-emerald-400" />
            <h2 className="text-lg font-bold">Payment successful!</h2>
            <p className="mt-1 text-sm text-gray-400">Redirecting to your certificate…</p>
          </>
        )}
        {state === "failed" && (
          <>
            <XCircle className="mx-auto mb-4 h-10 w-10 text-rose-400" />
            <h2 className="text-lg font-bold">Payment failed</h2>
            <p className="mt-1 text-sm text-gray-400">{error}</p>
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