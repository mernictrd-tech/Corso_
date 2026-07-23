import { Routes, Route } from "react-router-dom";
import Home from "../pages/Home/Home";
import PrivacyPolicy from "../pages/PrivacyPolicy/PrivacyPolicy";
import Terms from "../pages/Terms/Terms";
import RefundPolicy from "../pages/RefundPolicy/RefundPolicy";
import ScrollToTop from "../components/common/ScrollToTop";

const AppRoutes = () => {
  return (
    <>
    <ScrollToTop />
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/privacy-policy" element={<PrivacyPolicy />} />
      <Route path="/terms-and-conditions" element={<Terms />} />
      <Route path="/refund-policy" element={<RefundPolicy />} />
    </Routes>
    </>
  );
};

export default AppRoutes;