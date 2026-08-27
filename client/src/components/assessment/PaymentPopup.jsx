import { useEffect, useState } from "react";
import {
  X,
  Zap,
  ShieldCheck,
  Smartphone,
  CreditCard,
  CheckCircle,
  Loader2,
  Lock,
} from "lucide-react";
import api from "../../services/api";

const PaymentPopup = ({
  assessmentId,
  programId,
  programName,
  onClose,
  onCertificateGenerated,
}) => {
  // Auto pre-fill from logged in user if available
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
    return {
      name: "",
      email: "",
      mobile: "",
    };
  });

  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Load Razorpay Checkout script
  useEffect(() => {
    if (document.getElementById("razorpay-checkout-script")) {
      return;
    }

    const script = document.createElement("script");
    script.id = "razorpay-checkout-script";
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    document.body.appendChild(script);
  }, []);

  // Prevent background scrolling on mobile when modal is open
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, []);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (error) {
      setError("");
    }
  };

  // Start payment
  const handlePayment = async () => {
    try {
      setError("");

      // Validation
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

      setLoading(true);

      // Create Razorpay Order
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

      // Check Razorpay is loaded
      if (!window.Razorpay) {
        setLoading(false);
        setError("Razorpay checkout is still initializing. Please tap again.");
        return;
      }

      setLoading(false);

      // Razorpay Options
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
        notes: {
          programId,
          assessmentId,
        },
        theme: {
          color: "#06B6D4",
        },
        modal: {
          confirm_close: true,
          escape: true,
          backdropclose: false,
          ondismiss: () => {
            setLoading(false);
          },
        },

        // Payment successful callback
        handler: async (razorpayResponse) => {
          try {
            setLoading(true);
            setError("");

            // Verify payment on backend
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

            const generatedCertificate = verifyResponse.data?.data?.certificate;

            if (!generatedCertificate) {
              throw new Error(
                "Payment was successful, but certificate details could not be retrieved.",
              );
            }

            if (onCertificateGenerated) {
              onCertificateGenerated(generatedCertificate);
            }

            setLoading(false);
            if (onClose) {
              onClose();
            }
          } catch (err) {
            console.error("Payment verification error:", err);
            setLoading(false);
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
        setLoading(false);
        setError(
          res?.error?.description ||
            "Payment was not completed. Please try again.",
        );
      });

      razorpay.open();
    } catch (err) {
      console.error("Payment error:", err);
      setLoading(false);
      setError(
        err.response?.data?.message ||
          err.message ||
          "Unable to start payment checkout.",
      );
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center bg-black/80 backdrop-blur-sm p-0 sm:p-4 overflow-y-auto animate-fadeIn">
      {/* Backdrop tap to close */}
      <div className="fixed inset-0" onClick={!loading ? onClose : undefined} />

      {/* Modal / Bottom Sheet Box */}
      <div className="relative z-10 w-full sm:max-w-lg rounded-t-3xl sm:rounded-3xl border border-cyan-400/30 bg-gradient-to-b from-slate-900 via-slate-950 to-[#070B1A] p-5 sm:p-7 shadow-[0_0_60px_rgba(6,182,212,0.25)] max-h-[92vh] flex flex-col justify-between animate-slideUp sm:animate-scaleIn">
        {/* Mobile Swipe / Pull Handle */}
        <div className="mx-auto mb-3 h-1.5 w-12 rounded-full bg-white/20 sm:hidden" />

        {/* Header */}
        <div className="flex items-start justify-between gap-3 border-b border-white/10 pb-4">
          <div>
            <div className="inline-flex items-center gap-1.5 rounded-full border border-cyan-400/30 bg-cyan-400/10 px-2.5 py-0.5 text-xs font-semibold text-cyan-300 mb-1.5">
              <Zap size={13} className="fill-cyan-300" />
              <span>Fast 1-Tap Checkout</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-white leading-tight">
              Unlock Your Verified Certificate
            </h2>
            <p className="text-xs sm:text-sm text-gray-300 mt-1">
              For{" "}
              <span className="text-cyan-300 font-semibold">
                {programName || "Technical Assessment"}
              </span>
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="rounded-full bg-white/5 p-2 text-gray-400 hover:bg-white/10 hover:text-white transition cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {/* Quick Payment Apps Banner (Mobile Friendly) */}
        <div className="mt-4 rounded-2xl border border-emerald-500/20 bg-emerald-500/10 p-3 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Smartphone className="h-5 w-5 text-emerald-400 shrink-0" />
            <div>
              <span className="block text-xs font-bold text-emerald-300">
                Instant UPI & Card Payment
              </span>
              <span className="block text-[11px] text-gray-300">
                GPay, PhonePe, Paytm, BHIM, Cards & NetBanking
              </span>
            </div>
          </div>
          <span className="shrink-0 rounded-md bg-emerald-500/20 px-2 py-0.5 text-[10px] font-bold text-emerald-300">
            ⚡ INSTANT
          </span>
        </div>

        {/* Form Fields */}
        <div className="mt-4 space-y-3.5 overflow-y-auto pr-1">
          {/* Full Name */}
          <div>
            <label className="mb-1 block text-xs font-medium text-gray-300">
              Full Name (printed on certificate){" "}
              <span className="text-cyan-400">*</span>
            </label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="e.g. Rahul Sharma"
              autoComplete="name"
              className="w-full rounded-xl border border-white/15 bg-white/5 px-3.5 py-3 text-sm text-white outline-none placeholder:text-gray-500 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 transition"
            />
          </div>

          {/* Email */}
          <div>
            <label className="mb-1 block text-xs font-medium text-gray-300">
              Email Address (for certificate delivery){" "}
              <span className="text-cyan-400">*</span>
            </label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="rahul@example.com"
              autoComplete="email"
              inputMode="email"
              className="w-full rounded-xl border border-white/15 bg-white/5 px-3.5 py-3 text-sm text-white outline-none placeholder:text-gray-500 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 transition"
            />
          </div>

          {/* Mobile */}
          <div>
            <label className="mb-1 block text-xs font-medium text-gray-300">
              Mobile Number (10 digits) <span className="text-cyan-400">*</span>
            </label>
            <div className="relative flex items-center">
              <span className="absolute left-3.5 text-xs font-semibold text-gray-400 select-none">
                +91
              </span>
              <input
                type="tel"
                name="mobile"
                value={form.mobile}
                onChange={handleChange}
                maxLength={10}
                placeholder="9876543210"
                autoComplete="tel"
                inputMode="numeric"
                className="w-full rounded-xl border border-white/15 bg-white/5 py-3 pl-12 pr-3.5 text-sm text-white outline-none placeholder:text-gray-500 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 transition"
              />
            </div>
          </div>

          {/* Error Banner */}
          {error && (
            <div className="rounded-xl border border-rose-500/30 bg-rose-500/10 px-3.5 py-2.5 text-xs text-rose-300">
              {error}
            </div>
          )}
        </div>

        {/* Pricing Breakdown & Action Button */}

        <div className="mt-5 border-t border-white/10 pt-4 space-y-3">
          {/* Terms & Conditions */}
          <div className="flex items-start gap-2.5 pt-1">
            <input
              type="checkbox"
              id="termsAgreement"
              checked={agreedToTerms}
              onChange={(e) => {
                setAgreedToTerms(e.target.checked);

                if (e.target.checked && error) {
                  setError("");
                }
              }}
              disabled={loading}
              className="mt-0.5 h-4 w-4 shrink-0 cursor-pointer accent-cyan-400"
            />

            <label
              htmlFor="termsAgreement"
              className="text-[11px] sm:text-xs leading-5 text-gray-400 cursor-pointer"
            >
              I agree to the{" "}
              <a
                href="/terms-and-conditions"
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-cyan-400 hover:text-cyan-300 underline"
              >
                Terms & Conditions
              </a>{" "}
              and{" "}
              <a
                href="/privacy-policy"
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-cyan-400 hover:text-cyan-300 underline"
              >
                Privacy Policy
              </a>
            </label>
          </div>

          <div className="flex items-center justify-between text-xs">
            <span className="text-gray-400">Total Certification Amount:</span>
            <div className="flex items-baseline gap-2">
              <span className="text-gray-500 line-through">₹999</span>
              <span className="text-lg font-black text-white">₹249</span>
              <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded">
                75% OFF
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={handlePayment}
            disabled={loading}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-cyan-400 to-emerald-400 py-3.5 text-sm sm:text-base font-bold text-slate-950 transition-all hover:scale-[1.02] hover:shadow-[0_0_25px_rgba(0,255,255,0.4)] disabled:opacity-50 cursor-pointer shadow-lg shadow-cyan-500/20"
          >
            {loading ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                <span>Opening Payment Gateway...</span>
              </>
            ) : (
              <>
                <Zap size={18} className="fill-slate-950" />
                <span>Pay ₹249 & Get Instant Certificate</span>
              </>
            )}
          </button>

          <div className="flex items-center justify-center gap-3 text-[11px] text-gray-400 pt-1">
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
