import { Routes, Route } from "react-router-dom";

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

    </Routes>
  );
};

export default AdminRoutes;