const express = require("express");
const { check } = require("express-validator");
const categoryController = require("../controllers/category.controller");
const { protect } = require("../middlewares/auth.middleware");
const roleMiddleware = require("../middlewares/role.middleware");
const uploadMiddleware = require("../middlewares/upload.middleware");

const router = express.Router();

// Public routes
// Get all categories
router.get("/", categoryController.getAllCategories);

// Get category by ID
router.get("/:id", categoryController.getCategoryById);

// Get category by slug
router.get("/slug/:slug", categoryController.getCategoryBySlug);

// Get featured categories
router.get("/featured/all", categoryController.getFeaturedCategories);

// Protected routes (requires authentication)
router.use(protect);

// Create a new category (admin only)
router.post(
  "/",
  roleMiddleware(["admin"]),
  uploadMiddleware.single("image"),
  [check("name", "Category name is required").notEmpty()],
  categoryController.createCategory
);

// Update a category (admin only)
router.put(
  "/:id",
  roleMiddleware(["admin"]),
  uploadMiddleware.single("image"),
  categoryController.updateCategory
);

// Delete a category (admin only)
router.delete(
  "/:id",
  roleMiddleware(["admin"]),
  categoryController.deleteCategory
);

module.exports = router;
