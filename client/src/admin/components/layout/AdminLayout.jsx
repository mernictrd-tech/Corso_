import Sidebar from "./Sidebar";
import Topbar from "./Topbar";

const AdminLayout = ({ children }) => {
  return (
    <div className="flex h-screen overflow-hidden bg-[#F8FAFC]">

      <Sidebar />

      <div className="flex flex-1 flex-col overflow-hidden">

        <Topbar />

        <main className="flex-1 overflow-y-auto bg-[#F8FAFC] p-8 text-gray-900">
          {children}
        </main>

      </div>

    </div>
  );
};

export default AdminLayout;