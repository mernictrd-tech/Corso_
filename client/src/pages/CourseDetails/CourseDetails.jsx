import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Layout from "../../components/layout/Layout";
import api from "../../services/api";

import {
  CourseHero,
  CourseOverview,
  SkillsCovered,
  AssessmentDetails,
  CertificatePreview,
  StartAssessmentCard,
} from "../../components/courseDetails";

const CourseDetails = () => {
  const { courseId } = useParams(); // this is the slug

  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const { data } = await api.get(`/program/slug/${courseId}`);
        setCourse(data.data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchCourse();
  }, [courseId]);

  if (loading) return <Layout><div>Loading...</div></Layout>;
  if (!course) return <Layout><div>Course not found.</div></Layout>;

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