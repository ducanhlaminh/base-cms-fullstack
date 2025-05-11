const express = require("express");
const { check } = require("express-validator");
const roleController = require("../controllers/role.controller");
const {
  protect,
  authorize,
  checkPermission,
} = require("../middlewares/auth.middleware");

const router = express.Router();

// Protect all routes below
router.use(protect);

// @route   GET /api/roles
// @desc    Get all roles
// @access  Private/Admin
router.get(
  "/",
  authorize("admin"),
  checkPermission("roles", "read"),
  roleController.getAllRoles
);

// @route   GET /api/roles/:id
// @desc    Get role by id
// @access  Private/Admin
router.get(
  "/:id",
  authorize("admin"),
  checkPermission("roles", "read"),
  roleController.getRoleById
);

// @route   POST /api/roles
// @desc    Create a role
// @access  Private/Admin
router.post(
  "/",
  authorize("admin"),
  checkPermission("roles", "create"),
  [
    check("name", "Name is required").notEmpty(),
    check("permissions", "Permissions must be an object").optional().isObject(),
  ],
  roleController.createRole
);

// @route   PUT /api/roles/:id
// @desc    Update a role
// @access  Private/Admin
router.put(
  "/:id",
  authorize("admin"),
  checkPermission("roles", "update"),
  [
    check("name", "Name cannot be empty").optional().notEmpty(),
    check("permissions", "Permissions must be an object").optional().isObject(),
  ],
  roleController.updateRole
);

// @route   DELETE /api/roles/:id
// @desc    Delete a role
// @access  Private/Admin
router.delete(
  "/:id",
  authorize("admin"),
  checkPermission("roles", "delete"),
  roleController.deleteRole
);

module.exports = router;
