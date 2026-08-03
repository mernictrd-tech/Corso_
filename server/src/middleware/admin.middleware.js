const adminMiddleware = (req, res, next) => {
  // Ensure protect middleware has run first
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: "Unauthorized. Please login.",
    });
  }

  if (req.user.role !== "admin") {
    return res.status(403).json({
      success: false,
      message: "Access denied. Admin privileges required.",
    });
  }

  next();
};

module.exports = adminMiddleware;