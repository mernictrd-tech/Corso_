import { useEffect, useMemo, useState } from "react";
import AdminLayout from "../layout/AdminLayout";
import TableComponent from "../common/tableComponents/tableComponent";
import api from "../../../services/api";
import DeleteConfirmModal from "../common/DeleteConfirmModal";
import { Eye, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const StudentsPage = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [deleteStudent, setDeleteStudent] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const navigate = useNavigate();

  const fetchStudents = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/admin/students/list");

      setStudents(response.data.data || []);
    } catch (err) {
      console.error("Failed to fetch students:", err);

      setError(err.response?.data?.message || "Failed to load students.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  const handleDelete = async () => {
    if (!deleteStudent) return;

    try {
      setDeleteLoading(true);

      const response = await api.delete(
        `/admin/student/delete/${deleteStudent._id}`,
      );

      toast.success(response.data?.message || "Student deleted successfully.");

      setDeleteStudent(null);
      fetchStudents();
    } catch (err) {
      console.error("Failed to delete student:", err);

      toast.error(err.response?.data?.message || "Failed to delete student.");
    } finally {
      setDeleteLoading(false);
    }
  };

  const statusPillClass = (status) =>
    status === "Active" ? "dt-pill-dept-engineering" : "dt-pill-dept-sales";

  const columns = useMemo(
    () => [
      {
        key: "fullName",
        label: "Student",
        priority: 4,
        sortable: true,
        minWidth: 180,
      },

      {
        key: "email",
        label: "Email",
        priority: 3,
        sortable: true,
        minWidth: 220,
      },

      {
        key: "assessmentCount",
        label: "Assessments",
        priority: 2,
        sortable: true,
        minWidth: 120,
        render: (value) => value ?? 0,
      },

      {
        key: "createdAt",
        label: "Registration Date",
        priority: 2,
        sortable: true,
        minWidth: 120,
        render: (value) => {
          if (!value) return "-";

          return new Date(value).toLocaleString("en-IN", {
            day: "2-digit",
            month: "short",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
            hour12: true,
          });
        },
      },

      {
        key: "actions",
        label: "Actions",
        priority: 1,
        minWidth: 130,
        render: (_, row) => (
          <div className="flex items-center gap-2">
            {/* View */}
            <button
              onClick={() => navigate(`/admin/students/${row._id}`)}
              className="rounded-lg p-2 text-sky-400 transition hover:bg-sky-500/10"
              title="View Student"
            >
              <Eye size={17} />
            </button>

            {/* Delete */}
            <button
              onClick={() => setDeleteStudent(row)}
              className="rounded-lg p-2 text-red-400 transition hover:bg-red-500/10"
              title="Delete"
            >
              <Trash2 size={17} />
            </button>
          </div>
        ),
      },
    ],
    [],
  );

  const filters = useMemo(() => {
    const statuses = [
      ...new Set(
        students.map((student) => (student.isActive ? "Active" : "Inactive")),
      ),
    ];

    return [
      {
        key: "isActive",
        label: "Status",
        options: statuses.map((status) => ({
          label: status,
          value: status,
        })),
      },
    ];
  }, [students]);

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Heading */}
        <div>
          <h1 className="text-[30px] font-bold text-slate-800">Students</h1>

          <p className="mt-1 text-slate-500">All registered students</p>
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
              Loading students...
            </div>
          ) : (
            <TableComponent
              columns={columns}
              data={students}
              rowIdKey="_id"
              pageSize={8}
              searchPlaceholder="Search students..."
              defaultSort={{
                key: "fullName",
                dir: "asc",
              }}
              filters={filters}
              accent="#0EA5E9"
              title="Student Directory"
              description="Manage registered students"
            />
          )}
        </div>
      </div>

      {/* Delete Confirmation */}
      {deleteStudent && (
        <DeleteConfirmModal
          title="Delete Student"
          message={`Are you sure you want to delete "${deleteStudent.fullName}"? This action cannot be undone.`}
          loading={deleteLoading}
          onCancel={() => setDeleteStudent(null)}
          onConfirm={handleDelete}
        />
      )}
    </AdminLayout>
  );
};

export default StudentsPage;
