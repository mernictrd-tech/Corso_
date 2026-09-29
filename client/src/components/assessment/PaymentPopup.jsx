import { useEffect, useRef, useState } from "react";
import {
  X,
  Zap,
  ShieldCheck,
  Smartphone,
  Loader2,
  Lock,
  CheckCircle2,
} from "lucide-react";
import api from "../../services/api";

const PaymentPopup = ({
  assessmentId,
  programId,
  program,
  programName,
  onClose,
  onCertificateGenerated,
}) => {
  const [form, setForm] = useState(() => {
    try {
      const stored = localStorage.getItem("user");
      if (stored) {
        const u = JSON.parse(stored);
        return {
          name: u.fullName || u.name || "",
          email: u.email || "",
          mobile: u.mobile || u.phone || "",
        };
      }
    } catch {
      // ignore
    }
    return { name: "", email: "", mobile: "" };
  });

  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [error, setError] = useState("");
  const [stage, setStage] = useState("idle");

  // Refs for scroll-into-view on focus (handles keyboard overlap)
  const nameRef = useRef(null);
  const emailRef = useRef(null);
  const mobileRef = useRef(null);

  const loading =
    stage === "creating_order" ||
    stage === "verifying" ||
    stage === "generating";

  const stageCopy = {
    idle: {
      button: `Pay ₹${program.sellingPrice} & Get Instant Certificate`,
      helper: null,
    },
    creating_order: {
      button: "Opening Payment Gateway…",
      helper: "Preparing a secure checkout session.",
    },
    awaiting: {
      button: "Waiting for payment…",
      helper:
        "Complete the payment in the Razorpay window. Do not close this screen.",
    },
    verifying: {
      button: "Verifying payment…",
      helper: "Confirming your transaction with Razorpay. This takes a moment.",
    },
    generating: {
      button: "Generating your certificate…",
      helper: "Payment confirmed. Your certificate is being prepared.",
    },
  }[stage];

  useEffect(() => {
    if (document.getElementById("razorpay-checkout-script")) return;
    const script = document.createElement("script");
    script.id = "razorpay-checkout-script";
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    document.body.appendChild(script);
  }, []);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (error) setError("");
  };

  // Scroll the focused input into the center of the visible area
  // (handles the mobile keyboard covering the input)
  const scrollFieldIntoView = (ref) => {
    if (!ref?.current) return;
    // Small delay lets the keyboard finish its open animation
    setTimeout(() => {
      ref.current.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }, 300);
  };

  const handlePayment = async () => {
    if (stage !== "idle") return;

    try {
      setError("");

      if (!form.name.trim()) {
        setError(
          "Please enter your full name as it should appear on the certificate.",
        );
        return;
      }
      if (!form.email.trim()) {
        setError("Please enter a valid email for certificate delivery.");
        return;
      }
      if (!form.mobile.trim()) {
        setError("Please enter your 10-digit mobile number.");
        return;
      }
      if (!/^[0-9]{10}$/.test(form.mobile.trim())) {
        setError("Please enter a valid 10-digit mobile number.");
        return;
      }
      if (!assessmentId) {
        setError("Assessment ID is missing. Please refresh and try again.");
        return;
      }
      if (!programId) {
        setError("Program ID is missing. Please refresh and try again.");
        return;
      }
      if (!agreedToTerms) {
        setError("Please agree to the Terms & Conditions and Privacy Policy.");
        return;
      }

      setStage("creating_order");

      const response = await api.post("/payment/create-order", {
        assessmentId,
        programId,
        name: form.name.trim(),
        email: form.email.trim(),
        mobile: form.mobile.trim(),
      });

      if (!response.data?.success) {
        throw new Error(
          response.data?.message || "Unable to create payment order.",
        );
      }

      const order = response.data.data;

      if (!window.Razorpay) {
        setStage("idle");
        setError("Razorpay checkout is still initializing. Please tap again.");
        return;
      }

      setStage("awaiting");

      const options = {
        key: order.key,
        amount: order.amount,
        currency: order.currency,
        name: "Skilium Certification",
        description: `Certificate for ${programName || "Assessment"}`,
        order_id: order.orderId,
        prefill: {
          name: form.name.trim(),
          email: form.email.trim(),
          contact: `+91${form.mobile.trim()}`,
        },
        notes: { programId, assessmentId },
        theme: { color: "#06B6D4" },
        modal: {
          confirm_close: true,
          escape: true,
          backdropclose: false,
          ondismiss: () => setStage("idle"),
        },
        handler: async (razorpayResponse) => {
          try {
            setStage("verifying");
            setError("");

            const verifyResponse = await api.post("/payment/verify", {
              razorpay_order_id: razorpayResponse.razorpay_order_id,
              razorpay_payment_id: razorpayResponse.razorpay_payment_id,
              razorpay_signature: razorpayResponse.razorpay_signature,
              customer: {
                fullName: form.name.trim(),
                email: form.email.trim(),
                mobile: form.mobile.trim(),
              },
            });

            if (!verifyResponse.data?.success) {
              throw new Error(
                verifyResponse.data?.message || "Payment verification failed.",
              );
            }

            setStage("generating");

            const generatedCertificate =
              verifyResponse.data?.data?.certificate;

            if (!generatedCertificate) {
              throw new Error(
                "Payment was successful, but certificate details could not be retrieved.",
              );
            }

            if (onCertificateGenerated) {
              onCertificateGenerated(generatedCertificate);
            }

            setStage("idle");
            if (onClose) onClose();
          } catch (err) {
            console.error("Payment verification error:", err);
            setStage("idle");
            setError(
              err.response?.data?.message ||
                err.message ||
                "Payment verification failed. Please contact support.",
            );
          }
        },
      };

      const razorpay = new window.Razorpay(options);

      razorpay.on("payment.failed", (res) => {
        console.error("Razorpay payment failed:", res);
        setStage("idle");
        setError(
          res?.error?.description ||
            "Payment was not completed. Please try again.",
        );
      });

      razorpay.open();
    } catch (err) {
      console.error("Payment error:", err);
      setStage("idle");
      setError(
        err.response?.data?.message ||
          err.message ||
          "Unable to start payment checkout.",
      );
    }
  };

  const canClose = stage === "idle" || stage === "awaiting";

  return (
    <div className="fixed inset-0 z-[100] flex items-end justify-center bg-black/80 backdrop-blur-sm sm:items-center sm:p-4">
      <div
        className="fixed inset-0"
        onClick={canClose ? onClose : undefined}
      />

      <div
        className="relative z-10 flex w-full flex-col overflow-hidden rounded-t-3xl border border-cyan-400/30 bg-gradient-to-b from-slate-900 via-slate-950 to-[#070B1A] shadow-[0_0_60px_rgba(6,182,212,0.25)]
        h-[96dvh] max-h-[96dvh]
        md:max-w-[40dvw]
        sm:h-auto sm:max-h-[92vh]
        animate-slideUp sm:animate-scaleIn"
      >
        <div className="mx-auto mt-2.5 h-1.5 w-12 shrink-0 rounded-full bg-white/20 sm:hidden" />

        {/* ───── HEADER ───── */}
        <div className="shrink-0 px-5 pb-3 pt-3 sm:px-7 sm:pb-4 sm:pt-6">
          <div className="flex items-start justify-between gap-3 border-b border-white/10 pb-3 sm:pb-4">
            <div className="min-w-0 flex-1">
              <div className="mb-1.5 inline-flex items-center gap-1.5 rounded-full border border-cyan-400/30 bg-cyan-400/10 px-2.5 py-0.5 text-[11px] sm:text-xs font-semibold text-cyan-300">
                <Zap size={12} className="fill-cyan-300" />
                <span>Fast 1-Tap Checkout</span>
              </div>
              <h2 className="text-lg sm:text-2xl font-bold leading-tight text-white">
                Unlock Your Verified Certificate
              </h2>
              <p className="mt-1 text-xs sm:text-sm text-gray-300">
                For{" "}
                <span className="font-semibold text-cyan-300">
                  {programName || "Technical Assessment"}
                </span>
              </p>
            </div>

            <button
              type="button"
              onClick={onClose}
              disabled={!canClose}
              className="shrink-0 cursor-pointer rounded-full bg-white/5 p-2 text-gray-400 transition hover:bg-white/10 hover:text-white disabled:opacity-50"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* ───── SCROLLABLE BODY ───── */}
        {/* scroll-py gives breathing room for scrollIntoView on focus */}
        <div className="flex-1 min-h-0 space-y-3 overflow-y-auto overscroll-contain scroll-smooth px-5 pb-4 sm:space-y-3.5 sm:px-7 sm:pb-6">
          {/* UPI banner — hidden on mobile to save vertical space */}
          <div className="hidden items-center justify-between gap-2 rounded-2xl border border-emerald-500/20 bg-emerald-500/10 p-3 sm:flex">
            <div className="flex min-w-0 items-center gap-2">
              <Smartphone className="h-5 w-5 shrink-0 text-emerald-400" />
              <div className="min-w-0">
                <span className="block text-xs font-bold text-emerald-300">
                  Instant UPI & Card Payment
                </span>
                <span className="block truncate text-[11px] text-gray-300">
                  GPay, PhonePe, Paytm, BHIM, Cards & NetBanking
                </span>
              </div>
            </div>
            <span className="shrink-0 rounded-md bg-emerald-500/20 px-2 py-0.5 text-[10px] font-bold text-emerald-300">
              ⚡ INSTANT
            </span>
          </div>

          {/* Single-line compact banner for mobile only */}
          <div className="flex items-center justify-center gap-1.5 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1.5 text-[10px] font-medium text-emerald-300 sm:hidden">
            <Smartphone size={11} className="shrink-0" />
            <span className="truncate">
              GPay • PhonePe • Paytm • UPI • Cards
            </span>
          </div>

          {/* Full Name */}
          <div>
            <label
              htmlFor="pay-name"
              className="mb-1 block text-[11px] font-medium text-gray-300 sm:text-xs"
            >
              Full Name (printed on certificate){" "}
              <span className="text-cyan-400">*</span>
            </label>
            <input
              id="pay-name"
              ref={nameRef}
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              onFocus={() => scrollFieldIntoView(nameRef)}
              placeholder="e.g. Rahul Sharma"
              autoComplete="name"
              disabled={loading || stage === "awaiting"}
              className="w-full rounded-xl border border-white/15 bg-white/5 px-3.5 py-2.5 text-sm text-white outline-none transition placeholder:text-gray-500 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 disabled:opacity-60 sm:py-3"
            />
          </div>

          {/* Email */}
          <div>
            <label
              htmlFor="pay-email"
              className="mb-1 block text-[11px] font-medium text-gray-300 sm:text-xs"
            >
              Email (for certificate delivery){" "}
              <span className="text-cyan-400">*</span>
            </label>
            <input
              id="pay-email"
              ref={emailRef}
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              onFocus={() => scrollFieldIntoView(emailRef)}
              placeholder="rahul@example.com"
              autoComplete="email"
              inputMode="email"
              disabled={loading || stage === "awaiting"}
              className="w-full rounded-xl border border-white/15 bg-white/5 px-3.5 py-2.5 text-sm text-white outline-none transition placeholder:text-gray-500 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 disabled:opacity-60 sm:py-3"
            />
          </div>

          {/* Mobile */}
          <div>
            <label
              htmlFor="pay-mobile"
              className="mb-1 block text-[11px] font-medium text-gray-300 sm:text-xs"
            >
              Mobile Number (10 digits){" "}
              <span className="text-cyan-400">*</span>
            </label>
            <div className="relative flex items-center">
              <span className="absolute left-3.5 select-none text-xs font-semibold text-gray-400">
                +91
              </span>
              <input
                id="pay-mobile"
                ref={mobileRef}
                type="tel"
                name="mobile"
                value={form.mobile}
                onChange={handleChange}
                onFocus={() => scrollFieldIntoView(mobileRef)}
                maxLength={10}
                placeholder="9876543210"
                autoComplete="tel"
                inputMode="numeric"
                disabled={loading || stage === "awaiting"}
                className="w-full rounded-xl border border-white/15 bg-white/5 py-2.5 pl-12 pr-3.5 text-sm text-white outline-none transition placeholder:text-gray-500 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 disabled:opacity-60 sm:py-3"
              />
            </div>
          </div>

          {/* Stage helper */}
          {stageCopy.helper && !error && (
            <div className="flex items-start gap-2.5 rounded-xl border border-cyan-400/25 bg-cyan-400/[0.06] px-3.5 py-2.5 text-[11px] leading-5 text-cyan-200 sm:text-xs">
              {stage === "generating" ? (
                <CheckCircle2
                  size={14}
                  className="mt-0.5 shrink-0 text-emerald-400"
                />
              ) : (
                <Loader2
                  size={14}
                  className="mt-0.5 shrink-0 animate-spin text-cyan-300"
                />
              )}
              <span>{stageCopy.helper}</span>
            </div>
          )}

          {/* Error */}
          {error && (
            <div className="rounded-xl border border-rose-500/30 bg-rose-500/10 px-3.5 py-2.5 text-xs text-rose-300">
              {error}
            </div>
          )}
        </div>

        {/* ───── STICKY FOOTER ───── */}
        <div className="shrink-0 border-t border-white/10 bg-slate-950/95 px-5 pb-[calc(1rem+env(safe-area-inset-bottom))] pt-3 backdrop-blur sm:px-7 sm:pb-5 sm:pt-4">
          {/* Terms checkbox */}
          <label
            htmlFor="termsAgreement"
            className="mb-3 flex cursor-pointer items-start gap-2.5 rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2.5 transition hover:border-cyan-400/30 hover:bg-white/[0.05]"
          >
            <input
              type="checkbox"
              id="termsAgreement"
              checked={agreedToTerms}
              onChange={(e) => {
                setAgreedToTerms(e.target.checked);
                if (e.target.checked && error) setError("");
              }}
              disabled={loading || stage === "awaiting"}
              className="mt-0.5 h-4 w-4 shrink-0 cursor-pointer accent-cyan-400"
            />
            <span className="text-[11px] leading-5 text-gray-300 sm:text-xs">
              I agree to the{" "}
              <a
                href="/terms-and-conditions"
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="font-medium text-cyan-400 underline hover:text-cyan-300"
              >
                Terms & Conditions
              </a>{" "}
              and{" "}
              <a
                href="/privacy-policy"
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="font-medium text-cyan-400 underline hover:text-cyan-300"
              >
                Privacy Policy
              </a>
            </span>
          </label>

          {/* Total */}
          <div className="mb-3 flex items-center justify-between text-xs">
            <span className="text-gray-400">Total Certification Amount:</span>
            <div className="flex items-baseline gap-2">
              <span className="text-gray-500 line-through">
                ₹{program.originalPrice}
              </span>
              <span className="text-lg font-black text-white">
                ₹{program.sellingPrice}
              </span>
              <span className="rounded bg-emerald-500/10 px-1.5 py-0.5 text-[10px] font-bold text-emerald-400">
                {Math.round(
                  (program.sellingPrice / program.originalPrice) * 100,
                )}
                % OFF
              </span>
            </div>
          </div>

          {/* CTA */}
          <button
            type="button"
            onClick={handlePayment}
            disabled={stage !== "idle"}
            className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-cyan-400 to-emerald-400 py-3.5 text-sm font-bold text-slate-950 shadow-lg shadow-cyan-500/20 transition-all hover:scale-[1.02] hover:shadow-[0_0_25px_rgba(0,255,255,0.4)] disabled:cursor-not-allowed disabled:opacity-70 sm:text-base"
          >
            {stage === "idle" ? (
              <>
                <Zap size={18} className="shrink-0 fill-slate-950" />
                <span className="truncate">{stageCopy.button}</span>
              </>
            ) : stage === "generating" ? (
              <>
                <CheckCircle2 size={18} className="shrink-0" />
                <span className="truncate">{stageCopy.button}</span>
              </>
            ) : (
              <>
                <Loader2 size={18} className="shrink-0 animate-spin" />
                <span className="truncate">{stageCopy.button}</span>
              </>
            )}
          </button>

          {/* Trust badges */}
          <div className="mt-2.5 flex items-center justify-center gap-3 text-[10px] text-gray-400 sm:text-[11px]">
            <span className="flex items-center gap-1">
              <Lock size={12} className="text-cyan-400" />
              256-Bit SSL Encrypted
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <ShieldCheck size={12} className="text-emerald-400" />
              Powered by Razorpay
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentPopup;