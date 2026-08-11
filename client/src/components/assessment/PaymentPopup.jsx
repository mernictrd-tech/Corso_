import { useEffect, useState } from "react";
import api from "../../services/api";
import CertificateCard from "./CertificateCard";

const PaymentPopup = ({
  assessmentId,
  programId,
  programName,
  onClose,
}) => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    mobile: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [certificate, setCertificate] = useState(null);

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
        setError("Please enter your full name.");
        return;
      }

      if (!form.email.trim()) {
        setError("Please enter your email.");
        return;
      }

      if (!form.mobile.trim()) {
        setError("Please enter your mobile number.");
        return;
      }

      if (!/^[0-9]{10}$/.test(form.mobile.trim())) {
        setError("Please enter a valid 10 digit mobile number.");
        return;
      }

      if (!assessmentId) {
        setError("Assessment ID is missing.");
        return;
      }

      if (!programId) {
        setError("Program ID is missing.");
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
          response.data?.message ||
            "Unable to create payment order."
        );
      }

      const order = response.data.data;

      // Check Razorpay
      if (!window.Razorpay) {
        setLoading(false);

        setError(
          "Razorpay checkout is still loading. Please try again."
        );

        return;
      }

      setLoading(false);

      // Razorpay Options
      const options = {
        key: order.key,

        amount: order.amount,

        currency: order.currency,

        name: "Corso",

        description: `Certificate - ${
          programName || "Course"
        }`,

        order_id: order.orderId,

        prefill: {
          name: form.name.trim(),
          email: form.email.trim(),
          contact: `+91${form.mobile.trim()}`,
        },

        theme: {
          color: "#00D4AA",
        },

        modal: {
          confirm_close: true,
          escape: true,
          backdropclose: false,

          ondismiss: () => {
            setLoading(false);
          },
        },

        // Payment successful
        handler: async (razorpayResponse) => {
          try {
            setLoading(true);
            setError("");

            console.log(
              "Razorpay payment response:",
              razorpayResponse
            );

            // Verify payment
            const verifyResponse = await api.post(
              "/payment/verify",
              {
                razorpay_order_id:
                  razorpayResponse.razorpay_order_id,

                razorpay_payment_id:
                  razorpayResponse.razorpay_payment_id,

                razorpay_signature:
                  razorpayResponse.razorpay_signature,

                customer: {
                  fullName: form.name.trim(),
                  email: form.email.trim(),
                  mobile: form.mobile.trim(),
                },
              }
            );

            console.log(
              "Payment verification response:",
              verifyResponse.data
            );

            if (!verifyResponse.data?.success) {
              throw new Error(
                verifyResponse.data?.message ||
                  "Payment verification failed."
              );
            }

            // Get generated certificate
            const generatedCertificate =
              verifyResponse.data?.data?.certificate;

            console.log(
              "Generated certificate:",
              generatedCertificate
            );

            if (!generatedCertificate) {
              throw new Error(
                "Payment was successful but certificate data was not received."
              );
            }

            /*
             * IMPORTANT:
             *
             * Set certificate BEFORE removing loading state.
             * This makes React directly switch from the payment
             * popup to CertificateCard.
             */
            setCertificate(generatedCertificate);

            setLoading(false);
          } catch (err) {
            console.error(
              "Payment verification error:",
              err
            );

            setLoading(false);

            setError(
              err.response?.data?.message ||
                err.message ||
                "Payment verification failed."
            );
          }
        },
      };

      // Open Razorpay
      const razorpay =
        new window.Razorpay(options);

      // Payment failed
      razorpay.on(
        "payment.failed",
        (response) => {
          console.error(
            "Razorpay payment failed:",
            response
          );

          setLoading(false);

          setError(
            response?.error?.description ||
              "Payment failed. Please try again."
          );
        }
      );

      razorpay.open();
    } catch (err) {
      console.error(
        "Payment error:",
        err
      );

      setLoading(false);

      setError(
        err.response?.data?.message ||
          err.message ||
          "Unable to start payment."
      );
    }
  };

  // =============================================================
  // CERTIFICATE SCREEN
  // =============================================================

  if (certificate) {
    return (
      <div className="fixed inset-0 z-[100] bg-[#070B1A]">
        <div className="h-full w-full overflow-y-auto">
          <CertificateCard
            certificate={certificate}
          />
        </div>
      </div>
    );
  }

  // =============================================================
  // PAYMENT POPUP
  // =============================================================

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/75 p-4">
      <div className="w-full max-w-xl rounded-3xl border border-white/10 bg-[#171717] p-7 shadow-2xl">

        {/* Header */}
        <div>
          <h2 className="text-2xl font-bold text-white">
            Enter your details
          </h2>

          <p className="mt-2 text-gray-400">
            We'll use this for your certificate and updates.
          </p>
        </div>

        {/* Full Name */}
        <div className="mt-6">
          <label className="mb-2 block text-sm text-gray-300">
            Full name
          </label>

          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Your full name"
            autoComplete="name"
            className="
              w-full
              rounded-lg
              border
              border-white/10
              bg-[#262626]
              px-4
              py-3
              text-white
              outline-none
              placeholder:text-gray-500
              focus:border-emerald-400
            "
          />
        </div>

        {/* Email */}
        <div className="mt-5">
          <label className="mb-2 block text-sm text-gray-300">
            Email
          </label>

          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            placeholder="you@example.com"
            autoComplete="email"
            className="
              w-full
              rounded-lg
              border
              border-white/10
              bg-[#262626]
              px-4
              py-3
              text-white
              outline-none
              placeholder:text-gray-500
              focus:border-emerald-400
            "
          />
        </div>

        {/* Mobile */}
        <div className="mt-5">
          <label className="mb-2 block text-sm text-gray-300">
            Mobile number
          </label>

          <input
            type="tel"
            name="mobile"
            value={form.mobile}
            onChange={handleChange}
            maxLength={10}
            placeholder="9876543210"
            autoComplete="tel"
            inputMode="numeric"
            className="
              w-full
              rounded-lg
              border
              border-white/10
              bg-[#262626]
              px-4
              py-3
              text-white
              outline-none
              placeholder:text-gray-500
              focus:border-emerald-400
            "
          />
        </div>

        {/* Error */}
        {error && (
          <div
            className="
              mt-4
              rounded-lg
              bg-red-500/10
              px-4
              py-3
              text-sm
              text-red-400
            "
          >
            {error}
          </div>
        )}

        {/* Buttons */}
        <div className="mt-6 flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="
              rounded-lg
              border
              border-white/10
              bg-transparent
              px-6
              py-3
              font-semibold
              text-white
              hover:bg-white/5
              disabled:opacity-50
            "
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={handlePayment}
            disabled={loading}
            className="
              rounded-lg
              bg-emerald-500
              px-6
              py-3
              font-semibold
              text-white
              hover:bg-emerald-600
              disabled:cursor-not-allowed
              disabled:opacity-50
            "
          >
            {loading
              ? "Processing..."
              : "Pay ₹249"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentPopup;