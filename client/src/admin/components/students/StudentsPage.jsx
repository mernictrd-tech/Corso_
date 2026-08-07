import AdminLayout from "../layout/AdminLayout";
import StudentsTable from "./StudentsTable";
import api from "../../../services/api";
import { useEffect, useState } from "react";
import DeleteConfirmModal from "../common/DeleteConfirmModal";

const StudentsPage = () => {
  const [openModal, setOpenModal] = useState(false);

  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [deleteStudent, setDeleteStudent] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      setLoading(true);

      const response = await api.get("/admin/students/list");

      setStudents(response.data.data);
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      setDeleteLoading(true);

      await api.delete(`/admin/student/delete/${deleteStudent._id}`);

      fetchStudents();
      setDeleteStudent(null);
    } catch (err) {
      console.log(err);
    } finally {
      setDeleteLoading(false);
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="p-5">Loading programs...</div>
      </AdminLayout>
    );
  }

  if (error) {
    return (
      <AdminLayout>
        <div className="p-5 text-red-500">{error}</div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-[30px] font-bold text-slate-800">Students</h1>

          <p className="mt-1 text-slate-500">All registered students</p>
        </div>

        <StudentsTable 
            students={students}
            onDelete={setDeleteStudent} />
      </div>

      {deleteStudent && (
        <DeleteConfirmModal
          title="Delete Question"
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
