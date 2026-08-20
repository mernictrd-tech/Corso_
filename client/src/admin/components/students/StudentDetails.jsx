import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Mail, Phone, Calendar, User } from "lucide-react";

import AdminLayout from "../layout/AdminLayout";
import api from "../../../services/api";

const StudentDetails = () => {
  const { studentId } = useParams();
  const navigate = useNavigate();

  const [student, setStudent] = useState(null);
  const [purchases, setPurchases] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchStudentDetails = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get(`/admin/students/${studentId}`);

      const data = response.data.data;

      setStudent(data.student);
      setPurchases(data.purchases || []);
    } catch (err) {
      console.error("Failed to fetch student:", err);

      setError(
        err.response?.data?.message || "Failed to load student details.",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudentDetails();
  }, [studentId]);

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

  if (loading) {
    return (
      <AdminLayout>
        <div className="p-6 text-gray-400">Loading student details...</div>
      </AdminLayout>
    );
  }

  if (error) {
    return (
      <AdminLayout>
        <div className="p-6">
          <div className="rounded-xl border border-red-500/20 bg-red-500/10 p-4 text-red-400">
            {error}
          </div>
        </div>
      </AdminLayout>
    );
  }

  if (!student) return null;

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate("/admin/students")}
            className="rounded-lg p-2 text-slate-500 transition hover:bg-slate-100"
          >
            <ArrowLeft size={20} />
          </button>

          <div>
            <h1 className="text-[30px] font-bold text-slate-800">
              Student Details
            </h1>

            <p className="mt-1 text-slate-500">
              View student information and purchase history
            </p>
          </div>
        </div>

        {/* Personal Information */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-6 flex items-center gap-4">
            {/* Profile Photo */}
            <div className="h-20 w-20 overflow-hidden rounded-full border-2 border-slate-200 bg-slate-100">
              {student.avatar ? (
                <img
                  src={`${import.meta.env.VITE_API_BASE_URL_RESOURCE}${student.avatar}`}
                  alt={student.fullName}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-2xl font-semibold text-slate-500">
                  {student.fullName?.charAt(0)?.toUpperCase() || "U"}
                </div>
              )}
            </div>

            {/* Name */}
            <div>
              <h2 className="text-lg font-semibold text-slate-800">
                {student.fullName}
              </h2>
            </div>
          </div>

          <div className="border-t border-slate-100 pt-5">
            <h3 className="mb-5 text-base font-semibold text-slate-800">
              Personal Information
            </h3>

            {/* Your existing information grid */}
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
              {/* Email */}
              <div>
                <p className="text-xs text-slate-400">Email</p>

                <p className="mt-1 font-medium text-slate-700">
                  {student.email || "-"}
                </p>
              </div>

              {/* Phone */}
              <div>
                <p className="text-xs text-slate-400">Phone</p>

                <p className="mt-1 font-medium text-slate-700">
                  {student.phone || "-"}
                </p>
              </div>

              {/* Registration Date */}
              <div>
                <p className="text-xs text-slate-400">Registered On</p>

                <p className="mt-1 font-medium text-slate-700">
                  {formatDate(student.createdAt)}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Purchased Programs */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-5">
            <h2 className="text-lg font-semibold text-slate-800">
              Purchased Programs
            </h2>

            <p className="text-sm text-slate-500">
              Programs purchased by this student
            </p>
          </div>

          {purchases.length === 0 ? (
            <div className="rounded-xl bg-slate-50 p-8 text-center text-sm text-slate-500">
              No programs purchased yet.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-200 text-left">
                    <th className="px-4 py-3 text-sm font-semibold text-slate-600">
                      Program
                    </th>

                    <th className="px-4 py-3 text-sm font-semibold text-slate-600">
                      Score
                    </th>

                    <th className="px-4 py-3 text-sm font-semibold text-slate-600">
                      Amount
                    </th>

                    <th className="px-4 py-3 text-sm font-semibold text-slate-600">
                      Payment ID
                    </th>

                    <th className="px-4 py-3 text-sm font-semibold text-slate-600">
                      Status
                    </th>

                    <th className="px-4 py-3 text-sm font-semibold text-slate-600">
                      Purchase Date
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {purchases.map((purchase) => (
                    <tr
                      key={purchase._id}
                      className="border-b border-slate-100 last:border-0"
                    >
                      <td className="px-4 py-4">
                        <span className="font-medium text-slate-700">
                          {purchase.program?.name || "-"}
                        </span>
                      </td>

                      <td className="px-4 py-4">
                        <span className="font-medium text-slate-700">
                          {purchase.assessment?.score ?? "-"}
                        </span>
                      </td>

                      <td className="px-4 py-4 text-slate-600">
                        ₹{purchase.amount}
                      </td>

                      <td className="px-4 py-4">
                        <span className="font-mono text-xs text-slate-500">
                          {purchase.razorpayPaymentId || "-"}
                        </span>
                      </td>

                      <td className="px-4 py-4">
                        <span
                          className={`rounded-full px-3 py-1 text-xs font-medium ${
                            purchase.status === "paid"
                              ? "bg-green-50 text-green-600"
                              : purchase.status === "failed"
                                ? "bg-red-50 text-red-600"
                                : "bg-yellow-50 text-yellow-600"
                          }`}
                        >
                          {purchase.status}
                        </span>
                      </td>

                      <td className="px-4 py-4 text-sm text-slate-500">
                        {formatDate(purchase.createdAt)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
};

export default StudentDetails;
