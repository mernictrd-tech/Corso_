
import { useEffect, useMemo, useState } from "react";
import api from "../../services/api";
import toast from "react-hot-toast";

import {
  Eye,
  Trash2,
  Pencil,
  X,
  ClipboardCheck,
} from "lucide-react";

import AdminLayout from "../components/layout/AdminLayout";
import TableComponent from "../components/common/tableComponents/tableComponent";
import DeleteConfirmModal from "../components/common/DeleteConfirmModal";

const initialForm = {
  title: "",
  program: "",
  duration: "",
  totalQuestions: "",
  passingMarks: "",
  status: "unpaid",
};

const Assessment = () => {
  const [assessments, setAssessments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Modal states
  const [showModal, setShowModal] = useState(false);
  const [viewOnly, setViewOnly] = useState(false);
  const [editingAssessment, setEditingAssessment] = useState(null);

  // Form states
  const [formData, setFormData] = useState({ ...initialForm });
  const [saving, setSaving] = useState(false);

  // Delete states
  const [deleteAssessment, setDeleteAssessment] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  // Fetch Assessments
  const fetchAssessments = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/admin/assessments/list");

      setAssessments(response.data?.data || []);
    } catch (err) {
      console.error("Failed to fetch assessments:", err);

      setError(
        err.response?.data?.message ||
          "Failed to load assessments."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAssessments();
  }, []);

  // View Assessment
  const handleView = (assessment) => {
    setEditingAssessment(assessment);

    setFormData({
      title: assessment.title || "",
      program:
        assessment.program?.name ||
        assessment.program ||
        "",
      duration: assessment.duration ?? "",
      totalQuestions: assessment.totalQuestions ?? "",
      passingMarks: assessment.passingMarks ?? "",
      status: assessment.status?.toLowerCase() || "unpaid",
    });

    setViewOnly(true);
    setShowModal(true);
  };

  // Edit Assessment
  const handleEdit = (assessment) => {
    setEditingAssessment(assessment);

    setFormData({
      title: assessment.title || "",
      program:
        assessment.program?._id ||
        assessment.program ||
        "",
      duration: assessment.duration ?? "",
      totalQuestions: assessment.totalQuestions ?? "",
      passingMarks: assessment.passingMarks ?? "",
      status: assessment.status?.toLowerCase() || "unpaid",
    });

    setViewOnly(false);
    setShowModal(true);
  };

  // Close Modal
  const closeModal = () => {
    setShowModal(false);
    setViewOnly(false);
    setEditingAssessment(null);
    setFormData({ ...initialForm });
  };

  // Handle Input Change
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Update Assessment
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!editingAssessment) return;

    if (!formData.title.trim()) {
      toast.error("Please enter assessment title.");
      return;
    }

    if (!formData.program) {
      toast.error("Please enter program.");
      return;
    }

    if (
      Number(formData.duration) <= 0 ||
      Number(formData.totalQuestions) <= 0 ||
      Number(formData.passingMarks) < 0
    ) {
      toast.error("Please enter valid assessment details.");
      return;
    }

    if (
      Number(formData.passingMarks) >
      Number(formData.totalQuestions)
    ) {
      toast.error(
        "Passing marks cannot exceed total questions."
      );
      return;
    }

    try {
      setSaving(true);

      const payload = {
        title: formData.title.trim(),
        program: formData.program,
        duration: Number(formData.duration),
        totalQuestions: Number(formData.totalQuestions),
        passingMarks: Number(formData.passingMarks),
        status: formData.status,
      };

      const response = await api.put(
        `/admin/assessment/update/${editingAssessment._id}`,
        payload
      );

      toast.success(
        response.data?.message ||
          "Assessment updated successfully."
      );

      closeModal();
      await fetchAssessments();
    } catch (err) {
      console.error("Failed to update assessment:", err);

      toast.error(
        err.response?.data?.message ||
          "Failed to update assessment."
      );
    } finally {
      setSaving(false);
    }
  };

  // Delete Assessment
  const handleDelete = async () => {
    if (!deleteAssessment) return;

    try {
      setDeleteLoading(true);

      const response = await api.delete(
        `/admin/assessment/delete/${deleteAssessment._id}`
      );

      toast.success(
        response.data?.message ||
          "Assessment deleted successfully."
      );

      setDeleteAssessment(null);
      await fetchAssessments();
    } catch (err) {
      console.error("Failed to delete assessment:", err);

      toast.error(
        err.response?.data?.message ||
          "Failed to delete assessment."
      );
    } finally {
      setDeleteLoading(false);
    }
  };

  // Payment Status Badge
  const getPaymentStatusBadge = (status) => {
    const isPaid = status?.toLowerCase() === "paid";

    return (
      <span
        className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${
          isPaid
            ? "bg-green-100 text-green-700"
            : "bg-amber-100 text-amber-700"
        }`}
      >
        {isPaid ? "Paid" : "Unpaid"}
      </span>
    );
  };

  // Assessment Statistics
  const paidCount = assessments.filter(
    (item) => item.status?.toLowerCase() === "paid"
  ).length;

  const unpaidCount = assessments.filter(
    (item) => item.status?.toLowerCase() === "unpaid"
  ).length;

  // Table Columns
  const columns = useMemo(
    () => [
      {
        key: "title",
        label: "Assessment",
        priority: 5,
        sortable: true,
        minWidth: 200,
      },
      {
        key: "program",
        label: "Program",
        priority: 4,
        sortable: true,
        minWidth: 170,
        render: (value) =>
          typeof value === "object"
            ? value?.name || "-"
            : value || "-",
      },
      {
        key: "duration",
        label: "Duration",
        priority: 3,
        sortable: true,
        minWidth: 120,
        render: (value) =>
          value ? `${value} min` : "-",
      },
      {
        key: "totalQuestions",
        label: "Questions",
        priority: 3,
        sortable: true,
        minWidth: 120,
        render: (value) => value ?? "-",
      },
      {
        key: "passingMarks",
        label: "Passing Marks",
        priority: 3,
        sortable: true,
        minWidth: 140,
        render: (value) => value ?? "-",
      },
      {
        key: "status",
        label: "Payment Status",
        priority: 3,
        sortable: true,
        minWidth: 140,
        render: (value) => getPaymentStatusBadge(value),
      },
      {
        key: "createdAt",
        label: "Created",
        priority: 2,
        sortable: true,
        minWidth: 150,
        render: (value) =>
          value
            ? new Date(value).toLocaleDateString("en-IN", {
                day: "2-digit",
                month: "short",
                year: "numeric",
              })
            : "-",
      },
      {
        key: "actions",
        label: "Actions",
        priority: 1,
        minWidth: 120,
        render: (_, row) => (
          <div className="flex items-center gap-2">
            <button
              onClick={() => handleView(row)}
              className="rounded-lg p-2 text-sky-600 transition hover:bg-sky-50"
              title="View Assessment"
            >
              <Eye size={17} />
            </button>

            <button
              onClick={() => handleEdit(row)}
              className="rounded-lg p-2 text-amber-600 transition hover:bg-amber-50"
              title="Edit Assessment"
            >
              <Pencil size={17} />
            </button>

            <button
              onClick={() => setDeleteAssessment(row)}
              className="rounded-lg p-2 text-red-500 transition hover:bg-red-50"
              title="Delete Assessment"
            >
              <Trash2 size={17} />
            </button>
          </div>
        ),
      },
    ],
    []
  );

  // Payment Status Filters
  const filters = useMemo(
    () => [
      {
        key: "status",
        label: "Payment Status",
        options: [
          { label: "Paid", value: "paid" },
          { label: "Unpaid", value: "unpaid" },
        ],
      },
    ],
    []
  );

  return (
    <AdminLayout>
      <div className="space-y-6">

        {/* Page Heading */}
        <div>
          <h1 className="text-3xl font-bold text-slate-800">
            Assessments
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            Manage assessments and payment status
          </p>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">

          {/* Total Assessments */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:shadow-md">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-slate-500">
                Total Assessments
              </p>

              <div className="rounded-xl bg-sky-50 p-3">
                <ClipboardCheck
                  size={22}
                  className="text-sky-600"
                />
              </div>
            </div>

            <h2 className="mt-4 text-3xl font-bold text-slate-800">
              {assessments.length}
            </h2>
          </div>

          {/* Paid Assessments */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:shadow-md">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-slate-500">
                Paid Assessments
              </p>

              <div className="rounded-xl bg-green-50 p-3">
                <ClipboardCheck
                  size={22}
                  className="text-green-600"
                />
              </div>
            </div>

            <h2 className="mt-4 text-3xl font-bold text-green-600">
              {paidCount}
            </h2>
          </div>

          {/* Unpaid Assessments */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:shadow-md">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-slate-500">
                Unpaid Assessments
              </p>

              <div className="rounded-xl bg-amber-50 p-3">
                <ClipboardCheck
                  size={22}
                  className="text-amber-600"
                />
              </div>
            </div>

            <h2 className="mt-4 text-3xl font-bold text-amber-600">
              {unpaidCount}
            </h2>
          </div>

        </div>

        {/* Error Message */}
        {error && (
          <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
            {error}
          </div>
        )}

        {/* Assessment Table */}
        <div className="mt-6">
          {loading ? (
            <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center text-slate-500 shadow-sm">
              Loading assessments...
            </div>
          ) : (
            <TableComponent
              columns={columns}
              data={assessments}
              rowIdKey="_id"
              pageSize={8}
              searchPlaceholder="Search assessments..."
              defaultSort={{
                key: "createdAt",
                dir: "desc",
              }}
              filters={filters}
              accent="#0EA5E9"
              title="Assessments"
              description="View and manage assessments"
            />
          )}
        </div>
      </div>

      {/* View / Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center overflow-y-auto bg-slate-900/50 p-4">
          <div className="my-auto w-full max-w-2xl overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl">

            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-200 px-6 py-5">
              <div>
                <h2 className="text-xl font-semibold text-slate-800">
                  {viewOnly
                    ? "Assessment Details"
                    : "Edit Assessment"}
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  {viewOnly
                    ? "View assessment information"
                    : "Update assessment details"}
                </p>
              </div>

              <button
                type="button"
                onClick={closeModal}
                className="rounded-lg p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-800"
                title="Close"
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Form */}
            <form
              onSubmit={handleSubmit}
              className="space-y-5 p-6"
            >
              {/* Assessment Title */}
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Assessment Title
                </label>

                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  disabled={viewOnly}
                  placeholder="Enter assessment title"
                  required
                  className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-sky-500 focus:ring-2 focus:ring-sky-100 disabled:bg-slate-50"
                />
              </div>

              {/* Program */}
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Program ID
                </label>

                <input
                  type="text"
                  name="program"
                  value={formData.program}
                  onChange={handleChange}
                  disabled={viewOnly}
                  placeholder="Enter program ID"
                  required
                  className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-sky-500 focus:ring-2 focus:ring-sky-100 disabled:bg-slate-50"
                />
              </div>

              {/* Duration and Questions */}
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">

                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Duration (Minutes)
                  </label>

                  <input
                    type="number"
                    name="duration"
                    min="1"
                    value={formData.duration}
                    onChange={handleChange}
                    disabled={viewOnly}
                    required
                    className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-100 disabled:bg-slate-50"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Total Questions
                  </label>

                  <input
                    type="number"
                    name="totalQuestions"
                    min="1"
                    value={formData.totalQuestions}
                    onChange={handleChange}
                    disabled={viewOnly}
                    required
                    className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-100 disabled:bg-slate-50"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Passing Marks
                  </label>

                  <input
                    type="number"
                    name="passingMarks"
                    min="0"
                    value={formData.passingMarks}
                    onChange={handleChange}
                    disabled={viewOnly}
                    required
                    className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-100 disabled:bg-slate-50"
                  />
                </div>

                {/* Payment Status */}
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Payment Status
                  </label>

                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                    disabled={viewOnly}
                    className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-800 outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-100 disabled:bg-slate-50"
                  >
                    <option value="paid">Paid</option>
                    <option value="unpaid">Unpaid</option>
                  </select>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="flex justify-end gap-3 border-t border-slate-200 pt-5">
                <button
                  type="button"
                  onClick={closeModal}
                  className="rounded-xl border border-slate-300 px-5 py-2.5 text-sm font-medium text-slate-600 transition hover:bg-slate-50"
                >
                  {viewOnly ? "Close" : "Cancel"}
                </button>

                {!viewOnly && (
                  <button
                    type="submit"
                    disabled={saving}
                    className="rounded-xl bg-sky-600 px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-sky-700 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {saving ? "Saving..." : "Update Assessment"}
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteAssessment && (
        <DeleteConfirmModal
          title="Delete Assessment"
          message={`Are you sure you want to delete "${deleteAssessment.title}"? This action cannot be undone.`}
          loading={deleteLoading}
          onCancel={() => setDeleteAssessment(null)}
          onConfirm={handleDelete}
        />
      )}
    </AdminLayout>
  );
};

export default Assessment;
