import { Routes, Route } from "react-router-dom";
import ScrollToTop from "../components/common/ScrollToTop";
import Home from "../pages/Home/Home";
import PrivacyPolicy from "../pages/PrivacyPolicy/PrivacyPolicy";
import Terms from "../pages/Terms/Terms";
import RefundPolicy from "../pages/RefundPolicy/RefundPolicy";
import CourseDetails from "../pages/CourseDetails/CourseDetails";
import Dashboard from "../pages/Dashboard";
import Assessment from "../components/assessment/Assessment";
import ProtectedRoute from "../components/auth/ProtectedRoute";
import NotFound from "../pages/NotFound";

const AppRoutes = () => {
  return (
    <>
      <ScrollToTop />

      <Routes>
        <Route path="/" element={<Home />} />

        {/* Course Details */}
        <Route path="/course/:courseId" element={<CourseDetails />} />

        <Route path="/assessment/:courseId" element={<Assessment />} />

        <Route path="/privacy-policy" element={<PrivacyPolicy />} />

        <Route path="/terms-and-conditions" element={<Terms />} />

        <Route path="/refund-policy" element={<RefundPolicy />} />

        {/* Protected Routes */}
        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<Dashboard />} />
        </Route>

        {/* 404 - Catch All */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
};

export default AppRoutes;
