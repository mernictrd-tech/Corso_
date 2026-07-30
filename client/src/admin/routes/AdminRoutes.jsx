import { Routes, Route } from "react-router-dom";

import Login from "../pages/Login";
import Dashboard from "../pages/Dashboard";
import ProtectedAdminRoute from "./ProtectedAdminRoute";
import ProgramMaster from "../components/programs/ProgramMaster";

const AdminRoutes = () => {
  return (
    <Routes>
      <Route path="login" element={<Login />} />

      <Route
        path="dashboard"
        element={
          <ProtectedAdminRoute>
            <Dashboard />
          </ProtectedAdminRoute>
        }
      />

      <Route
        path="programs"
        element={
          <ProtectedAdminRoute>
            <ProgramMaster />
          </ProtectedAdminRoute>
        }
      />
    </Routes>
  );
};

export default AdminRoutes;