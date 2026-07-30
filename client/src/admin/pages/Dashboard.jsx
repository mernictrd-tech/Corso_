import AdminLayout from "../components/layout/AdminLayout";

const Dashboard = () => {
  return (
    <AdminLayout>

      <div className="h-full">

        <h1 className="mb-8 text-3xl font-bold">
          Dashboard
        </h1>

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">

          <div className="rounded-2xl bg-white p-6 shadow">

            <h3 className="text-gray-500">
              Total Courses
            </h3>

            <p className="mt-3 text-4xl font-bold">
              0
            </p>

          </div>

          <div className="rounded-2xl bg-white p-6 shadow">

            <h3 className="text-gray-500">
              Students
            </h3>

            <p className="mt-3 text-4xl font-bold">
              0
            </p>

          </div>

          <div className="rounded-2xl bg-white p-6 shadow">

            <h3 className="text-gray-500">
              Questions
            </h3>

            <p className="mt-3 text-4xl font-bold">
              0
            </p>

          </div>

          <div className="rounded-2xl bg-white p-6 shadow">

            <h3 className="text-gray-500">
              Revenue
            </h3>

            <p className="mt-3 text-4xl font-bold">
              ₹0
            </p>

          </div>

        </div>

      </div>

    </AdminLayout>
  );
};

export default Dashboard;