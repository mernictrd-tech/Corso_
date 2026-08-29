const adminMiddleware = (req, res, next) => {
  if (!req.admin) {
    return res.status(401).json({
      success: false,
      message: "Unauthorized. Please login.",
    });
  }

  if (req.admin.role !== "admin") {
    return res.status(403).json({
      success: false,
      message: "Access denied. Admin privileges required.",
    });
  }

  next();
};

module.exports = adminMiddleware;