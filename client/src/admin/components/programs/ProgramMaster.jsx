import ProgramCard from "./ProgramCard";
import { useState } from "react";
import {
  Plus,
  Search,
  Pencil,
  Trash2,
  Eye,
  FolderKanban,
} from "lucide-react";

import AdminLayout from "../layout/AdminLayout";
import ProgramForm from "./ProgramForm";

const ProgramMaster = () => {
  const [showForm, setShowForm] = useState(false);

  const [programs, setPrograms] = useState([
    {
      id: 1,
      name: "Full Stack Development",
      category: "Programming",
      duration: "6 Months",
      status: "Active",
    },
    {
      id: 2,
      name: "Data Analytics",
      category: "Data Science",
      duration: "4 Months",
      status: "Active",
    },
  ]);

  const handleDelete = (id) => {
    setPrograms(programs.filter((program) => program.id !== id));
  };

  return (
    <AdminLayout>
      <div className="space-y-6">

        {/* Header */}

        <div className="flex items-center justify-between">

          <div>

            <h1 className="text-3xl font-bold text-slate-900">
              Program Master
            </h1>

            <p className="mt-1 text-slate-500">
              Create and manage all certification programs.
            </p>

          </div>

          <button
            onClick={() => setShowForm(true)}
            className="
            inline-flex
            items-center
            gap-2
            rounded-xl
            bg-sky-600
            px-5
            py-3
            font-medium
            text-white
            transition
            hover:bg-sky-700
            shadow-sm
            "
          >
            <Plus size={18} />
            New Program
          </button>

        </div>

        {/* Stats */}

        <div className="grid gap-5 md:grid-cols-3">

          <div className="rounded-2xl bg-white p-6 shadow-sm border border-slate-100">

            <div className="flex items-center justify-between">

              <div>

                <p className="text-sm text-slate-500">
                  Total Programs
                </p>

                <h2 className="mt-2 text-3xl font-bold text-slate-900">
                  {programs.length}
                </h2>

              </div>

              <div className="rounded-xl bg-sky-100 p-3">
                <FolderKanban
                  className="text-sky-600"
                  size={22}
                />
              </div>

            </div>

          </div>

          <div className="rounded-2xl bg-white p-6 shadow-sm border border-slate-100">

            <p className="text-sm text-slate-500">
              Active
            </p>

            <h2 className="mt-2 text-3xl font-bold text-emerald-600">
              {programs.filter(p => p.status === "Active").length}
            </h2>

          </div>

          <div className="rounded-2xl bg-white p-6 shadow-sm border border-slate-100">

            <p className="text-sm text-slate-500">
              Categories
            </p>

            <h2 className="mt-2 text-3xl font-bold text-slate-900">
              {
                new Set(programs.map((p) => p.category)).size
              }
            </h2>

          </div>

        </div>

        {/* Search */}

        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">

          <div className="relative max-w-md">

            <Search
              size={18}
              className="
              absolute
              left-4
              top-1/2
              -translate-y-1/2
              text-slate-400
              "
            />

            <input
              type="text"
              placeholder="Search programs..."
              className="
              w-full
              rounded-xl
              border
              border-slate-200
              bg-slate-50
              py-3
              pl-11
              pr-4
              text-slate-800
              outline-none
              transition
              focus:border-sky-500
              focus:bg-white
              "
            />

          </div>

        </div>

        {/* Program Cards */}

        <div className="space-y-4">

          {programs.map((program) => (

            <div
              key={program.id}
              className="
              rounded-2xl
              border
              border-slate-200
              bg-white
              p-6
              shadow-sm
              transition
              hover:shadow-md
              "
            >

              <div className="flex items-center justify-between">

                <div>

                  <h3 className="text-lg font-semibold text-slate-900">
                    {program.name}
                  </h3>

                  <div className="mt-2 flex flex-wrap items-center gap-3 text-sm">

                    <span className="rounded-full bg-slate-100 px-3 py-1 text-slate-600">
                      {program.category}
                    </span>

                    <span className="rounded-full bg-blue-50 px-3 py-1 text-blue-600">
                      {program.duration}
                    </span>

                    <span className="rounded-full bg-emerald-50 px-3 py-1 text-emerald-700">
                      ● {program.status}
                    </span>

                  </div>

                </div>

                <div className="flex gap-2">

                  <button
                    className="
                    rounded-xl
                    p-2.5
                    text-slate-500
                    hover:bg-slate-100
                    "
                  >
                    <Eye size={18} />
                  </button>

                  <button
                    className="
                    rounded-xl
                    p-2.5
                    text-sky-600
                    hover:bg-sky-50
                    "
                  >
                    <Pencil size={18} />
                  </button>

                  <button
                    onClick={() => handleDelete(program.id)}
                    className="
                    rounded-xl
                    p-2.5
                    text-red-500
                    hover:bg-red-50
                    "
                  >
                    <Trash2 size={18} />
                  </button>

                </div>

              </div>

            </div>

          ))}

        </div>

        {showForm && (
          <ProgramForm close={() => setShowForm(false)} />
        )}

      </div>
    </AdminLayout>
  );
};

export default ProgramMaster;