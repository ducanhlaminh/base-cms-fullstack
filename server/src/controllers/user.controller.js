const { validationResult } = require("express-validator");
const db = require("../models");

// @desc    Get all users
// @route   GET /api/users
// @access  Private/Admin
exports.getAllUsers = async (req, res, next) => {
  try {
    const users = await db.User.findAll({
      include: {
        model: db.Role,
        as: "role",
        attributes: ["id", "name"],
      },
      attributes: { exclude: ["password"] },
    });

    res.status(200).json({
      success: true,
      count: users.length,
      users,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get user by ID
// @route   GET /api/users/:id
// @access  Private/Admin
exports.getUserById = async (req, res, next) => {
  try {
    const user = await db.User.findByPk(req.params.id, {
      include: {
        model: db.Role,
        as: "role",
        attributes: ["id", "name", "permissions"],
      },
      attributes: { exclude: ["password"] },
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create user
// @route   POST /api/users
// @access  Private/Admin
exports.createUser = async (req, res, next) => {
  try {
    // Validate request
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array(),
      });
    }

    const { firstName, lastName, email, password, roleId } = req.body;

    // Check if user exists
    const userExists = await db.User.findOne({ where: { email } });
    if (userExists) {
      return res.status(400).json({
        success: false,
        message: "User already exists",
      });
    }

    // Check if role exists
    const role = await db.Role.findByPk(roleId);
    if (!role) {
      return res.status(400).json({
        success: false,
        message: "Role not found",
      });
    }

    // Create user
    const user = await db.User.create({
      firstName,
      lastName,
      email,
      password,
      roleId,
    });

    res.status(201).json({
      success: true,
      user: {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        roleId: user.roleId,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update user
// @route   PUT /api/users/:id
// @access  Private/Admin
exports.updateUser = async (req, res, next) => {
  try {
    // Validate request
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array(),
      });
    }

    const { firstName, lastName, email, roleId, isActive, avatar, bio } =
      req.body;

    // Find user
    const user = await db.User.findByPk(req.params.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Check if role exists if provided
    if (roleId) {
      const role = await db.Role.findByPk(roleId);
      if (!role) {
        return res.status(400).json({
          success: false,
          message: "Role not found",
        });
      }
    }

    // Update user
    await user.update({
      firstName: firstName || user.firstName,
      lastName: lastName || user.lastName,
      email: email || user.email,
      roleId: roleId || user.roleId,
      isActive: isActive !== undefined ? isActive : user.isActive,
      avatar: avatar || user.avatar,
      bio: bio || user.bio,
    });

    // Get updated user with role
    const updatedUser = await db.User.findByPk(user.id, {
      include: {
        model: db.Role,
        as: "role",
        attributes: ["id", "name"],
      },
      attributes: { exclude: ["password"] },
    });

    res.status(200).json({
      success: true,
      user: updatedUser,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete user
// @route   DELETE /api/users/:id
// @access  Private/Admin
exports.deleteUser = async (req, res, next) => {
  try {
    // Find user
    const user = await db.User.findByPk(req.params.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Delete user
    await user.destroy();

    res.status(200).json({
      success: true,
      message: "User deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};
