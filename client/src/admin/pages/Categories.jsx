import { useEffect, useMemo, useState } from "react";

import AdminLayout from "../components/layout/AdminLayout";
import TableComponent from "../components/common/tableComponents/tableComponent";
import AddCategoryModal from "../components/modals/AddCategoryModal";
import api from "../../services/api";
import { Plus, Pencil, Trash2 } from "lucide-react";


const Categories = () => {
  const [openModal, setOpenModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  
  const [programs, setPrograms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  
  const statusPillClass = (status) =>
    status === "Active" ? "dt-pill-dept-engineering" : "dt-pill-dept-sales";
  
  const columns = [
    {
      key: "name",
      label: "Category",
      priority: 3,
      sortable: true,
      minWidth: 150,
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
          <span className={`dt-pill ${statusPillClass(status)}`}>{status}</span>
        );
      },
    },
    {
      key: "actions",
      label: "Actions",
      priority: 1,
      minWidth: 120,
      render: (_, row) => (
        <div className="flex items-center gap-2">
          <button
            onClick={() => handleEdit(row)}
            className="rounded-lg p-2 text-sky-400 transition hover:bg-sky-500/10"
            title="Edit"
          >
            <Pencil size={17} />
          </button>
  
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
  
  const handleEdit = (category) => {
    console.log("Edit category:", category);

    setSelectedCategory(category);
    setOpenModal(true);
  };

  const handleDelete = (category) => {
    console.log("Delete category:", category);

    // Later:
    // open delete confirmation modal
  };

  // Fetch programs
  const fetchCategories = async () => {
    try {
      setLoading(true);
      setError("");

      const { data } = await api.get("/admin/category/list", {
        withCredentials: true,
      });

      console.log("Programs response:", data);

      setPrograms(data.data || []);
    } catch (error) {
      console.error("Failed to fetch programs:", error);

      setError(error.response?.data?.message || "Failed to load programs.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  // Build filters dynamically
  const filters = useMemo(() => {
    const categories = [
      ...new Set(programs.map((program) => program.category).filter(Boolean)),
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

  return (
    <AdminLayout>
      {/* Heading */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-slate-600">Categories</h1>

          <p className="mt-1 text-sm text-gray-400">
            Create and manage Categories
          </p>
        </div>

        <button
          onClick={() => setOpenModal(true)}
          className="flex h-11 items-center gap-2 rounded-xl bg-sky-500 px-5 text-sm font-medium text-white transition hover:bg-sky-600"
        >
          <Plus size={18} />
          New Category
        </button>
      </div>

      {/* Error */}
      {error && (
        <div className="mt-6 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">
          {error}
        </div>
      )}

      {/* Table */}
      <div className="mt-6">
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
            title="Category Directory"
            description="Manage your categories"
          />
        )}
      </div>

      {/* Add Program Modal */}
      {openModal && (
        <AddCategoryModal
          category={selectedCategory}
          close={() => setOpenModal(false)}
          onSuccess={fetchCategories}
        />
      )}
    </AdminLayout>
  );
};

export default Categories;
