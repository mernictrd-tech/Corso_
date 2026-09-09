import Hero from "../../components/home/Hero";
import WhyChooseUs from "../../components/home/WhyChooseUs/WhyChooseUs";
import AssessmentInfo from "../../components/home/AssessmentInfo/AssessmentInfo";
import HowItWorks from "../../components/home/HowItWorks/HowItWorks";
import ReadyToProve from "../../components/home/ReadyToProve/ReadyToProve";
import VerifyCertificate from "../../components/home/VerifyCertificate/VerifyCertificate";
import CoursesCards from "../../components/home/Courses/CoursesCards";
import Layout from "../../components/layout/Layout";
import Contact from "../Contact/Contact";
import StructuredData from "../../seo/StructuredData";

const homeSchema = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": "https://skilium.in/#organization",
      name: "Skilium",
      url: "https://skilium.in",
      logo: {
        "@type": "ImageObject",
        url: "https://skilium.in/assets/skilium-logo-without-bg-DARK.png",
      },
    },
    {
      "@type": "WebSite",
      "@id": "https://skilium.in/#website",
      url: "https://skilium.in",
      name: "Skilium",
      publisher: {
        "@id": "https://skilium.in/#organization",
      },
    },
    {
      "@type": "WebPage",
      "@id": "https://skilium.in/#webpage",
      url: "https://skilium.in",
      name: "Skilium",
      isPartOf: {
        "@id": "https://skilium.in/#website",
      },
    },
  ],
};

const Home = () => {
  return (
    <>
      <Layout>
        <StructuredData data={homeSchema} />
        <Hero />
        <WhyChooseUs />
        <CoursesCards />
        <AssessmentInfo />
        <HowItWorks />
        <ReadyToProve />
        <VerifyCertificate />
        <Contact />
      </Layout>
    </>
  );
};

export default Home;
