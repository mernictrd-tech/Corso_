import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../../services/api";
import Layout from "../../components/layout/Layout";

import certificatePreview from "../../assets/images/CertificateHero.png";

import {
  CourseHero,
  CourseOverview,
  SkillsCovered,
  AssessmentDetails,
  CertificatePreview,
  StartAssessmentCard,
} from "../../components/courseDetails";
import StructuredData from "../../seo/StructuredData";

const CourseDetails = () => {
  const { courseId } = useParams();

  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await api.get(`/program/slug/${courseId}`);

        if (!response.data.success) {
          throw new Error(response.data.message || "Failed to load program.");
        }

        const program = response.data.data;

        const passingScore =
          program.totalQuestions > 0
            ? Math.round(
                (program.passingQuestions / program.totalQuestions) * 100,
              )
            : 0;

        const mappedCourse = {
          // MongoDB _id
          id: program._id,

          // Slug
          slug: program.slug,

          title: program.name,

          category: program.category?.name || "Assessment",

          description: program.description || "",

          questions: program.totalQuestions || 0,

          duration: program.examDuration
            ? `${program.examDuration} Minutes`
            : "Unlimited",

          passingScore: `${passingScore}%`,

          attempts: "Unlimited",

          rating: 4.9,

          students: 1550,

          topics: program.topics || [],

          certificate: {
            image: certificatePreview,

            title: "Industry Recognized Certificate",

            description:
              "Receive a verified certificate after successfully clearing the assessment.",
          },
        };

        setCourse(mappedCourse);
      } catch (err) {
        console.error("Course details error:", err);

        setError(
          err.response?.data?.message ||
            err.message ||
            "Failed to load course.",
        );
      } finally {
        setLoading(false);
      }
    };

    if (courseId) {
      fetchCourse();
    }
  }, [courseId]);

  const courseSchema = {
    "@context": "https://schema.org",
    "@type": "Course",
    "@id": `https://skilium.in/course/${course?.slug}#course`,
    name: course?.title,
    description: course?.description,
    url: `https://skilium.in/course/${course?.slug}`,
    provider: {
      "@type": "Organization",
      name: "Skilium",
      url: "https://skilium.in",
    },
    educationalLevel: "Professional",
    inLanguage: "en-IN",
    coursePrerequisites: "No prerequisites",
    hasCourseInstance: {
      "@type": "CourseInstance",
      courseMode: "online",
      duration: course?.duration,
    },
  };

  if (loading) {
    return (
      <Layout>
        <div className="min-h-screen bg-[#070B1A] flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-white">Loading course...</h2>

            <p className="mt-2 text-gray-400">Please wait.</p>
          </div>
        </div>
      </Layout>
    );
  }

  if (error || !course) {
    return (
      <Layout>
        <div className="min-h-screen bg-[#070B1A] flex items-center justify-center p-6">
          <div className="max-w-lg w-full rounded-2xl border border-red-400/20 bg-red-400/5 p-8 text-center">
            <h2 className="text-2xl font-bold text-red-400">
              Unable to Load Course
            </h2>

            <p className="mt-4 text-gray-300">{error || "Course not found."}</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <StructuredData data={courseSchema} />

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
