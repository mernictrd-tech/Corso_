import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../../services/api";
import Layout from "../../components/layout/Layout";

import certificatePreview from "../../assets/images/certificate-preview.png";

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

  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        setLoading(true);
        setError("");

        /*
         * courseId here is the slug from:
         * /course/:courseId
         *
         * Example:
         * /course/java-full-stack
         */

        const response = await api.get(
          `/program/slug/${courseId}`
        );

        if (!response.data.success) {
          throw new Error(
            response.data.message || "Failed to load program."
          );
        }

        const program = response.data.data;

        /*
         * Convert MongoDB Program into the
         * structure your existing UI expects.
         */

        const mappedCourse = {
          // VERY IMPORTANT
          // This is MongoDB _id
          id: program._id,

          // Keep slug separately
          slug: program.slug,

          title: program.name,

          category:
            program.category?.name || "Assessment",

          description:
            program.description || "",

          questions:
            program.totalQuestions || 0,

          duration:
            "10 Minutes",

          passingScore:
            "70%",

          attempts:
            "Unlimited",

          rating:
            4.9,

          students:
            0,

          skills:
            [],

          certificate: {
            image: certificatePreview,

            title:
              "Industry Recognized Certificate",

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
            "Failed to load course."
        );
      } finally {
        setLoading(false);
      }
    };

    if (courseId) {
      fetchCourse();
    }
  }, [courseId]);

  /*
  |--------------------------------------------------------------------------
  | Loading
  |--------------------------------------------------------------------------
  */

  if (loading) {
    return (
      <Layout>
        <div className="min-h-screen bg-[#070B1A] flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-white">
              Loading course...
            </h2>

            <p className="mt-2 text-gray-400">
              Please wait.
            </p>
          </div>
        </div>
      </Layout>
    );
  }

  /*
  |--------------------------------------------------------------------------
  | Error
  |--------------------------------------------------------------------------
  */

  if (error || !course) {
    return (
      <Layout>
        <div className="min-h-screen bg-[#070B1A] flex items-center justify-center p-6">
          <div className="max-w-lg w-full rounded-2xl border border-red-400/20 bg-red-400/5 p-8 text-center">
            <h2 className="text-2xl font-bold text-red-400">
              Unable to Load Course
            </h2>

            <p className="mt-4 text-gray-300">
              {error || "Course not found."}
            </p>
          </div>
        </div>
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