import Navbar from "./Navbar/Navbar";
import Footer from "./Footer/Footer";
import SiteSchema from "../../seo/SiteSchema";

const Layout = ({ children }) => {
  return (
    <>
      <SiteSchema />
      <Navbar />
      <main>{children}</main>
      <Footer />
    </>
  );
};

export default Layout;