import { useState, useEffect } from "react";
import {
  Plus,
  Search,
  FolderKanban,
  CheckCircle2,
  Layers3,
  Clock3,
} from "lucide-react";

import AdminLayout from "../layout/AdminLayout";
import ProgramTable from "./ProgramTable";
import AddProgramModal from "./AddProgramModal";
import api from "../../../services/api";

const ProgramMaster = () => {
  const [openModal, setOpenModal] = useState(false);

  // const [programs] = useState([
  //   {
  //     id: 1,
  //     name: "Full Stack Development",
  //     code: "FSD001",
  //     category: "Programming",
  //     duration: "6 Months",
  //     status: "Active",
  //   },
  //   {
  //     id: 2,
  //     name: "Data Analytics",
  //     code: "DA002",
  //     category: "Data Science",
  //     duration: "4 Months",
  //     status: "Active",
  //   },
  //   {
  //     id: 3,
  //     name: "UI / UX Design",
  //     code: "UI003",
  //     category: "Design",
  //     duration: "3 Months",
  //     status: "Inactive",
  //   },
  // ]);

  const [programs, setPrograms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchPrograms();
  }, []);

  const fetchPrograms = async () => {
    try {
      setLoading(true);

      const response = await api.get("/admin/program/list");

      console.log(response.data.data);

      setPrograms(response.data.data);
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
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
      <div className="space-y-5">
        {/* Heading */}

        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-800">
              Program Master
            </h1>

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

        {/* Search */}

        {/* Table */}

        <ProgramTable programs={programs} />
      </div>

      {openModal && (
        <AddProgramModal
          close={() => setOpenModal(false)}
          onSuccess={() => {
            fetchPrograms();
            setOpenModal(false);
          }}
        />
      )}
    </AdminLayout>
  );
};

export default ProgramMaster;
