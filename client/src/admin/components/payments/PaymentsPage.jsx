import AdminLayout from "../layout/AdminLayout";
import PaymentTable from "./PaymentTable";

const PaymentsPage = () => {
  const payments = [
    {
      id: 1,
      name: "Rahul Sharma",
      email: "rahul@gmail.com",
      program: "Full Stack Development",
      amount: "₹15,000",
      method: "UPI",
      date: "10 Jul 2025",
      status: "Paid",
    },
    {
      id: 2,
      name: "Priya Patel",
      email: "priya@gmail.com",
      program: "Data Analytics",
      amount: "₹12,000",
      method: "Credit Card",
      date: "08 Jul 2025",
      status: "Paid",
    },
    {
      id: 3,
      name: "Aman Verma",
      email: "aman@gmail.com",
      program: "Python Programming",
      amount: "₹10,000",
      method: "Net Banking",
      date: "06 Jul 2025",
      status: "Pending",
    },
    {
      id: 4,
      name: "Sneha Gupta",
      email: "sneha@gmail.com",
      program: "UI / UX Design",
      amount: "₹8,000",
      method: "UPI",
      date: "05 Jul 2025",
      status: "Paid",
    },
  ];

  return (
    <AdminLayout>
      <div className="space-y-6">

        <div>
          <h1 className="text-[30px] font-bold text-slate-800">
            Payments
          </h1>

          <p className="mt-2 text-slate-500">
            All student payment records
          </p>
        </div>

        <PaymentTable payments={payments} />

      </div>
    </AdminLayout>
  );
};

export default PaymentsPage;