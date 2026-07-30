import { Routes, Route } from "react-router-dom";

import Login from "../pages/Login";
import Dashboard from "../pages/Dashboard";
import ProtectedAdminRoute from "./ProtectedAdminRoute";

import ProgramMaster from "../components/programs/ProgramMaster";
import QuestionsPage from "../components/questions/QuestionsPage";
import StudentsPage from "../components/students/StudentsPage";
import Payments from "../pages/Payments";
import Certificates from "../pages/Certificates";

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

      <Route
        path="questions"
        element={
          <ProtectedAdminRoute>
            <QuestionsPage />
          </ProtectedAdminRoute>
        }
      />

      <Route
        path="students"
        element={
          <ProtectedAdminRoute>
            <StudentsPage />
          </ProtectedAdminRoute>
        }
      />

      <Route
        path="payments"
        element={
          <ProtectedAdminRoute>
            <Payments />
          </ProtectedAdminRoute>
        }
      />

      <Route
        path="certificates"
        element={
          <ProtectedAdminRoute>
            <Certificates />
          </ProtectedAdminRoute>
        }
      />

    </Routes>
  );
};

export default AdminRoutes;