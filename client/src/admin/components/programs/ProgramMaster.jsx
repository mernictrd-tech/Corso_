import { useEffect, useMemo, useState } from "react";
import { Plus, Pencil, Trash2, Eye } from "lucide-react";

import AdminLayout from "../layout/AdminLayout";
import TableComponent from "../common/tableComponents/tableComponent";
import AddProgramModal from "./AddProgramModal";
import EditProgramModal from "./EditProgramModal";
import DeleteConfirmModal from "../common/DeleteConfirmModal";
import api from "../../../services/api";
import toast from "react-hot-toast";
import ViewProgramModal from "./ViewProgramModal";

const ProgramMaster = () => {
  const [programs, setPrograms] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Add/Edit modal
  const [openModal, setOpenModal] = useState(false);
  const [selectedProgram, setSelectedProgram] = useState(null);

  // Delete modal
  const [deleteModal, setDeleteModal] = useState(false);
  const [programToDelete, setProgramToDelete] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  // View modal
  const [viewModal, setViewModal] = useState(false);

  // ----------------------------------------
  // Fetch Programs
  // ----------------------------------------

  const fetchPrograms = async () => {
    try {
      setLoading(true);
      setError("");

      const { data } = await api.get("/admin/program/list");

      setPrograms(data.data || []);
    } catch (error) {
      console.error("Failed to fetch programs:", error);

      setError(error.response?.data?.message || "Failed to load programs.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPrograms();
  }, []);

  // ----------------------------------------
  // Add Program
  // ----------------------------------------

  const handleAdd = () => {
    setSelectedProgram(null);
    setOpenModal(true);
  };

  // ----------------------------------------
  // Edit Program
  // ----------------------------------------

  const handleEdit = (program) => {
    setSelectedProgram(program);
    setOpenModal(true);
  };

  // ----------------------------------------
  // Delete - Open Modal
  // ----------------------------------------

  const handleDelete = (program) => {
    setProgramToDelete(program);
    setDeleteModal(true);
  };

  const handleView = (program) => {
    setSelectedProgram(program);
    setViewModal(true);
  };

  // ----------------------------------------
  // Delete - Confirm
  // ----------------------------------------

  const confirmDelete = async () => {
    if (!programToDelete?._id) {
      return;
    }

    try {
      setDeleteLoading(true);

      const { data } = await api.delete(
        `/admin/program/delete/${programToDelete._id}`,
      );

      if (data.success) {
        setDeleteModal(false);
        setProgramToDelete(null);
        toast.success("Program created successfully");
        await fetchPrograms();
      }
    } catch (error) {
      console.error("Failed to delete program:", error);
      const message =
        error.response?.data?.message ||
        error.response?.data?.error ||
        "Failed to delete program";

      toast.error(message);
      setError(error.response?.data?.message || "Failed to delete program.");
    } finally {
      setDeleteLoading(false);
    }
  };

  // ----------------------------------------
  // Table Columns
  // ----------------------------------------

  const columns = [
    {
      key: "name",
      label: "Program",
      priority: 3,
      sortable: true,
      minWidth: 200,

      render: (value, row) => (
        <div>
          <p className="font-medium text-slate-800">{value}</p>

          <p className="text-xs text-slate-400">{row.slug || "-"}</p>
        </div>
      ),
    },

    {
      key: "category",
      label: "Category",
      priority: 2,
      sortable: true,
      minWidth: 150,

      render: (value) => (
        <span className="dt-pill dt-pill-dept-engineering">
          {value?.name || "-"}
        </span>
      ),
    },

    {
      key: "totalQuestions",
      label: "Questions",
      priority: 2,
      sortable: true,
      minWidth: 120,

      render: (value) => (
        <span className="text-sm text-slate-600">{value || 0}</span>
      ),
    },

    {
      key: "examDuration",
      label: "Duration",
      priority: 2,
      sortable: true,
      minWidth: 120,

      render: (value) => (
        <span className="text-sm text-slate-600">
          {value ? `${value} min` : "-"}
        </span>
      ),
    },

    {
      key: "isActive",
      label: "Status",
      priority: 2,
      sortable: true,
      minWidth: 110,

      render: (value) => {
        const status = value ? "Active" : "Inactive";

        return (
          <span
            className={`dt-pill ${
              status === "Active"
                ? "dt-pill-dept-engineering"
                : "dt-pill-dept-sales"
            }`}
          >
            {status}
          </span>
        );
      },
    },
    {
      key: "actions",
      label: "Actions",
      priority: 1,
      minWidth: 150,

      render: (_, row) => (
        <div className="flex items-center gap-2">
          {/* View */}
          <button
            onClick={() => handleView(row)}
            className="rounded-lg p-2 text-emerald-500 transition hover:bg-emerald-500/10"
            title="View"
          >
            <Eye size={17} />
          </button>

          {/* Edit */}
          <button
            onClick={() => handleEdit(row)}
            className="rounded-lg p-2 text-sky-400 transition hover:bg-sky-500/10"
            title="Edit"
          >
            <Pencil size={17} />
          </button>

          {/* Delete */}
          <button
            onClick={() => handleDelete(row)}
            className="rounded-lg p-2 text-red-400 transition hover:bg-red-500/10"
            title="Delete"
          >
            <Trash2 size={17} />
          </button>
        </div>
      ),
    },
  ];

  // ----------------------------------------
  // Filters
  // ----------------------------------------

  const filters = useMemo(() => {
    const categories = [
      ...new Set(
        programs.map((program) => program.category?.name).filter(Boolean),
      ),
    ].sort();

    const statuses = [
      ...new Set(
        programs.map((program) => (program.isActive ? "Active" : "Inactive")),
      ),
    ];

    return [
      {
        key: "category",
        label: "Category",
        options: categories.map((category) => ({
          label: category,
          value: category,
        })),
      },

      {
        key: "isActive",
        label: "Status",
        options: statuses.map((status) => ({
          label: status,
          value: status,
        })),
      },
    ];
  }, [programs]);

  // ----------------------------------------
  // Render
  // ----------------------------------------

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Heading */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-slate-600">
              Program Master
            </h1>

            <p className="mt-1 text-sm text-gray-400">
              Create and manage certification programs
            </p>
          </div>

          <button
            onClick={handleAdd}
            className="flex h-11 items-center gap-2 rounded-xl bg-sky-500 px-5 text-sm font-medium text-white transition hover:bg-sky-600"
          >
            <Plus size={18} />
            New Program
          </button>
        </div>

        {/* Error */}
        {error && (
          <div className="rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-500">
            {error}
          </div>
        )}

        {/* Table */}
        {loading ? (
          <div className="rounded-2xl border border-gray-800 bg-[#10141D] p-10 text-center text-gray-400">
            Loading programs...
          </div>
        ) : (
          <TableComponent
            columns={columns}
            data={programs}
            rowIdKey="_id"
            pageSize={8}
            searchPlaceholder="Search programs..."
            defaultSort={{
              key: "name",
              dir: "asc",
            }}
            filters={filters}
            accent="#0EA5E9"
            title="Program Directory"
            description="Manage your certification programs"
          />
        )}
      </div>

      {/* Add / Edit Modal */}
      {openModal &&
        (selectedProgram ? (
          <EditProgramModal
            program={selectedProgram}
            close={() => {
              setOpenModal(false);
              setSelectedProgram(null);
            }}
            onSuccess={() => {
              fetchPrograms();

              setOpenModal(false);
              setSelectedProgram(null);
            }}
          />
        ) : (
          <AddProgramModal
            close={() => {
              setOpenModal(false);
            }}
            onSuccess={() => {
              fetchPrograms();
              setOpenModal(false);
            }}
          />
        ))}

      {/* View  */}

      {viewModal && selectedProgram && (
        <ViewProgramModal
          program={selectedProgram}
          close={() => {
            setViewModal(false);
            setSelectedProgram(null);
          }}
        />
      )}

      {/* Delete Confirmation */}
      {deleteModal && programToDelete && (
        <DeleteConfirmModal
          title="Delete Program"
          message={`Are you sure you want to delete "${programToDelete.name}"? This action cannot be undone.`}
          loading={deleteLoading}
          onCancel={() => {
            if (!deleteLoading) {
              setDeleteModal(false);
              setProgramToDelete(null);
            }
          }}
          onConfirm={confirmDelete}
        />
      )}
    </AdminLayout>
  );
};

export default ProgramMaster;
