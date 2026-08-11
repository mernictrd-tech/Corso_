import { useEffect, useMemo, useState } from "react";
import { Plus, Pencil, Trash2, ChevronDown, Check } from "lucide-react";

import AdminLayout from "../layout/AdminLayout";
import TableComponent from "../common/tableComponents/tableComponent";
import AddEditTopicModal from "./AddEditTopicModal";
import DeleteConfirmModal from "../common/DeleteConfirmModal";
import api from "../../../services/api";

const TopicsPage = () => {
  const [openModal, setOpenModal] = useState(false);
  const [selectedTopic, setSelectedTopic] = useState(null);

  const [programs, setPrograms] = useState([]);
  const [topics, setTopics] = useState([]);

  const [selectedProgram, setSelectedProgram] = useState("");
  const [openDropdown, setOpenDropdown] = useState(false);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [deleteTopic, setDeleteTopic] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  // --------------------------------------------------
  // Status
  // --------------------------------------------------

  const statusPillClass = (status) =>
    status === "Active"
      ? "dt-pill-dept-engineering"
      : "dt-pill-dept-sales";

  // --------------------------------------------------
  // Fetch Programs
  // --------------------------------------------------

  const fetchPrograms = async () => {
    try {
      const { data } = await api.get("/admin/program/list", {
        withCredentials: true,
      });

      const programList = data.data || [];

      setPrograms(programList);

      // Select first program automatically
      if (programList.length > 0 && !selectedProgram) {
        setSelectedProgram(programList[0]._id);
      }
    } catch (error) {
      console.error("Failed to fetch programs:", error);

      setError(
        error.response?.data?.message ||
          "Failed to load programs."
      );
    }
  };

  // --------------------------------------------------
  // Fetch Topics According To Program
  // --------------------------------------------------

  const fetchTopics = async () => {
    if (!selectedProgram) {
      setTopics([]);
      return;
    }

    try {
      setLoading(true);
      setError("");

      const { data } = await api.get(
        `/admin/topic/program/${selectedProgram}`,
        {
          withCredentials: true,
        }
      );

      setTopics(data.data || []);
    } catch (error) {
      console.error("Failed to fetch topics:", error);

      setTopics([]);

      setError(
        error.response?.data?.message ||
          "Failed to load topics."
      );
    } finally {
      setLoading(false);
    }
  };

  // --------------------------------------------------
  // Initial Program Fetch
  // --------------------------------------------------

  useEffect(() => {
    fetchPrograms();
  }, []);

  // --------------------------------------------------
  // Fetch Topics When Program Changes
  // --------------------------------------------------

  useEffect(() => {
    if (selectedProgram) {
      fetchTopics();
    }
  }, [selectedProgram]);

  // --------------------------------------------------
  // Edit Topic
  // --------------------------------------------------

  const handleEdit = (topic) => {
    setSelectedTopic(topic);
    setOpenModal(true);
  };

  // --------------------------------------------------
  // Delete Topic
  // --------------------------------------------------

  const handleDelete = (topic) => {
    setDeleteTopic(topic);
  };

  const confirmDelete = async () => {
    if (!deleteTopic) return;

    try {
      setDeleteLoading(true);

      await api.delete(
        `/admin/topic/delete/${deleteTopic._id}`,
        {
          withCredentials: true,
        }
      );

      setDeleteTopic(null);

      await fetchTopics();
    } catch (error) {
      console.error("Failed to delete topic:", error);

      setError(
        error.response?.data?.message ||
          "Failed to delete topic."
      );
    } finally {
      setDeleteLoading(false);
    }
  };

  // --------------------------------------------------
  // Table Columns
  // --------------------------------------------------

  const columns = [
    {
      key: "name",
      label: "Topic",
      priority: 3,
      sortable: true,
      minWidth: 180,
    },

    {
      key: "description",
      label: "Description",
      priority: 2,
      sortable: true,
      minWidth: 250,

      render: (value) => (
        <div
          className="max-w-[350px] truncate"
          title={value || ""}
        >
          {value || "-"}
        </div>
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
            className={`dt-pill ${statusPillClass(status)}`}
          >
            {status}
          </span>
        );
      },
    },

    {
      key: "createdAt",
      label: "Created At",
      priority: 1,
      sortable: true,
      minWidth: 150,

      render: (value) => {
        if (!value) return "-";

        return new Date(value).toLocaleDateString("en-IN", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        });
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

  // --------------------------------------------------
  // Filters
  // --------------------------------------------------

  const filters = useMemo(() => {
    const statuses = [
      ...new Set(
        topics.map((topic) =>
          topic.isActive ? "Active" : "Inactive"
        )
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
  }, [topics]);

  // --------------------------------------------------
  // Selected Program Name
  // --------------------------------------------------

  const selectedProgramName =
    programs.find(
      (program) => program._id === selectedProgram
    )?.name || "Select Program";

  // --------------------------------------------------
  // Render
  // --------------------------------------------------

  return (
    <AdminLayout>
      <div className="space-y-5">

        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-[28px] font-semibold text-slate-800">
              Topics
            </h1>

            <p className="mt-1 text-sm text-slate-500">
              Create and manage topics program wise.
            </p>

            {/* Program Dropdown */}
            <div className="relative mt-5 w-[320px]">
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Select Program
              </label>

              <button
                onClick={() =>
                  setOpenDropdown(!openDropdown)
                }
                className="flex h-11 w-full items-center justify-between rounded-xl border border-slate-200 bg-white px-4 text-sm font-medium text-slate-700 shadow-sm transition hover:border-sky-400"
              >
                {selectedProgramName}

                <ChevronDown
                  size={18}
                  className={`transition ${
                    openDropdown ? "rotate-180" : ""
                  }`}
                />
              </button>

              {openDropdown && (
                <div className="absolute z-50 mt-2 w-full overflow-hidden rounded-xl border border-slate-200 bg-white shadow-xl">

                  {programs.length > 0 ? (
                    programs.map((program) => (
                      <button
                        key={program._id}
                        onClick={() => {
                          setSelectedProgram(program._id);
                          setOpenDropdown(false);
                        }}
                        className={`flex w-full items-center justify-between px-4 py-3 text-left text-sm transition ${
                          selectedProgram === program._id
                            ? "bg-sky-50 text-sky-600"
                            : "text-slate-700 hover:bg-slate-50"
                        }`}
                      >
                        {program.name}

                        {selectedProgram === program._id && (
                          <Check
                            size={16}
                            className="text-sky-600"
                          />
                        )}
                      </button>
                    ))
                  ) : (
                    <div className="px-4 py-3 text-sm text-slate-500">
                      No programs found
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Add Topic */}
          <button
            onClick={() => {
              setSelectedTopic(null);
              setOpenModal(true);
            }}
            disabled={!selectedProgram}
            className="flex h-11 items-center gap-2 rounded-xl bg-sky-500 px-5 text-sm font-medium text-white transition hover:bg-sky-600 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Plus size={18} />
            New Topic
          </button>
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
              Loading topics...
            </div>
          ) : (
            <TableComponent
              columns={columns}
              data={topics}
              rowIdKey="_id"
              pageSize={8}
              searchPlaceholder="Search topics..."
              defaultSort={{
                key: "name",
                dir: "asc",
              }}
              filters={filters}
              accent="#0EA5E9"
              title="Topic Directory"
              description={
                selectedProgram
                  ? `Manage topics for ${selectedProgramName}`
                  : "Manage your topics"
              }
            />
          )}
        </div>
      </div>

      {/* Add / Edit Topic Modal */}
      {openModal && (
        <AddEditTopicModal
          topic={selectedTopic}
          programId={selectedProgram}
          close={() => {
            setOpenModal(false);
            setSelectedTopic(null);
          }}
          onSuccess={() => {
            fetchTopics();
            setOpenModal(false);
            setSelectedTopic(null);
          }}
        />
      )}

      {/* Delete Confirmation */}
      {deleteTopic && (
        <DeleteConfirmModal
          title="Delete Topic"
          message={`Are you sure you want to delete "${deleteTopic.name}"? This action cannot be undone.`}
          loading={deleteLoading}
          onCancel={() => setDeleteTopic(null)}
          onConfirm={confirmDelete}
        />
      )}
    </AdminLayout>
  );
};

export default TopicsPage;