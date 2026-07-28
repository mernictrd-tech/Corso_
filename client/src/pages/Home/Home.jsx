import Hero from "../../components/home/Hero";
import WhyChooseUs from "../../components/home/WhyChooseUs/WhyChooseUs";
import AssessmentInfo from "../../components/home/AssessmentInfo/AssessmentInfo";
import HowItWorks from "../../components/home/HowItWorks/HowItWorks";
import ReadyToProve from "../../components/home/ReadyToProve/ReadyToProve";
import VerifyCertificate from "../../components/home/VerifyCertificate/VerifyCertificate";
import CoursesCards from "../../components/home/Courses/CoursesCards";
import Layout from "../../components/layout/Layout";

const Home = () => {
  return (
    <>
      <Layout>
        <Hero />
        <WhyChooseUs />
        <CoursesCards />
        <AssessmentInfo />
        <HowItWorks />
      <ReadyToProve />
      <VerifyCertificate />
      </Layout>
    </>
  );
};

export default Home;