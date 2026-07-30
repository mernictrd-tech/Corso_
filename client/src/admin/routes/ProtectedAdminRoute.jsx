import { Navigate } from "react-router-dom";

const ProtectedAdminRoute = ({
  children,
}) => {
  const admin = JSON.parse(
    localStorage.getItem("admin")
  );

  if (!admin) {
    return (
      <Navigate
        to="/admin/login"
        replace
      />
    );
  }

  return children;
};

export default ProtectedAdminRoute;