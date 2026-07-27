// src/data/courseDetails.js

import certificatePreview from "../assets/images/certificate-preview.png";

const courseDetails = [
  {
    id: "java-full-stack",
    title: "Java Full Stack",
    category: "Programming",
    level: "Beginner to Intermediate",
    rating: 4.9,
    students: 1265,

    duration: "10 Minutes",
    questions: 10,
    passingScore: "70%",
    attempts: "Unlimited",

    description:
      "Validate your Java Full Stack development skills through our industry-level assessment. This assessment covers Java fundamentals, Spring Boot, REST APIs, SQL, Git, and problem-solving abilities required by modern companies.",

    skills: [
      "Java",
      "Spring Boot",
      "REST API",
      "Hibernate",
      "MySQL",
      "Collections",
      "Exception Handling",
      "Git",
      "OOP",
      "Problem Solving",
    ],

    certificate: {
      image: certificatePreview,
      title: "Industry Recognized Certificate",
      description:
        "Receive a verified certificate after successfully clearing the assessment. You can download it as PDF and share it directly on LinkedIn.",
    },
  },
];

export default courseDetails;