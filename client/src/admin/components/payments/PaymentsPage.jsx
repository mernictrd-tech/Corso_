import { useEffect, useMemo, useState } from "react";
import AdminLayout from "../layout/AdminLayout";
import TableComponent from "../common/tableComponents/tableComponent";
import api from "../../../services/api";
import { toast } from "react-hot-toast";

const PaymentsPage = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchPayments = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/admin/payments/list");

      setPayments(response.data.data || []);
    } catch (err) {
      console.error("Failed to fetch payments:", err);

      const message =
        err.response?.data?.message || "Failed to load payments.";

      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPayments();
  }, []);

  const formatDate = (value) => {
    if (!value) return "-";

    return new Date(value).toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  const columns = useMemo(
    () => [
      {
        key: "student",
        label: "Student",
        priority: 5,
        sortable: true,
        minWidth: 180,
        render: (value) => value?.fullName || "-",
      },

      {
        key: "email",
        label: "Email",
        priority: 4,
        sortable: true,
        minWidth: 220,
        render: (_, row) => row.student?.email || "-",
      },

      {
        key: "program",
        label: "Program",
        priority: 4,
        sortable: true,
        minWidth: 200,
        render: (value) => value?.name || "-",
      },

      {
        key: "assessment",
        label: "Score",
        priority: 3,
        sortable: true,
        minWidth: 100,
        render: (value) => value?.score ?? "-",
      },

      {
        key: "amount",
        label: "Amount",
        priority: 3,
        sortable: true,
        minWidth: 110,
        render: (value, row) =>
          `${row.currency === "INR" ? "₹" : row.currency || ""}${value ?? 0}`,
      },

      {
        key: "razorpayPaymentId",
        label: "Payment ID",
        priority: 2,
        sortable: true,
        minWidth: 180,
        render: (value) => value || "-",
      },

      {
        key: "status",
        label: "Status",
        priority: 2,
        sortable: true,
        minWidth: 110,
        render: (value) => {
          const status = value || "created";

          const statusClass =
            status === "paid"
              ? "dt-pill-dept-engineering"
              : status === "failed"
                ? "dt-pill-dept-sales"
                : "dt-pill-dept-sales";

          return (
            <span className={`dt-pill ${statusClass}`}>
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </span>
          );
        },
      },

      {
        key: "paidAt",
        label: "Payment Date",
        priority: 2,
        sortable: true,
        minWidth: 180,
        render: (value, row) =>
          formatDate(value || row.createdAt),
      },
    ],
    []
  );

  const filters = useMemo(() => {
    const statuses = [
      ...new Set(
        payments
          .map((payment) => payment.status)
          .filter(Boolean)
      ),
    ];

    return [
      {
        key: "status",
        label: "Status",
        options: statuses.map((status) => ({
          label:
            status.charAt(0).toUpperCase() + status.slice(1),
          value: status,
        })),
      },
    ];
  }, [payments]);

  return (
    <AdminLayout>
      <div className="space-y-6">

        {/* Heading */}
        <div>
          <h1 className="text-[30px] font-bold text-slate-800">
            Payments
          </h1>

          <p className="mt-2 text-slate-500">
            All student payment records
          </p>
        </div>

        {/* Error */}
        {error && (
          <div className="rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">
            {error}
          </div>
        )}

        {/* Table */}
        <div className="mt-6">
          {loading ? (
            <div className="rounded-2xl border border-gray-800 bg-[#10141D] p-10 text-center text-gray-400">
              Loading payments...
            </div>
          ) : (
            <TableComponent
              columns={columns}
              data={payments}
              rowIdKey="_id"
              pageSize={8}
              searchPlaceholder="Search payments..."
              defaultSort={{
                key: "paidAt",
                dir: "desc",
              }}
              filters={filters}
              accent="#0EA5E9"
              title="Payment Directory"
              description="Manage student payment records"
            />
          )}
        </div>
      </div>
    </AdminLayout>
  );
};

export default PaymentsPage;