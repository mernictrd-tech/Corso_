import { useState, useMemo } from "react";
import { Plus } from "lucide-react";

import AdminLayout from "../components/layout/AdminLayout";
import TableComponent from "../components/common/tableComponents/tableComponent";
import {
  IconPhone,
  IconDepartment,
  IconLocation,
  IconClock,
  IconFolder,
  IconStorage,
  getIconComponent,
} from "../components/common/tableComponents/tableIcons";

const statusPillClass = (status) =>
  status === "Active" ? "dt-pill-dept-engineering" : "dt-pill-dept-sales";

const columns = [
  {
    key: "name",
    label: "Program",
    priority: 1,
    sortable: true,
    minWidth: 220,
  },
  {
    key: "code",
    label: "Code",
    priority: 4,
    sortable: true,
    minWidth: 100,
  },
  {
    key: "category",
    label: "Category",
    priority: 3,
    sortable: true,
    minWidth: 150,
  },
  {
    key: "duration",
    label: "Duration",
    priority: 5,
    sortable: true,
    minWidth: 120,
    icon: "clock",
    render: TableComponent.renderers?.withIcon?.("clock") || ((value) => (
      <span className="dt-inline-icon">
        <IconClock />
        {value}
      </span>
    )),
  },
  {
    key: "status",
    label: "Status",
    priority: 2,
    sortable: true,
    minWidth: 110,
    render: (value) => (
      <span className={`dt-pill ${statusPillClass(value)}`}>{value}</span>
    ),
  },
];

const Categories = () => {
  const [openModal, setOpenModal] = useState(false);

  const [programs] = useState([
    {
      id: 1,
      name: "Full Stack Development",
      code: "FSD001",
      category: "Programming",
      duration: "6 Months",
      status: "Active",
    },
    {
      id: 2,
      name: "Full Stack Development",
      code: "FSD001",
      category: "Programming",
      duration: "6 Months",
      status: "Active",
    },
    {
      id: 3,
      name: "Data Analytics",
      code: "DA002",
      category: "Data Science",
      duration: "4 Months",
      status: "Active",
    },
    {
      id: 4,
      name: "Data Analytics",
      code: "DA002",
      category: "Data Science",
      duration: "4 Months",
      status: "Active",
    },
    {
      id: 5,
      name: "UI / UX Design",
      code: "UI003",
      category: "Design",
      duration: "3 Months",
      status: "Inactive",
    },
    {
      id: 6,
      name: "UI / UX Design",
      code: "UI003",
      category: "Design",
      duration: "3 Months",
      status: "Inactive",
    },
  ]);

  // Build filter option lists from whatever categories/statuses actually
  // exist in the data, so they stay correct as programs are added.
  const filters = useMemo(() => {
    const categories = [...new Set(programs.map((p) => p.category))].sort();
    const statuses = [...new Set(programs.map((p) => p.status))].sort();

    return [
      {
        key: "category",
        label: "Category",
        options: categories.map((c) => ({ label: c, value: c })),
      },
      {
        key: "status",
        label: "Status",
        options: statuses.map((s) => ({ label: s, value: s })),
      },
    ];
  }, [programs]);

  return (
    <AdminLayout>
      <div className="space-y-5">
        {/* Heading */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-800">Categories</h1>
            <p className="mt-1 text-sm text-slate-500">
              Create and manage certification programs
            </p>
          </div>

          <button
            onClick={() => setOpenModal(true)}
            className="flex h-11 items-center gap-2 rounded-xl bg-sky-500 px-5 text-sm font-medium text-white transition hover:bg-sky-600"
          >
            <Plus size={18} />
            New Program
          </button>
        </div>

        {/* Table (search + filters + pagination built in) */}
        {/* <div className="rounded-2xl bg-[#10141D] p-4"> */}
          <TableComponent
            columns={columns}
            data={programs}
            rowIdKey="id"
            pageSize={8}
            searchPlaceholder="Search programs…"
            defaultSort={{ key: "name", dir: "asc" }}
            filters={filters}
            accent="#0EA5E9"
            title="Programs Directory"
            description="Manage your certification programs"
          />
        </div>
      {/* </div> */}

      {openModal && <AddProgramModal close={() => setOpenModal(false)} />}
    </AdminLayout>
  );
};

export default Categories;