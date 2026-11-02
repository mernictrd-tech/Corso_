
const Payment = require("../../models/payment.model");

const TIME_ZONE = "Asia/Kolkata";

// Get today's or yesterday's date in IST.
const getISTDate = (daysAgo = 0) => {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: TIME_ZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(new Date());

  const values = {};

  parts.forEach(({ type, value }) => {
    values[type] = value;
  });

  const date = new Date(
    Date.UTC(
      Number(values.year),
      Number(values.month) - 1,
      Number(values.day) - daysAgo
    )
  );

  return date.toISOString().slice(0, 10);
};

// Get the start and end of a date in IST.
const getISTDateRange = (dateString) => {
  const start = new Date(`${dateString}T00:00:00+05:30`);

  const end = new Date(
    start.getTime() + 24 * 60 * 60 * 1000
  );

  return { start, end };
};

// Fetch and group successful payments by program.
const getCollectionByDate = async (dateString) => {
  const { start, end } = getISTDateRange(dateString);

  // Fetch paid payments from MongoDB.
  const payments = await Payment.find({
    status: "paid",
    paidAt: {
      $gte: start,
      $lt: end,
    },
  })
    .populate("program", "name")
    .select("program amount student customerEmail paidAt")
    .lean();

  const groupedData = new Map();

  // Track unique email IDs separately for each course.
  const freshEmails = new Set();

  for (const payment of payments) {
    if (!payment.program) continue;

    const programId = payment.program._id.toString();

    // Initialize course data.
    if (!groupedData.has(programId)) {
      groupedData.set(programId, {
        courseName: payment.program.name,
        totalCount: 0,
        freshAdmission: 0,
        totalAmount: 0,
      });
    }

    const course = groupedData.get(programId);

    // Calculate total payment count.
    course.totalCount += 1;

    // Calculate total payment amount.
    course.totalAmount += Number(payment.amount) || 0;

    // Count each unique email once per course.
    const email = payment.customerEmail
      ?.trim()
      .toLowerCase();

    const emailKey = `${programId}_${email}`;

    if (email && !freshEmails.has(emailKey)) {
      freshEmails.add(emailKey);
      course.freshAdmission += 1;
    }
  }

  return Array.from(groupedData.values()).map((course) => ({
    ...course,
    totalAmount: Number(course.totalAmount.toFixed(2)),
  }));
};

// Fetch today's and yesterday's collections.
const getCollectionReport = async () => {
  const today = getISTDate(0);
  const yesterday = getISTDate(1);

  const [todayData, yesterdayData] = await Promise.all([
    getCollectionByDate(today),
    getCollectionByDate(yesterday),
  ]);

  return {
    today: todayData,
    yesterday: yesterdayData,
  };
};

module.exports = {
  getCollectionReport,
};
