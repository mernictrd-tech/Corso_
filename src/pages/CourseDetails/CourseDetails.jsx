import { useParams } from "react-router-dom";

import courseDetails from "../../data/courseDetails";

import Layout from "../../components/layout/Layout";

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

  const course = courseDetails.find(
    (item) => item.id === courseId
  );

  if (!course) {
    return (
      <Layout>
        <section className="flex min-h-screen items-center justify-center bg-[#070B1A]">
          <div className="text-center">
            <h1 className="text-5xl font-bold text-white">
              Course Not Found
            </h1>

            <p className="mt-4 text-gray-400">
              The course you are looking for doesn't exist.
            </p>
          </div>
        </section>
      </Layout>
    );
  }

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