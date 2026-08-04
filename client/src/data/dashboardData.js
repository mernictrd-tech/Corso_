const dashboardData = {
  hero: {
    name: "Pallavi",
    assessment: "React.js",
    score: "92%",
    message:
      "Congratulations! Your assessment has been completed successfully.",
  },

  stats: {
    certificates: 4,
    assessments: 4,
    passRate: "92%",
    skillsVerified: 4,
  },

  certificates: [
    {
      id: 1,
      title: "React.js",
      score: 92,
      certificateId: "CRS-2026-001",
      issuedOn: "29 Jul 2026",

      payment: {
        amount: "₹499",
        status: "Paid",
        transactionId: "TXN78451236",
        date: "29 Jul 2026",
      },
    },

    {
      id: 2,
      title: "Node.js",
      score: 88,
      certificateId: "CRS-2026-002",
      issuedOn: "02 Aug 2026",

      payment: {
        amount: "₹499",
        status: "Paid",
        transactionId: "TXN78451237",
        date: "02 Aug 2026",
      },
    },

    {
      id: 3,
      title: "MongoDB",
      score: 95,
      certificateId: "CRS-2026-003",
      issuedOn: "10 Aug 2026",

      payment: {
        amount: "₹699",
        status: "Paid",
        transactionId: "TXN78451238",
        date: "10 Aug 2026",
      },
    },

    {
      id: 4,
      title: "JavaScript",
      score: 91,
      certificateId: "CRS-2026-004",
      issuedOn: "15 Aug 2026",

      payment: {
        amount: "₹399",
        status: "Paid",
        transactionId: "TXN78451239",
        date: "15 Aug 2026",
      },
    },
  ],

  suggestedAssessments: [
    {
      id: 1,
      title: "JavaScript",
    },
    {
      id: 2,
      title: "Node.js",
    },
    {
      id: 3,
      title: "MongoDB",
    },
  ],

  profile: {
    name: "Pallavi",
    email: "pallavi@gmail.com",
    joined: "July 2026",
  },
};

export default dashboardData;