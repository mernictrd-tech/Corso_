import { Routes, Route } from "react-router-dom";
import ScrollToTop from "../components/common/ScrollToTop";
import Home from "../pages/Home/Home";
import PrivacyPolicy from "../pages/PrivacyPolicy/PrivacyPolicy";
import Terms from "../pages/Terms/Terms";
import RefundPolicy from "../pages/RefundPolicy/RefundPolicy";
import CourseDetails from "../pages/CourseDetails/CourseDetails";
import Dashboard from "../pages/Dashboard";



const AppRoutes = () => {
  return (
    <>
      <ScrollToTop />

      <Routes>
        <Route path="/" element={<Home />} />

        {/* Course Details */}
        <Route
          path="/course/:courseId"
          element={<CourseDetails />}
        />

        {/* Future Assessment Page */}
        {/* <Route
          path="/assessment/:courseId"
          element={<Assessment />}
        /> */}

        <Route
          path="/privacy-policy"
          element={<PrivacyPolicy />}
        />

        <Route
          path="/terms-and-conditions"
          element={<Terms />}
        />

        <Route
          path="/refund-policy"
          element={<RefundPolicy />}
        />

        <Route 
        path="/dashboard" 
        element={<Dashboard />} />
      </Routes>
    </>
  );
};

export default AppRoutes;