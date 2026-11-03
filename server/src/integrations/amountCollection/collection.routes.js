const express = require("express");
const router = express.Router();

const {
  getCollection,
} = require("./collection.controller");

const verifyCollectionApi = require("./collection.middleware");

// Fetch collection report securely.
router.post(
  "/amount-collection",
  verifyCollectionApi,
  getCollection
);

module.exports = router;
