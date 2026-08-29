const jwt = require("jsonwebtoken");
const Admin = require("../models/admin.model");

const adminProtect = async (req, res, next) => {
  try {
    console.log("Cookies:", req.cookies);
    console.log("Authorization:", req.headers.authorization);

    let token;

    // Check admin cookie
    if (req.cookies && req.cookies.adminToken) {
      token = req.cookies.adminToken;
    }

    // Check Authorization header
    if (
      !token &&
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Not authorized. Please login.",
      });
    }

    // Verify token
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    // Find admin
    const admin = await Admin.findById(decoded.id);

    if (!admin) {
      return res.status(401).json({
        success: false,
        message: "Admin not found.",
      });
    }

    // Check active status
    if (!admin.isActive) {
      return res.status(403).json({
        success: false,
        message: "Admin account is inactive.",
      });
    }

    req.admin = admin;

    next();
  } catch (error) {
    console.error("Admin protect error:", error);

    return res.status(401).json({
      success: false,
      message: "Invalid or expired admin token.",
    });
  }
};

module.exports = adminProtect;