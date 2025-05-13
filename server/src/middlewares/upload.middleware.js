const multer = require("multer");
const path = require("path");
const fs = require("fs");
const { v4: uuidv4 } = require("uuid");

// Ensure upload directories exist
const createUploadDirs = () => {
  const uploadDirs = [
    path.join(__dirname, "../../uploads"),
    path.join(__dirname, "../../uploads/products"),
    path.join(__dirname, "../../uploads/categories"),
    path.join(__dirname, "../../uploads/banners"),
    path.join(__dirname, "../../uploads/brands"),
    path.join(__dirname, "../../uploads/users"),
    path.join(__dirname, "../../uploads/reviews"),
  ];

  uploadDirs.forEach((dir) => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  });
};

// Create upload dirs on startup
createUploadDirs();

// Configure storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // Determine the destination folder based on the file type or route
    let uploadPath = path.join(__dirname, "../../uploads");

    if (req.originalUrl.includes("/products")) {
      uploadPath = path.join(__dirname, "../../uploads/products");
    } else if (req.originalUrl.includes("/categories")) {
      uploadPath = path.join(__dirname, "../../uploads/categories");
    } else if (req.originalUrl.includes("/banners")) {
      uploadPath = path.join(__dirname, "../../uploads/banners");
    } else if (req.originalUrl.includes("/brands")) {
      uploadPath = path.join(__dirname, "../../uploads/brands");
    } else if (req.originalUrl.includes("/users")) {
      uploadPath = path.join(__dirname, "../../uploads/users");
    } else if (req.originalUrl.includes("/reviews")) {
      uploadPath = path.join(__dirname, "../../uploads/reviews");
    }

    // Create the directory if it doesn't exist
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }

    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    // Generate a unique filename
    const uniqueSuffix = `${Date.now()}-${uuidv4()}`;
    const extension = path.extname(file.originalname);
    cb(null, `${file.fieldname}-${uniqueSuffix}${extension}`);
  },
});

// File filter to validate uploads
const fileFilter = (req, file, cb) => {
  // Accept images and documents
  const allowedFileTypes = /jpeg|jpg|png|gif|webp|pdf|doc|docx|xls|xlsx|csv/;
  const mimetype = allowedFileTypes.test(file.mimetype);
  const extname = allowedFileTypes.test(
    path.extname(file.originalname).toLowerCase()
  );

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb(
      new Error("File type not supported. Please upload an image or document.")
    );
  }
};

// Setup multer upload
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB file size limit
  },
  fileFilter: fileFilter,
});

module.exports = upload;
