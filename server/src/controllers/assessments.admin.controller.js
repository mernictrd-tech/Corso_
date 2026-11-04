
const Assessment = require("../models/assessment.model");
const Payment = require("../models/payment.model");

// ---------------------------------------------
// DATE HELPERS (INDIA TIMEZONE)
// ---------------------------------------------

const getIndiaDate = () => {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Kolkata",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(new Date());

  const values = Object.fromEntries(
    parts.map(({ type, value }) => [type, value])
  );

  return `${values.year}-${values.month}-${values.day}`;
};

const addDays = (date, days) => {
  const result = new Date(`${date}T00:00:00.000Z`);
  result.setUTCDate(result.getUTCDate() + days);

  return result.toISOString().slice(0, 10);
};

// ---------------------------------------------
// PRESET DATE FILTER
// ---------------------------------------------

const getPresetRange = (period) => {
  const today = getIndiaDate();

  let start;
  let end = today;

  switch (period) {
    case "today":
      start = today;
      break;

    case "yesterday":
      start = addDays(today, -1);
      end = start;
      break;

    case "week":
      start = addDays(today, -6);
      break;

    case "month":
      start = addDays(today, -29);
      break;

    case "all":
      return null;

    default:
      return undefined;
  }

  return {
    start: new Date(`${start}T00:00:00+05:30`),
    end: new Date(`${addDays(end, 1)}T00:00:00+05:30`),
  };
};

// ---------------------------------------------
// CUSTOM DATE FILTER
// ---------------------------------------------

const getCustomRange = (from, to) => {
  const validDate = /^\d{4}-\d{2}-\d{2}$/;

  for (const date of [from, to]) {
    if (!date) continue;

    if (!validDate.test(date)) {
      return {
        error: "Invalid date format. Use YYYY-MM-DD.",
      };
    }

    const parsed = new Date(`${date}T00:00:00.000Z`);

    if (
      Number.isNaN(parsed.getTime()) ||
      parsed.toISOString().slice(0, 10) !== date
    ) {
      return {
        error: "Invalid calendar date.",
      };
    }
  }

  if (from && to && from > to) {
    return {
      error: "From date cannot be greater than To date.",
    };
  }

  return {
    start: from
      ? new Date(`${from}T00:00:00+05:30`)
      : new Date("1970-01-01T00:00:00.000Z"),

    end: to
      ? new Date(`${addDays(to, 1)}T00:00:00+05:30`)
      : new Date(),
  };
};

// ---------------------------------------------
// ASSESSMENT CONTROLLER
// ---------------------------------------------

module.exports = {
  getAssessments: async (req, res) => {
    try {
      const { period = "all", from, to } = req.query;

      // ----------------------------------
      // GET DATE RANGE
      // ----------------------------------

      let dateRange;

      if (from || to) {
        dateRange = getCustomRange(from, to);

        if (dateRange.error) {
          return res.status(400).json({
            success: false,
            message: dateRange.error,
          });
        }
      } else {
        dateRange = getPresetRange(period);

        if (dateRange === undefined) {
          return res.status(400).json({
            success: false,
            message: "Invalid date filter.",
          });
        }
      }

      // ----------------------------------
      // ASSESSMENT DATE MATCH
      // ----------------------------------

      const assessmentMatch = dateRange
        ? {
            completedAt: {
              $gte: dateRange.start,
              $lt: dateRange.end,
            },
          }
        : {};

      // ----------------------------------
      // SUMMARY
      // ----------------------------------

      const summaryResult = await Assessment.aggregate([
        {
          $match: assessmentMatch,
        },
        {
          $lookup: {
            from: Payment.collection.name,
            localField: "_id",
            foreignField: "assessment",
            as: "paymentDetails",
          },
        },
        {
          $addFields: {
            hasPayment: {
              $gt: [{ $size: "$paymentDetails" }, 0],
            },
            hasPaidPayment: {
              $in: ["paid", "$paymentDetails.status"],
            },
          },
        },
        {
          $group: {
            _id: null,

            totalAssessments: {
              $sum: 1,
            },

            paidAssessments: {
              $sum: {
                $cond: ["$hasPaidPayment", 1, 0],
              },
            },

            trashedStudents: {
              $sum: {
                $cond: ["$hasPayment", 1, 0],
              },
            },

            untrashedStudents: {
              $sum: {
                $cond: ["$hasPayment", 0, 1],
              },
            },
          },
        },
        {
          $project: {
            _id: 0,
            totalAssessments: 1,
            paidAssessments: 1,
            trashedStudents: 1,
            untrashedStudents: 1,
          },
        },
      ]);

      // ----------------------------------
      // TABLE DATA
      // LATEST PAYMENT -> ASSESSMENT
      // ----------------------------------

      const assessments = await Payment.aggregate([
        {
          $sort: {
            createdAt: -1,
          },
        },
        {
          $match: {
            assessment: { $ne: null },
          },
        },
        {
          $group: {
            _id: "$assessment",
            paymentDetails: {
              $first: "$$ROOT",
            },
          },
        },
        {
          $replaceRoot: {
            newRoot: "$paymentDetails",
          },
        },
        {
          $lookup: {
            from: Assessment.collection.name,
            localField: "assessment",
            foreignField: "_id",
            as: "assessmentDetails",
          },
        },
        {
          $unwind: "$assessmentDetails",
        },

        ...(dateRange
          ? [
              {
                $match: {
                  "assessmentDetails.completedAt": {
                    $gte: dateRange.start,
                    $lt: dateRange.end,
                  },
                },
              },
            ]
          : []),

        {
          $project: {
            _id: 1,
            assessmentId: "$assessmentDetails._id",

            // Payment information
            fullName: {
              $ifNull: ["$customerName", "N/A"],
            },
            email: {
              $ifNull: ["$customerEmail", "N/A"],
            },
            phone: {
              $ifNull: ["$customerMobile", "N/A"],
            },
            amount: {
              $ifNull: ["$amount", 0],
            },
            paymentStatus: {
              $ifNull: ["$status", "created"],
            },
            razorpayOrderId: 1,
            razorpayPaymentId: 1,
            paidAt: 1,

            // Assessment information
            totalQuestions: "$assessmentDetails.totalQuestions",
            score: "$assessmentDetails.score",
            percentage: "$assessmentDetails.percentage",
            passed: "$assessmentDetails.passed",
            completedAt: "$assessmentDetails.completedAt",
          },
        },
        {
          $sort: {
            completedAt: -1,
          },
        },
      ]);

      // ----------------------------------
      // DEFAULT SUMMARY
      // ----------------------------------

      const summary = summaryResult[0] || {
        totalAssessments: 0,
        paidAssessments: 0,
        trashedStudents: 0,
        untrashedStudents: 0,
      };

      // ----------------------------------
      // RESPONSE
      // ----------------------------------

      return res.status(200).json({
        success: true,
        message: "Assessments fetched successfully",

        filter: {
          period,
          from: from || null,
          to: to || null,
        },

        summary,
        total: assessments.length,
        data: assessments,
      });
    } catch (error) {
      console.error("Get Assessments Error:", error);

      return res.status(500).json({
        success: false,
        message: "Failed to fetch assessments",
        error: error.message,
      });
    }
  },
};
