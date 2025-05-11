const express = require("express");
const { check } = require("express-validator");
const categoryController = require("../controllers/category.controller");
const {
  protect,
  authorize,
  checkPermission,
} = require("../middlewares/auth.middleware");

const router = express.Router();

// @route   GET /api/categories
// @desc    Get all categories
// @access  Public
router.get("/", categoryController.getAllCategories);

// @route   GET /api/categories/:id
// @desc    Get category by id
// @access  Public
router.get("/:id", categoryController.getCategoryById);

// Protect all routes below
router.use(protect);

// @route   POST /api/categories
// @desc    Create a category
// @access  Private/Admin
router.post(
  "/",
  authorize("admin", "editor"),
  checkPermission("categories", "create"),
  [
    check("name", "Name is required").notEmpty(),
    check("description", "Description cannot be empty").optional().notEmpty(),
    check("parentId", "Parent ID must be a valid UUID").optional().isUUID(),
    check("image", "Image must be a string").optional().isString(),
    check("order", "Order must be a number").optional().isInt(),
  ],
  categoryController.createCategory
);

// @route   PUT /api/categories/:id
// @desc    Update a category
// @access  Private/Admin
router.put(
  "/:id",
  authorize("admin", "editor"),
  checkPermission("categories", "update"),
  [
    check("name", "Name cannot be empty").optional().notEmpty(),
    check("description", "Description cannot be empty").optional().notEmpty(),
    check("parentId", "Parent ID must be a valid UUID").optional().isUUID(),
    check("image", "Image must be a string").optional().isString(),
    check("order", "Order must be a number").optional().isInt(),
  ],
  categoryController.updateCategory
);

// @route   DELETE /api/categories/:id
// @desc    Delete a category
// @access  Private/Admin
router.delete(
  "/:id",
  authorize("admin"),
  checkPermission("categories", "delete"),
  categoryController.deleteCategory
);

module.exports = router;
