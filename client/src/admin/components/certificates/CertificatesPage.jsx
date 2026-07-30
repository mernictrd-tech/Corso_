import AdminLayout from "../layout/AdminLayout";
import CertificateTable from "./CertificateTable";

const CertificatesPage = () => {
  const certificates = [
    {
      id: 1,
      name: "Rahul Sharma",
      email: "rahul@gmail.com",
      program: "Full Stack Development",
      certificateId: "CERT-2025-001",
      issueDate: "10 Jul 2025",
      method: "Auto Generated",
      status: "Issued",
    },
    {
      id: 2,
      name: "Priya Patel",
      email: "priya@gmail.com",
      program: "Data Analytics",
      certificateId: "CERT-2025-002",
      issueDate: "12 Jul 2025",
      method: "Admin Generated",
      status: "Issued",
    },
    {
      id: 3,
      name: "Aman Verma",
      email: "aman@gmail.com",
      program: "Python Programming",
      certificateId: "CERT-2025-003",
      issueDate: "15 Jul 2025",
      method: "Auto Generated",
      status: "Pending",
    },
  ];

  return (
    <AdminLayout>
      <div className="space-y-6">

        <div>

          <h1 className="text-[30px] font-bold text-slate-900">
            Certificates
          </h1>

          <p className="mt-1 text-slate-500">
            Student certificate records
          </p>

        </div>

        <CertificateTable certificates={certificates} />

      </div>
    </AdminLayout>
  );
};

export default CertificatesPage;