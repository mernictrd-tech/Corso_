const multer = require("multer");
const path = require("path");

const fileFilter = (req, file, cb) => {
  const allowedTypes = ["image/jpeg", "image/png", "image/jpg", "image/webp"];

  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Only image files are allowed."), false);
  }
};

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    if (file.fieldname === "certificateDemo") {
      cb(null, "uploads/programs/certifications");
    } else if (file.fieldname === "thumbnail") {
      cb(null, "uploads/programs");
    } else {
      cb(new Error("Invalid file field"), false);
    }
  },

  filename: (req, file, cb) => {
    const uniqueName =
      Date.now() +
      "-" +
      Math.round(Math.random() * 1e9) +
      path.extname(file.originalname);

    cb(null, uniqueName);
  },
});

const upload = multer({
  storage,
  fileFilter,
});

module.exports = upload;
