
const { getCollectionReport } = require("./collection.service");

const getCollection = async (req, res) => {
  try {
    const collectionData = await getCollectionReport();

    return res.status(200).json({
      success: true,
      message: "Collection report fetched successfully.",
      data: collectionData,
    });
  } catch (error) {
    console.error("Collection error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch collection report.",
      error: error.message,
    });
  }
};

module.exports = {
  getCollection,
};
