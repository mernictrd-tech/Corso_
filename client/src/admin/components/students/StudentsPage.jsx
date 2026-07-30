import AdminLayout from "../layout/AdminLayout";
import StudentsTable from "./StudentsTable";

const StudentsPage = () => {
  const students = [
    {
      id: 1,
      name: "Rahul Sharma",
      email: "rahul@gmail.com",
      program: "Full Stack Development",
      status: "Active",
      payment: "Paid",
    },
    {
      id: 2,
      name: "Priya Patel",
      email: "priya@gmail.com",
      program: "Data Analytics",
      status: "Active",
      payment: "Pending",
    },
    {
      id: 3,
      name: "Aman Verma",
      email: "aman@gmail.com",
      program: "Python Programming",
      status: "Inactive",
      payment: "Paid",
    },
    {
      id: 4,
      name: "Sneha Gupta",
      email: "sneha@gmail.com",
      program: "UI / UX Design",
      status: "Active",
      payment: "Paid",
    },
  ];

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-[30px] font-bold text-slate-800">
            Students
          </h1>

          <p className="mt-1 text-slate-500">
            All registered students
          </p>
        </div>

        <StudentsTable students={students} />
      </div>
    </AdminLayout>
  );
};

export default StudentsPage;