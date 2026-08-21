import { Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import AppRoutes from "./routes/AppRoutes";
import AdminRoutes from "./admin/routes/AdminRoutes";

function App() {
  return (
    <>
      <Routes>
        <Route path="/admin/*" element={<AdminRoutes />} />
        
        <Route path="/*" element={<AppRoutes />} />
      </Routes>

      <Toaster
        position="top-center"
        toastOptions={{
          duration: 3000,
          style: {
            background: "#111827",
            color: "#fff",
            border: "1px solid #164e63",
          },
        }}
      />
    </>
  );
}

export default App;
