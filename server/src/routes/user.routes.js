const express = require("express");
const { check } = require("express-validator");
const userController = require("../controllers/user.controller");
const {
  protect,
  authorize,
  checkPermission,
} = require("../middlewares/auth.middleware");

const router = express.Router();

// Protect all routes below
router.use(protect);

// @route   GET /api/users
// @desc    Get all users
// @access  Private/Admin
router.get(
  "/",
  authorize("admin"),
  checkPermission("users", "read"),
  userController.getAllUsers
);

// @route   GET /api/users/:id
// @desc    Get user by id
// @access  Private/Admin
router.get(
  "/:id",
  authorize("admin"),
  checkPermission("users", "read"),
  userController.getUserById
);

// @route   POST /api/users
// @desc    Create a user
// @access  Private/Admin
router.post(
  "/",
  authorize("admin"),
  checkPermission("users", "create"),
  [
    check("firstName", "First name is required").notEmpty(),
    check("lastName", "Last name is required").notEmpty(),
    check("email", "Please include a valid email").isEmail(),
    check(
      "password",
      "Please enter a password with 6 or more characters"
    ).isLength({ min: 6 }),
    check("roleId", "Role ID is required").notEmpty(),
  ],
  userController.createUser
);

// @route   PUT /api/users/:id
// @desc    Update a user
// @access  Private/Admin
router.put(
  "/:id",
  authorize("admin"),
  checkPermission("users", "update"),
  [
    check("firstName", "First name cannot be empty").optional().notEmpty(),
    check("lastName", "Last name cannot be empty").optional().notEmpty(),
    check("email", "Please include a valid email").optional().isEmail(),
  ],
  userController.updateUser
);

// @route   DELETE /api/users/:id
// @desc    Delete a user
// @access  Private/Admin
router.delete(
  "/:id",
  authorize("admin"),
  checkPermission("users", "delete"),
  userController.deleteUser
);

module.exports = router;
