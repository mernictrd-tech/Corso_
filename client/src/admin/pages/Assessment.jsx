
import { useEffect, useMemo, useState, useCallback } from "react";
import {
  Eye,
  X,
  ClipboardCheck,
  Users,
  CreditCard,
  Trophy,
  CalendarDays,
  RefreshCw,
} from "lucide-react";

import api from "../../services/api";
import toast from "react-hot-toast";

import AdminLayout from "../components/layout/AdminLayout";
import TableComponent from "../components/common/tableComponents/tableComponent";

// ---------------------------------------------
// HELPERS
// ---------------------------------------------

const initialSummary = {
  totalAssessments: 0,
  paidAssessments: 0,
  trashedStudents: 0,
  untrashedStudents: 0,
};

const dateFilters = [
  { label: "All Time", value: "all" },
  { label: "Today", value: "today" },
  { label: "Yesterday", value: "yesterday" },
  { label: "Last 7 Days", value: "week" },
  { label: "Last 30 Days", value: "month" },
];

const formatDate = (date) => {
  if (!date) return "-";

  const parsed = new Date(date);

  if (Number.isNaN(parsed.getTime())) return "-";

  return parsed.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const getPaymentBadge = (status) => {
  const normalized = status?.toLowerCase();

  const paid = normalized === "paid";
  const failed = normalized === "failed";

  return (
    <span
      className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${
        paid
          ? "bg-green-100 text-green-700"
          : failed
            ? "bg-red-100 text-red-700"
            : "bg-amber-100 text-amber-700"
      }`}
    >
      <span
        className={`mr-2 h-1.5 w-1.5 rounded-full ${
          paid
            ? "bg-green-500"
            : failed
              ? "bg-red-500"
              : "bg-amber-500"
        }`}
      />
      {normalized
        ? normalized.charAt(0).toUpperCase() + normalized.slice(1)
        : "N/A"}
    </span>
  );
};

const getResultBadge = (passed) => (
  <span
    className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${
      passed
        ? "bg-green-100 text-green-700"
        : "bg-red-100 text-red-700"
    }`}
  >
    {passed ? "Passed" : "Failed"}
  </span>
);

// ---------------------------------------------
// COMPONENT
// ---------------------------------------------

const Assessment = () => {
  const [assessments, setAssessments] = useState([]);
  const [summary, setSummary] = useState(initialSummary);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Date filter
  const [period, setPeriod] = useState("all");

  // View modal
  const [showModal, setShowModal] = useState(false);
  const [selectedAssessment, setSelectedAssessment] = useState(null);

  // Manual Payment Modal
const [showManualModal, setShowManualModal] = useState(false);
const [razorpayPaymentId, setRazorpayPaymentId] = useState("");
const [manualPaymentLoading, setManualPaymentLoading] = useState(false);

  // ---------------------------------------------
  // FETCH ASSESSMENTS
  // ---------------------------------------------

  const fetchAssessments = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get(
        `/admin/assessments?period=${period}`
      );

      if (response.data?.success) {
        setAssessments(response.data.data || []);

        setSummary({
          ...initialSummary,
          ...(response.data.summary || {}),
        });
      } else {
        setAssessments([]);
        setSummary(initialSummary);

        setError(
          response.data?.message || "Failed to load assessments."
        );
      }
    } catch (err) {
      console.error("Fetch assessments error:", err);

      setError(
        err.response?.data?.message ||
          "Failed to load assessment results."
      );

      toast.error(
        err.response?.data?.message ||
          "Failed to fetch assessments."
      );
    } finally {
      setLoading(false);
    }
  }, [period]);

  useEffect(() => {
    fetchAssessments();
  }, [fetchAssessments]);

  // ---------------------------------------------
  // DATE FILTER HANDLER
  // ---------------------------------------------

  const handlePeriodChange = (value) => {
    setPeriod(value);
  };

  // ---------------------------------------------
  // VIEW DETAILS
  // ---------------------------------------------

  const handleView = (assessment) => {
    setSelectedAssessment(assessment);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedAssessment(null);
  };

  // ---------------------------------------------
// MANUAL PAYMENT HANDLERS
// ---------------------------------------------

const handleManualPayment = (payment) => {
  setSelectedAssessment(payment);
  setRazorpayPaymentId("");
  setShowManualModal(true);
};

const closeManualModal = () => {
  setShowManualModal(false);
  setSelectedAssessment(null);
  setRazorpayPaymentId("");
};

const submitManualPayment = async (e) => {
  e.preventDefault();

  if (!razorpayPaymentId.trim()) {
    toast.error("Please enter Razorpay Payment ID.");
    return;
  }

  if (!selectedAssessment?.razorpayOrderId) {
    toast.error("Razorpay Order ID not found.");
    return;
  }

  try {
    setManualPaymentLoading(true);

    const response = await api.post(
      "/payment/manual-verify",
      {
        razorpay_order_id: selectedAssessment.razorpayOrderId,
        razorpay_payment_id: razorpayPaymentId.trim(),
      }
    );

    if (response.data?.success) {
      toast.success(response.data.message || "Payment verified successfully.");

      closeManualModal();
      await fetchAssessments();
    } else {
      toast.error(response.data?.message || "Payment verification failed.");
    }
  } catch (error) {
    console.error("Manual payment error:", error);

    toast.error(
      error.response?.data?.message || "Unable to verify manual payment."
    );
  } finally {
    setManualPaymentLoading(false);
  }
};

  // ---------------------------------------------
  // SUMMARY CARDS
  // ---------------------------------------------

  const summaryCards = [
    {
      title: "Total Assessments",
      value: summary.totalAssessments,
      icon: ClipboardCheck,
      iconClass: "bg-sky-50 text-sky-600",
      valueClass: "text-slate-800",
    },
    {
      title: "Paid Assessments",
      value: summary.paidAssessments,
      icon: CreditCard,
      iconClass: "bg-green-50 text-green-600",
      valueClass: "text-green-600",
    },
    {
      title: "Tracked Students",
      value: summary.trashedStudents,
      icon: Users,
      iconClass: "bg-amber-50 text-amber-600",
      valueClass: "text-amber-600",
    },
    {
      title: "Untracked Students",
      value: summary.untrashedStudents,
      icon: Trophy,
      iconClass: "bg-purple-50 text-purple-600",
      valueClass: "text-purple-600",
    },
  ];

  // ---------------------------------------------
  // TABLE COLUMNS
  // ---------------------------------------------

  const columns = useMemo(
    () => [
      {
        key: "fullName",
        label: "Name",
        priority: 5,
        sortable: true,
        minWidth: 180,
        render: (value, row) => (
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-sky-100 text-sm font-bold text-sky-700">
              {value?.charAt(0)?.toUpperCase() || "S"}
            </div>

            <div className="min-w-0">
              <p className="truncate font-semibold text-slate-800">
                {value || "N/A"}
              </p>
              <p className="text-xs text-slate-400">
                {row.assessmentId?.slice(-8) || ""}
              </p>
            </div>
          </div>
        ),
      },
      {
        key: "email",
        label: "Email",
        priority: 4,
        sortable: true,
        minWidth: 210,
        render: (value) => (
          <span className="text-sm text-slate-600">
            {value || "-"}
          </span>
        ),
      },
      {
        key: "phone",
        label: "Phone",
        priority: 3,
        sortable: true,
        minWidth: 130,
        render: (value) => value || "-",
      },
      {
        key: "totalQuestions",
        label: "Total Questions",
        priority: 3,
        sortable: true,
        minWidth: 130,
        render: (value) => (
          <span className="font-medium text-slate-700">
            {value ?? 0}
          </span>
        ),
      },
      {
        key: "percentage",
        label: "Score",
        priority: 5,
        sortable: true,
        minWidth: 120,
        render: (value) => {
          const percentage = Number(value) || 0;

          return (
            <div className="min-w-[90px]">
              <span className="font-bold text-slate-800">
                {percentage}%
              </span>

              <div className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
                <div
                  className={`h-full rounded-full ${
                    percentage >= 50
                      ? "bg-green-500"
                      : "bg-red-500"
                  }`}
                  style={{
                    width: `${Math.min(100, Math.max(0, percentage))}%`,
                  }}
                />
              </div>
            </div>
          );
        },
      },
      {
        key: "passed",
        label: "Result",
        priority: 4,
        sortable: true,
        minWidth: 110,
        render: (value) => getResultBadge(value),
      },
      {
        key: "amount",
        label: "Amount",
        priority: 3,
        sortable: true,
        minWidth: 120,
        render: (value) => (
          <span className="font-semibold text-slate-800">
            ₹{Number(value || 0).toLocaleString("en-IN")}
          </span>
        ),
      },
      {
        key: "paymentStatus",
        label: "Payment Status",
        priority: 4,
        sortable: true,
        minWidth: 140,
        render: (value) => getPaymentBadge(value),
      },
      {
        key: "completedAt",
        label: "Completed Date",
        priority: 2,
        sortable: true,
        minWidth: 145,
        render: (value) => formatDate(value),
      },
     {
  key: "actions",
  label: "Actions",
  priority: 1,
  minWidth: 150,
  render: (_, row) => (
    <div className="flex items-center gap-2">

      {/* VIEW DETAILS */}
      <button
        type="button"
        onClick={() => handleView(row)}
        className="rounded-lg p-2 text-sky-600 transition hover:bg-sky-50"
        title="View Assessment Details"
      >
        <Eye size={18} />
      </button>

      {/* MANUAL PAYMENT - ONLY WHEN NOT PAID */}
      {row.paymentStatus?.toLowerCase() !== "paid" && (
        <button
          type="button"
          onClick={() => handleManualPayment(row)}
          className="rounded-lg bg-emerald-50 px-3 py-2 text-xs font-semibold text-emerald-700 hover:bg-emerald-100"
          title="Manual Payment"
        >
          Manual Pay
        </button>
      )}

    </div>
  ),
},
    ],
    []
  );

  // ---------------------------------------------
  // TABLE FILTERS
  // ---------------------------------------------

  const filters = useMemo(
    () => [
      {
        key: "paymentStatus",
        label: "Payment Status",
        options: [
          { label: "Paid", value: "paid" },
          { label: "Created", value: "created" },
          { label: "Failed", value: "failed" },
        ],
      },
      {
        key: "passed",
        label: "Assessment Result",
        options: [
          { label: "Passed", value: true },
          { label: "Failed", value: false },
        ],
      },
    ],
    []
  );

  // ---------------------------------------------
  // RENDER
  // ---------------------------------------------

  return (
    <AdminLayout>
      <div className="space-y-6">

        {/* PAGE HEADING */}

        <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
          {/* TITLE */}

          <div>
            <h1 className="text-2xl font-bold text-slate-800 sm:text-3xl">
              Assessment Results
            </h1>

            <p className="mt-1 text-sm text-slate-500">
              Manage student assessment results and payment information.
            </p>
          </div>

          {/* RIGHT SIDE ACTIONS */}

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">

            {/* PRESET FILTER */}

            <div className="flex min-w-[180px] items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2.5">
              <CalendarDays
                size={17}
                className="shrink-0 text-slate-400"
              />

              <select
                value={period}
                onChange={(e) => handlePeriodChange(e.target.value)}
                className="w-full cursor-pointer bg-transparent text-sm font-medium text-slate-600 outline-none"
              >
                {dateFilters.map((filter) => (
                  <option key={filter.value} value={filter.value}>
                    {filter.label}
                  </option>
                ))}
              </select>
            </div>

            {/* REFRESH BUTTON */}

            <button
              type="button"
              onClick={fetchAssessments}
              disabled={loading}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-sky-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-sky-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <RefreshCw
                size={16}
                className={loading ? "animate-spin" : ""}
              />
              Refresh Data
            </button>

          </div>
        </div>

        {/* SUMMARY CARDS */}

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {summaryCards.map((card) => {
            const Icon = card.icon;

            return (
              <div
                key={card.title}
                className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
              >
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-slate-500">
                    {card.title}
                  </p>

                  <div className={`rounded-xl p-3 ${card.iconClass}`}>
                    <Icon size={22} />
                  </div>
                </div>

                <h2 className={`mt-4 text-3xl font-bold ${card.valueClass}`}>
                  {card.value}
                </h2>
              </div>
            );
          })}
        </div>

        {/* ERROR MESSAGE */}

        {error && (
          <div className="flex items-center justify-between rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
            <span>{error}</span>

            <button
              type="button"
              onClick={fetchAssessments}
              className="font-semibold underline"
            >
              Retry
            </button>
          </div>
        )}

        {/* ASSESSMENT TABLE */}

        <div className="mt-6">
          {loading ? (
            <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center shadow-sm">
              <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-sky-200 border-t-sky-600" />

              <p className="mt-4 text-sm text-slate-500">
                Loading assessment results...
              </p>
            </div>
          ) : (
            <TableComponent
              columns={columns}
              data={assessments}
              rowIdKey="_id"
              pageSize={8}
              searchPlaceholder="Search student name, email, phone..."
              dateFilterable={true}
              dateKey="completedAt"
              defaultSort={{
                key: "completedAt",
                dir: "desc",
              }}
              filters={filters}
              accent="#0EA5E9"
              title="Student Assessment Results"
              description="View student scores, results and payment details"
            />
          )}
        </div>

      </div>

      {/* ASSESSMENT DETAILS MODAL */}

      {showModal && selectedAssessment && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center overflow-y-auto bg-slate-900/50 p-4">
          <div className="my-auto w-full max-w-2xl overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl">

            {/* MODAL HEADER */}

            <div className="flex items-center justify-between border-b border-slate-200 px-6 py-5">
              <div>
                <h2 className="text-xl font-bold text-slate-800">
                  Assessment Details
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Student assessment and payment information
                </p>
              </div>

              <button
                type="button"
                onClick={closeModal}
                className="rounded-lg p-2 text-slate-500 transition hover:bg-slate-100"
              >
                <X size={20} />
              </button>
            </div>

            {/* MODAL BODY */}

            <div className="space-y-6 p-6">

              {/* STUDENT INFORMATION */}

              <div>
                <h3 className="mb-3 text-sm font-bold uppercase tracking-wide text-slate-500">
                  Student Information
                </h3>

                <div className="grid grid-cols-1 gap-4 rounded-xl bg-slate-50 p-4 sm:grid-cols-2">
                  <div>
                    <p className="text-xs text-slate-500">Student Name</p>
                    <p className="mt-1 font-semibold text-slate-800">
                      {selectedAssessment.fullName || "N/A"}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-slate-500">Email Address</p>
                    <p className="mt-1 break-all font-semibold text-slate-800">
                      {selectedAssessment.email || "N/A"}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-slate-500">Phone Number</p>
                    <p className="mt-1 font-semibold text-slate-800">
                      {selectedAssessment.phone || "N/A"}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-slate-500">Assessment ID</p>
                    <p className="mt-1 break-all text-sm font-medium text-slate-800">
                      {selectedAssessment.assessmentId || "-"}
                    </p>
                  </div>
                </div>
              </div>

              {/* ASSESSMENT PERFORMANCE */}

              <div>
                <h3 className="mb-3 text-sm font-bold uppercase tracking-wide text-slate-500">
                  Assessment Performance
                </h3>

                <div className="grid grid-cols-2 gap-4">
                  <div className="rounded-xl border border-slate-200 p-4">
                    <p className="text-xs text-slate-500">Percentage</p>
                    <p className="mt-2 text-2xl font-bold text-sky-600">
                      {selectedAssessment.percentage ?? 0}%
                    </p>
                  </div>

                  <div className="rounded-xl border border-slate-200 p-4">
                    <p className="text-xs text-slate-500">Total Questions</p>
                    <p className="mt-2 text-2xl font-bold text-slate-800">
                      {selectedAssessment.totalQuestions ?? 0}
                    </p>
                  </div>

                  <div className="rounded-xl border border-slate-200 p-4">
                    <p className="text-xs text-slate-500">Correct Score</p>
                    <p className="mt-2 text-2xl font-bold text-slate-800">
                      {selectedAssessment.score ?? 0}
                    </p>
                  </div>

                  <div className="rounded-xl border border-slate-200 p-4">
                    <p className="text-xs text-slate-500">Result</p>
                    <div className="mt-3">
                      {getResultBadge(selectedAssessment.passed)}
                    </div>
                  </div>
                </div>
              </div>

              {/* PAYMENT INFORMATION */}

              <div>
                <h3 className="mb-3 text-sm font-bold uppercase tracking-wide text-slate-500">
                  Payment Information
                </h3>

                <div className="space-y-4 rounded-xl bg-slate-50 p-4">
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-sm text-slate-500">
                      Payment Amount
                    </span>

                    <span className="font-bold text-slate-800">
                      ₹{Number(
                        selectedAssessment.amount || 0
                      ).toLocaleString("en-IN")}
                    </span>
                  </div>

                  <div className="flex items-center justify-between gap-3">
                    <span className="text-sm text-slate-500">
                      Payment Status
                    </span>

                    {getPaymentBadge(selectedAssessment.paymentStatus)}
                  </div>

                  <div>
                    <p className="text-xs text-slate-500">
                      Razorpay Order ID
                    </p>
                    <p className="mt-1 break-all text-sm font-medium text-slate-800">
                      {selectedAssessment.razorpayOrderId || "-"}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-slate-500">
                      Razorpay Payment ID
                    </p>
                    <p className="mt-1 break-all text-sm font-medium text-slate-800">
                      {selectedAssessment.razorpayPaymentId || "-"}
                    </p>
                  </div>

                  <div className="flex items-center justify-between gap-3">
                    <span className="text-sm text-slate-500">
                      Paid Date
                    </span>
                    <span className="text-sm font-medium text-slate-800">
                      {formatDate(selectedAssessment.paidAt)}
                    </span>
                  </div>
                </div>
              </div>

              {/* COMPLETED DATE */}

              <div className="flex items-center justify-between border-t border-slate-200 pt-4">
                <span className="text-sm text-slate-500">
                  Assessment Completed
                </span>

                <span className="text-sm font-semibold text-slate-800">
                  {formatDate(selectedAssessment.completedAt)}
                </span>
              </div>

            </div>

            {/* MODAL FOOTER */}

            <div className="flex justify-end border-t border-slate-200 px-6 py-4">
              <button
                type="button"
                onClick={closeModal}
                className="rounded-xl bg-sky-600 px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-sky-700"
              >
                Close
              </button>
            </div>

          </div>
        </div>
      )}

      {/* MANUAL PAYMENT MODAL */}

{showManualModal && selectedAssessment && (
  <div className="fixed inset-0 z-[110] flex items-center justify-center bg-slate-900/60 p-4">
    <div className="w-full max-w-lg overflow-hidden rounded-2xl bg-white shadow-2xl">

      {/* HEADER */}
      <div className="flex items-center justify-between border-b border-slate-200 px-6 py-5">
        <div>
          <h2 className="text-xl font-bold text-slate-800">
            Manual Payment
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            Verify student payment details.
          </p>
        </div>

        <button
          type="button"
          onClick={closeManualModal}
          disabled={manualPaymentLoading}
          className="rounded-lg p-2 text-slate-500 hover:bg-slate-100"
        >
          <X size={20} />
        </button>
      </div>

      <form onSubmit={submitManualPayment}>

        <div className="space-y-5 p-6">

          {/* STUDENT DETAILS */}
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">

            <div className="rounded-lg bg-slate-50 p-3">
              <p className="text-xs text-slate-500">Student Name</p>
              <p className="mt-1 text-sm font-semibold text-slate-800">
                {selectedAssessment.fullName || "N/A"}
              </p>
            </div>

            <div className="rounded-lg bg-slate-50 p-3">
              <p className="text-xs text-slate-500">Amount</p>
              <p className="mt-1 text-sm font-bold text-slate-800">
                ₹{Number(selectedAssessment.amount || 0).toLocaleString("en-IN")}
              </p>
            </div>

          </div>

          {/* ORDER ID */}
          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700">
              Razorpay Order ID
            </label>

            <input
              type="text"
              value={selectedAssessment.razorpayOrderId || ""}
              readOnly
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-600"
            />
          </div>

          {/* PAYMENT ID */}
          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700">
              Razorpay Payment ID *
            </label>

            <input
              type="text"
              value={razorpayPaymentId}
              onChange={(e) => setRazorpayPaymentId(e.target.value)}
              placeholder="Enter Razorpay Payment ID"
              required
              disabled={manualPaymentLoading}
              className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none text-black focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
            />
          </div>

          <div className="rounded-lg border border-amber-200 bg-amber-50 p-3">
            <p className="text-xs leading-5 text-amber-700">
              Verify the actual payment in Razorpay before submitting.
            </p>
          </div>

        </div>

        {/* FOOTER */}
        <div className="flex justify-end gap-3 border-t border-slate-200 px-6 py-4">

          <button
            type="button"
            onClick={closeManualModal}
            disabled={manualPaymentLoading}
            className="rounded-xl border border-slate-300 px-5 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-50"
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={manualPaymentLoading || !razorpayPaymentId.trim()}
            className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-emerald-700 disabled:opacity-60"
          >
            {manualPaymentLoading ? (
              <>
                <RefreshCw size={16} className="animate-spin" />
                Verifying...
              </>
            ) : (
              <>
                <CreditCard size={16} />
                Verify Payment
              </>
            )}
          </button>

        </div>
      </form>
    </div>
  </div>
)}

    </AdminLayout>
  );
};

export default Assessment;
