import { Routes, Route, Navigate } from "react-router-dom";

import Login from "../pages/Login";
import Dashboard from "../pages/Dashboard";
import Categories from "../pages/Categories";
import ProtectedAdminRoute from "./ProtectedAdminRoute";

import ProgramMaster from "../components/programs/ProgramMaster";
import QuestionsPage from "../components/questions/QuestionsPage";
import StudentsPage from "../components/students/StudentsPage";
import Payments from "../pages/Payments";
import Certificates from "../pages/Certificates";
import TopicsPage from "../components/topics/TopicsPage";
import StudentDetails from "../components/students/StudentDetails";
import AdminNotFound from "../pages/AdminNotFound";

const AdminRoutes = () => {
  return (
    <Routes>
      <Route path="login" element={<Login />} />

      <Route index element={<Navigate to="dashboard" replace />} />

      <Route
        path="dashboard"
        element={
          <ProtectedAdminRoute>
            <Dashboard />
          </ProtectedAdminRoute>
        }
      />

      <Route
        path="categories"
        element={
          <ProtectedAdminRoute>
            <Categories />
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
        path="students/:studentId"
        element={
          <ProtectedAdminRoute>
            <StudentDetails />
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

      <Route
        path="program-topics"
        element={
          <ProtectedAdminRoute>
            <TopicsPage />
          </ProtectedAdminRoute>
        }
      />

      {/* Admin 404 */}
      <Route path="*" element={<AdminNotFound />} />
    </Routes>
  );
};

export default AdminRoutes;
