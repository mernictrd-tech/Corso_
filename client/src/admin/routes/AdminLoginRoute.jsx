import { Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { adminLogin } from "../services/adminService";

const AdminLoginRoute = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const checkAdminAuth = async () => {
      try {
        const response = await adminLogin.get("/admin/me");

        setIsAdmin(response.data.success);
      } catch {
        setIsAdmin(false);
      } finally {
        setLoading(false);
      }
    };

    checkAdminAuth();
  }, []);

  if (loading) {
    return null;
  }

  if (isAdmin) {
    return <Navigate to="/admin/dashboard" replace />;
  }

  return children;
};

export default AdminLoginRoute;