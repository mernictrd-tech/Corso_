
const crypto = require("crypto");

const verifyCollectionApi = (req, res, next) => {
  try {
    const apiKey = req.headers["x-api-key"];
    const timestamp = req.headers["x-timestamp"];
    const signature = req.headers["x-signature"];

    const expectedApiKey = process.env.COLLECTION_API_KEY;
    const secret = process.env.COLLECTION_API_SECRET;

    // Check environment configuration.
    if (!expectedApiKey || !secret) {
      console.error("Collection API credentials are missing.");

      return res.status(500).json({
        success: false,
        message: "API authentication is not configured.",
      });
    }

    // Check required headers.
    if (!apiKey || !timestamp || !signature) {
      return res.status(401).json({
        success: false,
        message: "Missing authentication headers.",
      });
    }

    // Verify API key.
    const receivedKey = Buffer.from(apiKey);
    const configuredKey = Buffer.from(expectedApiKey);

    if (
      receivedKey.length !== configuredKey.length ||
      !crypto.timingSafeEqual(receivedKey, configuredKey)
    ) {
      return res.status(401).json({
        success: false,
        message: "Invalid API key.",
      });
    }

    // Validate timestamp (allow 5 minutes difference).
    const requestTime = Number(timestamp);
    const currentTime = Math.floor(Date.now() / 1000);

    if (
      !Number.isFinite(requestTime) ||
      Math.abs(currentTime - requestTime) > 300
    ) {
      return res.status(401).json({
        success: false,
        message: "Request timestamp expired.",
      });
    }

    // Generate expected HMAC signature.
    const payload = `${timestamp}.${JSON.stringify(req.body || {})}`;

    const expectedSignature = crypto
      .createHmac("sha256", secret)
      .update(payload)
      .digest("hex");

    // Verify signature.
    const receivedSignature = Buffer.from(signature, "hex");
    const calculatedSignature = Buffer.from(expectedSignature, "hex");

    if (
      receivedSignature.length !== calculatedSignature.length ||
      !crypto.timingSafeEqual(
        receivedSignature,
        calculatedSignature
      )
    ) {
      return res.status(401).json({
        success: false,
        message: "Invalid request signature.",
      });
    }

    next();
  } catch (error) {
    console.error("Collection authentication error:", error);

    return res.status(500).json({
      success: false,
      message: "Authentication failed.",
    });
  }
};

module.exports = verifyCollectionApi;
