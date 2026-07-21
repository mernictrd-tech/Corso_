import Navbar from "../../components/layout/Navbar";
import Hero from "../../components/home/Hero";
import WhyChooseUs from "../../components/home/WhyChooseUs/WhyChooseUs";
import AssessmentInfo from "../../components/home/AssessmentInfo/AssessmentInfo";
import HowItWorks from "../../components/home/HowItWorks/HowItWorks";
import ReadyToProve from "../../components/home/ReadyToProve/ReadyToProve";
import VerifyCertificate from "../../components/home/VerifyCertificate/VerifyCertificate";
import Footer from "../../components/layout/Footer/Footer";

const Home = () => {
  return (
    <>
      <Navbar />
      <Hero />
      <WhyChooseUs />
      <AssessmentInfo />
      <HowItWorks />
      <ReadyToProve />
      <VerifyCertificate />
      <Footer />
    </>
  );
};

export default Home;