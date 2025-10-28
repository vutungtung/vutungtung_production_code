import multer from "multer";
import path from "path";
import fs from "fs";

// Directly set upload path to /uploads/bookingLicense
const bookingLicensePath = path.join(__dirname, "../../uploads/bookingLicense");

// Ensure folder exists
if (!fs.existsSync(bookingLicensePath)) {
  fs.mkdirSync(bookingLicensePath, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, bookingLicensePath); // Store files inside /uploads/bookingLicense
  },
  filename: (_req, file, cb) => {
    const uniqueName = `${Date.now()}-${Math.round(
      Math.random() * 1e9
    )}${path.extname(file.originalname)}`;
    cb(null, uniqueName);
  },
});

// ✅ Only allow jpg, jpeg, png
const fileFilter: multer.Options["fileFilter"] = (_req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png/;
  const extname = allowedTypes.test(
    path.extname(file.originalname).toLowerCase()
  );
  const mimetype = allowedTypes.test(file.mimetype);

  if (extname && mimetype) {
    cb(null, true);
  } else {
    cb(new Error("Only .jpg, .jpeg, and .png files are allowed!"));
  }
};

export const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // optional: 5MB
});
