const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const path = require("path");
const dotenv = require("dotenv");
const fs = require("fs");

// Load environment variables
dotenv.config();

// Import routes
const authRoutes = require("./routes/auth.routes");
const userRoutes = require("./routes/user.routes");
const roleRoutes = require("./routes/role.routes");
const productRoutes = require("./routes/product.routes");
const categoryRoutes = require("./routes/category.routes");
// const brandRoutes = require("./routes/brand.routes"); // TODO: Implement Brand routes
// const orderRoutes = require("./routes/order.routes"); // TODO: Implement Order routes
// const cartRoutes = require("./routes/cart.routes");
// const reviewRoutes = require("./routes/review.routes"); // TODO: Implement Review routes
// const addressRoutes = require("./routes/address.routes"); // TODO: Implement Address routes
// const wishlistRoutes = require("./routes/wishlist.routes"); // TODO: Implement Wishlist routes
// const paymentRoutes = require("./routes/payment.routes"); // TODO: Implement Payment routes
// const searchRoutes = require("./routes/search.routes"); // TODO: Implement Search routes
const bannerRoutes = require("./routes/banner.routes");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Logger
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// Create upload directories if they don't exist
const uploadDirs = [
  path.join(__dirname, "../uploads"),
  path.join(__dirname, "../uploads/products"),
  path.join(__dirname, "../uploads/brands"),
  path.join(__dirname, "../uploads/reviews"),
  path.join(__dirname, "../uploads/users"),
  path.join(__dirname, "../uploads/banners"),
  path.join(__dirname, "../uploads/categories"),
];

uploadDirs.forEach((dir) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

// Static folders
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));
app.use(
  "/uploads/products",
  express.static(path.join(__dirname, "../uploads/products"))
);
app.use(
  "/uploads/brands",
  express.static(path.join(__dirname, "../uploads/brands"))
);
app.use(
  "/uploads/reviews",
  express.static(path.join(__dirname, "../uploads/reviews"))
);
app.use(
  "/uploads/users",
  express.static(path.join(__dirname, "../uploads/users"))
);
app.use(
  "/uploads/banners",
  express.static(path.join(__dirname, "../uploads/banners"))
);
app.use(
  "/uploads/categories",
  express.static(path.join(__dirname, "../uploads/categories"))
);

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/roles", roleRoutes);
app.use("/api/products", productRoutes);
app.use("/api/categories", categoryRoutes);
// app.use("/api/brands", brandRoutes); // TODO: Implement Brand routes
// app.use("/api/orders", orderRoutes); // TODO: Implement Order routes
// app.use("/api/cart", cartRoutes);
// app.use("/api/reviews", reviewRoutes); // TODO: Implement Review routes
// app.use("/api/addresses", addressRoutes); // TODO: Implement Address routes
// app.use("/api/wishlist", wishlistRoutes); // TODO: Implement Wishlist routes
// app.use("/api/payments", paymentRoutes); // TODO: Implement Payment routes
// app.use("/api/search", searchRoutes); // TODO: Implement Search routes
app.use("/api/banners", bannerRoutes);

// Default route
app.get("/", (req, res) => {
  res.send("E-commerce API is running");
});

// Error handling middleware
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Something went wrong";

  return res.status(statusCode).json({
    success: false,
    status: statusCode,
    message: message,
    stack: process.env.NODE_ENV === "development" ? err.stack : {},
  });
});

module.exports = app;
