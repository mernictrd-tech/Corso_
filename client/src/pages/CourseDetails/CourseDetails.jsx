import { useParams } from "react-router-dom";
import Layout from "../../components/layout/Layout";
import courseDetails from "../../data/courseDetails";

import {
  CourseHero,
  CourseOverview,
  SkillsCovered,
  AssessmentDetails,
  CertificatePreview,
  StartAssessmentCard,
} from "../../components/courseDetails";

const CourseDetails = () => {
  const { courseId } = useParams();

  const course =
    courseDetails.find((item) => item.id === courseId) ||
    courseDetails[0];

  return (
    <Layout>
      <CourseHero course={course} />
      <CourseOverview course={course} />
      <SkillsCovered course={course} />
      <AssessmentDetails course={course} />
      <CertificatePreview course={course} />
      <StartAssessmentCard course={course} />
    </Layout>
  );
};

export default CourseDetails;